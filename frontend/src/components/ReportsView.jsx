import React from 'react';
import { 
  Printer, 
  Download, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function ReportsView({ analysis, onNavigate }) {
  if (!analysis) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '40px auto' }}>
        <FileText size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 16px auto' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No Analysis Available for Reporting</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
          Please upload a document or execute the bundled demo to compile an executive diagnostic report.
        </p>
        <button className="btn btn-primary" onClick={() => onNavigate('analyze')}>
          Go to Analyze Document
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const plan = analysis.plan_30_60_90 || {};

  return (
    <div className="report-container">
      {/* Action header bar (Hidden during print) */}
      <div className="page-header no-print">
        <div className="page-title">
          <h2>Executive Diagnostic Report</h2>
          <p>Board-level diagnostic dossier and 30/60/90-day action blueprint.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="card" style={{ padding: '40px', background: 'var(--bg-card)', maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Document Header */}
        <div style={{ 
          borderBottom: '2px solid var(--border-subtle)', 
          paddingBottom: '24px', 
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>
              MSMEOS2 Executive Decision Intelligence Dossier
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
              {analysis.business_name}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Sector: {analysis.business_sector} • Document: {analysis.document_type}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'inline-flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              background: '#0b111e', 
              border: '2px solid #2563eb', 
              borderRadius: 'var(--radius-md)', 
              padding: '8px 16px' 
            }}>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#60a5fa' }}>
                {analysis.overall_score}<span style={{ fontSize: '14px', color: 'var(--text-dim)' }}>/100</span>
              </div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)' }}>
                Readiness Score
              </div>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '8px' }}>
              Appraisal Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa', marginBottom: '10px' }}>
            1. Executive Diagnostic Summary
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {analysis.summary}
          </p>
        </section>

        {/* 2. Score Breakdown Table */}
        <section style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa', marginBottom: '10px' }}>
            2. Diagnostic Dimension Evaluation
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '8px 12px' }}>Pillar</th>
                  <th style={{ padding: '8px 12px' }}>Rating</th>
                  <th style={{ padding: '8px 12px' }}>Status</th>
                  <th style={{ padding: '8px 12px' }}>Evidence / Audit Notes</th>
                </tr>
              </thead>
              <tbody>
                {(analysis.score_breakdown || []).map((dim, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: '600', color: '#ffffff' }}>{dim.name}</td>
                    <td style={{ padding: '10px 12px', fontWeight: '700' }}>{dim.score}%</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge ${dim.status === 'Vulnerable' ? 'badge-critical' : dim.status === 'Moderate' ? 'badge-medium' : 'badge-low'}`}>
                        {dim.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{dim.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Strengths & Opportunities */}
        <section style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa', marginBottom: '12px' }}>
            3. Commercial Strengths & Strategic Opportunities
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} />
                <span>Demonstrated Enterprise Strengths</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(analysis.strengths || []).map((s, i) => (
                  <div key={i} style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{s.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#60a5fa', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} />
                <span>Strategic Expansion Opportunities</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(analysis.opportunities || []).map((o, i) => (
                  <div key={i} style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{o.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Critical Findings & Evidence */}
        <section style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ef4444', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={15} />
            <span>4. Critical Vulnerabilities & Document Citations</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(analysis.findings || []).map((f) => (
              <div key={f.id} style={{ 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge badge-${f.severity.toLowerCase()}`}>{f.severity}</span>
                    <strong style={{ fontSize: '14px', color: '#ffffff' }}>{f.title}</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{f.category}</span>
                </div>

                <div className="evidence-box">
                  <div className="evidence-label">Document Citation:</div>
                  <div style={{ fontSize: '12.5px', color: '#e2e8f0' }}>"{f.evidence}"</div>
                  <div className="source-tag">Reference: {f.source_reference}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Risk Exposure: </span>
                    <span style={{ color: 'var(--text-muted)' }}>{f.why_it_matters}</span>
                  </div>
                  <div>
                    <span style={{ color: '#60a5fa', fontWeight: '600' }}>Remediation: </span>
                    <span style={{ color: 'var(--text-muted)' }}>{f.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 30/60/90-Day Priority Action Framework */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#60a5fa', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} />
            <span>5. Prioritized 30/60/90-Day Execution Framework</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {['0-30 Days', '31-60 Days', '61-90 Days'].map((horizon) => (
              <div key={horizon} style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '16px' 
              }}>
                <div style={{ 
                  fontSize: '12.5px', 
                  fontWeight: '700', 
                  color: horizon === '0-30 Days' ? '#ef4444' : horizon === '31-60 Days' ? '#f59e0b' : '#3b82f6',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '8px',
                  marginBottom: '10px'
                }}>
                  {horizon} ({horizon === '0-30 Days' ? 'Immediate' : horizon === '31-60 Days' ? 'Near-Term' : 'Strategic'})
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(plan[horizon] || []).map((act, i) => (
                    <div key={act.id || i} style={{ fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '3px' }}>
                        • {act.action}
                      </div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '11px', lineHeight: '1.3' }}>
                        {act.expected_outcome}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statutory Legal Disclaimer */}
        <footer style={{ 
          borderTop: '1px solid var(--border-subtle)', 
          paddingTop: '16px', 
          fontSize: '11px', 
          color: 'var(--text-dim)', 
          lineHeight: '1.5',
          fontStyle: 'italic'
        }}>
          <strong>Statutory Disclaimer:</strong> This document represents an automated indicative diagnostic appraisal generated by MSMEOS2 based strictly on the uploaded source dossier. It does not constitute a formal statutory audit, legal opinion, tax advisory, or guaranteed credit underwriting sanction. Actual lending terms depend on bank inspection and credit committee appraisal.
        </footer>
      </div>
    </div>
  );
}
