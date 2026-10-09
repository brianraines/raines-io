# Web application analysis

Reviewed October 8, 2026. The site is a small static publishing application with a straightforward architecture. Its main risks are presentation/accessibility defects, oversized media, inconsistent professional positioning, and an undocumented production deployment path. A framework migration is not necessary to address those issues.

## Scope and evidence

Reviewed application HTML, site-specific CSS/JavaScript, loaded library headers, download links, metadata, repository history/configuration, GitHub Actions, Pages settings, and the default-branch ruleset. Ran the new browser regression suite and a separate exploratory audit using Chromium, mobile emulation, keyboard navigation, reduced-motion emulation, JavaScript-disabled browsing, and axe-core 4.13.0. Inspected desktop, mobile, and breakpoint screenshots.

The exploratory viewport sweep covered 320, 375, 393, 768, 980, 992, 999, 1000, 1024, and 1280 CSS pixels. External analytics were suppressed; Google fonts were allowed for visual inspection. Hero/about randomness was fixed to the first image for comparable measurements. Production inspection used read-only HTTP requests; no VM access or configuration changes were performed.

The automated regression suite covers Chromium desktop and Pixel 7 mobile emulation. Neither this review nor a passing suite establishes Safari/Firefox compatibility, a complete security assessment, formal accessibility compliance, or factual accuracy of career claims. The Google Drive resume's permissions were inspected, but its contents were not reviewed.

## Architecture and data flow

| Layer | Current implementation | Implication |
| --- | --- | --- |
| Page/content | One `index.html`, six main destinations, embedded metadata/JSON-LD | Simple publishing; repeated facts require coordinated edits |
| Styling | Bootstrap 5.3.8 plus `css/main.css`, Font Awesome, Swiper and popup CSS | Site overrides and framework breakpoints must agree |
| Runtime | jQuery 3.7.1, Bootstrap, Gumshoe 5.1.2, Swiper 12.0.3, Magnific Popup 1.1.0, Filterizr, custom scripts | Libraries are checked in rather than managed by npm |
| Startup | `js/main.js` runs on DOM ready; fades a full-screen loader; initializes Swiper and random imagery | A script failure can obstruct otherwise static content |
| Timed behavior | Testimonials advance every four seconds; hero randomly changes every five seconds | Accessibility controls, deterministic tests, and media budgets matter |
| Contact | `mailto:`/`tel:` links, PDF and vCard downloads | No application backend needed for the current page |
| Legacy behavior | `js/common.js` submits `#form` to `mail.php`; gallery/filter setup is guarded | No matching form, backend, work section, or filter container is in the current page |
| Hosting | Apache on the Linode VM shared with Stableishwater | Deployments must target the correct site directory |
| Secondary publication | Generated GitHub Pages workflow publishes `main` | Separate from production Linode hosting |

`index.html` loads jQuery, Bootstrap, common.js, Gumshoe, Swiper, popup/filter plugins, then main.js; an inline script creates Gumshoe. Production assets require no npm install or compilation. The new npm dependencies support local serving and tests only.

## Prioritized findings and test-first repair plan

Priority 1 means address early in the update; priority 2 means schedule alongside the redesign/content work. Findings below were identified through code and browser checks; they have not been repaired by this setup task.

