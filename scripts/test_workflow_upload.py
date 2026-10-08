import os
import sys
import json
import urllib.request
import urllib.error
import urllib.parse
from io import BytesIO

BASE_URL = "http://127.0.0.1:8000"

def request_json(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    req_data = None
    if data is not None:
        if isinstance(data, (dict, list)):
            req_data = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        elif isinstance(data, bytes):
            req_data = data
        else:
            req_data = data.encode("utf-8")
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, {"error": err_body}

def upload_multipart(url, field_name, filename, file_bytes, content_type="application/octet-stream"):
    boundary = "----WebKitFormBoundaryMSMEOS2WorkflowTest7MA4YWxkTrZu0gW"
    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    }
    req = urllib.request.Request(url, data=bytes(body), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run_workflow_audit():
    print("=================================================================")
    print(" MSMEOS2 WORKFLOW AUDIT & ARBITRARY UPLOAD VERIFICATION")
    print("=================================================================")

    # Step 1: Health check
    status, health = request_json(f"{BASE_URL}/api/health")
    assert status == 200, f"Health check failed with {status}"
    print(f"[PASS] 1. API Health Check OK: {health['status']}")

    # Step 2: Reset database to clean state
    status, reset_res = request_json(f"{BASE_URL}/api/demo/reset", method="POST")
    assert status == 200, f"Reset failed: {reset_res}"
    print("[PASS] 2. System clean state initialized via /api/demo/reset")

    # Step 3: Run Bundled Demo
    status, demo_res = request_json(f"{BASE_URL}/api/demo/load", method="POST")
    assert status == 200, f"Demo load failed: {demo_res}"
    demo_analysis = demo_res["analysis"]
    print(f"[PASS] 3. Bundled Demo Loaded: '{demo_analysis['business_name']}'")
    print(f"       Score: {demo_analysis['overall_score']}/100, Findings: {len(demo_analysis['findings'])}")
    assert "Sri Murugan" in demo_analysis["business_name"]
    assert demo_analysis["overall_score"] > 0
    assert len(demo_analysis["findings"]) >= 5

    # Step 4: Create a realistic custom PDF for an entirely different company
    # Company: Surya Prakash Solar Tech Solutions Pvt. Ltd. (Renewable energy MSME)
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    
    pdf_buffer = BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    
    # Page 1
    c.setFont("Helvetica-Bold", 16)
    c.drawString(54, 730, "DETAILED PROJECT APPRAISAL REPORT")
    c.setFont("Helvetica", 11)
    c.drawString(54, 705, "Enterprise Name: Surya Prakash Solar Tech Solutions Pvt. Ltd.")
    c.drawString(54, 685, "Primary Activity: Commercial Solar Rooftop and Inverter Manufacturing")
    c.drawString(54, 665, "Location: Peenya Industrial Estate, Bengaluru, Karnataka")
    c.drawString(54, 645, "Audited Turnover: FY24 Revenue INR 245.80 Lakhs with 18.5% operating EBITDA margin.")
    c.drawString(54, 620, "Promoter experience: 14 years in commercial electrical and rooftop power installations.")
    c.showPage()
    
    # Page 2
    c.setFont("Helvetica-Bold", 14)
    c.drawString(54, 730, "OPERATIONS & WORKING CAPITAL LIQUIDITY REVIEW")
    c.setFont("Helvetica", 11)
    c.drawString(54, 700, "Cash credit facility of INR 50.00 Lakhs operates under severe stress.")
    c.drawString(54, 680, "Due to 92-day delayed payments from EPC contractors, drawing power utilization has touched 94.2%.")
    c.drawString(54, 655, "Customer concentration: Single infrastructure buyer Apex EPC Infra accounts for 42.5% of annual revenue.")
    c.drawString(54, 630, "Operational bottleneck: Inverter PCB testing rig capacity limits factory throughput to 150 units/month.")
    c.showPage()
    
    # Page 3
    c.setFont("Helvetica-Bold", 14)
    c.drawString(54, 730, "STATUTORY COVENANTS & CAPITAL EXPENDITURE SCHEDULE")
    c.setFont("Helvetica", 11)
    c.drawString(54, 700, "Capital investment requires promoter contribution of INR 20.00 Lakhs, leaving a promoter equity shortfall of INR 6.50 Lakhs.")
    c.drawString(54, 675, "Statutory audit flagged unmitigated compliance gap: Factory expansion constructed without updated PCB consent to operate renewal.")
    c.drawString(54, 650, "Total proposed machinery capex is INR 65.00 Lakhs for automatic SMD pick-and-place line.")
    c.showPage()
    
    c.save()
    custom_pdf_bytes = pdf_buffer.getvalue()

    # Step 5: Upload Custom PDF via POST /api/documents/upload
    status, upload_res = upload_multipart(
        f"{BASE_URL}/api/documents/upload",
        field_name="file",
        filename="Surya_Prakash_Solar_Project_Report.pdf",
        file_bytes=custom_pdf_bytes,
        content_type="application/pdf"
    )
    assert status == 200, f"Upload failed with status {status}: {upload_res}"
    custom_doc_id = upload_res["id"]
    print(f"[PASS] 4. Custom PDF Uploaded Successfully: doc_id={custom_doc_id}, pages={upload_res['page_count']}")

    # Step 6: Trigger Analysis for Custom PDF
    status, custom_analysis = request_json(f"{BASE_URL}/api/documents/{custom_doc_id}/analyze", method="POST")
    assert status == 200, f"Analysis failed: {custom_analysis}"
    print(f"[PASS] 5. Custom Document Analysis Complete:")
    print(f"       Business Name: '{custom_analysis['business_name']}'")
    print(f"       Business Sector: '{custom_analysis['business_sector']}'")
    print(f"       Document Type: '{custom_analysis['document_type']}'")
    print(f"       Overall Score: {custom_analysis['overall_score']}/100")
    print(f"       Total Findings: {len(custom_analysis['findings'])}")

    # Verify that it is NOT defaulting to Sri Murugan
    assert "Sri Murugan" not in custom_analysis["business_name"], "ERROR: Analysis defaulted to demo company!"
    assert "Solar" in custom_analysis["business_name"] or "Surya" in custom_analysis["business_name"], "Expected solar company name"
    assert "Solar" in custom_analysis["business_sector"] or "Renewable" in custom_analysis["business_sector"], "Expected solar sector"
    
    # Verify that evidence has real page citations
    for f in custom_analysis["findings"]:
        print(f"       - [{f['severity']}] {f['title']} -> Citation: {f['source_reference']}")
        print(f"         Evidence: \"{f['evidence'][:80]}...\"")
        assert "Page" in f["source_reference"], "Finding missing page citation"
        assert len(f["evidence"]) > 10, "Finding missing textual evidence"

    # Step 7: Test Dashboard with target analysis_id
    status, dash_custom = request_json(f"{BASE_URL}/api/dashboard?analysis_id={custom_analysis['id']}")
    assert status == 200
    assert dash_custom["business_name"] == custom_analysis["business_name"]
    print(f"[PASS] 6. Dashboard dynamically reflects custom document when queried by analysis_id")

    # Step 8: Test Findings query with target analysis_id
    status, findings_custom = request_json(f"{BASE_URL}/api/findings?analysis_id={custom_analysis['id']}")
    assert status == 200
    assert len(findings_custom) == len(custom_analysis["findings"])
    print(f"[PASS] 7. Findings filter correctly isolates {len(findings_custom)} findings for custom analysis")

    # Step 9: Test Updating a Finding Status
    first_finding_id = findings_custom[0]["id"]
    status, patch_res = request_json(
        f"{BASE_URL}/api/findings/{first_finding_id}",
        method="PATCH",
        data={"status": "In Progress"}
    )
    assert status == 200
    assert patch_res["status"] == "In Progress"
    print(f"[PASS] 8. Finding status updated to 'In Progress' for id={first_finding_id}")

    # Step 10: Test Uploading another format (Text File: Engineering MSME)
    txt_content = """
Kavitha Precision CNC Engineering Works
Address: SIDCO Industrial Estate, Ambattur, Chennai
Enterprise: Micro Enterprise manufacturing automotive machined fasteners.

FINANCIAL APPRAISAL & TURNOVER:
Audited FY24 Revenue: INR 88.40 Lakhs with net profit margin of 6.2%.
Order book secured from tier-1 automotive suppliers for INR 45 Lakhs.

RISK FACTORS & LIQUIDITY STRAIN:
Cash credit drawing power is 91% utilized against sanctioned INR 15 Lakhs limit.
Top customer concentration: 48% of total machined components supplied exclusively to Lucas TVS vendor cluster.
Machinery downtime: CNC turning center experiences 18% idle time due to lack of trained operators.
Statutory gap: Periodic calibration certification for micrometer instruments is pending renewal.
    """.strip().encode("utf-8")

    status, upload_txt = upload_multipart(
        f"{BASE_URL}/api/documents/upload",
        field_name="file",
        filename="Kavitha_CNC_Profile.txt",
        file_bytes=txt_content,
        content_type="text/plain"
    )
    assert status == 200, f"TXT Upload failed: {upload_txt}"
    txt_doc_id = upload_txt["id"]
    print(f"[PASS] 9. Text Document Ingested: doc_id={txt_doc_id}")

    status, txt_analysis = request_json(f"{BASE_URL}/api/documents/{txt_doc_id}/analyze", method="POST")
    assert status == 200
    print(f"[PASS] 10. Text Document Analyzed:")
    print(f"       Business Name: '{txt_analysis['business_name']}'")
    print(f"       Sector: '{txt_analysis['business_sector']}'")
    print(f"       Findings: {len(txt_analysis['findings'])}")
    assert "Kavitha" in txt_analysis["business_name"]

    print("\n=================================================================")
    print(" ALL 10/10 WORKFLOW & ARBITRARY UPLOAD VERIFICATION TESTS PASSED!")
    print("=================================================================")

if __name__ == "__main__":
    run_workflow_audit()
