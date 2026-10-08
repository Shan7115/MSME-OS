# MSMEOS2 — Product Overview

## 1. Executive Summary
MSMEOS2 is an intelligent document-analysis and business decision-support platform designed for Micro, Small and Medium Enterprises (MSMEs) in India. Instead of requiring owners or credit analysts to manually key data into complex spreadsheets, MSMEOS2 ingests existing business documents (such as Project Profiles, Bank Loan Applications, Detailed Project Reports, and Financial Statements) and transforms them into structured business intelligence.

## 2. Core Value Workflow
1. **Intake & Extraction:** PyMuPDF, python-docx, and openpyxl parse uploaded files and extract structured tables and page text.
2. **Fact Normalization:** Identification of key business parameters (turnover, customer shares, creditor/debtor cycles, CC limits, statutory filings).
3. **Evidence-First Diagnostic:** Every finding is linked directly to an exact document citation and page reference.
4. **Transparent Scoring:** An indicative 0–100 Readiness Score with category-level breakdowns (Financial, Operations, Market, Working Capital, Compliance, Growth).
5. **Action Planning:** Generation of prioritized 30/60/90-day action steps with expected liquidity and operational outcomes.
6. **Executive Reporting:** Board-ready diagnostic report with browser print and PDF export capabilities.

## 3. Architecture Principles
- **Local-First & Resilient:** Fully functional on Windows 11 without requiring internet access or GPU infrastructure.
- **Evidence Over Hallucination:** Strict separation between factual citations, interpretations, and recommended remedies.
- **Deterministic Baseline with Optional LLM:** Operates with 100% reliability offline via deterministic rule analysis, with transparent LLM plug-in capabilities.
