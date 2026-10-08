import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Star, 
  Send, 
  Users, 
  ThumbsUp, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function ValidationView({ validationData, onSubmitFeedback }) {
  const [participantType, setParticipantType] = useState('MSME Owner');
  const [understanding, setUnderstanding] = useState('');
  const [usefulness, setUsefulness] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [trust, setTrust] = useState(5);
  const [intentToUse, setIntentToUse] = useState('Yes');
  const [mostUseful, setMostUseful] = useState('');
  const [biggestConcern, setBiggestConcern] = useState('');
  const [changes, setChanges] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmitFeedback({
      participant_type: participantType,
      understanding,
      usefulness,
      clarity,
      trust,
      intent_to_use: intentToUse,
      most_useful: mostUseful,
      biggest_concern: biggestConcern,
      changes,
      additional_feedback: additionalFeedback
    });
    setIsSubmitting(false);
    setSubmittedSuccess(true);
    // Reset fields
    setUnderstanding('');
    setMostUseful('');
    setBiggestConcern('');
    setChanges('');
    setAdditionalFeedback('');
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const hasResponses = validationData && validationData.participant_count > 0;

  return (
    <div className="validation-container">
      <div className="page-header">
        <div className="page-title">
          <h2>User & Stakeholder Validation Hub</h2>
          <p>
            Authentic customer feedback mechanism and live validation metrics per PRD Section 35.
          </p>
        </div>
      </div>

      {/* Validation Metrics Banner */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Verified Responses</div>
          <div className="stat-value" style={{ color: '#ffffff' }}>
            {validationData ? validationData.participant_count : 0}
          </div>
          <div className="stat-sub">
            {hasResponses ? 'Live stakeholder responses recorded' : 'No validation responses recorded yet'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Usefulness</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {hasResponses ? validationData.avg_usefulness.toFixed(1) : '—'}<span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>/5.0</span>
          </div>
          <div className="stat-sub">Actionability of findings & 30/60/90 plan</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Clarity</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {hasResponses ? validationData.avg_clarity.toFixed(1) : '—'}<span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>/5.0</span>
          </div>
          <div className="stat-sub">Separation of facts from recommendations</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Trust Rating</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {hasResponses ? validationData.avg_trust.toFixed(1) : '—'}<span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>/5.0</span>
          </div>
          <div className="stat-sub">Confidence in document-backed citations</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
        
        {/* Feedback Collection Form */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Record Stakeholder Feedback</div>
              <div className="card-subtitle">Collect feedback from MSME owners, accountants, or advisors</div>
            </div>
          </div>

          {submittedSuccess && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              border: '1px solid #10b981', 
              color: '#86efac', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}>
              <CheckCircle2 size={16} />
              <span>Feedback recorded and added to verification analytics.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Stakeholder Category */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Stakeholder Profile / Professional Role
              </label>
              <select 
                className="form-select"
                value={participantType} 
                onChange={(e) => setParticipantType(e.target.value)}
              >
                <option value="MSME Owner">MSME Owner / Enterprise Promoter</option>
                <option value="Accountant">Chartered Accountant / Tax Practitioner</option>
                <option value="Business Advisor">MSME Credit Advisor / Financial Consultant</option>
                <option value="Student/Research Participant">Academic / Research Evaluator</option>
                <option value="Other">Other Institutional Stakeholder</option>
              </select>
            </div>

            {/* Core Product Comprehension */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                1. What do you understand this product does?
              </label>
              <input 
                type="text" 
                required
                className="form-control"
                placeholder="e.g. Extracts financial signals from reports to highlight credit risks and generate 30/60/90-day remedies"
                value={understanding} 
                onChange={(e) => setUnderstanding(e.target.value)}
              />
            </div>

            {/* Quantitative 1-5 Star Ratings */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  2. Usefulness ({usefulness}/5)
                </label>
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => setUsefulness(star)}
                      title={`${star} Star`}
                    >
                      <Star 
                        size={18} 
                        fill={star <= usefulness ? '#f59e0b' : 'transparent'} 
                        stroke={star <= usefulness ? '#f59e0b' : 'var(--text-dim)'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  3. Clarity ({clarity}/5)
                </label>
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => setClarity(star)}
                      title={`${star} Star`}
                    >
                      <Star 
                        size={18} 
                        fill={star <= clarity ? '#3b82f6' : 'transparent'} 
                        stroke={star <= clarity ? '#3b82f6' : 'var(--text-dim)'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  4. Trust ({trust}/5)
                </label>
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => setTrust(star)}
                      title={`${star} Star`}
                    >
                      <Star 
                        size={18} 
                        fill={star <= trust ? '#8b5cf6' : 'transparent'} 
                        stroke={star <= trust ? '#8b5cf6' : 'var(--text-dim)'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Intent to use */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                5. Would you pilot or adopt this for your business / clientele?
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Yes', 'Maybe', 'No'].map((opt) => (
                  <button 
                    key={opt}
                    type="button"
                    className={`btn btn-sm ${intentToUse === opt ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '8px', fontSize: '12.5px' }}
                    onClick={() => setIntentToUse(opt)}
                  >
                    {opt === 'Yes' ? '✓ Yes, Definitely' : opt === 'Maybe' ? '• Possibly / Evaluating' : '✕ No'}
                  </button>
                ))}
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                6. Most valuable capability observed:
              </label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Page citations and prioritized 30/60/90-day debt remediation"
                value={mostUseful} 
                onChange={(e) => setMostUseful(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                7. Identified risks, missing features, or suggested additions:
              </label>
              <textarea 
                className="form-textarea"
                rows={3}
                placeholder="e.g. Direct GST portal sync, vernacular Hindi/Tamil reporting, or bank loan eligibility matrix"
                value={biggestConcern} 
                onChange={(e) => setBiggestConcern(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: '6px', padding: '12px 18px', width: '100%' }}
              disabled={isSubmitting}
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Recording Feedback...' : 'Submit Stakeholder Verification'}</span>
            </button>
          </form>
        </div>

        {/* Live Verified Responses Stream */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Verified Feedback Stream</div>
              <div className="card-subtitle">Real feedback recorded without simulation or fabrication</div>
            </div>
          </div>

          {!hasResponses ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', fontSize: '13px' }}>
              <Users size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <p>No validation responses recorded yet.</p>
              <p style={{ fontSize: '11.5px', marginTop: '6px' }}>Submit feedback using the form to populate real validation data.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '550px', overflowY: 'auto' }}>
              {(validationData.feedbacks || []).map((fb) => (
                <div key={fb.id} style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '14px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="badge badge-open" style={{ fontSize: '10px' }}>{fb.participant_type}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      Pilot Intent: <strong>{fb.intent_to_use}</strong>
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#f1f5f9', marginBottom: '8px' }}>
                    "{fb.understanding}"
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    <span>Usefulness: <strong>{fb.usefulness}/5</strong></span>
                    <span>Clarity: <strong>{fb.clarity}/5</strong></span>
                    <span>Trust: <strong>{fb.trust}/5</strong></span>
                  </div>

                  {fb.most_useful && (
                    <div style={{ fontSize: '11.5px', color: '#60a5fa' }}>
                      <strong>Valued:</strong> {fb.most_useful}
                    </div>
                  )}

                  {fb.biggest_concern && (
                    <div style={{ fontSize: '11.5px', color: '#f59e0b', marginTop: '4px' }}>
                      <strong>Feedback:</strong> {fb.biggest_concern}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
