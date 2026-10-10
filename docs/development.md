# Website development

This is a static site. `index.html`, `css/main.css`, and `js/main.js` are the main application files; the other JavaScript and CSS files include vendored libraries. There is no compilation step or application backend in this repository.

## Resume source of truth

The authoritative resume is [Brian_Raines_Resume.docx on Google Drive](https://docs.google.com/document/d/1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP/edit), file ID `1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP`, as designated by Brian. It is a stored Word document opened through Google Docs.

Read the current Drive file before updating resume content. Make authorized resume revisions in that source, then update the relevant README, website copy/metadata, vCard, downloadable PDF, and social-profile drafts to agree with it. These are derived copies. Resume content parity was checked on October 8, 2026; recheck it after revisions. There is no automatic Drive sync or checked-in PDF-generation command. See [publication verification](publication.md) for the reviewed-artifact manifest and local/public checks.

## Local setup

Use Node.js 24 (`nvm use` reads `.nvmrc`). The pinned `http-server` development dependency serves the site locally; production needs no Node runtime. From the repository root:

```sh
npm ci
npx playwright install chromium
npm test
```

On Linux, install browser system dependencies with `npx playwright install --with-deps chromium`.

`npm test` starts and stops its own server at `http://127.0.0.1:4173`. It refuses to reuse an existing server so tests cannot accidentally validate another checkout. Stop any manual server on that port before testing.

For a manual preview, run `npm run serve`. For interactive testing, run `npm run test:ui`. To view results, run `npm run test:report`. Failure screenshots and traces are saved under `test-results/`; these and the HTML report are ignored by Git.

## Test coverage and workflow

`npm test` runs the Node publication-verifier tests and a check that the private `docs/job_hunt/` folder stays Git-ignored, then the Playwright suite against the actual site in desktop Chromium and mobile Chromium device emulation. Browser checks cover startup errors, local asset availability, navigation and mobile menu behavior, usable PDF/vCard downloads, current-employer/AI profile metadata, and project write-ups operated with pointer and keyboard. Direct-link checks cover the primary `#feedback` anchor and the legacy `#clients` bookmark alias. The Quality & Reliability card is checked beside Technical Leadership on desktop and beneath it on mobile, including equal desktop row height and no horizontal overflow. It also checks that Projects follows Resume in the reading/menu order and that workflow gate captions have a useful reading width without clipping. The Brandon Morrill testimonial check verifies that its portrait decodes, its LinkedIn citation is retained, and its visible attribution/excerpt match the structured review without inventing a star rating. Recommendation cards open the shared LinkedIn recommendations page in a new tab using pointer or Enter activation. Keyboard checks cover visible focus and all cards staying in view while focused. Hover checks confirm autoplay pauses over a card and advances immediately after pointer leave; combined hover/focus checks require both interactions to end before advancing and resuming. Keyboard blur at the last card wraps to the first, then continues timed autoplay. Autoplay timing is controlled with Playwright’s clock. External fonts and analytics are intercepted to keep tests independent of third-party availability and avoid recording test traffic.

The suite establishes these behaviors; it does not verify the accuracy of career claims, every accessibility requirement, visual appearance, external profile availability, or Firefox/Safari behavior. The publication verifier checks artifact hashes; prose/source parity requires separate review. Add focused coverage when a change introduces new behavior.

For a behavior change:

1. Add a test expressing the desired visitor-visible result.
2. Run the focused test and confirm it fails for the intended reason.
3. Make the smallest production change that passes it.
4. Run `npm test` to check both desktop and mobile.
5. Refactor and rerun the suite if code changed.

For example, run a focused test with `npm test -- --project=desktop-chromium --grep 'navigation'`.

Use role/name locators and observable outcomes. Avoid assertions tied to incidental markup or exact resume prose. If future code introduces substantial data transformations or application logic, add focused unit tests alongside these browser tests.

The configuration follows Playwright's [web server](https://playwright.dev/docs/test-webserver), [projects](https://playwright.dev/docs/test-projects), and [CI](https://playwright.dev/docs/ci) guidance.

## CI and production hosting

`.github/workflows/ci.yml` installs locked dependencies and Chromium, runs the same suite on pushes and pull requests, and uploads reports and failure traces for 14 days. It uses read-only repository permissions and pinned action revisions. It becomes active once pushed to GitHub. It does not deploy the site.

Production `https://raines.io` is hosted on the Linode VM shared with Stableishwater, as confirmed by Brian. No automatic Linode deployment workflow is checked into this repository. The verified Apache document root, SSH context, scoped release and rollback procedure are documented in [publication.md](publication.md). Scope deployment to this website's files and directory on the shared VM.

GitHub also runs an automatically generated `pages-build-deployment` workflow from `main` at the repository root. It publishes a separate copy at `https://brianraines.github.io/raines-io/`; Pages currently has no custom domain configured. This workflow is managed by GitHub and has no YAML file in the repository.

The active `Review` ruleset covers the default branch: pull requests and signed commits are required, deletion and force pushes are blocked, and there are no required status checks. After the first CI run, add the `Browser tests` check to that ruleset if merges must be blocked by failing tests. Existing Pages deployments do not wait for this new CI job.
