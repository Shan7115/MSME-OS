import os
import sys
import unittest
from starlette.testclient import TestClient

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from backend.database import init_db, reset_db_data

class TestMSMEOS2API(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        reset_db_data(include_validation=True)
        cls.client = TestClient(app)
        cls.demo_pdf_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "sample-data",
            "demo-document.pdf"
        )

    def test_01_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["database"], "sqlite_connected")

    def test_02_dashboard_empty_state(self):
        reset_db_data()
        response = self.client.get("/api/dashboard")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["documents_count"], 0)
        self.assertEqual(data["has_analysis"], False)
        self.assertIsNone(data["overall_score"])

    def test_03_file_upload_validation(self):
        # 1. Reject unsupported extension
        res_bad_ext = self.client.post(
            "/api/documents/upload",
            files={"file": ("malicious.exe", b"binarycontent", "application/octet-stream")}
        )
        self.assertEqual(res_bad_ext.status_code, 400)
        self.assertIn("Unsupported file type", res_bad_ext.json()["detail"])

        # 2. Reject empty file
        res_empty = self.client.post(
            "/api/documents/upload",
            files={"file": ("empty.pdf", b"", "application/pdf")}
        )
        self.assertEqual(res_empty.status_code, 400)
        self.assertIn("empty", res_empty.json()["detail"].lower())

    def test_04_valid_pdf_upload_and_extraction(self):
        self.assertTrue(os.path.exists(self.demo_pdf_path), "Demo PDF should exist")
        with open(self.demo_pdf_path, "rb") as f:
            pdf_bytes = f.read()

        response = self.client.post(
            "/api/documents/upload",
            files={"file": ("demo-document.pdf", pdf_bytes, "application/pdf")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["id"].startswith("doc-"))
        self.assertEqual(data["filename"], "demo-document.pdf")
        self.assertGreaterEqual(data["page_count"], 5)
        self.__class__.uploaded_doc_id = data["id"]

    def test_05_analyze_document_and_evidence(self):
        doc_id = self.__class__.uploaded_doc_id
        response = self.client.post(f"/api/documents/{doc_id}/analyze")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("overall_score", data)
        self.assertGreater(data["overall_score"], 0)
        self.assertIn("findings", data)
        self.assertGreater(len(data["findings"]), 0)

        # Verify evidence model
        first_finding = data["findings"][0]
        self.assertIn("evidence", first_finding)
        self.assertIn("source_reference", first_finding)
        self.assertIn("why_it_matters", first_finding)
        self.assertIn("recommendation", first_finding)
        self.assertTrue(len(first_finding["evidence"]) > 10)
        self.assertTrue(len(first_finding["source_reference"]) > 3)

        self.__class__.analysis_id = data["id"]
        self.__class__.sample_finding_id = first_finding["id"]

    def test_06_finding_status_update(self):
        finding_id = self.__class__.sample_finding_id
        res_patch = self.client.patch(
            f"/api/findings/{finding_id}",
            json={"status": "In Progress"}
        )
        self.assertEqual(res_patch.status_code, 200)
        self.assertEqual(res_patch.json()["status"], "In Progress")

        # Verify in findings query
        res_list = self.client.get(f"/api/findings?status=In Progress")
        self.assertEqual(res_list.status_code, 200)
        items = res_list.json()
        self.assertTrue(any(f["id"] == finding_id for f in items))

    def test_07_validation_feedback_workflow(self):
        feedback_payload = {
            "participant_type": "MSME Owner",
            "understanding": "Automated MSME business diagnostic and decision support tool",
            "usefulness": 5,
            "clarity": 5,
            "trust": 4,
            "intent_to_use": "Yes",
            "most_useful": "Evidence linked to specific project report pages and working capital alerts",
            "biggest_concern": "Need direct integration with GST portal",
            "changes": "Add Tamil language translation",
            "additional_feedback": "Extremely clear and actionable analysis."
        }
        res_submit = self.client.post("/api/validation/feedback", json=feedback_payload)
        self.assertEqual(res_submit.status_code, 200)

        # Retrieve metrics
        res_get = self.client.get("/api/validation/feedback")
        self.assertEqual(res_get.status_code, 200)
        stats = res_get.json()
        self.assertGreaterEqual(stats["participant_count"], 1)
        self.assertEqual(stats["avg_usefulness"], 5.0)
        self.assertEqual(stats["intent_yes_count"], 1)

    def test_08_business_model_and_roadmap(self):
        res_bm = self.client.get("/api/business-model")
        self.assertEqual(res_bm.status_code, 200)
        bm_data = res_bm.json()
        self.assertIn("value_proposition", bm_data)
        self.assertIn("pricing_tiers", bm_data)

        res_rm = self.client.get("/api/roadmap")
        self.assertEqual(res_rm.status_code, 200)
        rm_data = res_rm.json()
        self.assertIn("phases", rm_data)

    def test_09_demo_load_and_reset(self):
        # Reset data
        res_reset = self.client.post("/api/demo/reset")
        self.assertEqual(res_reset.status_code, 200)

        # Load demo directly
        res_load = self.client.post("/api/demo/load")
        self.assertEqual(res_load.status_code, 200)
        demo_data = res_load.json()
        self.assertIn(demo_data["document_id"], ["doc-demo-agro-foods", "doc-demo-murugan-spices"])
        self.assertIn("analysis", demo_data)

        # Check dashboard has populated demo data
        res_dash = self.client.get("/api/dashboard")
        self.assertEqual(res_dash.status_code, 200)
        dash_data = res_dash.json()
        self.assertEqual(dash_data["has_analysis"], True)
        self.assertEqual(dash_data["business_name"], "Sri Murugan Agro Foods & Spices Pvt. Ltd.")

    def test_10_frontend_static_serving(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("MSMEOS2", response.text)

if __name__ == "__main__":
    unittest.main()
