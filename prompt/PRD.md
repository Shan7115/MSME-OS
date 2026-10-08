# MSMEOS2 — Product Requirements Document

**Document:** PRD.md  
**Product:** MSMEOS2  
**Version:** 1.0  
**Status:** MVP Development  
**Development Mode:** Local-first prototype  
**Primary IDE:** VS Code / Antigravity IDE  
**Target Review:** Tomorrow  
**Development Constraint:** Approximately 4 hours for initial MVP  
**Last Updated:** 2026-10-08

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Name

MSMEOS2

## 1.2 Product Concept

MSMEOS2 is an intelligent document-analysis and business decision-support platform for Micro, Small and Medium Enterprises (MSMEs).

The system allows an MSME user to upload an existing business document and receive:

- structured understanding of the document
- business facts extracted from the document
- evidence-backed findings
- strengths
- risks and gaps
- opportunities
- prioritized recommendations
- actionable next steps
- 30/60/90-day action planning
- executive-level reporting

The core product is NOT a calculator.

The core product is:

> Business document → Understanding → Evidence → Insight → Decision → Action

---

# 2. IMPORTANT PROJECT STATUS

The project is being rebuilt completely from scratch.

Any previous project implementation is considered unavailable.

If previous planning material says that Phase 1 or another phase is already complete, that statement must be ignored.

All functionality must be considered incomplete unless it actually exists and has been tested in the current repository.

---

# 3. PROBLEM STATEMENT

MSMEs generate and possess large amounts of business information through documents such as:

- business plans
- project reports
- financial statements
- sales reports
- operational reports
- market reports
- quotations
- inventory records
- project proposals
- business projections

However, having information does not automatically produce useful business decisions.

Many MSME owners may not have the time, analytical expertise or financial/business knowledge required to manually interpret these documents.

Important signals may therefore remain hidden.

Examples include:

- working-capital pressure
- customer concentration
- excessive costs
- weak documentation
- operational gaps
- market risks
- missing information
- growth opportunities
- inconsistent projections
- dependency on particular suppliers/customers

---

# 4. PROPOSED SOLUTION

MSMEOS2 analyzes business documents and transforms them into actionable business intelligence.

The user should not need to manually enter every number into a calculator.

Instead:

1. Upload document.
2. System extracts information.
3. System identifies relevant business facts.
4. System analyzes those facts.
5. System identifies risks, strengths and opportunities.
6. System provides evidence for findings.
7. System explains why findings matter.
8. System recommends actions.
9. System prioritizes actions.
10. System generates an executive report.

---

# 5. TARGET USERS

## Primary Users

- Indian MSME owners
- micro-business owners
- small-business operators
- entrepreneurs
- business founders

## Secondary Users

- accountants
- business advisors
- consultants
- incubators
- entrepreneurship programs
- MSME support organizations
- business-development professionals

---

# 6. TARGET MARKET CONTEXT

The initial product context is the Indian MSME ecosystem.

The product should support Indian business terminology, currency and business context where appropriate.

Currency:

INR / ₹

However, the underlying architecture should not make the system impossible to adapt to other markets later.

---

# 7. CORE VALUE PROPOSITION

## Primary Value Proposition

> Upload the business documents you already have and receive evidence-backed insights, risks, opportunities and prioritized actions.

## Supporting Value

MSMEOS2 should help users:

- reduce manual document analysis
- identify important business signals
- understand business risks
- identify information gaps
- identify opportunities
- prioritize actions
- make business information easier to understand

---

# 8. PRODUCT DIFFERENTIATION

The product should NOT be positioned simply as:

- an AI chatbot
- an AI document summarizer
- a financial calculator
- a generic dashboard

The important differentiator is:

> Evidence-backed business intelligence from existing MSME documents.

The system should connect:

### Evidence

What the document actually says.

### Interpretation

What that information may indicate.

### Recommendation

What the business could consider doing.

This separation is fundamental.

---

# 9. CORE PRODUCT WORKFLOW

```text
                    USER
                     |
                     v
             Upload Document
                     |
                     v
             Document Extraction
                     |
                     v
           Business Information
               Normalization
                     |
                     v
             Analysis Engine
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Strengths   Risks    Opportunities
          |          |          |
          +----------+----------+
                     |
                     v
             Evidence Mapping
                     |
                     v
           Prioritized Actions
                     |
                     v
              30/60/90 Plan
                     |
                     v
             Executive Report
```