| Priority | Location | Finding and evidence | Focused regression before repair |
| --- | --- | --- | --- |
| 1 | `index.html:370` | Skip link remains at x = -9999 after keyboard focus. Its inline `left`, width, and height override the normal `.skip-link:focus` rule. The focused link is invisible. | Press Tab, assert the skip link is visible inside the viewport, activate it, and verify main-content navigation/focus |
| 1 | `css/main.css:62`, `js/main.js:6` | The full-screen preloader remains displayed with JavaScript disabled and blocks pointer interaction with the static page. Failure to load main.js has the same dependency risk. Even a healthy startup deliberately delays access by 1.5 seconds plus the fade. | Load without JS and with main.js unavailable; verify primary content and downloads remain usable |
| 1 | `css/main.css:31`, `index.html:494`, `index.html:764` | axe reports six low-contrast email, phone, PDF, and vCard links: orange `#ff8c42` on white measures 2.31:1, below the 4.5:1 expectation for their text size. | Run targeted contrast checks and keyboard focus checks after changing link colors/styling |
| 1 | `img/hero/`, `js/main.js:65` | First hero image is 8,809,643 bytes. The deterministic local initial load accounted for about 10.1 MB of decoded resource bodies, excluding unavailable cross-origin size accounting. Nine hero PNGs total roughly 52 MB. | Establish an independent asset-size/page-weight budget; assert optimized assets and visible hero rendering |
| 1 | `index.html:20`, `index.html:107`, `index.html:443`, `vcard/Brian_Raines.vcf:6` | Visible current experience is Property Vista/Principal, while the headline, previews, vCard title, and structured profile still present Distinguished/Turnitin. This mixes historical position and current employment. | Once the intended headline/current role is agreed, verify semantic parity across the affected publishing surfaces |
| 2 | `index.html:399`, `css/main.css:356`, `css/main.css:1356` | Bootstrap expands navigation at 992px; custom sidebar styling starts at 1000px. Screenshots at 992–999px show a 320px-high fixed black navigation bar with vertically stacked links. At exactly 1000px both custom media queries apply: the sidebar exists but main content loses its left padding, and the sampled About heading is covered by navigation. | Test 991/992/999/1000/1001px; assert navigation layout and unobscured content |
| 2 | `js/main.js:10`, `js/main.js:76`, `css/main.css:326` | With reduced-motion enabled, Swiper autoplay remains running and the Learn More animation remains `animate-it`. No reduced-motion rule or hero timer opt-out exists. No user pause/stop controls are exposed. | Emulate reduced motion and advance the browser clock; assert stable imagery/carousel and usable playback controls |
| 2 | `index.html:677`, `js/main.js:10` | The carousel has zero keyboard tab stops, keyboard navigation is disabled, and no previous/next/pause controls are present. Touch/autoplay is its primary navigation. | Reach feedback by keyboard, move between testimonials, and pause movement without a gesture |
| 2 | `index.html:471`, `index.html:527`, `index.html:580`, `index.html:685`, `index.html:763` | axe flags five heading-order nodes: section h2 headings jump to h4/h5 subheadings. Headings are being used partly for styling. | Check semantic heading hierarchy, preserving visual styling independently |
| 2 | `index.html:437` | `role="banner"` is nested inside the main landmark; axe flags that a banner should be a top-level landmark. | Assert the intended landmark hierarchy and accessible navigation regions |
| 2 | `css/main.css:455`, `index.html:430` | Desktop sidebar URL relies on color alone; axe reports 1.29:1 contrast against neighboring gray text and no distinguishing underline. | Verify link distinguishability/focus treatment in the sidebar |
| 2 | `index.html:482`, `index.html:681` | All seven content images lack explicit width/height attributes. The About image starts as bulldog/8.png and changes to a randomized image on DOM ready, causing two image loads in the measured session. | Verify reserved image space and avoid redundant initial portrait requests |

For autoplay, motion, and contrast fixes, use meaningful behavioral/accessibility checks rather than assertions that specific CSS strings exist. Retain the current baseline suite; add focused regressions as each repair is implemented.

## Accessibility and interaction assessment

Existing strengths include a language declaration, viewport metadata that permits zoom, a main landmark, named section regions, a labeled mobile menu button with expanded state, descriptive social links, image alt text, and genuine link/button elements. Main navigation, PDFs, and vCard downloads worked in the baseline desktop/mobile suite.

The axe run reported four violation categories on desktop and three on mobile: color contrast, heading order, nested banner landmark, and the desktop-only link-in-text-block issue. Automated rules do not detect all observed failures: the invisible focused skip link, lack of motion controls, and keyboard carousel access need dedicated checks.

