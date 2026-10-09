# Working in this repository

## Project map

This is Brian Raines's static resume companion website, not a framework application. Preserve that architecture unless the task explicitly calls for a migration.

- `index.html`: page sections, copy, navigation, SEO/social metadata, JSON-LD, and library loading.
- `css/main.css`: site-specific styling and responsive layouts.
- `js/main.js`: preloader, testimonials, optional gallery/filter setup, and randomized hero/about images.
- `js/common.js`: legacy contact-form handler; no matching form or `mail.php` is currently checked in.
- Other files in `css/`, `js/`, and `fonts/`: mostly vendored third-party assets. Avoid editing generated/minified libraries directly.
- `img/`: hero, bulldog, testimonial, favicon, and legacy portfolio assets.
- `README.md`: derived resume prose plus links to the authoritative Drive source and developer documentation.
- `resume/Brian_Raines_Resume.pdf`: downloadable resume derived from the authoritative Drive source. No generation command is checked in.
- `vcard/Brian_Raines.vcf`: downloadable contact card.
- `publication.json`, `scripts/verify-publication.js`: reviewed resume revision and local/public artifact parity checks; refresh only after source and content review.
- `docs/publication.md`: verified Linode layout, scoped release and rollback procedure.
- `tests/site.spec.js`, `playwright.config.js`: browser regression suite and local server configuration.
- `.github/workflows/ci.yml`: browser CI, separate from deployment.
- `docs/development.md`: commands, test coverage, and hosting details.
- `docs/readiness-review.md` and `docs/web-app-analysis.md`: planning context and audit findings; recheck findings before treating them as current.

## Setup and commands

Use Node.js 24 via `.nvmrc` and npm. The site itself has no build step; npm dependencies are development tools.

```sh
npm ci
npx playwright install chromium
npm test
```

On Linux, use `npx playwright install --with-deps chromium`.

- `npm test`: Node publication-verifier tests, then desktop Chromium and mobile Chromium emulation.
- `npm run verify:publication`: compare local artifacts with the reviewed manifest.
- `npm run verify:publication -- --url https://raines.io/`: read-only public artifact check; does not deploy.
- `npm test -- --project=desktop-chromium --grep 'navigation'`: example focused run.
- `npm run test:ui`: interactive test runner.
- `npm run test:report`: HTML report.
- `npm run serve`: manual preview at `http://127.0.0.1:4173`.

Tests manage their own server and refuse to reuse an existing process. Stop manual previews on port 4173 before running tests. Do not change this safeguard to work around an occupied port.

## Test-driven changes

For features, bug fixes, and behavior-changing refactors:

1. Identify the visitor-visible contract and the bug a test should catch.
2. Add the smallest focused test before changing production behavior.
3. Run it and observe the intended failure. A syntax error, missing dependency, or unavailable server is not the required red result.
4. Implement the smallest change that passes.
5. Run the focused test, then the complete `npm test` suite.
6. Refactor only after green; rerun affected checks after further edits.

For an existing behavior with no coverage, first add a characterization test. For a bug, add a reproducer that fails on the current implementation. If a meaningful behavioral test cannot be identified, explain why and choose an appropriate validation instead; do not invent brittle tests merely to check source text.

Documentation, pure copy edits, and configuration changes need proportionate validation: review accuracy, inspect the rendered result when applicable, and run relevant existing checks. Do not snapshot exact resume prose just to force a red test. Changes to links, downloads, metadata contracts, navigation, dynamic behavior, or accessibility should have behavioral regression coverage.

## Test design

