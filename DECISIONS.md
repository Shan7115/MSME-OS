# MSMEOS2 — Engineering & Product Decisions

This document records important decisions made during development.
Its purpose is to prevent future AI developers from unknowingly reversing useful decisions.

---

## Decision Log

### DEC-001 — Local-first MVP

**Decision:**  
Build the MVP as a local application using React/Vite + FastAPI + SQLite.

**Reason:**  
The project has a very short development window and must be reliable on the developer's Windows 11 laptop.

**Date:**  
2026-10-08

---

### DEC-002 — Evidence-first analysis

**Decision:**  
Important findings must contain evidence from the uploaded document whenever possible.

**Reason:**  
This differentiates the product from a generic AI summarizer and improves trustworthiness.

**Date:**  
2026-10-08

---

### DEC-003 — LLM is optional

**Decision:**  
The application must work without an LLM API key using a deterministic fallback analysis engine.

**Reason:**  
The demo must remain functional and reproducible.

**Date:**  
2026-10-08

---

### DEC-004 — Local demo document

**Decision:**  
The demo document is stored locally after acquisition.

**Reason:**  
The demonstration should not depend on internet access.

**Date:**  
2026-10-08

---

### DEC-005 — No authentication for MVP

**Decision:**  
Authentication is excluded from the initial MVP.

**Reason:**  
It does not contribute to the core product demonstration and consumes development time.

**Date:**  
2026-10-08

---

### DEC-006 — Browser-print report

**Decision:**  
Use a print-optimized report for MVP rather than building a complex PDF generation system.

**Reason:**  
The reviewer needs a usable report; complex PDF infrastructure is not a priority.

**Date:**  
2026-10-08

---

### DEC-007 — Hybrid Single-Command Architecture (FastAPI + Vite Static SPA)

**Decision:**  
Compile React frontend using Vite into `frontend/dist` and mount directly to `/` in FastAPI, alongside `/api/*` endpoints.

**Reason:**  
Enables single command startup (`python app.py`) on Windows without requiring dual terminal sessions, while preserving `npm run dev` hot-reloading for frontend developers.

**Date:**  
2026-10-09

---

### DEC-008 — Synthetic Agro-Processing MSME Case Study

**Decision:**  
Create a realistic 6-page synthetic Indian MSME dossier for "Sri Murugan Agro Foods & Spices Pvt. Ltd." (Erode, Tamil Nadu) in `sample-data/demo-document.pdf`.

**Reason:**  
Accurately models key MSME stress points (38% customer concentration, 78-day DSO, 92.5% CC limit utilization, Salem supplier cluster dependence, ₹5L promoter capex shortfall, and missing warehouse Fire Safety NOC) while respecting privacy constraints per PRD Sections 14 and 15.

**Date:**  
2026-10-09

---

### DEC-009 — Real-time Validation Hub with Zero Fabrication

**Decision:**  
Implement direct database feedback collection (`POST /api/validation/feedback`) with live statistical aggregation instead of static mock numbers.

**Reason:**  
Strictly complies with the NO FAKE VALIDATION requirement (PRD Sections 11 & 35). When no reviews exist, the empty state explicitly reflects 0 responses until real stakeholders submit evaluations.

**Date:**  
2026-10-09

---

### DEC-010 — Google Gemini 2.5 Flash LLM Analysis Provider

**Decision:**  
Integrate Google GenAI (`gemini-2.5-flash`) via the official `google-genai` SDK in `backend/providers.py` using native constrained JSON decoding (`response_mime_type="application/json"`). Store API keys exclusively in local untracked `.env` files.

**Reason:**  
Provides true frontier AI document intelligence, extracting nuanced business signals, exact text quotations, and synthesized 30/60/90 action plans, while gracefully falling back to `DeterministicAnalysisProvider` if the model encounters intermittent API overloads.

**Date:**  
2026-10-09

---

### DEC-011 — Dynamic Multi-Document Extraction & Unique Analysis Namespacing

**Decision:**  
Implement `_analyze_custom_document()` in `DeterministicAnalysisProvider` and namespace finding IDs with `{analysis_id}-{finding_id}` using `INSERT OR REPLACE` in SQLite. Allow dashboard and findings endpoints to accept an optional `analysis_id` query parameter for seamless switching between ingested dossiers.

