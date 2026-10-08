import os
import sys
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from backend.database import get_db_connection, init_db, reset_db_data
from backend.extractor import extract_document, DocumentExtractionError, SUPPORTED_EXTENSIONS
from backend.providers import get_analysis_provider
from backend.models import (
    FindingStatusUpdate,
    ValidationFeedbackCreate,
    ValidationFeedbackOut,
    ValidationMetrics
)

app = FastAPI(
    title="MSMEOS2 Intelligent Business Decision Platform",
    description="Evidence-backed document analysis and decision support for MSMEs",
    version="1.0.0"
)

# Enable CORS for local Vite frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schema on startup
@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MSMEOS2 API",
        "timestamp": datetime.now().isoformat(),
        "database": "sqlite_connected"
    }

@app.get("/api/dashboard")
def get_dashboard_data(analysis_id: Optional[str] = Query(None)):
    conn = get_db_connection()
    c = conn.cursor()

    # Documents count
    doc_count = c.execute("SELECT COUNT(*) FROM documents").fetchone()[0]

    # Selected or Latest analysis
    if analysis_id:
        latest_analysis = c.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
    else:
        latest_analysis = c.execute("""
            SELECT * FROM analyses ORDER BY created_at DESC LIMIT 1
        """).fetchone()

    # Findings metrics for selected analysis (or across all if none selected)
    if latest_analysis:
        crit_query = "SELECT COUNT(*) FROM findings WHERE analysis_id = ? AND severity = 'Critical' AND status != 'Resolved'"
        open_query = "SELECT COUNT(*) FROM findings WHERE analysis_id = ? AND status = 'Open'"
        critical_findings_count = c.execute(crit_query, (latest_analysis["id"],)).fetchone()[0]
        open_actions_count = c.execute(open_query, (latest_analysis["id"],)).fetchone()[0]
    else:
        critical_findings_count = c.execute("""
            SELECT COUNT(*) FROM findings WHERE severity = 'Critical' AND status != 'Resolved'
        """).fetchone()[0]
        open_actions_count = c.execute("""
            SELECT COUNT(*) FROM findings WHERE status = 'Open'
        """).fetchone()[0]

    dashboard_data = {
        "documents_count": doc_count,
        "critical_findings_count": critical_findings_count,
        "high_priority_actions_count": open_actions_count,
        "has_analysis": latest_analysis is not None,
    }

    if latest_analysis:
        analysis_json = json.loads(latest_analysis["analysis_json"])
        dashboard_data.update({
            "latest_analysis_id": latest_analysis["id"],
            "document_id": latest_analysis["document_id"],
            "business_name": latest_analysis["business_name"],
            "business_sector": latest_analysis["business_sector"],
            "overall_score": latest_analysis["overall_score"],
            "score_explanation": latest_analysis["score_explanation"],
            "score_breakdown": json.loads(latest_analysis["score_breakdown"] or "[]"),
            "summary": latest_analysis["summary"],
            "created_at": latest_analysis["created_at"],
            "top_findings": analysis_json.get("findings", [])[:3],
            "priority_recommendations": analysis_json.get("recommendations", [])[:3]
        })
    else:
        dashboard_data.update({
            "overall_score": None,
            "business_name": None,
            "business_sector": None,
            "score_explanation": "No documents analyzed yet. Upload a business report or click 'Try Demo' to begin diagnostic.",
            "score_breakdown": [],
            "summary": "",
            "top_findings": [],
            "priority_recommendations": []
        })

    conn.close()
    return dashboard_data

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_document"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported formats: {', '.join(SUPPORTED_EXTENSIONS)}"
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

    try:
        extracted = extract_document(filename, file_bytes)
    except DocumentExtractionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failure: {str(e)}")

    doc_id = f"doc-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now().isoformat()

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO documents (id, filename, file_type, file_size, uploaded_at, status, extracted_text, page_count, source_reference)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        doc_id,
        filename,
        ext,
        len(file_bytes),
        now_iso,
        "extracted",
        extracted["extracted_text"],
        extracted["page_count"],
        f"Uploaded document: {filename}"
    ))
    conn.commit()
    conn.close()

    return {
        "id": doc_id,
        "filename": filename,
        "file_type": ext,
        "file_size": len(file_bytes),
        "page_count": extracted["page_count"],
        "status": "extracted",
        "uploaded_at": now_iso,
        "message": "Document successfully uploaded and extracted."
    }

