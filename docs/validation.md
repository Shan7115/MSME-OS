# MSMEOS2 — Validation Strategy & Evidence Log

## 1. Validation Objective
Verify whether Indian MSME business promoters, accountants, and credit advisors find automated document extraction and evidence-backed diagnostics understandable, trustworthy, and actionable for decision-making.

## 2. Target Stakeholders
- **MSME Promoters / Owners:** Evaluating whether the 30/60/90 plan and working capital alerts provide tangible operational relief.
- **Chartered Accountants / Advisors:** Evaluating whether automated fact extraction accelerates credit appraisal preparation without introducing errors.
- **Academic / Evaluator Participants:** Testing interface clarity, evidence attribution, and workflow coherence.

## 3. Methodology & Integrity Policy
- **Zero Fabrication Rule:** Per PRD Section 11 & 35, all validation data is collected in real-time through the application's `/api/validation/feedback` endpoint. No fictitious customer testimonials or fake metrics are fabricated.
- **Live Aggregation:** When no evaluations have been submitted, the hub explicitly reports `0` verified responses. As real stakeholders test the system, averages for Usefulness, Clarity, Trust, and Pilot Intent update dynamically.

## 4. Current Status
- Feedback collection infrastructure is fully operational in the **Validation Hub** tab of the web application.
- Real-time SQLite persistence and metric calculation verified via automated test suite `tests/test_api.py`.
