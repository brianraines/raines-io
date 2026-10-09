# Resume and website content gap analysis

Reviewed October 8, 2026. This is a content assessment of the authoritative resume, the updated local website, and the currently published website. Recommendations below are proposed work, not implemented changes.

**Implementation follow-up, October 8:** The original comparison below is preserved as a review snapshot. The approved hero specialization, Projects section and three write-ups, structured AI skills, current-employer corrections, updated resume PDF and vCard have since been implemented and published to raines.io. A reviewed-artifact manifest and local/public verifier were added. Public checksums passed on raines.io and www.raines.io. See [publication.md](publication.md) for verification and rollback details. LinkedIn, GitHub profiles and the separate GitHub Pages copy remain outside this release.

**Presentation refinement, October 8:** Brian requested a quieter Projects section that matches the existing page. The hero specialization/project callout and project links in Experience were removed. Projects now uses the page's white background, experience-style headings and compact native “Technical notes” disclosures. Paper to Digital was added from the existing Turnitin resume content, bringing the section to four write-ups. AI positioning remains in About, Skills, Experience and profile metadata.

The local website contains the updated resume's core content. The largest gap is publication: the live page still presents older positioning, and its downloadable PDF omits Property Vista entirely. Publishing the reviewed local files is the first priority. Project write-ups and stronger first-screen AI positioning would then make the website a more useful companion to the resume.

## Sources and scope

