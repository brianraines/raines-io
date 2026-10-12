const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, execFileSync } = require('node:child_process');
const { mkdtemp, writeFile, rm, access } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { resolve, join } = require('node:path');
const { createServer } = require('node:net');
const http = require('node:http');
const https = require('node:https');
const { setTimeout: delay } = require('node:timers/promises');

const root = resolve(__dirname, '..');
const mac = process.platform === 'darwin';
const binary = process.env.APACHE_HTTPD || (mac ? '/usr/sbin/httpd' : '/usr/sbin/apache2');
const modules = process.env.APACHE_MODULE_DIR || (mac ? '/usr/libexec/apache2' : '/usr/lib/apache2/modules');
let directory, server, plainPort, tlsPort;
let output = '';

async function unusedPort() {
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  return port;
}

function request(path, { tls = true, host = 'raines.io', headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const transport = tls ? https : http;
    const connection = transport.get({ hostname: '127.0.0.1', port: tls ? tlsPort : plainPort,
      path, headers: { Host: host, ...headers },
      // This loopback test server uses a temporary self-signed certificate.
      rejectUnauthorized: false }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers,
        body: Buffer.concat(chunks).toString() }));
    });
    connection.setTimeout(2000, () => connection.destroy(new Error('Apache request timed out')));
    connection.on('error', reject);
  });
}

before(async () => {
  await access(binary);
  directory = await mkdtemp(join(tmpdir(), 'raines-apache-'));
  plainPort = await unusedPort();
  tlsPort = await unusedPort();
  const certificate = join(directory, 'localhost.crt');
  const key = join(directory, 'localhost.key');
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1',
    '-subj', '/CN=localhost', '-keyout', key, '-out', certificate], { stdio: 'ignore' });
  // Linux compiles unixd into Apache; macOS ships it as a loadable module.
  const compiled = execFileSync(binary, ['-l'], { encoding: 'utf8' });
  const load = ['mpm_event', 'unixd', 'authz_core', 'dir', 'mime', 'alias', 'rewrite', 'headers', 'ssl', 'socache_shmcb']
    .filter((name) => !compiled.includes(`mod_${name}.c`))
    .map((name) => `LoadModule ${name}_module "${modules}/mod_${name}.so"`).join('\n');
  const rules = process.env.APACHE_HTTP_RULES || join(root, 'deploy/apache/raines-io-http.conf');
  const config = join(directory, 'httpd.conf');
  await writeFile(config, `ServerRoot "${directory}"
${load}
Listen 127.0.0.1:${plainPort}
Listen 127.0.0.1:${tlsPort}
ServerName localhost
PidFile "${directory}/httpd.pid"
ErrorLog "${directory}/error.log"
LogLevel warn
User #${process.getuid()}
Group #${process.getgid()}
TypesConfig "${mac ? '/etc/apache2/mime.types' : '/etc/mime.types'}"
DocumentRoot "${root}"
DirectoryIndex index.html
<Directory "${root}">
    Require all granted
    AllowOverride All
    Options FollowSymLinks
</Directory>
<VirtualHost 127.0.0.1:${plainPort}>
    ServerName raines.io
    ServerAlias www.raines.io
    Include "${rules}"
</VirtualHost>
<VirtualHost 127.0.0.1:${tlsPort}>
    ServerName raines.io
    ServerAlias www.raines.io
    SSLEngine on
    SSLCertificateFile "${certificate}"
    SSLCertificateKeyFile "${key}"
</VirtualHost>
`);
  execFileSync(binary, ['-t', '-f', config], { stdio: 'pipe' });
  server = spawn(binary, ['-f', config, '-DFOREGROUND'], { stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.on('data', (data) => { output += data; });
  server.stderr.on('data', (data) => { output += data; });
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Apache exited: ${output}`);
    try { await request('/'); return; } catch { await delay(50); }
  }
  throw new Error(`Apache did not start: ${output}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    const stopped = new Promise((resolve) => server.once('exit', resolve));
    server.kill('SIGTERM');
    await stopped;
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

for (const scenario of [
  { path: '/', tls: false, host: 'raines.io', destination: 'https://raines.io/' },
  { path: '/', tls: false, host: 'www.raines.io', destination: 'https://raines.io/' },
  { path: '/?ref=profile', tls: true, host: 'www.raines.io', destination: 'https://raines.io/?ref=profile' },
  { path: '/index.html?ref=profile', tls: false, host: 'www.raines.io', destination: 'https://raines.io/?ref=profile' },
  { path: '/index.html', tls: true, host: 'raines.io', destination: 'https://raines.io/' },
  { path: '/index.html?ref=profile', tls: true, host: 'www.raines.io', destination: 'https://raines.io/?ref=profile' },
  { path: '/resume/Brian_Raines_Resume.pdf?ref=profile', tls: false, host: 'raines.io',
    destination: 'https://raines.io/resume/Brian_Raines_Resume.pdf?ref=profile' },
  { path: '/writing/a%20b?ref=a%2Fb', tls: true, host: 'www.raines.io',
    destination: 'https://raines.io/writing/a%20b?ref=a%2Fb' },
]) {
  test(`${scenario.tls ? 'HTTPS' : 'HTTP'} ${scenario.host}${scenario.path} permanently redirects directly to canonical`, async () => {
    const response = await request(scenario.path, scenario);
    assert.equal(response.status, 301);
    assert.equal(response.headers.location, scenario.destination);
  });
}

test('canonical home, query strings and downloads are served without redirect loops', async () => {
  for (const path of ['/', '/?ref=profile', '/resume/Brian_Raines_Resume.pdf', '/css/main.css']) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.location, undefined, path);
  }
  assert.equal((await request('/missing-seo-test')).status, 404);
});

test('HTML revalidates while mutable static assets have bounded caching', async () => {
  const home = await request('/');
  assert.equal(home.headers['cache-control'], 'no-cache');
  for (const path of ['/css/main.css', '/js/main.js', '/img/hero/hero-01.webp']) {
    const asset = await request(path);
    assert.equal(asset.status, 200);
    assert.equal(asset.headers['cache-control'], 'public, max-age=3600, must-revalidate');
    assert.ok(asset.headers['last-modified']);
  }
});
