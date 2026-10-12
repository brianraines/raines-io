# SEO and discoverability audit

Reviewed October 12, 2026. Repository baseline: `main`, commit `2a3b0e4`. This is an audit and implementation backlog; production files, career copy, hosting, and profiles were not changed.

## Assessment

The site has a sound technical foundation for a personal resume website: real HTML content, descriptive metadata, a canonical tag, social previews, working downloads, and structured identity data. It is discoverable through the public search service sampled in this review.

Its strongest opportunity is to turn the existing engineering projects into useful, separately addressable case studies, supported by consistent identity signals and relevant links from elsewhere. A single resume page can serve branded searches well, but it offers fewer focused entry points for people researching a technical problem or evaluating a particular kind of engineering experience.

Two concrete technical defects deserve attention first: the loader can permanently cover the site when JavaScript fails, and redirects favor a different hostname from the canonical tag. Search measurement is also a prerequisite for judging whether subsequent changes help.

This review does not establish Google rankings, search traffic, backlink quality, Search Console configuration, or real-user Core Web Vitals. Public search results are a sample, not a ranking report. No numeric SEO score is assigned.

## Evidence and scope

Reviewed `index.html`, site-specific JavaScript/CSS, dependency and CI configuration, browser tests, publication manifest, and existing development/audit/publication notes. Checked production HTTP responses, redirects, duplicate URLs, missing-page behavior, image responses, and publication parity. Inspected the production page in desktop and Pixel 7 Chromium contexts, plus JavaScript-disabled and failed-script contexts. Reviewed desktop screenshots and the failed-loader screenshot. Mobile DOM and overflow were checked; this was not a complete visual or accessibility audit.

The public HTML from raines.io, www.raines.io, and GitHub Pages matched the checked-in HTML byte for byte. The publication verifier independently passed all 29 reviewed production artifacts at `https://raines.io/`.

The search tool returned an older title and resume snapshot even though direct HTTP reads returned the current page. Treat that as evidence of stale data in the sampled service, not proof that Google currently displays the same snippet or failed to index a release.

The authoritative Drive resume was not revalidated because this review makes no career-content revisions. Before implementing any factual content additions, re-read that source and review project detail against the confirmed material documented in `publication.md`.

## Prioritized backlog

Effort is a rough engineering estimate, excluding account access and content approval.

| Priority | Change | Value | Effort |
| --- | --- | --- | --- |
| First | Remove the blocking preloader and make content usable when scripts fail | Restores access and eliminates an intentional startup delay | Small |
| First | Align HTTP, HTTPS/www, and `/index.html` redirects with the non-www canonical | Gives crawlers and visitors one consistent destination | Small; hosting change |
| First | Inspect Search Console and GA4; establish a baseline and useful conversion events | Makes SEO decisions measurable | Small; account access |
| Next | Publish two substantial static project case studies with descriptive links | Creates focused discovery and sharing opportunities | Medium; content review |
| Next | Make the title/hero more explicit about software engineering | Helps visitors interpret search results and the opening screen | Small; copy review |
| Next | Correct the Person image and the mascot's alternative text | Improves identity accuracy and accessible content | Small |
| Next | Deliberately retain or retire the GitHub Pages mirror | Clarifies publication ownership and avoids accidental divergence | Small; remote setting if retired |
| Next | Add a minimal sitemap and robots.txt | Supports discovery and monitoring, especially as pages grow | Small |
| Later | Optimize random image loading, unused libraries, fonts, and caching | Improves loading predictability and reduces unnecessary transfers | Medium |
| Ongoing | Share original technical work through relevant profiles and communities | Helps the intended audience discover and reference the site | Recurring editorial work |

## 1. Crawlability and canonical URLs

Production GET observations, with redirects disabled:

| URL | Response | Observation |
| --- | --- | --- |
| `http://raines.io/` | 301 | Location: `https://www.raines.io/` |
| `http://www.raines.io/` | 301 | Location: `https://www.raines.io/` |
| `https://raines.io/` | 200 | Canonical declares `https://raines.io` |
| `https://www.raines.io/` | 200 | Identical HTML, same non-www canonical |
| `https://raines.io/index.html` | 200 | Identical HTML, same canonical |
| `https://brianraines.github.io/raines-io/` | 200 | Identical HTML, same canonical, `index, follow` |
| `https://raines.io/robots.txt` | 404 | No robots file |
| `https://raines.io/sitemap.xml` | 404 | No sitemap at this conventional location |
| A deliberately nonexistent page | 404 | Correct missing-page response; no soft-404 fallback observed |

