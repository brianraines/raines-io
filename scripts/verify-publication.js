const { readFile } = require('node:fs/promises');
const { createHash } = require('node:crypto');
const { dirname, resolve } = require('node:path');
const { parseArgs } = require('node:util');

async function verifyPublication({ manifestPath, baseUrl }) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.version !== 1 || !manifest.source?.fileId || !manifest.source?.modifiedTime ||
      !Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error('Invalid publication manifest or missing resume source revision.');
  }
  for (const file of manifest.files) {
    if (typeof file.path !== 'string' || !/^[\w.-]+(?:\/[\w.-]+)*$/.test(file.path) ||
        file.path.split('/').some((part) => part === '.' || part === '..') ||
        !/^[a-f0-9]{64}$/.test(file.sha256)) {
      throw new Error('Invalid artifact path or SHA-256 in publication manifest.');
    }
  }
  let base;
  if (baseUrl) {
    base = new URL(baseUrl);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
      throw new Error('Publication URL must be an HTTP(S) site URL without credentials, query or fragment.');
    }
    if (!base.pathname.endsWith('/')) base.pathname += '/';
  }
  const files = [];
  for (const file of manifest.files) {
    try {
      let bytes;
      if (base) {
        const response = await fetch(new URL(file.path, base), {
          signal: AbortSignal.timeout(10_000),
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        bytes = Buffer.from(await response.arrayBuffer());
      } else {
        bytes = await readFile(resolve(dirname(manifestPath), file.path));
      }
      const actualSha256 = createHash('sha256').update(bytes).digest('hex');
      files.push({ path: file.path, ok: actualSha256 === file.sha256, actualSha256 });
    } catch (error) {
      files.push({ path: file.path, ok: false, error: error.message });
    }
  }
  return { ok: files.every((file) => file.ok), files, source: manifest.source };
}

if (require.main === module) {
  (async () => {
    const { values } = parseArgs({ options: {
      manifest: { type: 'string', default: resolve(__dirname, '../publication.json') },
      url: { type: 'string' },
    } });
    const result = await verifyPublication({ manifestPath: resolve(values.manifest), baseUrl: values.url });
    console.log(`Resume source: ${result.source.fileId}, modified ${result.source.modifiedTime}`);
    for (const file of result.files) {
      console.log(`${file.ok ? 'PASS' : 'FAIL'} ${file.path}${file.error ? `: ${file.error}` : ''}`);
    }
    process.exitCode = result.ok ? 0 : 1;
  })().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { verifyPublication };
