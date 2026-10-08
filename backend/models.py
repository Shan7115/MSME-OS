from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class FindingItem(BaseModel):
    id: str
    title: str
    category: str
    severity: str  # Critical, High, Medium, Low
    confidence: str  # High, Medium, Low
    evidence: str
    source_reference: str
    why_it_matters: str
    recommendation: str
    expected_outcome: str
    effort: str  # Low, Medium, High
    time_horizon: str  # Immediate (0-30d), Near-term (31-60d), Strategic (61-90d)
    status: str = "Open"  # Open, In Progress, Resolved

class FindingStatusUpdate(BaseModel):
    status: str  # Open, In Progress, Resolved

class ScoreDimension(BaseModel):
    name: str
    score: int
    max_score: int = 100
    status: str  # Strong, Moderate, Vulnerable
    note: str

class PlanAction(BaseModel):
    id: str
    horizon: str  # 0-30 Days, 31-60 Days, 61-90 Days
    action: str
    reason: str
    expected_outcome: str
    effort: str
    finding_id: Optional[str] = None

class AnalysisResult(BaseModel):
    id: str
    document_id: str
    created_at: str
    business_name: str
    business_sector: str
    document_type: str
    overall_score: int
    score_explanation: str
    score_breakdown: List[ScoreDimension]
    summary: str
    strengths: List[Dict[str, str]]
    findings: List[FindingItem]
    opportunities: List[Dict[str, str]]
    recommendations: List[Dict[str, str]]
    next_steps: List[str]
    plan_30_60_90: Dict[str, List[PlanAction]]

class DocumentInfo(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size: int
    uploaded_at: str
    status: str
    page_count: int = 1
    source_reference: Optional[str] = None

class ValidationFeedbackCreate(BaseModel):
    participant_type: str
    understanding: str
    usefulness: int = Field(..., ge=1, le=5)
    clarity: int = Field(..., ge=1, le=5)
    trust: int = Field(..., ge=1, le=5)
    intent_to_use: str  # Yes, Maybe, No
    most_useful: Optional[str] = ""
    biggest_concern: Optional[str] = ""
    changes: Optional[str] = ""
    additional_feedback: Optional[str] = ""

class ValidationFeedbackOut(ValidationFeedbackCreate):
    id: str
    created_at: str

class ValidationMetrics(BaseModel):
    participant_count: int
    avg_usefulness: float
    avg_clarity: float
    avg_trust: float
    intent_yes_count: int
    intent_maybe_count: int
    intent_no_count: int
    recent_feedback: List[ValidationFeedbackOut]