**Reason:**  
Ensures that arbitrary/random document uploads (PDF, DOCX, XLSX, TXT, CSV) from different industries (solar, textiles, precision engineering, etc.) extract real text and metrics rather than defaulting to the Sri Murugan demo profile, while eliminating SQLite primary key collisions across multi-document workflows.

**Date:**  
2026-10-09

---

### DEC-012 — Multi-Sector Sample Dossier Library (4 Industry Options)

**Decision:**  
Generate 4 distinct executive-grade PDF credit appraisal dossiers in `sample-data/` representing diverse manufacturing and export sectors (Agro-Processing, CleanTech Solar, Precision CNC Engineering, and Textile Exports). Provide direct API endpoints (`GET /api/sample-documents`, `GET /api/sample-documents/{option}/download`, `POST /api/demo/load?option={opt}`) and an interactive 4-card UI selector in `AnalyzeView`.

**Reason:**  
Provides evaluators and stakeholders with multiple realistic options across different Indian industrial clusters, demonstrating the platform's multi-sector versatility, robust citation model, and seamless transition between pre-packaged specimens and arbitrary file uploads.

**Date:**  
2026-10-09

---

### DEC-013 — UI/UX Pro Max Executive Design System Implementation

**Decision:**  
Apply the `skills/SKILL.md` (`ui_ux_pro_max`) design intelligence workflow across the entire web application. Standardize all styles into CSS Custom Properties in `:root`, implement executive glassmorphic depth (`backdrop-filter: blur(16px)` on obsidian palette `#070b14`), use typography pairings `Plus Jakarta Sans` + `JetBrains Mono`, replace static meters with an SVG animated radial gauge, add pillar meters with animated transitions, build custom form controls (`.form-control`, `.form-select`, `.form-textarea`), and introduce interactive star ratings and severity counter chips.

**Reason:**  
Elevates MSMEOS2 from an MVP to a high-credibility, board-level decision cockpit suitable for bank credit committees, MSME promoters, and financial advisors. Solves usability issues by providing instant visual hierarchy, high contrast dark-mode readability, accessible interactive states, and responsive cards.

**Date:**  
2026-10-09

---

### DEC-014 — Apple Human Interface Guidelines (HIG) Design Audit & Refinement

**Decision:**  
Conduct an Apple HIG audit using `.agents/skills/apple-design/SKILL.md` across 5 lenses (Accessibility, Platform Conventions, Visual Design & Craft, Interaction, Writing & Content):
1. **Layer Discipline (`liquid-glass.md`)**: Restrict Liquid Glass translucency strictly to the functional floating layer (the macOS-style sidebar with `backdrop-filter: saturate(180%) blur(24px)` and floating modal drawers). Remove blur from the content layer cards (`.card`, `.stat-card`, `.finding-card`) and use clean solid materials (`#0c1222`) with hairline borders (`rgba(255, 255, 255, 0.08)`).
2. **Text Placement & Visual Hierarchy (`layout.md` & `typography.md`)**: Separate the crowded Readiness Score Cockpit from the 6 Diagnostic Dimension Pillars into distinct, balanced cards. Use tabular numbers (`font-variant-numeric: tabular-nums`) on all numeric KPIs, align sample card buttons horizontally at the bottom, and fix section numbering in the Executive Report.
3. **Typography & Accessible Contrast (`accessibility.md` & `typography.md`)**: Elevate secondary and caption text tokens (`--text-muted: #9fb0c7`, `--text-dim: #7d8da2`) to guarantee WCAG AA contrast (minimum 4.8:1 and 7.6:1 against dark backgrounds). Default to system font stack `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display"`.
4. **Restraint & Color Budget (`buttons.md` & `branding.md`)**: Enforce single primary CTA per view, replacing noisy background gradients with solid system buttons (`#2563eb`) and secondary ghost buttons.

**Reason:**  
Resolves visual clutter, awkward text wrapping, and inconsistent layering. Produces an uncluttered, high-craft executive cockpit that feels native, legible, and authoritative.

**Date:**  
2026-10-09