- Exercise the real served HTML, CSS, JavaScript, and downloads. Prefer role/name locators and Playwright's retrying assertions.
- Test outcomes: a menu reveals links, an anchor reaches visible content, or a downloaded file has usable content. Avoid source-string assertions and tests coupled to incidental markup.
- Keep external analytics and font requests isolated in automated regression tests, as the existing suite does. This suite does not establish third-party integration health or final typography.
- Register error/request listeners before navigation. Missing local assets and uncaught script errors are failures, not allowlisted noise.
- Control randomness in targeted tests with test-only initialization, and use Playwright's clock when testing timed behavior. Do not modify production behavior just to simplify tests.
- Avoid arbitrary sleeps, forced clicks, broad timeout increases, skipped assertions, or retries that mask defects. Investigate failure traces first.
- Use desktop and mobile coverage for shared interactions; add cases near affected breakpoints. Do not claim Safari/Firefox compatibility from Chromium emulation.
- Keep test helpers in test files/utilities. Add unit tests if nontrivial pure application logic is introduced; browser tests are the current primary boundary.
- Use screenshots for visual review of layout changes. A passing functional suite does not establish accessibility compliance or visual quality.

## Resume source of truth

Brian has designated [Brian_Raines_Resume.docx on Google Drive](https://docs.google.com/document/d/1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP/edit) as the authoritative resume source.

- Drive file ID: `1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP`.
- It is a Word `.docx` stored in Drive and opened through Google Docs, not a native Google Doc. Use a Word-compatible workflow when editing it; preserve the original file identity and format unless Brian requests otherwise.
- Read the latest source before revising career facts or resume content. Treat the repository README, website, downloadable PDF, vCard, and profile copy as derived publishing surfaces, not competing resume masters.
- For authorized resume revisions, update this source and synchronize the affected derived surfaces. Adapt presentation for each surface without introducing conflicting facts.
- No automatic Drive synchronization or PDF-generation workflow is currently implemented. The publication manifest records an explicitly reviewed artifact set; it does not prove source accuracy. Verify the exported PDF and affected website content before refreshing it, then verify public artifacts after publishing changes.

## Content and implementation constraints

- Keep facts consistent across the README, website sections, page title, social metadata, JSON-LD, PDF, and vCard when the task includes those surfaces. Never invent AI skills, accomplishments, employers, metrics, awards, or testimonials.
- Keep copy and structure focused on the authorized change. Do not silently rewrite unrelated career history.
- Preserve the site owner's all-rights-reserved terms and third-party license notices.
- Preserve established library load order unless a tested change explicitly alters it.
- Match local formatting and line endings in existing files. Avoid sweeping formatting churn.
- Do not commit generated test reports, traces, `node_modules/`, or secrets. Preserve unrelated user changes, including editor settings.
- Update `package-lock.json` with dependency changes and verify reproducibility with `npm ci`. The npm audit covers development dependencies only, not vendored browser libraries.

## CI, Git, and deployment

Production `raines.io` is on the Linode VM shared with Stableishwater. No Linode deployment automation is checked into this repo. GitHub Pages is a separate copy served from `main` at the repository root, using GitHub's generated `pages-build-deployment` workflow.

- `.github/workflows/ci.yml` runs browser tests on pushes and PRs, with read-only permissions, pinned actions, and failure artifacts. It does not deploy.
- The current default-branch ruleset requires PRs and signed commits, but no test status checks. Do not claim CI gates merges or Pages deployment until that configuration is verified.
- Inspect the current branch and working tree before edits. Use a `codex/` prefix for a newly requested work branch unless the user specifies otherwise. Do not reset, clean, or discard unrelated work.
- Before committing or opening a PR, run `npm test` and `git diff --check`. For workflow changes, run `actionlint .github/workflows/ci.yml` when available; otherwise report that validation limit.
- Deployment requires the verified SSH target, site document root, current release process, and rollback method. Scope any authorized deployment to this site; do not alter Stableishwater or shared VM services as a side effect.
- Never put credentials into source control. Do not publish profile edits, deploy, merge, or change remote rules without authorization covering that action.

## Completion reporting

Report what changed, which fresh checks were run and their results, and remaining limitations. Name any failing tests, including failures that predate the change. Distinguish local verification from a GitHub-hosted CI run and production verification. Do not claim deployment, cross-browser coverage, content accuracy, or accessibility compliance without evidence.