**Finding:** HTTP redirects favor www while the page canonical favors non-www. The existing canonical already helps; the problem is inconsistent consolidation signals rather than a missing canonical or a demonstrated duplicate-content penalty. Google treats redirects and canonical annotations as signals and ultimately selects its own canonical. [Canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

**Recommendation:** keep `https://raines.io/` as the preferred origin unless there is a reason to change it. Permanently redirect HTTP and HTTPS/www requests directly to that origin, preserving paths and query strings. Redirect `/index.html` to `/`. Test real redirects before and after release, including asset paths and direct project links. Avoid redirect loops and changes to the other site on the shared VM. A trailing slash on the origin is a consistency cleanup, not a substantive indexing defect: browsers normalize the existing root canonical to `/`.

The GitHub Pages copy already has a cross-domain canonical to production. Choose its purpose explicitly. If it is unnecessary, retire the public mirror after reviewing incoming links and its preview role. If it remains useful, preserve the production canonical and check for divergence. A preview-only `noindex` policy would need environment-specific HTML; changing the shared page would also affect production. A JavaScript redirect is not equivalent to a server redirect. Do not block a duplicate in robots.txt while expecting crawlers to read its canonical.

**Validation:** each alternate production URL reaches the preferred URL without a chain; it returns 200; its HTML canonical agrees. Search Console URL Inspection must confirm the Google-selected canonical. Local browser tests cannot verify Apache redirects or Google's choice.

## 2. Visitor access and loading behavior

**High-priority defect:** `css/main.css:62` makes `.preloader-wrap` a full-screen overlay with a high stacking order. `js/main.js:6` removes it only after a 1,500 ms delay plus a slow fade, approximately another 600 ms. The site otherwise has static content that could be available immediately.

Production exploration reproduced both failure modes:

- JavaScript disabled: the loader remained visible and covered the page.
- Only `js/main.js` blocked: the same permanent overlay remained.

In both cases, the center of the viewport hit the loader's `.lines` element rather than the page underneath. The resume text remained in the DOM. This establishes a visitor-access defect; it does not prove Google cannot index the HTML.

Remove the full-screen startup gate, or make any decorative loading indicator incapable of obscuring or blocking the content. Provide a usable static hero fallback. Add focused reproducer tests for disabled JavaScript and failed initialization before changing behavior, then run the full suite. Check mobile navigation fallback as part of that work; it currently also depends on JavaScript.

**Performance follow-up:** the hero is selected in JavaScript after DOM readiness and changes every five seconds. Hero assets are already WebP; do not repeat the earlier audit's obsolete claim that the active hero images are multi-megabyte JPEGs. The largest reviewed hero is 512,186 bytes, approximately 500 KiB. It is not necessary to download all nine at startup, but rotation can fetch additional images during a visit.

The exploratory desktop/mobile visits transferred both the default bulldog image and a randomly selected replacement. Choose a stable default and avoid fetching two images when only one will be shown. If rotation is retained, use responsive image sizes, defer work while offscreen, and respect motion preferences. A deterministic initial hero also makes loading more predictable; preload only the asset actually used above the fold.

Seven of the eight content images lack explicit width/height attributes. Add truthful dimensions or reserve the aspect ratio in CSS, then verify layout. Missing attributes alone do not prove a measured layout-shift failure; CSS may already reserve some space.

The page loads Magnific Popup, Filterizr, and the dormant contact-form handler even though their associated UI is absent. Their compressed JavaScript transfers were approximately 7.2 KiB, 11 KiB, and 0.2 KiB in the sampled session, plus popup CSS. Removing unused loading references is a modest cleanup; it is less important than fixing the loader. Preserve dependency order for libraries that remain. Use an upstream minified jQuery distribution if worthwhile; do not hand-edit vendored source.

The Roboto stylesheet request lacks `display=swap`, while Montserrat includes it. Review the actual font weights used and use an appropriate font-display strategy. Confirm final typography independently of the regression suite's isolated external fonts.

Production HTML, CSS, and JavaScript are gzip-compressed, with ETag/Last-Modified validators on sampled files. Explicit Cache-Control was absent on sampled Linode responses. Introduce a measured caching policy: revalidate HTML; give versioned assets longer lifetimes. Do not apply immutable caching to mutable asset URLs without a versioning strategy.

No field-performance verdict is possible here. The PageSpeed API request returned HTTP 429, so no PageSpeed score or CrUX result was obtained. Unthrottled local Chromium timings are not a mobile performance benchmark, especially with a loader visually obscuring content. Obtain field data where available and repeat lab tests with mobile throttling and representative hero choices. Google's good-experience targets are LCP within 2.5 seconds, INP below 200 ms, and CLS below 0.1; evaluate the field distribution rather than a single fast run. [Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).

## 3. Search presentation and identity

The current title is `Brian Raines | Engineer & Architect` (35 characters). The description is a useful 144-character summary mentioning software engineering, AI-native development, distributed systems, and 25+ years. Title, Open Graph, and Twitter titles agree. The hero has a single H1 with Brian's name and an “Engineer & Architect” subtitle.

**Opportunity:** “Engineer & Architect” is broad when shown outside the website. Consider `Brian Raines | Software Engineer & Architect` as a concise title and a similarly explicit visible subtitle. Keep the existing short branding if preferred, but provide a nearby plain-language description of the specialty. The current About text already does this lower down. This is a relevance and clarity improvement, not a guarantee of higher rankings. Google's title can be rewritten from page signals. [Title-link guidance](https://developers.google.com/search/docs/appearance/title-link).

Keep seniority labels grounded in career history and open-to preferences; do not turn an aspirational role into a current title. Mention Plano/Dallas–Fort Worth naturally where useful, rather than appending every specialty and location to the title. Choose wording after checking real query data; search demand was not measured in this audit.

**Identity defect:** Person JSON-LD points to `img/bulldog/8.png`. Visual inspection confirms this is an illustrated bulldog in historical clothing. The About image uses the same mascot family but its alt text says “Brian Raines - Software Engineer.” That description is inaccurate for the actual image.

Keep the mascot if it is part of the site's personality, but give it accurate alternative text, or empty alt text when purely decorative. Use a reviewed portrait for Person.image if available, or omit the image property. This improves accuracy without requiring a visual redesign.

The current Person and WebSite structured data are useful. Person.sameAs matches the LinkedIn and GitHub links; worksFor identifies Property Vista. Consider stable `@id` values connecting Person, WebSite, and an optional ProfilePage/mainEntity record. Treat ProfilePage as an optional semantic improvement and validate eligibility; it does not promise a rich result or knowledge panel. Google explicitly supports profile pages centered on an affiliated person and requires images to represent the marked-up subject. [Profile-page guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page).

Retain the cleaned-up schema. There are no current numeric review ratings, SearchAction, Service, or separate Turnitin Organization records. Those findings in the earlier audit are resolved. Do not reintroduce invented ratings, a nonexistent site search, or business/service schema merely to increase schema volume.

Social preview metadata now references a served 1200×630 card. Keep that working asset and validate actual previews after releases where needed; this audit did not refresh platform caches or inspect the destination social accounts. Social cards help sharing and click decisions; their presence alone does not establish organic ranking performance.

## 4. Content that creates discovery opportunities

The site already has substantial original material: Robot Bakery, Pantry MCP, Paper to Digital, AI Support Skills, and Zero Touch Lease. Its technical notes are present in the initial HTML inside native `<details>` elements. They are not fetched only after a click. Collapsed disclosures are therefore not evidence that the text is uncrawlable; forcing every disclosure open is unnecessary.

The structural limitation is that all four project articles share the home page's URL, title, and description. Fragment links help navigation and sharing, but do not provide independent HTML documents with their own search presentation. Separate pages are an editorial opportunity, not a requirement to replace the static architecture.

Start with two substantial static pages. Keep concise summaries on the home page and link to the full write-ups using descriptive text. Suggested topics and paths are proposals:

| Page | Visitor question | Proposed path |
| --- | --- | --- |
| Robot Bakery case study | How can an agentic development workflow enforce TDD and human approval? | `/projects/robot-bakery/` |
| Paper to Digital case study | How do Step Functions, DynamoDB, and WebSockets support an AI/OCR assessment workflow? | `/projects/paper-to-digital/` |
| Pantry MCP technical note, if enough distinct material exists | How can agent memory preserve scope and provenance across engineering tasks? | `/writing/scoped-agent-memory/` |
| AI investigation case study | How can a human-invoked investigation connect CloudWatch evidence with application code? | `/projects/ai-support-investigations/` |

Each published page should answer a real question, show Brian's specific contribution, explain constraints and trade-offs, and distinguish implemented behavior from a proof of concept. Include a diagram or safe example where it materially clarifies the engineering. Add outcomes only when verified; quantitative claims need evidence. Use verified public product/award references where they support the story. Avoid repeating the complete resume on every page.

Give each page a unique descriptive title, H1, summary, self-canonical, and share preview. Link back to the relevant experience and contact options. Use ordinary HTML links in both directions. Existing project fragments should remain usable. Static directories containing `index.html` are sufficient; no framework or CMS migration is needed.

The topic/query ideas above are hypotheses derived from existing material, not keyword research with measured volume. Validate them with Search Console and the intended audience. Prioritize recruiters/hiring leaders researching Brian and engineers interested in the underlying problems. Broad terms such as “software engineer” are poor success criteria by themselves.

Publish at the pace of useful original material. Google emphasizes first-hand, helpful content; bulk generic AI articles or thin pages for every keyword would weaken the editorial purpose. [People-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## 5. Discovery outside the site

The site links out to LinkedIn and GitHub. This review did not verify links back from those profiles, inspect Search Console's links report, or use a backlink database. Do not infer that the site has no backlinks from a few search queries.

After verifying the current profiles, ensure the preferred website URL is easy to find in LinkedIn contact/featured areas and GitHub profile/repository materials where appropriate. Link relevant public repositories to matching case studies. Add the site to the resume and other owned publishing surfaces when that fits their purpose. These are proposed profile edits, not changes made during this review.

For each strong case study, share a short, useful explanation through an appropriate professional channel with a direct link to the full piece. Seek relevant references through genuine technical contributions, conference/community participation, or permitted employer/project biographies. Links from real work are more useful to the audience than unrelated directory listings or purchased links. Link-based discovery and descriptive link text are covered in Google's [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

Use consistent name, professional description, and primary URL across owned profiles to reduce ambiguity with other people named Brian Raines. The sampled public search results included unrelated same-name material; this is a reason to strengthen identity consistency, not proof of a particular Google ranking problem.

Retain Plano, TX as useful geographic context. A personal resume website does not, by itself, justify a Google Business Profile or LocalBusiness markup. Consider local business tactics only if there is an actual eligible business and visitor need.

## 6. Robots, sitemaps, PDFs, and AI search

There is no checked-in robots.txt or sitemap, and the conventional production URLs returned 404. This is a small housekeeping opportunity for today's single-page site, not the reason it cannot be found. A missing robots.txt does not prohibit crawling. A small, well-linked site may not need a sitemap. [Robots introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

When adding pages, publish a simple sitemap listing the canonical home page and genuine case-study/writing URLs. Do not list `#about` or other page fragments as separate pages. Use accurate modification dates only for meaningful updates. A minimal production robots.txt could allow crawling and advertise the sitemap:

```text
User-agent: *
Allow: /
Sitemap: https://raines.io/sitemap.xml
```

Keep CSS, JavaScript, and relevant images crawlable. Robots rules do not secure private data; continue excluding private data from version control and deployment.

The public PDF returns 200 with `application/pdf`; sampled headers contained neither X-Robots-Tag nor a canonical Link header. The download attribute does not establish an indexing policy. The PDF can be a useful result for a branded resume query. Decide whether that is desired before changing it. If an unwanted PDF search result bypasses the site, a deliberate HTTP indexing policy can address it. Only use an HTTP canonical to an HTML equivalent when the documents are meaningfully equivalent; the richer portfolio page and resume are not automatically interchangeable. The audit did not inspect live PDF search coverage or revise PDF metadata/content.

For Google AI search features, prioritize the same crawlable, useful, well-supported content. There is no required special AI schema or AI text file for inclusion. Do not make `llms.txt` a prerequisite for visibility work. This statement concerns Google's documented features, not every third-party AI crawler. [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features).

## 7. Measurement and a practical release sequence

GA4 configuration exists in `index.html`, but account access and event ingestion were not verified. Search Console ownership/configuration cannot be inferred from the absence of a verification meta tag. Check the accounts before assuming instrumentation is missing.

1. Inspect a Search Console domain property for raines.io, or establish one if absent. Review URL Inspection, the selected canonical, indexing, search queries/pages, mobile/desktop performance, and available Core Web Vitals. Capture a baseline before edits. Request recrawling after substantive releases without assuming immediate updates. [Search Console guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start).
2. Check Bing Webmaster Tools as a second discovery channel and submit the sitemap there when it exists.
3. Verify GA4 page views and useful actions: resume PDF clicks, email/phone clicks, relevant outbound profile clicks, and case-study engagement. Inspect existing enhanced measurement before adding duplicate download listeners; PDF clicks may already produce `file_download`. A click is an intent signal, not proof that a file was read or a message was sent. [Enhanced measurement documentation](https://support.google.com/analytics/answer/9216061).
4. Use campaign parameters on links shared externally when useful for attribution. Do not add campaign parameters to internal navigation, and do not send contact details or user-identifying data as event parameters.
5. Review branded versus non-branded impressions/clicks, query relevance, organic landing pages, and useful actions over comparable periods. For a small personal site, qualified visits and conversations matter more than raw traffic. Do not declare a trend from a handful of clicks.

**Suggested first month:** establish the measurement baseline; fix the loader and URL policy; review title/identity metadata; decide the Pages mirror's role; add the modest discovery files; then publish one reviewed case study and share it through relevant owned channels. Publish the second when it adds distinct useful material. Review discovery and visitor behavior after recrawling and enough traffic to interpret it. This is a sequence of work, not a traffic forecast or ranking guarantee.

Keep release changes scoped to raines.io. Apache redirect/cache changes require their own reviewed rollback procedure; the static symlink rollback alone does not restore server configuration. Apply the repository's test-first workflow for behavior changes, validate new links/metadata through the served pages, refresh the publication manifest only after content/artifact review, and verify production after an authorized release.

## 8. Broader project observations and verification

Preserve the static architecture. It suits the site and does not prevent the recommended improvements. Keep the existing document/source-of-truth workflow; consistency across the resume, website, structured data, and shared previews is more useful than adding more SEO tags.

The earlier `web-app-analysis.md` is historical context. Its old social-image dimensions, fake SearchAction/ratings, employer schema, LinkedIn URL, favicon wording, and large active hero-image findings should not be repeated as current defects. Current publication documentation and direct checks show these areas have changed. The preloader and hostname inconsistency remain reproducible.

Current tests cover navigation, project disclosures, downloads, assets, social-card dimensions, identity consistency, and JSON-LD. They do not cover the failed-script/disabled-JavaScript fallback, production redirects, sitemap/robots behavior, Google canonical selection, GA collection, or field search performance. Add meaningful checks as each relevant change is implemented. Semantic heading levels also skip from H2 to H4/H5 in places; improving the outline would help accessible reading, but it is not a demonstrated ranking defect.

Avoid low-value additions: keyword meta tags, hidden repeated keywords, fabricated review stars, generic city landing pages, and markup for services that are not offered. Google does not use the keywords meta tag for indexing or ranking. [Supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags).

Fresh checks during this review:

| Check | Result and limit |
| --- | --- |
| `npm test` under Node 24.21.0 | 6 Node tests passed; 61 browser tests passed; 1 existing mobile test skipped |
| Existing skipped test | Fractional-pixel-ratio Contact menu test is desktop-specific and skips the mobile project |
| Production publication verifier | All 29 manifest artifacts passed at `https://raines.io/` |
| Direct public HTML comparison | Production non-www, www, and GitHub Pages HTML each matched the local index |
| Production desktop/mobile exploration | No page errors, failed unblocked requests, or HTTP error responses observed in normal visits; no horizontal overflow at sampled sizes |
| Failure-mode exploration | Permanent loader reproduced with JavaScript disabled and with main.js deliberately blocked; these failures are not covered by the passing suite |
| `npm audit` | 0 reported dependency vulnerabilities; this does not audit vendored browser libraries |
| PageSpeed API | HTTP 429; no score or field-data result obtained |

The browser exploration blocked analytics collection and allowed font requests. The existing regression suite isolates all external requests. Neither run establishes analytics integration health or a complete final-font/accessibility/cross-browser verdict. The suite was run locally, not as a new GitHub-hosted CI run. No deployment, commit, profile edit, or remote setting change was performed.