@app.get("/api/documents")
def list_documents():
    conn = get_db_connection()
    c = conn.cursor()
    rows = c.execute("SELECT id, filename, file_type, file_size, uploaded_at, status, page_count, source_reference FROM documents ORDER BY uploaded_at DESC").fetchall()
    docs = [dict(r) for r in rows]
    conn.close()
    return docs

@app.get("/api/documents/{doc_id}")
def get_document(doc_id: str):
    conn = get_db_connection()
    c = conn.cursor()
    row = c.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Document not found")
    return dict(row)

def split_pages_from_text(extracted_text: str, page_count: int) -> List[Dict[str, Any]]:
    import re
    pattern = r'---\s*PAGE\s*(\d+)\s*---'
    parts = re.split(pattern, extracted_text)
    if len(parts) > 1:
        pages = []
        for i in range(1, len(parts), 2):
            try:
                p_num = int(parts[i])
            except ValueError:
                p_num = len(pages) + 1
            p_text = parts[i+1].strip() if i+1 < len(parts) else ""
            pages.append({"page_number": p_num, "text": p_text})
        return pages if pages else [{"page_number": 1, "text": extracted_text}]
    return [{"page_number": 1, "text": extracted_text}]

@app.get("/api/documents/{doc_id}/analysis")
def get_document_analysis(doc_id: str):
    conn = get_db_connection()
    c = conn.cursor()
    row = c.execute("SELECT * FROM analyses WHERE document_id = ? ORDER BY created_at DESC LIMIT 1", (doc_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="No analysis found for this document")
    return json.loads(row["analysis_json"])

@app.post("/api/documents/{doc_id}/analyze")
def analyze_document(doc_id: str):
    conn = get_db_connection()
    c = conn.cursor()
    doc_row = c.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
    if not doc_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Document not found")

    doc_dict = dict(doc_row)
    # Check if analysis already exists for this document
    existing = c.execute("SELECT id FROM analyses WHERE document_id = ?", (doc_id,)).fetchone()
    if existing:
        analysis_id = existing["id"]
        # Fetch and return existing analysis
        full_analysis_row = c.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
        conn.close()
        return json.loads(full_analysis_row["analysis_json"])

    # Run Analysis Engine
    provider = get_analysis_provider()
    # Reconstruct extracted structure with real page text
    real_pages = split_pages_from_text(doc_dict["extracted_text"] or "", doc_dict["page_count"])
    doc_info = {
        "id": doc_id,
        "filename": doc_dict["filename"],
        "file_type": doc_dict["file_type"],
        "page_count": doc_dict["page_count"],
        "extracted_text": doc_dict["extracted_text"],
        "pages": real_pages
    }

    try:
        analysis_result = provider.analyze(doc_info)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Analysis engine error: {str(e)}")

    analysis_id = analysis_result["id"]
    now_iso = datetime.now().isoformat()

    c.execute("""
        INSERT INTO analyses (
            id, document_id, created_at, business_name, business_sector,
            document_type, overall_score, score_explanation, score_breakdown,
            summary, strengths, opportunities, next_steps, plan_30_60_90, analysis_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        analysis_id,
        doc_id,
        now_iso,
        analysis_result["business_name"],
        analysis_result["business_sector"],
        analysis_result["document_type"],
        analysis_result["overall_score"],
        analysis_result["score_explanation"],
        json.dumps(analysis_result["score_breakdown"]),
        analysis_result["summary"],
        json.dumps(analysis_result["strengths"]),
        json.dumps(analysis_result["opportunities"]),
        json.dumps(analysis_result["next_steps"]),
        json.dumps(analysis_result["plan_30_60_90"]),
        json.dumps(analysis_result)
    ))

    # Save individual findings into findings table for search/filter/update
    for idx, f in enumerate(analysis_result.get("findings", [])):
        finding_id = f.get("id") or f"find-{idx+1}"
        if not finding_id.startswith(f"{analysis_id}-"):
            finding_id = f"{analysis_id}-{finding_id}"
            f["id"] = finding_id

        c.execute("""
            INSERT OR REPLACE INTO findings (
                id, analysis_id, title, category, severity, confidence,
                evidence, source_reference, why_it_matters, recommendation,
                expected_outcome, effort, time_horizon, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            finding_id,
            analysis_id,
            f["title"],
            f["category"],
            f["severity"],
            f["confidence"],
            f["evidence"],
            f["source_reference"],
            f["why_it_matters"],
            f["recommendation"],
            f["expected_outcome"],
            f["effort"],
            f["time_horizon"],
            f.get("status", "Open")
        ))

    c.execute("UPDATE documents SET status = 'analyzed' WHERE id = ?", (doc_id,))
    conn.commit()
    conn.close()

    return analysis_result

@app.get("/api/analyses/{analysis_id}")
def get_analysis(analysis_id: str):
    conn = get_db_connection()
    c = conn.cursor()
    row = c.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return json.loads(row["analysis_json"])

@app.get("/api/findings")
def list_findings(
    analysis_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    conn = get_db_connection()
    c = conn.cursor()
    query = "SELECT * FROM findings WHERE 1=1"
    params = []

    if analysis_id:
        query += " AND analysis_id = ?"
        params.append(analysis_id)
    if severity:
        query += " AND severity = ?"
        params.append(severity)
    if category:
        query += " AND category = ?"
        params.append(category)
    if status:
        query += " AND status = ?"
        params.append(status)
    if search:
        query += " AND (title LIKE ? OR evidence LIKE ? OR why_it_matters LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    query += " ORDER BY CASE severity WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END"
    rows = c.execute(query, params).fetchall()
    findings = [dict(r) for r in rows]
    conn.close()
    return findings

@app.patch("/api/findings/{finding_id}")
def update_finding_status(finding_id: str, update: FindingStatusUpdate):
    if update.status not in ["Open", "In Progress", "Resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status value. Allowed: Open, In Progress, Resolved")

    conn = get_db_connection()
    c = conn.cursor()
    finding = c.execute("SELECT * FROM findings WHERE id = ?", (finding_id,)).fetchone()
    if not finding:
        conn.close()
        raise HTTPException(status_code=404, detail="Finding not found")

    c.execute("UPDATE findings SET status = ? WHERE id = ?", (update.status, finding_id))
    
    # Also update embedded JSON inside parent analyses record to keep synchronized
    analysis_id = finding["analysis_id"]
    analysis_row = c.execute("SELECT analysis_json FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
    if analysis_row:
        data = json.loads(analysis_row["analysis_json"])
        for f in data.get("findings", []):
            if f["id"] == finding_id:
                f["status"] = update.status
        c.execute("UPDATE analyses SET analysis_json = ? WHERE id = ?", (json.dumps(data), analysis_id))

    conn.commit()
    conn.close()
    return {"id": finding_id, "status": update.status, "message": "Finding status updated."}

@app.post("/api/validation/feedback")
def submit_validation_feedback(fb: ValidationFeedbackCreate):
    feedback_id = f"fb-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now().isoformat()

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO validation_feedback (
            id, participant_type, understanding, usefulness, clarity,
            trust, intent_to_use, most_useful, biggest_concern, changes,
            additional_feedback, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        feedback_id,
        fb.participant_type,
        fb.understanding,
        fb.usefulness,
        fb.clarity,
        fb.trust,
        fb.intent_to_use,
        fb.most_useful,
        fb.biggest_concern,
        fb.changes,
        fb.additional_feedback,
        now_iso
    ))
    conn.commit()
    conn.close()

    return {
        "id": feedback_id,
        "created_at": now_iso,
        "message": "Validation feedback recorded successfully."
    }

@app.get("/api/validation/feedback")
def get_validation_feedback():
    conn = get_db_connection()
    c = conn.cursor()
    rows = c.execute("SELECT * FROM validation_feedback ORDER BY created_at DESC").fetchall()
    feedbacks = [dict(r) for r in rows]

    total = len(feedbacks)
    if total > 0:
        avg_useful = round(sum(f["usefulness"] for f in feedbacks) / total, 2)
        avg_clarity = round(sum(f["clarity"] for f in feedbacks) / total, 2)
        avg_trust = round(sum(f["trust"] for f in feedbacks) / total, 2)
        yes_count = sum(1 for f in feedbacks if f["intent_to_use"] == "Yes")
        maybe_count = sum(1 for f in feedbacks if f["intent_to_use"] == "Maybe")
        no_count = sum(1 for f in feedbacks if f["intent_to_use"] == "No")
    else:
        avg_useful = 0.0
        avg_clarity = 0.0
        avg_trust = 0.0
        yes_count = 0
        maybe_count = 0
        no_count = 0

    conn.close()
    return {
        "participant_count": total,
        "avg_usefulness": avg_useful,
        "avg_clarity": avg_clarity,
        "avg_trust": avg_trust,
        "intent_yes_count": yes_count,
        "intent_maybe_count": maybe_count,
        "intent_no_count": no_count,
        "feedbacks": feedbacks
    }

@app.get("/api/business-model")
def get_business_model():
    return {
        "value_proposition": {
            "headline": "Evidence-Backed Business Diagnostic for MSME Owners",
            "summary": "Transforming unstructured business documents into quantified risks, statutory checks, and prioritized 30/60/90-day action plans without requiring manual data re-entry.",
            "pillars": [
                {"title": "Zero Manual Data Entry", "description": "Upload existing DPRs, balance sheets, or quotations directly."},
                {"title": "Evidence Before Opinion", "description": "Every single risk is tagged with specific document source references and citations."},
                {"title": "Prioritized Execution", "description": "Separation of facts, interpretations, and categorized 30/60/90-day execution plans."}
            ]
        },
        "target_segments": [
            {"segment": "Primary Beachhead", "audience": "Indian Manufacturing & Agro-processing MSMEs (Turnover ₹1 Cr – ₹25 Cr)", "need": "Bank credit appraisal readiness, working capital bottleneck relief."},
            {"segment": "Secondary", "audience": "Chartered Accountants & MSME Financial Advisors", "need": "Rapid automated client diagnostic audits and lender presentation prep."},
            {"segment": "Institutional", "audience": "MSME Incubators, District Industries Centres (DIC), & NBFC Credit Underwriters", "need": "Pre-screening loan applicants and monitoring borrower covenant compliance."}
        ],
        "pricing_tiers": [
            {
                "name": "Starter / Diagnostic",
                "price": "Free / ₹0",
                "billing": "Forever free",
                "features": ["Single document upload (up to 15 pages)", "Baseline health score & top 3 findings", "Standard PDF extraction", "Web dashboard access"]
            },
            {
                "name": "MSME Growth (Beachhead)",
                "price": "₹ 2,499",
                "billing": "Per month / ₹24,000 billed annually",
                "features": ["Unlimited document uploads (PDF, DOCX, XLSX)", "Deep Evidence-backed finding engine", "30/60/90-Day execution roadmap", "Downloadable Executive Board Reports", "Receivable & supplier concentration alerts", "Email & WhatsApp support"]
            },
            {
                "name": "Advisor / Professional",
                "price": "₹ 6,999",
                "billing": "Per month",
                "features": ["Multi-client workspaces (up to 25 MSME profiles)", "Custom brand white-label executive reports", "TReDS / Invoice discounting API linking", "Priority document processing & batch OCR", "Dedicated account manager"]
            },
            {
                "name": "Enterprise / Institutional",
                "price": "Custom Quote",
                "billing": "Annual license",
                "features": ["On-premise / Local-first VPC deployment", "NBFC Credit risk scoring module", "Bulk portfolio monitoring", "Custom ERP / Tally connectors"]
            }
        ],
        "cost_structure": [
            {"item": "Core Infrastructure", "pct": 20, "description": "High-availability cloud compute, secure encrypted storage, and caching."},
            {"item": "Document AI & NLP Processing", "pct": 25, "description": "Hybrid deterministic parsing and LLM API inference tokens."},
            {"item": "Direct Sales & Field Acquisition", "pct": 35, "description": "Partnerships with industrial cluster associations and CA networks."},
            {"item": "Compliance & Security Audits", "pct": 20, "description": "Data privacy certifications (ISO 27001 / SOC 2) and legal compliance."}
        ]
    }

@app.get("/api/roadmap")
def get_roadmap():
    return {
        "phases": [
            {
                "phase": "Phase 1: Core MVP (Current)",
                "status": "In Progress",
                "timeline": "Months 1–2",
                "milestones": [
                    {"title": "Local-first Document Ingestion", "detail": "PyMuPDF, python-docx, openpyxl support with instant validation.", "done": True},
                    {"title": "Deterministic Evidence-First Engine", "detail": "Extraction of concentration risks, working capital metrics, and compliance deficits.", "done": True},
                    {"title": "Executive Report & 30/60/90-Day Planner", "detail": "Board-ready printable reports and prioritized horizon frameworks.", "done": True},
                    {"title": "Validation & Feedback Hub", "detail": "Structured survey collection directly embedded into app.", "done": True}
                ]
            },
            {
                "phase": "Phase 2: Pilot & Advisor Co-Creation",
                "status": "Planned",
                "timeline": "Months 3–4",
                "milestones": [
                    {"title": "Live MSME Cohort Pilot", "detail": "Deploy with 25 manufacturing MSMEs across Coimbatore/Erode industrial corridors.", "done": False},
                    {"title": "Tally & Zoho Books Ingestion", "detail": "Automated XML/JSON export ingestion from standard Indian accounting software.", "done": False},
                    {"title": "TReDS & Factoring Integration", "detail": "Direct referral bridge to invoice discounting portals for approved receivables.", "done": False}
                ]
            },
            {
                "phase": "Phase 3: Productization & Workspaces",
                "status": "Planned",
                "timeline": "Months 5–8",
                "milestones": [
                    {"title": "Role-Based Multi-User Accounts", "detail": "Workspaces for MSME owners, accountants, and external consulting teams.", "done": False},
                    {"title": "Monthly Recurring Health Monitoring", "detail": "Trend analysis across consecutive GST returns and trailing P&Ls.", "done": False},
                    {"title": "Regional Language Localization", "detail": "Support Tamil, Hindi, Gujarati, and Telugu reporting interfaces.", "done": False}
                ]
            },
            {
                "phase": "Phase 4: Scale & Ecosystem Integrations",
                "status": "Planned",
                "timeline": "Months 9–12",
                "milestones": [
                    {"title": "Industry Benchmark Intelligence", "detail": "Comparative peer analytics across 50+ NIC manufacturing codes.", "done": False},
                    {"title": "NBFC Lending API Syndicate", "detail": "Pre-qualified credit underwriting pipelines for equipment financing.", "done": False},
                    {"title": "Government MSME Scheme Matching", "detail": "Automated qualification engine for CGTMSE, PMEGP, and state subsidy schemes.", "done": False}
                ]
            }
        ]
    }

SAMPLE_MAP = {
    "agro": {
        "id": "agro",
        "filename": "01_agro_foods_credit_appraisal.pdf",
        "doc_id": "doc-demo-agro-foods",
        "title": "Sri Murugan Agro Foods & Spices Pvt. Ltd.",
        "sector": "Agro-Processing & Food Manufacturing",
        "location": "Erode, Tamil Nadu",
        "revenue": "₹142.50 L",
        "key_signals": "Customer concentration (38%), CC stress (92.5%), Fire Safety NOC deficit"
    },
    "solar": {
        "id": "solar",
        "filename": "02_solar_tech_expansion_dpr.pdf",
        "doc_id": "doc-demo-solar-tech",
        "title": "Surya Prakash Solar Tech Solutions Pvt. Ltd.",
        "sector": "CleanTech & Smart Inverters",
        "location": "Peenya, Bengaluru",
        "revenue": "₹245.80 L",
        "key_signals": "EPC concentration (42.5%), Testing rig bottleneck, PCB consent renewal"
    },
    "cnc": {
        "id": "cnc",
        "filename": "03_precision_engineering_term_loan.pdf",
        "doc_id": "doc-demo-precision-cnc",
        "title": "Kavitha Precision CNC Engineering Works Pvt. Ltd.",
        "sector": "Precision Automotive Machining",
        "location": "Ambattur, Chennai",
        "revenue": "₹188.40 L",
        "key_signals": "Tier-1 Auto concentration (46.8%), 18% CNC idle time, NABL calibration"
    },
    "textiles": {
        "id": "textiles",
        "filename": "04_textiles_export_credit_dossier.pdf",
        "doc_id": "doc-demo-textile-exports",
        "title": "Sri Lakshmi Knits & Garment Exports LLP",
        "sector": "Textiles & Cotton Garment Exports",
        "location": "Tiruppur, Tamil Nadu",
        "revenue": "₹315.00 L",
        "key_signals": "EU buyer concentration (39.5%), 78-day yarn lockup, ZLD effluent compliance"
    }
}

@app.get("/api/sample-documents")
def list_sample_documents():
    """List available pre-generated executive MSME sample dossiers."""
    return list(SAMPLE_MAP.values())

@app.get("/api/sample-documents/{option}/download")
def download_sample_document(option: str):
    """Download any of the pre-generated executive sample PDFs."""
    opt_key = option.lower()
    info = SAMPLE_MAP.get(opt_key)
    if not info:
        raise HTTPException(status_code=404, detail=f"Sample document option '{option}' not found. Available: agro, solar, cnc, textiles")
    
    sample_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample-data")
    file_path = os.path.join(sample_dir, info["filename"])
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Sample PDF file not found on disk")
    return FileResponse(file_path, media_type="application/pdf", filename=info["filename"])

@app.post("/api/demo/load")
def load_demo_data(option: Optional[str] = Query("agro")):
    """Load a chosen sample MSME dossier and perform immediate end-to-end diagnostic analysis."""
    opt_key = (option or "agro").lower()
    if opt_key not in SAMPLE_MAP:
        opt_key = "agro"
    
    sample_info = SAMPLE_MAP[opt_key]
    sample_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample-data")
    demo_path = os.path.join(sample_dir, sample_info["filename"])
    
    # Fallback to demo-document.pdf if specific file is missing
    if not os.path.exists(demo_path):
        demo_path = os.path.join(sample_dir, "demo-document.pdf")
    if not os.path.exists(demo_path):
        raise HTTPException(status_code=404, detail="Demo document not found on server")

    with open(demo_path, "rb") as f:
        file_bytes = f.read()

    doc_id = sample_info["doc_id"]
    now_iso = datetime.now().isoformat()

    conn = get_db_connection()
    c = conn.cursor()

    # Check if this demo doc already exists
    existing_doc = c.execute("SELECT id FROM documents WHERE id = ?", (doc_id,)).fetchone()
    if not existing_doc:
        extracted = extract_document(sample_info["filename"], file_bytes)
        c.execute("""
            INSERT INTO documents (id, filename, file_type, file_size, uploaded_at, status, extracted_text, page_count, source_reference)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc_id,
            sample_info["filename"],
            ".pdf",
            len(file_bytes),
            now_iso,
            "extracted",
            extracted["extracted_text"],
            extracted["page_count"],
            f"Pre-packaged Sample Dossier: {sample_info['title']}"
        ))
        conn.commit()

    conn.close()

    # Run analysis
    analysis_result = analyze_document(doc_id)
    return {
        "message": f"Demo document '{sample_info['title']}' loaded and analyzed successfully.",
        "option": opt_key,
        "document_id": doc_id,
        "analysis_id": analysis_result["id"],
        "analysis": analysis_result
    }

@app.post("/api/demo/reset")
def reset_demo():
    """Reset all documents, analyses, and findings to allow repeat demonstrations."""
    reset_db_data()
    return {"message": "All demo documents, analyses, and findings have been successfully reset."}

# Mount static build files if frontend/dist exists
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