---

# 10. MVP OBJECTIVES

The MVP must demonstrate an end-to-end working workflow.

The reviewer must be able to see:

1. dashboard
2. document upload
3. document processing
4. document extraction
5. intelligent analysis
6. evidence-backed findings
7. recommendations
8. prioritization
9. action plan
10. executive report
11. validation mechanism
12. business model
13. commercialization plan
14. roadmap

---

# 11. REVIEW REQUIREMENTS

## Requirement 1

Approximately 80% of the product/prototype/MVP developed with functional testing completed.

The MVP must therefore have a functioning core workflow rather than only mockups.

## Requirement 2

User/customer validation completed with feedback/evidence documented.

The application must provide mechanisms for recording real validation feedback.

The project must NEVER fabricate customer validation.

## Requirement 3

Business model, roadmap and commercialization plan finalized.

These must be documented and represented within the application where appropriate.

---

# 12. CORE DEMO STORY

The primary demonstration should take approximately 3–5 minutes.

The story:

### Step 1

Open MSMEOS2.

### Step 2

Show dashboard.

### Step 3

Choose:

> Analyze a Document

### Step 4

Use the bundled demo document.

### Step 5

Show processing:

- Reading document
- Extracting information
- Evaluating business signals
- Preparing recommendations

### Step 6

Show overall assessment.

### Step 7

Show key findings.

### Step 8

Open a high-priority finding.

Show:

- evidence
- source/page
- why it matters
- recommendation
- expected outcome

### Step 9

Show prioritized action plan.

### Step 10

Show 30/60/90-day plan.

### Step 11

Show executive report.

### Step 12

Show validation page.

### Step 13

Show business model.

### Step 14

Show roadmap.

---

# 13. FUNCTIONAL REQUIREMENTS

# 13.1 Dashboard

The dashboard must provide:

- overall business/readiness score
- documents analyzed
- critical findings
- high-priority actions
- latest analysis
- current analysis status

When no analysis exists:

Do not show fabricated metrics.

Instead show a useful empty state.

After a demo analysis:

Show actual metrics generated from the analysis.

---

# 13.2 Document Upload

The system must support:

- drag and drop
- file picker

Target supported formats:

- PDF
- DOCX
- XLSX
- TXT
- CSV

The upload interface must show:

- filename
- file type
- file size
- upload status
- processing status

---

# 13.3 Demo Document

A bundled demo document must exist.

Preferred location:

```text
/sample-data/demo-document.pdf
```

The demo document should be substantial enough to produce meaningful analysis.

Target:

Approximately 5–15 pages or equivalent information density.

It should contain realistic business information.

---

# 14. DEMO DOCUMENT SOURCING

The developer/AI agent should attempt to obtain a suitable publicly available MSME project/business document.

Preferred context:

India.

Preferred sources:

- government organizations
- government-supported MSME programs
- state government resources
- educational institutions
- reputable public business resources

Potential document types:

- MSME project report
- MSME business plan
- project profile
- business plan example
- small manufacturing project report

The document should ideally contain:

- business profile
- products/services
- target customers
- market
- competition
- operations
- production
- equipment
- employees
- project cost
- working capital
- sales
- expenses
- profitability
- projections
- risks
- growth plans

Do not use documents containing:

- Aadhaar numbers
- PAN numbers
- bank account numbers
- passwords
- confidential information
- private personal data

If a suitable public document cannot be found quickly, create a synthetic demo document.

---

# 15. SYNTHETIC DEMO FALLBACK

If a suitable public document cannot be obtained quickly:

Create a fictional Indian MSME.

Recommended example:

A small packaged-food/spice manufacturing business in Tamil Nadu.

The document should contain fictional but realistic information about:

- business
- products
- target market
- customers
- competitors
- suppliers
- employees
- production
- equipment
- monthly sales
- annual revenue
- costs
- margins
- receivables
- inventory
- working capital
- customer concentration
- marketing
- operational challenges
- compliance/documentation
- expansion plans
- projections

Clearly label:

> SYNTHETIC DEMO DATA — CREATED FOR PROTOTYPE TESTING

Never imply that the fictional company exists.

---

# 16. SOURCE TRANSPARENCY

If an external document is used:

Create:

```text
sample-data/source-document.pdf
sample-data/README.md
```

The README must contain:

- document title
- organization/source
- source URL
- access date
- reason for selection
- whether it is public/illustrative

The live application should use a local copy.

The demo must not depend on internet access.

---

# 17. DOCUMENT EXTRACTION

The application must extract text from uploaded documents.

## PDF

Use PyMuPDF / fitz.

Extract:

- page text
- page number
- useful table information where practical

## DOCX

Use python-docx.

Extract:

- paragraphs
- tables

## XLSX

Use openpyxl.

Extract:

- sheet names
- meaningful cells
- tables/data

## TXT

Read directly.

## CSV

Parse structured data.

---

# 18. EVIDENCE MODEL

Evidence is a core product requirement.

Every significant finding should contain:

- evidence
- source reference
- page number where available
- confidence

Example:

```text
Finding:
Customer concentration risk

Evidence:
A significant percentage of projected sales is associated with one customer.

Source:
Page 12

Confidence:
High
```

The application must distinguish:

```text
FACT / EVIDENCE
        ↓
INTERPRETATION
        ↓
RECOMMENDATION
```

The system must never fabricate evidence.

If evidence is insufficient:

> Insufficient evidence in the uploaded document.

---

# 19. ANALYSIS ENGINE

The architecture must separate:

### Document extraction

from

### Analysis

from

### Presentation

Conceptually:

```text
Document
    ↓
Extraction
    ↓
Normalized Business Facts
    ↓
Analysis Provider
    ↓
Structured Analysis
    ↓
Findings
    ↓
Recommendations
```

---

# 20. ANALYSIS PROVIDER

Implement an abstraction such as:

```text
AnalysisProvider
```

It should support:

- LLM analysis
- deterministic fallback analysis

The UI should not depend directly on a particular LLM vendor.

---

# 21. LLM REQUIREMENTS

If an LLM API is available:

Use an environment variable such as:

```text
LLM_API_KEY
```

Never hard-code secrets.

The LLM must be instructed to:

- analyze only provided evidence
- distinguish fact from interpretation
- avoid hallucination
- avoid fabricated numbers
- avoid fabricated page references
- provide structured output
- explain uncertainty
- provide practical recommendations

---

# 22. FALLBACK ANALYSIS

The product must function without an LLM API key.

The fallback analysis should use deterministic rules and extracted information.

Potential signals:

- revenue
- revenue growth
- costs
- expense ratio
- gross margin
- receivables
- inventory
- working capital
- customer concentration
- supplier concentration
- projected growth
- missing documentation
- missing market information
- project funding gap
- operational capacity

The system should generate structured findings from available evidence.

It must not invent information that does not exist.

---

# 23. ANALYSIS OUTPUT SCHEMA

The analysis should conceptually contain:

```json
{
  "document_type": "",
  "business_name": "",
  "business_sector": "",
  "summary": "",
  "overall_score": 0,
  "score_explanation": "",
  "strengths": [],
  "findings": [],
  "opportunities": [],
  "recommendations": [],
  "next_steps": []
}
```

Each finding:

```json
{
  "id": "",
  "title": "",
  "category": "",
  "severity": "",
  "confidence": "",
  "evidence": "",
  "source_reference": "",
  "why_it_matters": "",
  "recommendation": "",
  "expected_outcome": "",
  "effort": "",
  "time_horizon": ""
}
```

---

# 24. FINDING CATEGORIES

Potential categories:

- Financial
- Operations
- Market
- Sales
- Customer
- Working Capital
- Risk
- Compliance
- Documentation
- Growth
- Technology

Categories should be adapted to the actual business and project brief.

---

# 25. FINDING SEVERITY

Allowed values:

- Critical
- High
- Medium
- Low

---

# 26. FINDING CONFIDENCE

Allowed values:

- High
- Medium
- Low

---

# 27. RECOMMENDATIONS

Recommendations must be:

- practical
- understandable
- actionable
- prioritized

Each recommendation should contain:

