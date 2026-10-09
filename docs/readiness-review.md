# Resume website readiness review

Reviewed October 8, 2026. This review covers the local checkout and the repository's GitHub configuration, with read-only inspection of production HTTP responses.

## Starting state

- Static HTML/CSS/JavaScript with locally vendored Bootstrap, jQuery, Swiper, and other plugins.
- No package manifest, lockfile, test suite, or checked-in CI workflow before this review.
- Local checkout is on `feature/add-image`, not `main`. Existing untracked `.vscode/settings.json` was preserved.
- `README.md` contains resume content rather than development instructions.
- The downloadable resume is a PDF with no editable source or reproducible generation command checked into this project.
- Brian subsequently designated [Brian_Raines_Resume.docx on Google Drive](https://docs.google.com/document/d/1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP/edit) as the resume source of truth. The connected account owns that stored Word file; parity with the repository's derived content and PDF has not yet been verified.
- GitHub has one active workflow, the automatically generated Pages build/deployment. Its latest listed run succeeded on February 27, 2026 ([run details](https://github.com/brianraines/raines-io/actions/runs/22500250203)).
- Production runs on the shared Linode VM. The repository contains no workflow or script explaining how files reach that VM.
- The default-branch ruleset requires PRs and signed commits but does not require CI success.

## Preparation added

- A private npm manifest, exact Playwright dependency, lockfile, Node version selection, and ignores for generated artifacts.
- Desktop and mobile browser tests with an automatically managed local server and diagnostic failure artifacts.
- A GitHub CI workflow for pushes and PRs, with no production deployment actions.
- [Development instructions](development.md) covering setup, test-first changes, hosting, and the remaining merge/deployment configuration.
- [Detailed web application analysis](web-app-analysis.md) and a root `AGENTS.md` describing repo-specific TDD work.

## Content issues to address during the resume update

- The website experience section and README already include Property Vista, but the hero/title/social metadata still say Distinguished Software Engineer, and the Person structured data still lists Turnitin as the current employer. Decide the intended professional headline and reconcile it across all surfaces.
- The README repeats Turnitin's introductory paragraph and Organizational Impact block.
- Technical Expertise emphasizes cloud/serverless engineering. AI appears in prior Turnitin project descriptions; the past year's native-AI working practices and evidence are not yet explicitly presented.
- Resume content exists in the README, website, and PDF as derived copies of the authoritative Drive document. Establish a publishing process to keep them synchronized before making coordinated revisions.
- LinkedIn and GitHub are linked from the page; Twitter/X metadata names `@brianraines`. Confirm which profiles belong in the public positioning plan and whether their links and claims are current.

## Suggested next sequence

1. Inventory the AI skills acquired over the past year with concrete examples: what was built, which tools/workflows were used, Brian's role, the outcome, and what can be shared publicly. Distinguish using AI while engineering from engineering AI-powered products.
2. Choose the target roles/audience and a professional headline, then derive evidence-backed accomplishment bullets from that inventory.
3. Read and revise the authoritative Drive resume; update the derived README, website copy, metadata, and downloadable PDF together. Add tests for new website behaviors before implementation.
4. Adapt the same narrative for LinkedIn and GitHub, including selected project demonstrations or case studies. Draft profile changes and posts before publication.
5. Document the existing Linode deployment and rollback process, then decide whether to automate it after passing CI. Make the browser check required for merges and decide whether the separate Pages copy should remain published.

No resume or public profile content was rewritten as part of the readiness setup. No remote repository settings or production files were changed.
