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