- action
- reason
- expected outcome
- effort
- time horizon

---

# 28. OVERALL SCORE

Provide an indicative business/readiness score.

Potential dimensions:

- financial visibility
- operational readiness
- market readiness
- documentation completeness
- risk exposure
- growth readiness

The scoring system must be transparent.

The score must not be random.

Display score breakdown.

Include a disclaimer:

> This is an indicative prototype assessment based on the uploaded document. It is not a professional audit, credit decision, legal opinion, tax opinion or investment recommendation.

---

# 29. RESULTS PAGE

The results page is the most important page.

It should contain:

1. Executive Summary
2. Overall Assessment
3. Score Breakdown
4. Strengths
5. Critical Findings
6. Risks / Gaps
7. Opportunities
8. Priority Actions
9. 30/60/90-Day Plan
10. Evidence
11. Limitations

---

# 30. FINDING DETAIL

Clicking a finding must reveal:

- title
- severity
- category
- confidence
- evidence
- source
- why it matters
- recommendation
- expected outcome
- effort
- time horizon
- status

Status:

- Open
- In Progress
- Resolved

---

# 31. FINDINGS EXPLORER

Provide:

- search
- severity filtering
- category filtering
- status filtering
- priority sorting

Display counts by severity.

---

# 32. ACTION PLAN

The system must generate a prioritized action list.

Each action must include:

- priority
- action
- reason
- expected outcome
- effort
- time horizon

The action plan should be generated from actual findings.

---

# 33. 30/60/90 DAY PLAN

Create:

## 0–30 Days

Immediate actions.

## 31–60 Days

Near-term improvements.

## 61–90 Days

Strategic improvements.

Actions should derive from findings rather than generic filler.

---

# 34. EXECUTIVE REPORT

Create a polished report view.

Report structure:

1. Executive Summary
2. Business Snapshot
3. Overall Assessment
4. Score Breakdown
5. Strengths
6. Risks
7. Opportunities
8. Priority Actions
9. 30/60/90-Day Plan
10. Evidence
11. Limitations

Provide browser print / export functionality.

A complex PDF engine is not required for MVP.

---

# 35. VALIDATION

The application must provide a validation page.

It should allow actual users to provide feedback.

Participant types:

- MSME owner
- Accountant
- Business advisor
- Student/research participant
- Other

Questions:

1. What do you think this product does?
2. How useful was the analysis? 1–5
3. How understandable were the findings? 1–5
4. How trustworthy did the findings feel? 1–5
5. Would you use/pilot this? Yes / Maybe / No
6. Most useful feature
7. Biggest concern
8. What would you change?
9. Additional feedback

Store responses.

Display:

- participant count
- average usefulness
- average clarity
- average trust
- intent to use

Never fabricate validation results.

---

# 36. VALIDATION EVIDENCE

Document:

- validation objective
- target participants
- methodology
- feedback
- themes
- discovered problems
- changes made
- next steps

Create:

```text
docs/validation.md
```

---

# 37. BUSINESS MODEL

Create a business model section containing:

- target customers
- customer problem
- value proposition
- solution
- channels
- customer relationships
- revenue streams
- key resources
- key activities
- key partners
- cost structure

Also define:

- beachhead customer
- initial use case
- differentiation
- expansion opportunities

---

# 38. COMMERCIALIZATION

Document:

- beachhead market
- customer acquisition
- pilot strategy
- pricing
- distribution
- partnerships
- retention
- expansion
- key metrics
- risks

Potential pricing structure:

Free:
Basic diagnostic

Paid:
Detailed analysis

Professional:
Recurring monitoring / advisor features

Enterprise:
Organizations / incubators / associations

This must be adapted to the actual project brief.

---

# 39. ROADMAP

## Phase 1 — MVP

- document upload
- extraction
- analysis
- evidence
- findings
- recommendations
- report

## Phase 2 — Pilot

- real MSME users
- feedback
- improved analysis
- more document types
- industry-specific analysis

## Phase 3 — Productization

- accounts
- secure storage
- workspaces
- recurring analysis
- document history

## Phase 4 — Scale

- benchmarking
- industry models
- advisor ecosystem
- MSME ecosystem integrations
- monitoring

Each phase should have:

