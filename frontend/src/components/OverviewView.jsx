import React from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  FileCheck2, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Building2,
  ExternalLink
} from 'lucide-react';

export default function OverviewView({ dashboardData, analysis, onNavigate, onRunDemo }) {
  if (!dashboardData || (!dashboardData.has_analysis && !analysis)) {
    return (
      <div className="overview-container">
        <div className="page-header">
          <div className="page-title">
            <h2>Executive Decision Dashboard</h2>
            <p>Welcome to MSMEOS2. Upload a business report or execute the bundled demo to view diagnostics.</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={onRunDemo}>
              <Sparkles size={16} />
              <span>Launch Demo Analysis</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '100px 40px', maxWidth: '700px', margin: '40px auto' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            border: '1px solid var(--border-subtle)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px auto',
            color: 'var(--primary)'
          }}>
            <FileCheck2 size={24} />
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '12px', letterSpacing: '-0.02em' }}>No Diagnostic Results Ingested Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '520px', margin: '0 auto 36px auto', lineHeight: '1.6' }}>
            MSMEOS2 analyzes unstructured business documents (project profiles, loan dossiers, financial schedules) and produces evidence-backed risk analysis, scoring, and 30/60/90-day action frameworks.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button className="btn btn-primary" onClick={onRunDemo}>
              <Sparkles size={16} />
              <span>Analyze Demo Dossier</span>
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('analyze')}>
              <span>Upload Custom Document</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const businessName = analysis?.business_name || dashboardData.business_name || 'Enterprise Diagnostic';
  const businessSector = analysis?.business_sector || dashboardData.business_sector || 'MSME Enterprise';
  const documentType = analysis?.document_type || 'Credit Appraisal Dossier';
  const score = analysis?.overall_score ?? dashboardData.overall_score ?? 0;
  const scoreBreakdown = analysis?.score_breakdown || dashboardData.score_breakdown || [];
  const scoreExplanation = analysis?.score_explanation || dashboardData.score_explanation || '';
  const topFindings = (analysis?.findings || dashboardData.top_findings || []).slice(0, 3);
  const priorityRecs = (analysis?.recommendations || dashboardData.priority_recommendations || []).slice(0, 3);
  const criticalCount = analysis?.findings 
    ? analysis.findings.filter(f => f.severity === 'Critical' && f.status !== 'Resolved').length 
    : (dashboardData.critical_findings_count || 0);

  const getScoreStatus = (s) => {
    if (s >= 75) return { label: 'Strong Solvency', sub: 'Healthy balance sheet & operational resilience' };
    if (s >= 55) return { label: 'Moderate Posture', sub: 'Viable operations with working capital stress' };
    return { label: 'Vulnerable Position', sub: 'High risk exposure requiring immediate remediation' };
  };

  const statusInfo = getScoreStatus(score);

  return (
    <div className="overview-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Executive Decision Dashboard</h2>
          <p>
            Automated diagnostic appraisal for <strong>{businessName}</strong>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => onNavigate('reports')}>
            <span>View Executive Report</span>
            <ExternalLink size={15} />
          </button>
        </div>
      </div>

      {/* Enterprise Snapshot Banner */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '24px 0',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} style={{ color: 'var(--text-main)' }} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {businessName}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
              Sector: {businessSector} <span style={{ margin: '0 8px', color: 'var(--border-subtle)' }}>|</span> Document: {documentType}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className={`badge ${score >= 70 ? 'badge-resolved' : (score >= 50 ? 'badge-medium' : 'badge-critical')}`}>
            {statusInfo.label}
          </span>
          <span className="badge badge-low">
            Verified Citations
          </span>
          {criticalCount > 0 && (
            <span className="badge badge-critical">
              {criticalCount} Critical Alert{criticalCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* High-level metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Overall Readiness Score</div>
          <div className="stat-value" style={{ color: score < 55 ? '#ef4444' : (score < 75 ? '#f59e0b' : '#10b981') }}>
            {score}<span style={{ fontSize: '16px', color: 'var(--text-dim)' }}>/100</span>
          </div>
          <div className="stat-sub">{statusInfo.sub}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Critical Findings</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {dashboardData.critical_findings_count}
          </div>
          <div className="stat-sub">Customer concentration & CC utilization alerts</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Priority Next Steps</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {dashboardData.high_priority_actions_count}
          </div>
          <div className="stat-sub">Derived from document evidence citations</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Documents Processed</div>
          <div className="stat-value" style={{ color: '#ffffff' }}>
            {dashboardData.documents_count}
          </div>
          <div className="stat-sub">Single enterprise appraisal dossier</div>
        </div>
      </div>

      {/* Diagnostic Score Cockpit */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '48px', 
        padding: '40px 0', 
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '40px' 
      }}>
        <div className="score-gauge-wrapper">
          <svg className="score-gauge-svg" viewBox="0 0 110 110">
            <defs>
              <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor={score >= 70 ? "#10b981" : (score >= 50 ? "#f59e0b" : "#ef4444")} />
              </linearGradient>
            </defs>
            <circle cx="55" cy="55" r="46" className="score-gauge-bg" />
            <circle 
              cx="55" 
              cy="55" 
              r="46" 
              className="score-gauge-meter"
              stroke="url(#scoreGaugeGrad)"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - Math.min(100, Math.max(0, score)) / 100)}
            />
          </svg>
          <div className="score-gauge-center">
            <div className="score-number">{score}</div>
            <div className="score-max">OUT OF 100</div>
          </div>
        </div>

        <div className="score-details" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3>Diagnostic Health Evaluation</h3>
            <span className={`badge ${score >= 70 ? 'badge-resolved' : (score >= 50 ? 'badge-medium' : 'badge-critical')}`} style={{ fontSize: '11px' }}>
              {statusInfo.label}
            </span>
          </div>
          <p>{scoreExplanation}</p>
        </div>
      </div>

      {/* 6 Diagnostic Pillars Evaluation Matrix */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>Diagnostic Dimension Evaluation</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Audited health across core MSME operational and financial pillars</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {scoreBreakdown.map((item, idx) => {
            const isVulnerable = item.status === 'Vulnerable';
            const isModerate = item.status === 'Moderate';
            const badgeClass = isVulnerable ? 'badge-critical' : (isModerate ? 'badge-medium' : 'badge-low');
            const barColor = isVulnerable ? '#ef4444' : (isModerate ? '#f59e0b' : '#10b981');
            return (
              <div key={idx} className="pillar-meter">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>{item.name}</span>
                  <span className={`badge ${badgeClass}`} style={{ fontSize: '10px', padding: '1px 6px' }}>{item.score}% • {item.status}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.45' }}>{item.note}</div>
                <div className="pillar-bar-track">
                  <div className="pillar-bar-fill" style={{ width: `${item.score}%`, backgroundColor: barColor }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column layout: Top Findings & Priority Next Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px' }}>
        {/* Top Critical Findings */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>Critical Evidence Signals</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Highest severity risks extracted directly from page references</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('findings')}>
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topFindings.map((f) => (
              <div key={f.id} className="finding-card" onClick={() => onNavigate('findings')}>
                <div className="finding-card-header">
                  <span className={`badge badge-${f.severity.toLowerCase()}`}>{f.severity}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{f.category}</span>
                </div>
                <div className="finding-title">{f.title}</div>
                <div className="evidence-box">
                  <div className="evidence-label">Document Citation:</div>
                  <div>"{f.evidence}"</div>
                  <div className="source-tag">Ref: {f.source_reference}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action Framework */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>Priority Recommendations</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Derived next actions with expected liquidity & risk outcomes</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('reports')}>
              <span>Full Plan</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {priorityRecs.map((rec, i) => (
              <div key={i} style={{ 
                borderBottom: i !== priorityRecs.length - 1 ? '1px solid var(--border-subtle)' : 'none', 
                paddingBottom: i !== priorityRecs.length - 1 ? '16px' : '0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-open" style={{ fontSize: '10px' }}>{rec.priority || 'P0'}</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>Horizon: {rec.time_horizon}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff', marginBottom: '6px', lineHeight: '1.4' }}>
                  {rec.action}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  <strong style={{ color: '#ffffff', fontWeight: '500' }}>Expected Impact:</strong> {rec.expected_outcome}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
