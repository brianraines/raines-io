const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { join } = require('node:path');

const root = join(__dirname, '..');

function isIgnored(path) {
  try {
    execFileSync('git', ['check-ignore', '--quiet', path], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// docs/job_hunt/ holds private job-search data for the job-hunt agent skill. This repository is
// public and GitHub Pages publishes it, so nothing in that folder may ever be committable.
test('private job-search data in docs/job_hunt/ is ignored by Git', () => {
  for (const path of [
    'docs/job_hunt/',
    'docs/job_hunt/PROFILE.md',
    'docs/job_hunt/search/2026-10-10/SEARCH-20261010-143205.md',
    'docs/job_hunt/.history/PROFILE-20261010-143205.md',
  ]) {
    assert.equal(isIgnored(path), true, `${path} must be ignored`);
  }
});