- objectives
- features
- success metrics
- dependencies

---

# 40. TECHNOLOGY

Recommended stack:

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui where useful
- Lucide icons
- Recharts

## Backend

- Python
- FastAPI
- Pydantic
- SQLite
- SQLAlchemy if useful

## Document Processing

- PyMuPDF
- python-docx
- openpyxl
- standard Python
- pandas where useful

Avoid unnecessary technologies.

---

# 41. LOCAL-FIRST REQUIREMENT

The MVP should run locally.

Do not require:

- Docker
- Kubernetes
- cloud infrastructure
- GPU
- local LLM
- complicated authentication
- production deployment infrastructure

The demo should work without an internet connection after the demo document has been downloaded.

---

# 42. SECURITY

The prototype must:

- never expose API keys
- validate file types
- validate file size
- prevent path traversal
- sanitize displayed document text
- handle malformed files
- handle empty files
- handle unsupported files
- handle LLM failures
- handle missing API keys

---

# 43. UI / UX

The product should look like a credible B2B SaaS application.

Avoid:

- generic Bootstrap appearance
- school-project appearance
- excessive cards
- excessive gradients
- excessive glassmorphism
- neon effects
- unnecessary animations
- chatbot-style interface
- meaningless metrics
- decorative AI imagery
- emoji-heavy UI

Prefer:

- clean typography
- whitespace
- strong hierarchy
- subtle borders
- restrained colors
- meaningful status indicators
- professional charts
- excellent empty states
- clear loading states
- clear error states
- accessible contrast

---

# 44. NAVIGATION

Primary navigation:

- Overview
- Analyze
- Findings
- Reports
- Validation
- Business Model
- Roadmap

---

# 45. DATABASE

Use SQLite.

Tables:

## documents

- id
- filename
- file_type
- file_size
- uploaded_at
- status
- extracted_text
- source_reference

## analyses

- id
- document_id
- created_at
- overall_score
- summary
- analysis_json

## findings

- id
- analysis_id
- title
- category
- severity
- confidence
- evidence
- source_reference
- why_it_matters
- recommendation
- expected_outcome
- effort
- time_horizon
- status

## validation_feedback

- id
- participant_type
- understanding
- usefulness
- clarity
- trust
- intent_to_use
- most_useful
- biggest_concern
- changes
- additional_feedback
- created_at

---

# 46. API

Provide endpoints conceptually equivalent to:

```text
GET  /api/health
POST /api/documents/upload
GET  /api/documents
GET  /api/documents/{id}
POST /api/documents/{id}/analyze
GET  /api/analyses/{id}
GET  /api/findings
PATCH /api/findings/{id}
POST /api/validation/feedback
GET  /api/validation/feedback
GET  /api/dashboard
GET  /api/business-model
GET  /api/roadmap
```

---

# 47. DEMO MODE

The reviewer must be able to use the product without:

- creating an account
- entering API keys
- finding a document
- configuring a database
- understanding the architecture

Provide:

> Try Demo

The demo must use the bundled document.

---

# 48. DEMO RESET

Provide a development/demo mechanism to reset demo data.

It should allow the demo to be run repeatedly.

---

# 49. TESTING REQUIREMENTS

At minimum test:

1. health endpoint
2. file validation
3. PDF extraction
4. analysis schema
5. fallback analysis
6. finding generation
7. validation submission
8. finding status update
9. dashboard data
10. report data

Create:

```text
TESTING.md
```

Document:

- test ID
- test description
- expected result
- actual result
- status

---

# 50. DOCUMENTATION

Create:

```text
README.md

docs/
    product-overview.md
    validation.md
    business-model.md
    commercialization.md
    roadmap.md
    demo-script.md
```

---

# 51. DEMO SCRIPT

The demo should communicate:

## Problem

MSME information is often trapped in documents and difficult to turn into decisions.

## Solution

MSMEOS2 transforms those documents into evidence-backed business intelligence.

## Workflow

Upload → Understand → Analyze → Explain → Prioritize → Act

## Value

- less manual analysis
- better visibility
- earlier risk identification
- clearer priorities
- actionable next steps

---

# 52. LIMITATIONS

The prototype must clearly acknowledge:

