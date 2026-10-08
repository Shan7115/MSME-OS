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

---

### DEC-003 — LLM is optional

**Decision:**  
The application must work without an LLM API key using a deterministic fallback analysis engine.

**Reason:**  
The demo must remain functional and reproducible.

---

### DEC-004 — Local demo document

**Decision:**  
The demo document is stored locally after acquisition.

**Reason:**  
The demonstration should not depend on internet access.

---

### DEC-005 — No authentication for MVP

**Decision:**  
Authentication is excluded from the initial MVP.

**Reason:**  
It does not contribute to the core product demonstration and consumes development time.

---

### DEC-006 — Browser-print report

**Decision:**  
Use a print-optimized report for MVP rather than building a complex PDF generation system.

**Reason:**  
The reviewer needs a usable report; complex PDF infrastructure is not a priority.

---

## Future Decisions

Add important decisions here as development progresses.

Format:

### DEC-XXX — Title

**Decision:**

**Reason:**

**Alternatives considered:**

**Date:**