The mobile menu toggles successfully but remains open after selecting an anchor. This should be considered during UX revision, along with fixed-header clearance. There is no `scroll-margin-top`/`scroll-padding-top` customization; test settled scroll positions and whether fixed UI actually covers the destination, not just whether its bounding box intersects the viewport.

Image alt text identifies the bulldog as Brian Raines, whereas the visual is a dog. Decide whether this is decorative brand imagery or a literal portrait and write the alternative text accordingly. Decorative icon semantics should be checked individually; contact/download icons already have `aria-hidden`, while some other icons do not.

The mobile hero wraps the name onto separate lines with wide letter spacing and a tall title block. This is a design judgment rather than a functional failure, but it makes the headline slower to scan. The long employment chronology also dominates the page; a new AI-focused summary and selected case studies should give recruiters a shorter route to relevant evidence.

## Performance and asset maintenance

The large hero media outweigh the JavaScript optimizations available here. Asset priority should be: resize/re-encode hero images, choose a deliberate initial image and loading strategy, then simplify optional libraries and duplicate assets. Avoid fetching every hero up front; preserve a useful still image if rotation is removed or motion is reduced.

The initial measured local request set included roughly 296 KB of unminified jQuery, 232 KB of Bootstrap CSS, and 154 KB of Swiper JavaScript. These are decoded payload sizes, not production compressed-transfer sizes. Production `css/main.css` supports gzip in the sampled response, so local payload accounting must not be reported as a production speed score. Core Web Vitals/Lighthouse and throttled-network timings were not measured.

There are numerous Bootstrap variants, maps, and unused portfolio images in the checkout. The presence of unused files does not itself slow the page, but loaded Magnific Popup/Filterizr scripts and their styles have no corresponding active UI here. Remove them only after a focused characterization/check confirms their absence from current visitor behavior.

Vendored library updates have no lockfile, dependency inventory, or automated update path. The new npm lockfile tracks development tools only. `npm audit` returned zero vulnerabilities for those tools; that result says nothing about the checked-in runtime libraries. Retain vendor license headers and avoid treating the owner's content license as a replacement for third-party licenses.

Several `transition: all` declarations remain in site CSS (`css/main.css:582`, `css/main.css:1175`, and legacy selectors). Limit transitions to the actual properties used when touching those components. Unused selectors should not take precedence over higher-impact media and accessibility work.

## Content, SEO, and social footprint

The page already has a canonical URL, title/description, Open Graph and Twitter cards, favicon/manifest, Person/WebSite/Breadcrumb/Service/Organization/review JSON-LD, and LinkedIn/GitHub links. This gives the planned repositioning several places where old wording must be deliberately updated.

Specific inconsistencies:

- `index.html:43` declares the social image as 1200×630; the referenced `img/logo.png` is actually 830×830 and about 1.3 MB. Create a deliberate preview asset and use truthful dimensions.
- `index.html:156` advertises a SearchAction on `?q=...`, but no search UI or query handling exists in this application. Remove that declaration or implement a real search behavior if it becomes useful.
- JSON-LD review ratings all say 5 even though the visible page displays prose testimonials, not star ratings. Confirm the source supports numeric ratings before retaining those claims.
- Turnitin remains an Organization record and the Person's `worksFor`; historical work and current employment should be modeled deliberately.
- The favicon manifest also contains the older Distinguished Software Engineer title.
- LinkedIn uses an older `/pub/` URL; Twitter/X account metadata exists without a visible X link. Confirm chosen destinations before editing profiles or publishing.
- There is no checked-in robots.txt or sitemap. For a single-page site, this is lower priority than accurate content and usable metadata.

Resume material is duplicated across README, HTML, PDF, vCard, JSON-LD, and metadata. README also repeats the Turnitin introduction/Organizational Impact block. No AI accomplishments should be added until they can be grounded in Brian's actual work and shareable outcomes.