- analysis quality depends on document quality
- prototype scoring is indicative
- LLM output may require human review
- absence of evidence does not prove absence of a business condition
- this is not professional legal, tax, investment, credit or audit advice

---

# 53. NON-FUNCTIONAL REQUIREMENTS

The application should:

- start reliably
- handle errors gracefully
- maintain consistent UI
- avoid crashes
- use typed interfaces
- have understandable code
- keep dependencies reasonable
- work on Windows 11
- work on the specified laptop
- work without GPU acceleration

---

# 54. TIME CONSTRAINT

Initial MVP development target:

Approximately 4 hours.

Prioritize:

```text
P0
Application
Upload
Extraction
Analysis
Evidence
Findings
Recommendations
Action Plan
Demo

P1
Report
Validation
Business Model
Roadmap
Testing

P2
Advanced functionality
```

Do not spend time on:

- authentication
- deployment
- advanced infrastructure
- complex PDF generation
- unnecessary animations
- unnecessary integrations

---

# 55. QUALITY BAR

The final prototype should feel like:

> an early-stage B2B SaaS product that could be shown to an evaluator or pilot customer.

It should NOT feel like:

> a collection of generated UI screens.

Functionality is more important than decoration.

The primary workflow must actually work.

---

# 56. SUCCESS CRITERIA

The MVP is considered successful when a reviewer can:

1. open the application
2. understand what it does
3. use the demo document
4. see document processing
5. see analysis
6. see evidence
7. understand a finding
8. understand why it matters
9. see a recommended action
10. see priorities
11. see a 30/60/90 plan
12. view a report
13. understand the validation mechanism
14. view business model
15. view roadmap
16. understand commercialization strategy

---

# 57. FUTURE PRODUCT DIRECTION

Potential future capabilities:

- more document types
- industry-specific analysis
- document history
- business workspaces
- recurring monitoring
- benchmarking
- advisor collaboration
- MSME ecosystem integrations
- secure cloud storage
- multilingual support
- regional-language analysis
- advanced financial analysis
- alerts
- integrations with accounting systems

These are future capabilities and must not distract from MVP completion.

---

# 58. ENGINEERING HANDOFF REQUIREMENT

This repository must always be understandable by another AI developer.

The project must contain:

```text
PRD.md
PROGRESS.md
DECISIONS.md
```

These files serve different purposes.

## PRD.md

Stable product requirements.

## PROGRESS.md

Current implementation status.

## DECISIONS.md

Important technical/product decisions and reasons.

Any AI entering the repository must read these files before making substantial changes.

---

# 59. PROGRESS FILE REQUIREMENTS

`PROGRESS.md` is a living document.

It must contain:

- current date/time
- current project phase
- overall completion estimate
- completed work
- current work
- next tasks
- blocked tasks
- known bugs
- tests completed
- tests failing
- files changed
- dependencies installed
- commands that work
- commands that fail
- environment setup
- important implementation notes
- demo status
- validation status
- business model status
- roadmap status

The completion estimate must be an honest engineering estimate.

Never mark something complete merely because code exists.

A feature is complete only when it works and has been tested.

---

# 60. AI HANDOFF RULE

Any AI working on this repository MUST:

1. Read `PRD.md`.
2. Read `PROGRESS.md`.
3. Read `DECISIONS.md`.
4. Inspect the current repository.
5. Determine what is actually working.
6. Continue from the current state.
7. Avoid rebuilding completed functionality unnecessarily.
8. Update `PROGRESS.md` after meaningful work.
9. Record important decisions in `DECISIONS.md`.

Before stopping, the AI MUST update:

```text
PROGRESS.md
```

so another AI can continue from the exact current state.

---

# 61. FINAL PRODUCT PRINCIPLE

The product should answer this question:

> "I gave MSMEOS2 a real business document. What useful business decision did it help me make?"

The answer must be visible in the product.

The most important experience is:

```text
DOCUMENT
   ↓
WHAT DOES IT SAY?
   ↓
WHAT DOES IT MEAN?
   ↓
WHAT SHOULD I WORRY ABOUT?
   ↓
WHAT OPPORTUNITIES EXIST?
   ↓
WHAT SHOULD I DO NEXT?
```

That is the core of MSMEOS2.
