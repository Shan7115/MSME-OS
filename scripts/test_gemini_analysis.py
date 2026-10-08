import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from google import genai
from backend.extractor import extract_document
from backend.providers import get_analysis_provider

load_dotenv()
doc_path = os.path.join(os.path.dirname(__file__), "..", "sample-data", "demo-document.pdf")
with open(doc_path, "rb") as f:
    doc = extract_document("demo-document.pdf", f.read())

provider = get_analysis_provider()
result = provider.analyze(doc)

print("Analysis ID:", result.get("id"))
print("Business Name:", result.get("business_name"))
print("Overall Score:", result.get("overall_score"))
print("Findings Count:", len(result.get("findings", [])))
print("Strengths Count:", len(result.get("strengths", [])))
print("Recommendations Count:", len(result.get("recommendations", [])))
print("Plan 30/60/90 Keys:", list(result.get("plan_30_60_90", {}).keys()))

# Check first finding
if result.get("findings"):
    f0 = result["findings"][0]
    print("Finding 1 Title:", f0.get("title"))
    print("Finding 1 Category:", f0.get("category"))
    print("Finding 1 Severity:", f0.get("severity"))
    print("Finding 1 Evidence:", f0.get("evidence")[:100], "...")
    print("Finding 1 Source:", f0.get("source_reference"))