Brian has designated [Brian_Raines_Resume.docx in Drive](https://docs.google.com/document/d/1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP/edit), file ID `1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP`, as the authoritative resume source. The connected account owns it. It is a stored Word file, not a native Google Doc. The README, website, PDF, vCard, and profile copy are derived publishing surfaces. Their parity with the source and the export workflow still need to be verified; no automatic synchronization has been implemented.

## Security, operations, and delivery

The current page has no authentication, application API, user-submitted content, or live contact form. Its application attack surface is comparatively small. The dormant `mail.php` reference does not prove a working backend exists; if a form is introduced, add validation, error handling, accessible feedback, and appropriate backend protections as part of that feature.

Observed production responses enforce HTTPS via HSTS and redirect HTTP requests to `https://www.raines.io/`. Both `https://raines.io` and the www hostname return the page. The HTML canonical prefers the non-www hostname; decide one canonical redirect policy when reviewing hosting. HTTPS responses inspected did not include CSP, frame restrictions, or an explicit Cache-Control header. Review those headers and caching with the actual Apache configuration; absence in sampled responses is an observation, not proof of an exploitable vulnerability. Inline scripts and external fonts/analytics must be accounted for if a CSP is added.

GitHub currently has one active, generated `pages-build-deployment` workflow. Its latest listed run succeeded on February 27, 2026 ([run](https://github.com/brianraines/raines-io/actions/runs/22500250203)). It publishes `main` at the repository root to `https://brianraines.github.io/raines-io/`, with no custom domain configured. That is not the Linode deployment.

The active `Review` ruleset requires PRs and signed commits and blocks deletion/force pushes on the default branch. It has zero required approving reviews and no required status checks. The new Website CI workflow will provide a `Browser tests` check once pushed; requiring that check is still a remote settings task. Generated Pages deployments also do not wait for it.

No repository script identifies the Linode SSH target, document root, release artifact, deployment trigger, or rollback procedure. Establish the existing process before automating it. On the shared VM, a release should be limited to this site's assets and directory and have a verified rollback path.

## TDD readiness and recommended order

The added manifest/lockfile, pinned static server, Playwright configuration, six baseline scenarios exercised on two device configurations, CI YAML, developer documentation, and `AGENTS.md` now support test-first website changes. The suite captures existing working behavior; it does not hide known audit issues with skipped tests or claim they are fixed.

The initial Python server experiment produced connection resets during concurrent asset requests, which surfaced as preloader and download failures. Traces isolated this as a development-server issue. It was replaced by the pinned Node static server; the complete suite then passed. Do not respond to similar failures by increasing timeouts or forcing clicks.

A controlled mutation changed the PDF links to a nonexistent local file. The asset regression test failed with the expected missing-asset message, and the original HTML bytes were restored before the final suite run. This establishes that the baseline check can catch a real broken download rather than merely passing against the current page.

Final local verification used Node 24.21.0, a clean `npm ci`, and `CI=true npm test`: all 12 tests passed in 18 seconds. Actionlint, JavaScript syntax checks, and `git diff --check` also passed. The install reported a transitive `whatwg-encoding` deprecation warning; npm audit reported zero vulnerabilities in the 52-package development dependency tree. This is a local run, not a GitHub runner result.

Recommended sequence:

1. Repair skip-link visibility, loader fallback, contrast, and responsive navigation with focused failing tests.
2. Optimize hero images and add reduced-motion/keyboard controls, with asset budgets and deterministic timer tests.
3. Read the authoritative Drive resume and build an evidence inventory of the past year's native-AI work. Agree target roles and professional headline.
4. Update resume, website narrative, current-employer data, vCard, and social-preview assets coherently. Add case studies or project examples with clear roles and outcomes.
5. Draft matching LinkedIn/GitHub positioning and selected public examples; publish only within the user's authorized scope.
6. Document Linode release/rollback, make CI required for merges, and decide the role of the secondary Pages copy.

Production HTML/CSS/JavaScript and public profiles were not changed by this review. All preparation changes remain local until committed/pushed; the GitHub-hosted CI job and a Linode release have not been run.
