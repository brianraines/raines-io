const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { mkdtemp, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { createServer } = require('node:http');
const { verifyPublication } = require('../scripts/verify-publication');

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'raines-publication-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const content = 'reviewed resume artifact';
  const manifest = {
    version: 1,
    source: { fileId: 'test-source', modifiedTime: '2026-10-08T21:05:29.346Z' },
    files: [{ path: 'resume.pdf', sha256: createHash('sha256').update(content).digest('hex') }],
  };
  const manifestPath = join(root, 'publication.json');
  await writeFile(manifestPath, JSON.stringify(manifest));
  await writeFile(join(root, 'resume.pdf'), content);
  return { root, manifestPath, content, manifest };
}

test('reviewed local bytes pass publication verification', async (t) => {
  const { manifestPath } = await fixture(t);
  const result = await verifyPublication({ manifestPath });
  assert.equal(result.ok, true);
  assert.equal(result.files.length, 1);
  assert.equal(result.files[0].ok, true);
});

test('changed local artifacts fail verification', async (t) => {
  const { manifestPath, root } = await fixture(t);
  await writeFile(join(root, 'resume.pdf'), 'older resume');
  const result = await verifyPublication({ manifestPath });
  assert.equal(result.ok, false);
  assert.deepEqual(result.files.map(({ path, ok }) => ({ path, ok })), [{ path: 'resume.pdf', ok: false }]);
});

test('missing local artifacts are reported as failures', async (t) => {
  const { manifestPath, root } = await fixture(t);
  await rm(join(root, 'resume.pdf'));
  const result = await verifyPublication({ manifestPath });
  assert.deepEqual(result.files.map(({ path, ok }) => ({ path, ok })), [{ path: 'resume.pdf', ok: false }]);
});

test('public bytes are checked instead of assuming a local pass means publication', async (t) => {
  const { manifestPath, content } = await fixture(t);
  let served = content;
  let status = 200;
  const server = createServer((request, response) => {
    assert.equal(request.url, '/site/resume.pdf');
    response.writeHead(status);
    response.end(served);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const baseUrl = `http://127.0.0.1:${server.address().port}/site/`;
  assert.equal((await verifyPublication({ manifestPath, baseUrl })).ok, true);
  served = 'older deployed resume';
  const stale = await verifyPublication({ manifestPath, baseUrl });
  assert.equal(stale.ok, false);
  assert.equal(stale.files[0].ok, false);
  status = 404;
  const missing = await verifyPublication({ manifestPath, baseUrl });
  assert.equal(missing.ok, false);
  assert.match(missing.files[0].error, /404/);
});

test('manifest paths cannot escape the reviewed site directory', async (t) => {
  const { manifestPath, manifest } = await fixture(t);
  manifest.files[0].path = '../outside.pdf';
  await writeFile(manifestPath, JSON.stringify(manifest));
  await assert.rejects(verifyPublication({ manifestPath }), /path/i);
});
