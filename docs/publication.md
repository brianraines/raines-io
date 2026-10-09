# Resume website publication

Google Drive remains the resume authority: [Brian_Raines_Resume.docx](https://docs.google.com/document/d/1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP/edit). The website, README, PDF, vCard and social profiles are publishing surfaces derived from the approved facts. The website's project write-ups also use Brian's confirmed interview answers; their additional engineering detail must not be mistaken for new resume claims or measured outcomes.

## Repeatable parity checks

`publication.json` records the reviewed Drive file ID and modification time, plus SHA-256 checksums for `index.html`, `css/main.css`, `js/main.js`, the PDF, the vCard and newly added testimonial portraits. It identifies a reviewed set of publishing artifacts, not a competing resume master.

```sh
npm test
npm run verify:publication
npm run verify:publication -- --url https://raines.io/
git diff --check
```

The local command detects missing or changed artifacts. The URL command downloads each public artifact and compares its exact bytes against the reviewed checksums; any mismatch, HTTP failure or timeout causes a nonzero exit. It also works with a site hosted below a path. Neither command publishes files.

Before refreshing the manifest, read the current Drive revision, verify the exported PDF and affected website copy against that source, and review additional project material against Brian's confirmed facts. Update the manifest only after review; mechanically accepting new hashes cannot prove that content is accurate. This check does not fetch Drive or generate the PDF automatically.

For a future reviewed revision, update `source.modifiedTime` and replace each artifact checksum using `shasum -a 256` or another SHA-256 implementation. Run the local check before release and the public check after release. Commit the manifest with the content it describes when a commit is authorized.

## Verified hosting layout

Read-only inspection on October 8, 2026 confirmed:

- `raines.io` and `stableishwater.com` resolve to the shared VM at `45.56.126.85`.
- The raines.io virtual host is Apache, configured in `/etc/apache2/sites-enabled/rainesio.conf`.
- Its HTTPS document root is `/opt/app/brian/current`, an existing symlink into `/opt/app/brian/releases/`.
- SSH user `brian` has access through the workstation's existing `~/.ssh/id_rsa_raines` identity with strict host-key checking. The private key must never be copied into the repository or a deployment archive.
- The release active before this update was `releases/release-4.4.0`.

These facts describe this website. Stableishwater has its own release procedure and must not be redeployed or have shared services restarted as part of a resume-site release.

## Scoped release and rollback

1. Run the local tests, review desktop/mobile layouts, verify resume content and validate the publication manifest.
2. Recheck the current symlink and active release on the VM. Create a new, uniquely named release directory under `/opt/app/brian/releases/`. Copy the active site's public files into it, excluding repository metadata and editor directories, so unchanged assets remain available.
3. Upload only the reviewed website files changed by the release. Use the manifest to verify the release, including any newly added testimonial portraits. The README and development documentation belong in Git. Do not upload repository metadata, local test reports, npm dependencies, private keys or unrelated files.
4. Compare the staged remote files' checksums against the local reviewed artifacts before switching. Record the prior release target for rollback.
5. Create a temporary symlink beside `current` and rename it over `current` atomically. Keep the prior release intact. The existing Apache configuration follows this symlink; no shared service restart or configuration change is required for these static files.
6. Run the public parity command and check project navigation, disclosures and downloads on desktop/mobile. Check both raines.io and www.raines.io if both are maintained.
7. If release verification fails, atomically restore the previous symlink, verify the public site, and investigate before retrying. Never delete or overwrite the previous release to repair the new one.

Public artifact checks establish that the reviewed bytes are serving. They do not establish every accessibility requirement, cross-browser compatibility, social-profile parity or search-engine indexing. GitHub Pages is a separate copy; this Linode process does not update it or merge/push the Git branch.

## October 8, 2026 release record

Released `releases/release-resume-ai-20261008-222339` through the existing `current` symlink. The prior `releases/release-4.4.0` remains intact for rollback. No Apache configuration, shared service, or Stableishwater release was changed.

Before switching, all four changed remote artifacts matched the reviewed manifest. After switching, the public verifier passed for all four artifacts on both `https://raines.io/` and `https://www.raines.io/`. The PDF checksum is `6c326c613090944a8df55acbaa9b3d2dad7380ff47788294c09427c10557c4a4`, matching the reviewed three-page resume containing Property Vista.

Local verification passed five Node tests and 16 browser tests. Eight additional browser smoke checks passed against the published site, covering project navigation, pointer/keyboard disclosures, and PDF/vCard downloads on desktop and mobile Chromium. Desktop, mobile and 320px layouts were visually reviewed; no horizontal page overflow was observed. The design detector also flagged existing low-contrast text and existing font/style choices outside the new project content. This update does not claim a complete accessibility audit or remediation of those legacy styles.

## Projects presentation refinement

Released `releases/release-projects-20261008223741` on October 8, 2026. The prior `releases/release-resume-ai-20261008-222339` remains intact for rollback.

This revision adds Paper to Digital using the existing resume's Turnitin facts. It removes the hero's AI/project callouts and the extra project links in Experience. The Projects section now follows the existing white surface, heading scale and spacing, with compact native “Technical notes” disclosures. The resume PDF, vCard and authoritative Drive revision are unchanged.

All five Node tests and 16 local browser tests passed, including pointer/keyboard disclosures for all four projects. Eight production browser checks also passed for navigation, project disclosures and downloads on desktop and mobile. Desktop, mobile and 320px layouts were reviewed with no page overflow. All four public artifact checks passed on raines.io and www.raines.io. Legacy design-detector findings remain outside this refinement; the site's existing typefaces and wider design are intentionally preserved.

## Expanded project layout and section order

Released `releases/release-project-layout-20261008225910` on October 8, 2026. The prior `releases/release-projects-20261008223741` remains intact for rollback. Restore that prior target through the same atomic symlink procedure if needed.

Projects now follows Resume in the page, menu and structured navigation. On wide screens, project names and topic headings align in a left column beside readable text. On phones, headings stack above their text. Consistent topic/paragraph spacing and subtle separators distinguish the four projects. Robot Bakery's seven stages form a numbered vertical sequence with readable gate explanations. Project facts, resume content, PDF and vCard are unchanged.

UI/UX Pro Max's targeted text-layout guidance informed this refinement. Expanded and collapsed project views were reviewed at 1440px, 1024px, 412px and 320px; additional checks used a 375px phone, landscape orientation, reduced-motion preference and enlarged body text. No horizontal page overflow or clipped project text was observed. Disclosure controls retained 44px minimum height and pointer/keyboard operation. This is scoped layout verification, not a full accessibility or cross-browser audit.

The new regression checks first failed on the old section order and narrow desktop workflow captions. Final verification passed five Node tests and 20 local browser tests. Twelve production browser checks passed for section/menu order, workflow caption width, navigation, disclosures and downloads on desktop/mobile Chromium. All four public artifacts matched the reviewed manifest on both raines.io and www.raines.io. No shared service or Stableishwater release was changed.

The README was checked against the freshly read authoritative Drive content and matching DOCX readback: all 72 nonempty resume paragraphs are represented, including the summary, five skill groups, career roles/dates and education. It now records the reviewed source revision and puts developer notes after the resume. Repository changes remain on `codex/resume-ai-content-review`, staged but not committed or pushed; the README displayed on GitHub therefore still reflects the older committed version.


## Technical Expertise divider spacing

On October 8, 2026 at 6:12 p.m. CDT, the authoritative Word resume was updated in place on Drive (revision modification time `2026-10-08T23:12:07.842Z`). The first AI-Native Engineering paragraph now has 7pt spacing before it, matching the first entry beneath the Professional Experience bar. All divider geometry and all other document elements are preserved. A targeted OOXML comparison confirmed this was the only formatting change; the complete resume text is unchanged. Drive readback exactly matched the edited DOCX, SHA-256 `a6324c6f9a109ac594e4cbd695471aa884d10adfbbc6351246d6ad21c05c6004`.

All three rendered Letter pages were visually inspected and all source paragraphs were verified in the PDF. The regenerated PDF checksum is `650266c60f34551f29bb63e3281c03c664dcd225f57a0cabf55b7281ef7c579e`. Released `releases/release-resume-spacing-20261008231256`; the prior `releases/release-project-layout-20261008225910` is preserved for rollback. The PDF is the only changed public file. README source-revision metadata and the publication manifest were updated locally.

Five local publication tests and four local browser download checks passed. All four artifacts matched the manifest on both public hostnames. Four production desktop/mobile download checks passed. No shared service, Stableishwater release, website copy, or resume wording was changed.

## Brandon Morrill recommendation

On October 8, 2026, Brian's signed-in LinkedIn profile was reviewed for [Brandon Morrill's received recommendation](https://www.linkedin.com/in/brian-raines-0669913/details/recommendations/?detailScreenTabIndex=0), dated September 25, 2026. Brandon's [profile](https://www.linkedin.com/in/brandonmorrill/) confirmed his Principal Engineer title and current Property Vista affiliation. An exact 25-word excerpt about technical judgment initially led the testimonial carousel. The full recommendation was not reproduced. His actual 800×800 JPEG portrait was downloaded from the profile photo viewer and is served locally as `img/testimonials/brandon_morrill.jpeg`, preserving the section's existing presentation. The structured review matches the displayed excerpt and attribution and retains the source/date without adding an unsupported star rating.

The portrait regression test first failed because the image was absent. Final checks passed five Node tests and 22 browser tests, plus desktop/mobile screenshot review with no horizontal overflow. Eight production checks passed for the new portrait/attribution, navigation and usable downloads. All five manifest artifacts matched on both raines.io and www.raines.io. The Drive source revision was rechecked and is unchanged; the resume PDF and vCard were not revised.

Released `releases/release-testimonial-20261009002444`; `releases/release-resume-spacing-20261008231256` remains intact for rollback through the existing atomic symlink procedure. Only `index.html` and the new portrait were uploaded. No shared service or Stableishwater release changed. Changes remain staged on `codex/resume-ai-content-review`, without a commit or push.


## Stronger testimonial excerpt

At Brian's request, the opening testimonial now combines Brandon's direct endorsement of Brian's engineering ability with his willingness to work together again. Both passages retain the source wording, with an ellipsis marking the omitted material. The visible excerpt and structured review match; the portrait and attribution are unchanged.

Released `releases/release-testimonial-excerpt-20261009003120`, retaining `releases/release-testimonial-20261009002444` for rollback. Only `index.html` changed publicly. Five Node tests and 22 local browser tests passed; desktop/mobile screenshots were reviewed with no page overflow. Both production testimonial checks passed, and all five manifest artifacts matched on both public hostnames. The Drive revision remains unchanged. Changes are staged without a commit or push.

## Linked recommendation cards

All seven recommendation cards now link to Brian's requested [LinkedIn recommendations page](https://www.linkedin.com/in/brian-raines-0669913/details/recommendations), opening in a new tab with `noopener noreferrer`. Each link has an accessible name identifying the author and the new-tab behavior. The existing card styling is preserved; keyboard focus adds a visible outline and reveals the focused card. Carousel autoplay stops while focus is inside and restarts when focus leaves.

The new pointer and keyboard tests first failed because no card links existed. Final verification passed five Node tests and 26 local browser tests. Desktop/mobile screenshots were reviewed, including focus appearance and page overflow. Four production link/keyboard checks passed; all six manifest artifacts matched on both public hostnames. Automated destination checks intercept LinkedIn navigation; the requested URL was separately opened in signed-in Chrome and confirmed to show Received recommendations, including Brandon Morrill. This does not establish anonymous LinkedIn access. Resume content and its Drive revision remain unchanged.

Released `releases/release-testimonial-links-20261009003736`; the previous `releases/release-testimonial-excerpt-20261009003120` remains intact for rollback. Only `index.html`, `css/main.css`, and `js/main.js` changed publicly. The manifest now includes `js/main.js` so the carousel behavior is verified during releases. No shared service or Stableishwater release changed. Work is staged on `codex/resume-ai-content-review`, without a commit or push.

## Hover pause and resume

Recommendation autoplay now pauses while the pointer hovers over a card and resumes when it leaves, provided keyboard focus has also left the carousel. Hover and focus are tracked independently, preventing either interaction's exit from restarting scrolling while the other remains active. Card layout, excerpts, links and resume content are unchanged.

The hover test first reproduced unwanted scrolling, and the combined-interaction test reproduced restarting on focus loss while the pointer remained over the card. The existing focus-only behavior remained covered. Final verification passed five Node tests and 32 local browser tests; eight production checks passed for hover, resume and keyboard behavior on desktop/mobile Chromium. All six artifacts matched the manifest on both public hostnames. The Drive revision was rechecked and remains unchanged.

Released `releases/release-testimonial-hover-20261009004105`, preserving `releases/release-testimonial-links-20261009003736` for rollback. Only `js/main.js` changed publicly. No shared service or Stableishwater release changed. Work remains staged without a commit or push; the manual local preview was restarted at `http://127.0.0.1:4173/`.

## Expanded Brandon testimonial

Brandon's visible testimonial and matching structured review now use Brian's supplied three-sentence version, including the sentence about simplifying complex problems. Desktop/mobile screenshots were reviewed with no page overflow; the longer quote fits the existing card styling. Five Node tests and 32 local browser tests passed. Both production portrait/attribution checks passed, and all six artifacts matched on both public hostnames. The resume source revision remains unchanged.

Released `releases/release-testimonial-expanded-20261009004309`, retaining `releases/release-testimonial-hover-20261009004105` for rollback. Only `index.html` changed publicly. Work remains staged without a commit or push, and the local preview was restarted.

## Feedback section anchor

The recommendation section now uses `#feedback`. The Feedback menu, structured navigation URL and local testimonial citations were updated. A zero-height, hidden `#clients` bookmark alias immediately before the section keeps older links working without changing the layout or adding JavaScript redirects. Recommendation regression tests now enter through `#feedback`, and direct-link tests cover both anchors.

The updated navigation and direct `#feedback` tests first failed against the old section. Final verification passed five Node tests and 36 local browser tests. Six production navigation/direct-link checks passed on desktop/mobile Chromium. All six artifacts matched the manifest on both public hostnames. The resume source revision remains unchanged.

Released `releases/release-feedback-anchor-20261009004652`, retaining `releases/release-testimonial-expanded-20261009004309` for rollback. Only `index.html` changed publicly. Work remains staged without a commit or push; the local preview was restarted.

## Immediate carousel advance when interaction ends

When hover and keyboard focus have both ended, the feedback carousel now advances immediately, then continues its normal timed autoplay. At the last recommendation it wraps to the first. A pause-state guard limits the immediate advance to an actual transition out of interaction. Existing hover/focus overlap behavior and keyboard visibility are preserved.

The tightened hover/blur tests first failed because the carousel still waited for its four-second timer. The end-of-carousel test also failed before implementation, then passed with immediate wrapping and subsequent timed autoplay. Final verification passed five Node tests and 40 local browser tests. Twelve production checks passed for immediate advancement, hover/focus overlap, wrapping, timed autoplay, keyboard visibility and pointer movement between visible cards. All six artifacts matched on both public hostnames; the resume source revision remains unchanged.

Released `releases/release-feedback-blur-20261009005202`, retaining `releases/release-feedback-anchor-20261009004652` for rollback. Only `js/main.js` changed publicly. Work remains staged without a commit or push; the local preview was restarted.

## Robot Bakery wording and project trim

At Brian's request, the Robot Bakery opening now says it was developed using Codex to orchestrate a standard software development lifecycle. This replaces the claim about conceiving it without an existing reference implementation in the authoritative Drive resume, README, website Experience and Projects. The resume retains the maintenance and extension statement. The website's “From development to operation” topic was removed.

The stored Word source was updated in place, preserving its file ID and format, at October 8, 2026, 7:58 p.m. CDT (`2026-10-09T00:58:47.160Z`). A package comparison confirmed only the intended text clause changed; all other document XML and package parts were preserved. Drive readback exactly matched the edited DOCX, SHA-256 `d98ebb0639fa6a2a752f816b9a217cf085b4344dfd189957a0101fd2d3cb7f16`. All three Letter pages were visually reviewed and all 72 source paragraphs were verified in the regenerated PDF. Its SHA-256 is `99451f84e2638af2e33ee4d725e1baaf128566baf8b60323b3a4c6942c741789`.

Desktop/mobile project screenshots were reviewed, with three remaining Robot Bakery topics and no horizontal page overflow. Five Node tests and 40 local browser tests passed. Six production browser checks passed for project disclosures and PDF/vCard downloads. All six public artifacts matched the manifest on both hostnames.

Released `releases/release-robot-bakery-wording-20261009010039`, retaining `releases/release-feedback-blur-20261009005202` for rollback. Only `index.html` and the PDF changed publicly. No shared service or Stableishwater release changed. README and publication metadata were synchronized locally; changes remain staged without a commit or push. The manual preview was restarted at `http://127.0.0.1:4173/`.

## Quality & Reliability expertise card

On October 8, 2026, the website's Technical Expertise grid gained a sixth card, Quality & Reliability, beside Technical Leadership. It covers test-driven development; unit, integration, browser and end-to-end testing; synthetic monitoring and canaries; CloudWatch alarms and Logs Insights; and AI-assisted root-cause analysis. All items were grounded in the freshly read authoritative Drive resume, whose revision remains `2026-10-09T00:58:47.160Z`. Testing moved out of the AI-Native card while AI-assisted review remains there; monitoring moved out of Architecture & AWS. The Drive resume and PDF were not revised for this website presentation change. README developer notes explain the grouping difference.

The new layout test first failed because the Quality & Reliability card was absent. It then passed, checking paired alignment and equal row height on desktop, stacking on mobile and no horizontal overflow. The complete suite passed five Node tests and 42 browser tests. Real-font screenshots at 1440px, 1024px, 412px and 320px were visually reviewed; six cards, readable text and no horizontal overflow were verified. Existing styling and typography were retained.

Released `releases/release-quality-card-20261009012446`, preserving `releases/release-robot-bakery-wording-20261009010039` for rollback. Only `index.html` changed publicly. All six manifest artifacts matched on both public hostnames; eight production desktop/mobile browser checks passed for the new card's layout, navigation and downloads. No shared service or Stableishwater release changed. Changes remain staged on `codex/resume-ai-content-review`, without a commit or push; the manual preview was restarted at `http://127.0.0.1:4173/`.

## Amazon Q and Amazon Bedrock

On October 9, 2026, Brian requested Amazon Q and Amazon Bedrock in the AI tools list. Both were appended to the authoritative Drive resume, derived README and website AI-Native Engineering card. The page keywords and both Person structured skill lists also include them. No project contributions, proficiency levels or outcomes were added.

The Word source was updated in place at 9:26 a.m. CDT (`2026-10-09T14:26:48.512Z`), preserving its file ID and format. A package comparison confirmed the tool-list text was the only DOCX change. Drive readback exactly matched the edited file, SHA-256 `0c2101c6c1161a42b7653e8bf7a2a58ba895aea018b220d104bee651a585fa7e`. All three Letter pages were visually reviewed and all 72 source paragraphs were verified in the PDF, SHA-256 `009430725ca2c324ea3074e3b14ba395b74ba0e221cb7bdea6ae494120c0a7c2`. Website screenshots at 1440px, 1024px, 412px and 320px were reviewed with no clipped text or horizontal overflow. The publication manifest and README source revision were refreshed after review.

Five Node tests and 42 local browser tests passed. Eight production desktop/mobile checks passed for skills layout, structured profile and downloads; all six manifest artifacts matched on both public hostnames. This copy change used existing regression checks and direct source/PDF review rather than adding exact-prose tests.

Released `releases/release-amazon-ai-tools-20261009142804`, retaining `releases/release-quality-card-20261009012446` for rollback. Only `index.html` and the resume PDF changed publicly. No shared service or Stableishwater release changed. Changes remain staged on `codex/resume-ai-content-review`, without a commit or push, and the manual preview was restarted at `http://127.0.0.1:4173/`.

## Shorter AI-Native Engineering card

On October 9, 2026, the two selected bullets, “Persistent agent memory and scoped retrieval” and “AI-assisted review,” were removed from the website's AI-Native Engineering card to balance the skills grid. Its four remaining bullets retain the complete tools list, including Amazon Q and Amazon Bedrock. This is a website presentation edit; the resume, README resume prose, PDF, project details and structured skill metadata retain the supported experience. Drive metadata was rechecked and its source revision remains `2026-10-09T14:26:48.512Z`.

Screenshots at 1440px, 1024px, 412px and 320px were reviewed with no clipped text or horizontal overflow. Five Node tests and 42 local browser tests passed. Ten production desktop/mobile checks passed for skills layout, navigation, project disclosures and downloads; all six manifest artifacts matched on both hostnames.

Released `releases/release-ai-card-trim-20261009144125`, retaining `releases/release-amazon-ai-tools-20261009142804` for rollback. Only `index.html` changed publicly. No shared service or Stableishwater release changed. Changes remain staged without a commit or push; the manual preview was restarted at `http://127.0.0.1:4173/`.

## Separate testing and human-approval bullets

On October 9, 2026, the Robot Bakery bullet combining test-driven implementation and human oversight was split into Brian's approved two statements in the authoritative Drive resume, README and website Experience. Testing now has its own bullet; the next bullet describes required human plan approval and operator ownership of pull-request approval, merging and deployment.

The stored Word source was updated in place at 9:49 a.m. CDT (`2026-10-09T14:49:17.898Z`), preserving its file ID and format. Only the targeted paragraph was replaced by two paragraphs using the same list formatting; all other paragraphs and package parts were preserved. Drive readback exactly matched the edited DOCX, SHA-256 `5e60704d7b53bbfef043a2f29c9f5f94ebb76382130b055abc468262ba91ba54`. All three Letter pages were visually reviewed and all 73 nonempty source paragraphs were verified in the regenerated PDF, SHA-256 `8ce877c96da1d540c23b0948b6b24de4500e0176c34d5a0d43314f1c77c8e579`. Desktop/mobile website screenshots confirmed two distinct bullets and readable text without horizontal overflow.

Five Node tests and 42 local browser tests passed. Eight production desktop/mobile checks passed for navigation, project disclosures and downloads; all six manifest artifacts matched on both public hostnames. README source metadata and the publication manifest were refreshed after source/PDF review.

Released `releases/release-split-bullet-20261009145106`, retaining `releases/release-ai-card-trim-20261009144125` for rollback. Only `index.html` and the PDF changed publicly. No shared service or Stableishwater release changed. Changes remain staged on `codex/resume-ai-content-review`, without a commit or push; the manual preview was restarted at `http://127.0.0.1:4173/`.

## Engineer & Architect hero, Open to line and social card

Released `releases/release-engineer-architect-20261009110159` on October 9, 2026. The prior `releases/release-split-bullet-20261009145106` remains intact for rollback; restore it through the same atomic symlink procedure if needed.

The hero and About Role row now read Engineer & Architect, the About section gains an Open to line for Staff, Principal and Distinguished roles or engineering management, and `og:image`/`twitter:image` use the new 1200x630 `img/og-card.jpg` instead of the square logo. The page title, meta descriptions, structured data and vCard title are unchanged. Changed public files: `index.html` and `img/og-card.jpg`.

Before switching, all six staged remote files matched the reviewed manifest. After switching, the public verifier passed all seven artifacts on both raines.io and www.raines.io, and a browser check confirmed the new hero, Open to line and a 200 `image/jpeg` response for the card. Local verification was 48 passing browser tests plus the manifest check; social-platform preview caches were not refreshed.

## Hero and about-photo compression

Released `releases/release-compress-images-20261009` on October 9, 2026. The prior `releases/release-engineer-architect-20261009110159` remains intact for rollback; restore it through the same atomic symlink procedure if needed. Because that release still serves the old hero PNGs, rolling back also restores the older `main.js` and `main.css` that reference them.

The nine rotating hero PNGs (about 52 MB combined) became 1920px WebP files (about 2.2 MB combined, largest 512 KB), referenced from `js/main.js` and the `css/main.css` fallback keyframes. Bulldog photos 10 and 11 shrank from about 2.4 and 2.8 MB to about 250 and 220 KB. The old hero PNGs were removed from the new release only; the prior release keeps them. Changed public files: `js/main.js`, `css/main.css`, nine `img/hero/*.webp`, and `img/bulldog/10.png` and `11.png`.

Before switching, all 17 staged remote files matched the local repository byte for byte. After switching, the public verifier passed all 16 manifest artifacts on both raines.io and www.raines.io, and all nine WebP files returned 200 `image/webp` at the expected sizes while the old PNG returned 404. Local verification was 52 passing browser tests (one mobile carousel hover test failed once under full-suite load and passed on rerun and in isolation) plus the manifest check.

## Title and metadata alignment

Released `releases/release-title-metadata-20261009` on October 9, 2026. The prior `releases/release-compress-images-20261009` remains intact for rollback; restore it through the same atomic symlink procedure if needed.

The page `<title>`, `meta name="title"`, `og:title`, `twitter:title`, the Person `jobTitle` in the JSON-LD and the vCard `TITLE` now read Engineer & Architect, matching the hero. The meta, Open Graph and JSON-LD descriptions keep the resume summary wording, `hasOccupation.name` stays Software Engineer as the occupation category, and employment titles are unchanged. Changed public files: `index.html` and `vcard/Brian_Raines.vcf`.

Before switching, all 15 staged remote files matched the local repository byte for byte. After switching, the public verifier passed all 16 manifest artifacts on both raines.io and www.raines.io, and the served title, social titles, JSON-LD jobTitle and vCard title were read back from the live site. Local verification was 54 passing browser tests plus the manifest check. Social-platform preview caches were not refreshed.

## Carousel pause fix

Released `releases/release-carousel-fix-20261009` on October 9, 2026. The prior `releases/release-title-metadata-20261009` remains intact for rollback; restore it through the same atomic symlink procedure if needed. Rolling back restores the earlier carousel behavior.

Moving the pointer from one testimonial card to another previously fired `mouseleave` before `mouseenter`, which resumed autoplay and advanced a slide. `js/main.js` now treats movement within the carousel as still hovering and resumes only when the pointer leaves the carousel or a card is left toward the outside. Changed public file: `js/main.js`.

The carousel regression tests were also made deterministic: they wait for real-time CSS transitions to settle and measure a card's overlap with the carousel instead of depending on an IntersectionObserver frame arriving in time. Under heavy artificial CPU load (10 busy processes, 6 workers), the previous tests failed intermittently while 280 carousel runs passed after the change, and the old `main.js` fails the between-cards test on every run.

Before switching, all 15 staged remote files matched the local repository byte for byte. After switching, the public verifier passed all 16 manifest artifacts on both raines.io and www.raines.io, and a browser check against raines.io confirmed that moving the pointer between two cards leaves the carousel on its first slide with autoplay paused. Local verification was 54 passing browser tests, run twice, plus the manifest check.

## Web app manifest name

Released `releases/release-webmanifest-20261009` on October 9, 2026. The prior `releases/release-carousel-fix-20261009` remains intact for rollback; restore it through the same atomic symlink procedure if needed.

`img/favicon/site.webmanifest` named the site "Brian Raines - Distinguished Software Engineer", which browsers can show when the site is added to a home screen. It now reads "Brian Raines - Engineer & Architect", matching the hero, page title and structured data. Changed public file: `img/favicon/site.webmanifest`, which is now also listed in `publication.json`, so the verifier covers 17 artifacts.

Before switching, all 16 staged remote files matched the local repository byte for byte. After switching, the public verifier passed all 17 manifest artifacts on both raines.io and www.raines.io, and the served manifest name was read back from the live site. Local verification was 56 passing browser tests, including a new test that the linked manifest names Brian as an Engineer & Architect and that its icons are served, plus the manifest check. Installed home-screen shortcuts may keep the old name until the browser refreshes the manifest.

## New logo and icon set

Released `releases/release-new-logo-20261009` on October 9, 2026. The prior `releases/release-webmanifest-20261009` remains intact for rollback; restore it through the same atomic symlink procedure if needed.

The textured orange tile logo was replaced by a flat "br" lettermark (bold black "br" on white with an orange underscore) across the whole icon set: `img/logo.png`, the `img/favicon/favicon-*.png` files from 16 to 512 px, the two `android-chrome` icons and `apple-touch-icon.png`. The 16, 32 and 48 px versions use a heavier "br" and thicker underscore to stay legible in browser tabs, and the Apple icon is full-bleed because iOS applies its own rounding. `favicon.ico` now contains 16, 32 and 48 px images; it previously held only 16 px. `img/logo.png` is replaced in place (13 KB instead of 1.3 MB), so social-platform previews cached before the card change that still reference it now show the new logo instead of a broken image. Changed public files: all of the above.

Before switching, all 28 staged remote files matched the local repository byte for byte. After switching, the public verifier passed all 29 manifest artifacts on both raines.io and www.raines.io, and the `.ico`, 32 px favicon, Apple icon and `logo.png` returned 200 with the expected content types. Local verification was 58 passing browser tests, including a new test that every icon declared by the page and web manifest is served at its declared size and that the `.ico` offers 16, 32 and 48 px images, plus the manifest check. Browsers may keep showing the old tab icon from cache for some time. The icons are flat PNGs; no SVG favicon was added.