- Authority: [Brian_Raines_Resume.docx in Google Drive](https://docs.google.com/document/d/1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP/edit), file ID `1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP`. This is a stored Word document. Its verified modification time was `2026-10-08T21:05:29.346Z`.
- Local publishing surfaces: [README](../README.md), [website](../index.html), [PDF](../resume/Brian_Raines_Resume.pdf), and [vCard](../vcard/Brian_Raines.vcf), on branch `codex/resume-ai-content-review`.
- Published surfaces: [raines.io](https://raines.io/), its [downloadable PDF](https://raines.io/resume/Brian_Raines_Resume.pdf), and [vCard](https://raines.io/vcard/Brian_Raines.vcf), fetched directly during this review.
- Hosting context: Brian confirmed that raines.io runs on the Linode VM shared with Stableishwater. A local branch or GitHub Pages publication does not establish that the Linode copy has been updated.

LinkedIn and GitHub profile content were not reviewed here. Their links exist on the site, but that does not establish that their professional positioning matches the updated resume. No company impact figures or additional skills have been inferred.

## Content coverage

| Area | Updated resume and local website | Published website | Assessment |
| --- | --- | --- | --- |
| Professional identity | Software Engineer; AI-native development and distributed systems in the summary | Older Distinguished Software Engineer headline and cloud-focused positioning | Local alignment complete; publish the approved identity |
| Property Vista | Principal Engineer, 2026–present; VIDA context, mentoring, support skills, two projects | Generic company description and older role wording | Major public gap |
| Robot Bakery | Jira-driven agentic SDLC; task agents and critics; scripted gates; TDD; human approvals | Project absent | Major public gap |
| Pantry MCP and shared knowledge | SQLite-backed persistent memory, scoped recall and provenance; repository knowledge files | Absent | Major public gap |
| Zero Touch Lease | Active proof of concept; personal DocuSeal, Payroc, contact and household contributions | Project absent | Major public gap |
| Tier 3 RCA and user audit skills | Operator-invoked investigation, read-only data access, evidence and reports | Absent | Major public gap |
| Technical expertise | Five groups, including AI-native engineering, MCP, memory, AI-assisted development tools, CDK and SQLite | Older expertise content without the new AI-native group | Publish the current groups |
| Turnitin and earlier experience | Condensed descriptions, projects, formal titles and awards retained | Older descriptions | Local parity established; no new career claims needed |
| Education and contact | Present locally; general identity also updated in the vCard | Public vCard retains the older headline | Publish the contact card with the page and PDF |
| Metadata | Local title, descriptions and Person employer updated; detailed skill arrays lag | Person employer still Turnitin; older headline | Publish existing corrections, then finish local skill metadata |
| Project evidence | Resume-level descriptions in the experience timeline | No new AI project material | Opportunity for supporting case studies |

The general headline should remain **Software Engineer**, as approved. Distinguished Software Engineer and Principal Engineer remain valid formal titles in the employment history.

## Priority 1: publish the aligned content together

### Replace the stale public PDF

The live PDF has no Property Vista section. A visitor can therefore read the current role on the public page and download a resume that excludes it. This also removes the strongest evidence of current AI-native engineering from the application artifact.

Both resume buttons in the local page use `resume/Brian_Raines_Resume.pdf`. Replace that public file with the reviewed local export as part of the same release as the page and vCard.

| Artifact | Pages | Bytes | SHA-256 |
| --- | --- | --- | --- |
| Reviewed local PDF | 3, US Letter | 102473 | `6c326c613090944a8df55acbaa9b3d2dad7380ff47788294c09427c10557c4a4` |
| Live PDF at review time | 3 | 125464 | `46fa180970bc8bd59e914946a8eddb84f60905a2ae85df05c77170e059b91f56` |

Equal page counts do not establish content parity. Verify the deployed download by its content and checksum.

### Publish the local page and vCard

The local page already includes the approved summary, Property Vista work, AI-native expertise and revised career content. Its Person structured data also identifies Property Vista as the current employer. The local vCard uses Software Engineer.

These corrections should ship together so the visible page, search/social descriptions, structured profile, downloadable resume and contact card agree. Publishing only the README will not update the public page or downloads.

Deployment remains separate work. Verify the Linode target, document root, release procedure and rollback before deploying; limit changes to raines.io on the shared VM. Check GitHub Pages separately if that alternate public copy is still intended to remain available.

## Priority 2: close the remaining local content gaps

### Complete the structured skills

The local Person JSON-LD `hasOccupation.skills` and `knowsAbout` arrays still describe the older cloud and distributed-systems focus. They do not represent the AI-native skills now visible on the page.

Add confirmed subjects such as agentic SDLC orchestration, MCP server development, persistent agent memory and scoped retrieval, AI skill development, and test-driven development with AI-assisted review. Retain the established architecture skills. This improves consistency between representations of the profile; it is not a guarantee of search ranking or recruiting outcomes.

The ProfessionalService schema also has an older service list. Review whether the site should present engineering services as well as a professional profile, then align that list if services are intended. The standalone Turnitin Organization object is not itself evidence of an incorrect current employer; the live Person `worksFor` field is the actual employer mismatch.

### Make AI positioning visible on the first screen

The approved hero headline is Software Engineer. The local About section explains the AI-native focus, but the hero has no supporting specialization line.

A short line such as **AI-native engineering and distributed systems** would make the current focus apparent immediately while retaining Brian's chosen general title. This is a presentation improvement, not a missing resume fact or a prerequisite for applying.

### Support the resume's technical-write-up promise

The resume says that portfolio and technical write-ups are available at raines.io. The inspected page has no linked project case studies or technical articles in its navigation or project blocks. The experience descriptions provide useful context, but little supporting depth beyond the resume.

Add concise website-specific material, beginning with Robot Bakery. If write-ups are not intended, revise that promise in the authoritative resume instead. Do not invent public repositories, demos, customer results or benchmarks to fill this gap.

| Proposed write-up | Confirmed material to develop | Boundary to preserve |
| --- | --- | --- |
| Robot Bakery, including Pantry MCP | Jira workflow; task-tuned agents and read-only critics; scripted state gates; revisions; tests; human approvals; persistent memory versus repository knowledge | Humans approve plans and PRs and own merging and deployment; do not describe autonomous production operations |
| Zero Touch Lease | Working end-to-end proof of concept; DocuSeal, Payroc, contact and household states; broad leasing journey | Actively developed thin-thread POC, not a hardened production product; distinguish Brian's integrations from the overall team's workflow |
| RCA and audit skills | Human invocation; logs, Logs Insights, DynamoDB and repository tracing; evidence-backed reports; user-event and conversation reconstruction | Read-only investigation, likely causes and recommendations; no invented detection accuracy, response times or automated remediation |

A workflow diagram and concrete engineering tradeoffs would add more evidence than repeating the resume bullets. Publish only material Brian is authorized to share, using examples that do not expose customer data or internal credentials.

## Priority 3: prevent content drift

The resume authority is clear, but the publishing surfaces are manually maintained. There is no checked-in source-to-PDF generation or Drive-to-site synchronization workflow. The stale public PDF demonstrates why publication needs an explicit parity check.

For the next release, record the authoritative file revision and exported PDF checksum, check the affected copy locally, publish all affected surfaces together, and verify the public outputs. A future reproducible export or shared content-data workflow could reduce duplicated editing while retaining Drive as the authority.

The next social-footprint review should compare LinkedIn's headline, About, current experience and skills, plus the GitHub profile README and project presentation, against the same approved facts. That review has not been performed and no social changes have been published.

## Verification and limits

- Fresh local Playwright run: **12 tests passed**, covering desktop Chromium and mobile Chromium emulation, navigation, startup, local assets, downloads, and basic profile/social metadata contracts.
- Content verification: all authoritative resume paragraphs extract from the current three-page Letter PDF; the five skills groups and experience descriptions, bullets and awards agree between the current content source, README and local page. Existing HTML CRLF line endings were preserved.
- The authoritative DOCX readback SHA-256 was `15e3411ef54b0b15662bc62832a7b599bf62810fdf5fdee53979c92ae8507b5e`.
- The browser suite does not establish resume-source parity by itself, production deployment, full accessibility compliance, Firefox/Safari support, or the accuracy of external social profiles. Content parity was checked separately.

## Recommended sequence and acceptance

1. Finish the structured skills and decide on the optional hero supporting line. Verify the affected metadata and rendered page.
2. Release the reviewed page, PDF and vCard to raines.io using the established Linode deployment process. Confirm the public PDF checksum, Property Vista/projects, current employer and Software Engineer headline.
3. Add the Robot Bakery/Pantry write-up, then the Zero Touch Lease and support-skill evidence. Ensure the technical-write-up statement has an actual destination.
4. Review and align LinkedIn and GitHub using the approved resume facts.
5. Introduce a repeatable publication parity check so subsequent resume revisions cannot silently leave public downloads behind.

The updated resume does not need new metrics or additional projects to establish the confirmed AI-native experience. The website's immediate need is publication parity; its next opportunity is deeper, credible evidence of how Brian builds and governs these systems.


## Projects layout and README follow-up

The project write-ups now follow Resume, with matching menu and structured navigation order. Aligned topic labels, a bounded reading column, consistent paragraph/topic spacing, and subtle project separators replace the previous loose arrangement. Robot Bakery's workflow uses a single numbered sequence so gate explanations are no longer squeezed into wrapping columns. Topic headings stack above their copy on phones. All four write-ups retain their reviewed facts.

The local README contains all 72 nonempty paragraphs of the current authoritative resume, with Markdown formatting adapted for reading. Drive metadata and readable content were rechecked against the October 8, 2026 revision at 21:05:29 UTC. The README now records that reviewed source revision and puts website-development notes after the resume. The older committed README is still different because the working branch has not been committed or pushed.
