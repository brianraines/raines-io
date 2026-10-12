# Technical SEO patch

Prepared on October 12, 2026 on `codex/seo-technical-fixes`, following [the SEO audit](seo-audit.md). This is staged repository work, not a production release.

## Scope

The patch preserves visible page copy, titles, descriptions, career facts, testimonial text, the PDF, and vCard. A whitespace-normalized comparison of the old/new HTML body text and a separate comparison of title/description metadata confirmed no prose changes. The decorative mascot's misleading alt description is removed, and it is no longer identified as a portrait in Person structured data.

Implemented:

- Removed the full-screen loader and its startup delay. A CSS hero image is available without JavaScript; mobile navigation stays expanded in document flow until Bootstrap successfully enhances it.
- Kept the initial hero deterministic and preloaded only the selected WebP size. Added 960-pixel derivatives for small screens at standard pixel density; larger/high-density views keep the original images. Rotation stops offscreen, in a hidden tab, or with reduced motion. Recommendation autoplay also respects reduced motion, including preference changes during a visit.
- Kept one stable About mascot, eliminating its second image request. Added image dimensions and preserved responsive aspect ratios.
- Corrected heading levels while retaining their styling and text.
- Added `robots.txt` and a one-URL sitemap; aligned canonical, social, and structured-data root URLs.
- Linked Person, WebSite, and ProfilePage records through stable IDs, retaining the existing facts and omitting the mascot portrait claim.
- Loaded upstream minified jQuery 3.7.1 and stopped loading unused popup/filter libraries and the dormant form handler. The original vendor files remain available; license notices are preserved. Loaded local JavaScript falls from 595,791 to 317,277 uncompressed bytes, approximately 47% less.
- Added `display=swap` to the existing Roboto request.
- Prepared Apache URL consolidation and bounded cache policies, with real HTTP/HTTPS regression checks. HTML/discovery documents revalidate; mutable styles/scripts/images/fonts cache for one hour and then revalidate. Immutable caching is deliberately absent because these filenames can change in place.

The Drive Word source was re-read and its modification time remains `2026-10-09T14:49:17.898Z`, matching the prior manifest. The PDF/vCard bytes are unchanged. `publication.json` records the reviewed technical artifacts and the same source revision; it is not a claim that this branch has been published.

## Hosting changes awaiting an authorized release

Read-only inspection confirmed that `/etc/apache2/sites-enabled/rainesio.conf` has a raines.io HTTP virtual host using `Redirect permanent / https://www.raines.io/`, and an HTTPS virtual host with document root `/opt/app/brian/current` and `AllowOverride All`.

Two coordinated changes are required for one-hop canonical redirects:

1. Include the branch's `.htaccess` in the staged static release. It canonicalizes HTTPS www and explicit `/index.html` requests, preserving query strings and encoded paths. Internal DirectoryIndex resolution does not redirect. It also sets document/asset cache headers.
2. Install [the HTTP rule include](../deploy/apache/raines-io-http.conf) outside the symlinked releases, for example at `/etc/apache2/raines-io-http.conf`. In **only** the port-80 VirtualHost whose ServerName is raines.io, replace the old `Redirect` directive with `Include /etc/apache2/raines-io-http.conf`. Preserve the other virtual hosts, TLS configuration, logging, and shared services.

The `.htaccess` rule alone cannot change the existing HTTP virtual-host redirect. The include must replace that directive rather than be added alongside it. This repository does not install either change remotely.

Before activation, save the current virtual-host configuration, previous include if any, and active release target. Verify `mod_rewrite` and `mod_headers` are enabled. Compare the staged include and `.htaccess` with reviewed local bytes. Run Apache's configuration check and follow the site's existing operator process for applying virtual-host changes; a service configuration change is separate from the static symlink switch. Validate the staged release and keep the previous release available as described in [publication.md](publication.md).

After activation, verify these GET outcomes without automatically following redirects:

| Request | Expected result |
| --- | --- |
| HTTP raines.io or www, `/` | 301 directly to `https://raines.io/` |
| HTTPS www, `/` | 301 directly to `https://raines.io/` |
| HTTP/HTTPS, explicit `/index.html?ref=profile` | 301 directly to `https://raines.io/?ref=profile` |
| Noncanonical host, asset/download path with a query | 301 to the same encoded path/query on the preferred origin |
| HTTPS raines.io `/`, query URLs, and downloads | 200 without a redirect loop |
| A nonexistent canonical path | 404 |
| Canonical HTML | `Cache-Control: no-cache` |
| Existing CSS/JS/image URLs | `Cache-Control: public, max-age=3600, must-revalidate` |

Run `npm run verify:publication -- --url https://raines.io/` and production desktop/mobile smoke checks after release. `.htaccess` is an Apache access file and is intentionally not a publicly downloadable manifest artifact; verify its effects through redirects/headers and its staged bytes separately. The HTTP include is also outside the public-artifact manifest. Cached 301s and assets may outlive a rollback in a visitor's browser.

For rollback, restore the previous virtual-host/include configuration and validate it before applying it through the operator process. Restore the previous static release symlink as well. Switching only the symlink does not roll back HTTP virtual-host rules. No remote changes were made during preparation.

## Verification

`tests/seo.spec.js` exercises disabled JavaScript, failed main.js/Bootstrap, working downloads and fallback navigation, initial/responsive image requests and all nine smaller hero images, reduced-motion preferences, offscreen hero rotation, served crawl files, linked profile metadata, image sizing, heading order, and a local JavaScript byte budget. Tests first reproduced the previous behavior before implementation. Existing tests remain the primary functional regression boundary.

`npm run test:apache` starts an isolated loopback Apache with temporary HTTP/HTTPS ports and a temporary self-signed certificate. It checks actual redirect destinations, encoded-path/query preservation, canonical downloads, missing-page status, and response cache headers. It does not contact production or alter system Apache configuration. Test certificate verification is disabled only for that temporary loopback fixture. Apache and OpenSSL must be installed; on Linux, install Apache's modules with the `apache2` package. `APACHE_HTTPD` and `APACHE_MODULE_DIR` can override binary/module locations.

Fresh local verification on Node.js 24 passed six Node checks and 85 browser checks. The existing desktop-only fractional-pixel Contact test remains skipped on mobile. All ten Apache checks, all 41 local publication hashes, `actionlint`, and `git diff --check` passed. A full run exposed a scroll-timing race in the existing skill-card layout test; measuring both rectangles in one browser frame fixed the test without changing its alignment assertions. The complete suite was rerun after that correction. Screenshots with live Google Fonts were reviewed at 1440, 412, and 320 pixels and for mobile without JavaScript; sampled pages had no horizontal overflow, and Montserrat/Roboto loaded successfully.

CI installs Apache and runs this separate hosting check after `npm test`. Local checks do not establish a new GitHub-hosted CI result, real-user performance, search-engine canonical selection, or complete accessibility/cross-browser compliance.

## Work left outside this patch

Case-study pages, new articles, title changes, and other prose changes remain outside the requested scope. Search Console/Bing ownership and reporting, GA4 account-side event verification, profile/backlink edits, and retiring the GitHub Pages mirror are account/publication decisions rather than branch patches. The mirror retains its production canonical. The PDF retains its existing indexing behavior.

The original WebP hero assets remain unchanged. The smaller derivatives use the same photographs and crop, generated with libwebp 1.6.0 (`dwebp INPUT.webp -o TEMP.png`, then `cwebp -q 82 -m 6 -resize 960 0 TEMP.png -o OUTPUT-960.webp`). No mobile field-performance claim is made. The complete SEO audit remains a dated record of the pre-patch state.
