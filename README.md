# BRIAN RAINES

Resume source of truth: [Brian_Raines_Resume.docx on Google Drive](https://docs.google.com/document/d/1UJJjGHyt_VwZ6xB4fJHmDn1T5qSgoNIP/edit). The resume below matches the source revision last modified October 9, 2026 at 9:49 a.m. CDT, also used for the downloadable PDF.

Plano, TX | (214) 707-0983 | brian@raines.io | https://raines.io

---

## PROFESSIONAL SUMMARY

Software Engineer focused on AI-native software development and scalable distributed systems. I draw on 25+ years of hands-on engineering experience to bring clarity to complex problems and guide technical direction. My approach combines thoughtful architecture, pragmatic execution, and mentorship to help teams build reliable software and evolve how they work.

---

## TECHNICAL EXPERTISE

**AI-Native Engineering**
Agentic SDLC orchestration • AI skill development • Model Context Protocol (MCP) server development • Persistent agent memory and scoped retrieval • Test-driven development and AI-assisted review • Codex, Claude, Cursor, GitHub Copilot, Devin, Jules, Amazon Q, Amazon Bedrock

**Architecture & AWS**
Distributed, serverless, and event-driven systems • REST and WebSocket APIs • Lambda, API Gateway, Step Functions, SNS/SQS, S3 • Infrastructure as Code: CDK, SAM, CloudFormation • CloudWatch and synthetic monitoring

**Data Engineering**
DynamoDB single-table design • PostgreSQL, MySQL, MongoDB, Redis, SQLite • Data modeling, migrations, and event-driven ETL

**Software Development**
Java, Python, Node.js, PHP, JavaScript/TypeScript • Third-party API integration • Legacy system modernization

**Technical Leadership**
Architecture and engineering standards • Technical strategy • Engineering mentorship • Cross-team collaboration and knowledge sharing

---

## PROFESSIONAL EXPERIENCE

### Property Vista — Dallas, TX

**Principal Engineer | 2026 — Present**

Property Vista develops VIDA, an AI-powered multifamily leasing platform connecting renter engagement, tour scheduling, and lease signing.

**Organizational Impact:**

- Advanced AI-native engineering adoption by mentoring engineers in integrating AI agents into everyday development.
- Built an operator-invoked Codex skill that traces CloudWatch alarms through Lambda logs, Logs Insights, DynamoDB, and repository code, producing RCA reports with supporting queries and recommended fixes for defects, misconfigurations, and suspected attacks.
- Built an operator-invoked Codex skill that locates Vivian users by email, phone, name, or web-chat ID and reconstructs system-event timelines and complete conversations from read-only DynamoDB and CloudWatch queries.

**Robot Bakery**

Developed Robot Bakery using Codex to orchestrate a standard software development lifecycle; continue to maintain and extend it. The Codex-orchestrated agentic SDLC platform is used by all engineers to process Jira tickets through discovery, design, planning, implementation, testing, review, and closure.

- Paired task-tuned agents with read-only critics; the orchestrator enforces scripted workflow gates and iterates until both agents agree on completion.
- Enforced test-driven implementation with unit, integration, and browser tests.
- Enforced human approval of plans before implementation, with operators retaining ownership of pull-request approval, merging, and deployment.
- Built Pantry MCP, a SQLite-backed persistent memory service with scoped, provenance-aware recall across sessions, tickets, and repositories so agents reuse decisions and lessons.
- Created repository-based knowledge files documenting missteps and preferred patterns for reuse across developers.
- Added feature-specific CloudWatch alarms through CDK stacks to monitor deployed application behavior, including API HTTP status codes.

**Zero Touch Lease**

Contribute to an actively developed proof of concept for end-to-end self-service leasing, connecting Vivian tours, Plaid identity verification, quotes, and lease signing across web chat, SMS, voice, and email.

- Integrated DocuSeal e-signatures and Payroc application-fee collection; added workflow states for contact and household information.

---

### Turnitin — Dallas, TX

**Distinguished Software Engineer | 2022 — 2026**

**Principal Software Engineer | 2021 — 2022**

Built cloud-native, serverless platforms at global scale and established architecture patterns and engineering standards adopted company-wide.

**Organizational Impact:**

- Established AWS SAM serverless patterns as an organizational standard, creating a shared foundation for development.
- Built cross-team expertise through mentorship in distributed systems, DynamoDB modeling, and event-driven design.
- Shaped platform technical direction with engineering leadership through strategy and architecture decisions.

**Award:** 2024 Values Champion Regional Winner: Americas “Action and Ownership, One Team”

**Paper to Digital Platform (2022 — 2025)**

Developed an AI-powered extension to Turnitin Feedback Studio for paper-based assessments, including handwritten and mathematical responses, using serverless architecture, real-time collaboration, and AI/OCR workflows.

- Architected serverless, event-driven backends in AWS achieving 99.9% reliability and horizontal scalability.
- Implemented DynamoDB single-table design and Step Functions for complex AI/OCR workflow orchestration.
- Built real-time collaboration via WebSocket APIs enabling synchronous grading and feedback.
- Developed test automation that included unit tests, integration tests, end-to-end tests, and synthetic canaries.
- Ensured TX-RAMP compliance and certification, maintaining rigorous state-level security standards.

**Award:** Tech & Learning “Best Tools For Back to School 2024” for Turnitin’s Paper to Digital Add-On for Feedback Studio

**Usage Analytics Platform (2021 — 2022)**

Designed an event-driven ETL pipeline using SNS, DynamoDB Streams, and Kinesis Data Firehose to feed customer engagement data into Redshift and QuickSight dashboards, supporting consumption-based billing insights across the product portfolio.

---

### ExamSoft (Acquired by Turnitin 2021) — Dallas, TX

**Software Engineer IV | 2019 — 2021**

- Re-engineered high-volume assessment password management from WordPress to an auto-scaling AWS serverless architecture supporting hundreds of thousands of simultaneous credential requests.
- Led Liftupp’s migration from a PHP monolith to AWS serverless Java microservices, reverse-engineering APIs and guiding database migration to RDS and DocumentDB.
- Mentored PHP engineers transitioning to AWS and Java development.

**Award:** 2020 Engineering Will-to-Win Employee of the Year

---

### Innovar Solutions — McKinney, TX

**Lead Software Developer (Consultant) | 2018 — 2019**

- Architected and delivered a Symfony REST API and Vue.js SPA that unified commercial purchasing and scheduling workflows with real-time data synchronization.
- Integrated and decommissioned legacy systems, reducing operational complexity and long-term technical debt.

---

### Speed Commerce — Dallas, TX

**Application Architect | 2010 — 2018**

- Architected enterprise fulfillment and warehouse systems supporting multi-million-square-foot distribution centers and thousands of concurrent users.
- Designed event-driven order fulfillment and warehouse control systems with real-time integrations to PLCs, sortation equipment, and FedEx, UPS, and USPS.
- Developed SaaS platforms for global eCommerce operations serving Fortune 500 retailers.

---

### Early Career (2000 — 2008)

**Senior PHP Developer — StoneEagle, Credit Solutions**

**Senior Developer / Engineering Lead — New Media Gateway, Crosswerk, Oven Digital**

**Intranet Coordinator — Garden.com**

**Freelance Web Developer - Siegel Gale, Credit Suisse First Boston, BLUEprint**

Built enterprise applications and marketing automation systems and led development teams for Fortune 500 clients including Sprint, Harrah’s, ING, Tiffany, and Consumer Reports.

---

## EDUCATION

**B.S., Business Administration — University of Texas at Dallas**

## ADDITIONAL INFORMATION

Portfolio and technical write-ups available at https://raines.io

---

## Website development

Project setup: [development and testing](docs/development.md) and [agent instructions](AGENTS.md). Planning: [readiness review](docs/readiness-review.md) and [web application analysis](docs/web-app-analysis.md).

Content review: [website and resume gap analysis — October 8, 2026](docs/resume-website-content-gap-analysis.md), including the original local/live comparison and the implementation follow-up.

The website presents existing testing, monitoring, and root-cause analysis experience in a dedicated Quality & Reliability card; the resume retains its five expertise groups.

The website includes project write-ups for Robot Bakery and Pantry MCP, Zero Touch Lease, Paper to Digital at Turnitin, and AI Support Skills. [Publication verification and Linode release procedure](docs/publication.md) records how to keep the page, PDF, and vCard aligned with the reviewed resume revision.

## License
All rights reserved.

The content, code, and images in this repository are the property of Brian Raines.
No part of this repository may be reproduced, distributed, or used in any form
without explicit written permission.
