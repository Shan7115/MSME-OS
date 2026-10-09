import React from 'react';
import { Printer } from 'lucide-react';
import { ICON, PageHead, Ref, Severity } from './ui';

const HORIZONS = [
  { key: '0-30 Days', label: '0–30 days', note: 'Immediate' },
  { key: '31-60 Days', label: '31–60 days', note: 'Near term' },
  { key: '61-90 Days', label: '61–90 days', note: 'Strategic' },
];

export default function ReportsView({ analysis, onNavigate }) {
  if (!analysis) {
    return (
      <>
        <PageHead title="Report" />
        <div className="panel empty">
          <h2>No report yet</h2>
          <p>Review a document first. The report is the printable version of that review.</p>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('documents')}>Go to documents</button>
          </div>
        </div>
      </>
    );
  }

  const plan = analysis.plan_30_60_90 || {};
  const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <PageHead
        title="Report"
        actions={<button className="btn btn-primary" onClick={() => window.print()}><Printer {...ICON} /> Print or save as PDF</button>}
      >
        A printable version of the review, for a credit committee or a client meeting.
      </PageHead>

      <article className="sheet">
        <div className="sheet-head">
          <div>
            <div className="sheet-kicker">Credit dossier review · {date}</div>
            <h1>{analysis.business_name}</h1>
            <p className="muted" style={{ marginTop: 8 }}>{[analysis.business_sector, analysis.document_type].filter(Boolean).join(' · ')}</p>
          </div>
          <div className="sheet-score">
            <b>{analysis.overall_score}</b>
            <small>out of 100</small>
          </div>
        </div>

        <section>
          <h2>Summary</h2>
          <p className="lead">{analysis.summary}</p>
        </section>

        <section>
          <h2>Scores by area</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Area</th><th className="r">Score</th><th>Rating</th><th>Basis</th></tr></thead>
              <tbody>
                {(analysis.score_breakdown || []).map((d) => (
                  <tr key={d.name}>
                    <td style={{ color: 'var(--ink)', fontWeight: 550 }}>{d.name}</td>
                    <td className="r num">{d.score}</td>
                    <td><span className={`tag ${d.status === 'Vulnerable' ? 'tag-crit' : d.status === 'Moderate' ? 'tag-warn' : 'tag-ok'}`}>{d.status}</span></td>
                    <td className="muted">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Strengths and opportunities</h2>
          <div className="two">
            <div>
              <div className="block-label">Strengths</div>
              <ul className="plain">
                {(analysis.strengths || []).map((s, i) => <li key={i}><strong>{s.title}</strong><span>{s.detail}</span></li>)}
              </ul>
            </div>
            <div>
              <div className="block-label">Opportunities</div>
              <ul className="plain">
                {(analysis.opportunities || []).map((o, i) => <li key={i}><strong>{o.title}</strong><span>{o.detail}</span></li>)}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>Findings</h2>
          {(analysis.findings || []).map((f) => (
            <div key={f.id} className="find">
              <div className="find-head">
                <strong>{f.title}</strong>
                <Severity level={f.severity} />
              </div>
              <div className="quote">
                <p style={{ fontSize: 14 }}>“{f.evidence}”</p>
                <Ref value={f.source_reference} />
              </div>
              <div className="find-cols">
                <div><b>Why it matters</b>{f.why_it_matters}</div>
                <div><b>Recommended action</b>{f.recommendation}</div>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2>30/60/90-day plan</h2>
          <div className="horizons">
            {HORIZONS.map((h) => (
              <div key={h.key} className="horizon">
                <h3>{h.label} <span className="faint" style={{ fontWeight: 400 }}>· {h.note}</span></h3>
                <ul>
                  {(plan[h.key] || []).map((a, i) => (
                    <li key={a.id || i}><strong>{a.action}</strong><span>{a.expected_outcome}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer>
          This is an automated, indicative review based only on the document that was uploaded. It is not a statutory audit,
          legal opinion, tax advice or a credit sanction. Lending terms depend on the bank's own inspection and credit committee.
        </footer>
      </article>
    </>
  );
}
