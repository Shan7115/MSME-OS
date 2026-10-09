import React from 'react';
import { ArrowRight, FileUp } from 'lucide-react';
import { ICON, PageHead, Ref, Severity, scoreBand } from './ui';

const TONE_VAR = { ok: 'var(--ok)', med: 'var(--med)', crit: 'var(--crit)' };

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="skeleton" style={{ height: 30, width: 320, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 16, width: 420, marginBottom: 32 }} />
      <div className="skeleton" style={{ height: 150, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 280 }} />
    </div>
  );
}

export default function OverviewView({ loaded, dashboardData, analysis, findings, onNavigate }) {
  if (!loaded) return <Skeleton />;

  if (!dashboardData || (!dashboardData.has_analysis && !analysis)) {
    return (
      <>
        <PageHead title="Overview" />
        <div className="panel empty">
          <h2>Start with a credit dossier</h2>
          <p>
            Upload a project report, loan proposal or financial schedule. You get a scored review in which every
            finding quotes the page it came from, plus a 30/60/90-day plan.
          </p>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('documents')}>
              <FileUp {...ICON} /> Add a document
            </button>
          </div>
        </div>
      </>
    );
  }

  const businessName = analysis?.business_name || dashboardData.business_name || 'Untitled dossier';
  const sector = analysis?.business_sector || dashboardData.business_sector;
  const docType = analysis?.document_type;
  const score = analysis?.overall_score ?? dashboardData.overall_score ?? 0;
  const breakdown = analysis?.score_breakdown || dashboardData.score_breakdown || [];
  const explanation = analysis?.score_explanation || dashboardData.score_explanation || '';
  const recs = (analysis?.recommendations || dashboardData.priority_recommendations || []).slice(0, 4);

  const list = findings.length ? findings : analysis?.findings || [];
  const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const attention = [...list]
    .filter((f) => f.status !== 'Resolved')
    .sort((a, b) => (rank[a.severity] ?? 9) - (rank[b.severity] ?? 9))
    .slice(0, 3);
  const count = (s) => list.filter((f) => f.severity === s && f.status !== 'Resolved').length;
  const band = scoreBand(score);

  const tally = ['Critical', 'High', 'Medium']
    .map((s) => ({ s, n: count(s) }))
    .filter((x) => x.n > 0)
    .map((x) => `${x.n} ${x.s.toLowerCase()}`)
    .join(' · ');

  return (
    <div className="reveal">
      <PageHead
        title={businessName}
        actions={
          <>
            <button className="btn" onClick={() => onNavigate('findings')}>All findings</button>
            <button className="btn btn-primary" onClick={() => onNavigate('report')}>Open report</button>
          </>
        }
      >
        {[sector, docType].filter(Boolean).join(' · ')}
      </PageHead>

      <section className="panel verdict" aria-label="Verdict">
        <div>
          <div className="verdict-score">
            <b>{score}</b>
            <span>/ 100</span>
          </div>
          <div className="verdict-label" style={{ color: TONE_VAR[band.tone] }}>{band.label}</div>
        </div>
        <div className="verdict-body">
          <p>{explanation}</p>
          <div className="scale" aria-hidden="true">
            <div className="scale-track">
              <i /><i /><i />
              <span className="scale-pin" style={{ left: `${Math.min(100, Math.max(0, score))}%` }} />
            </div>
            <div className="scale-labels"><span>Vulnerable</span><span>Moderate</span><span>Strong</span></div>
          </div>
          {tally && <p className="muted" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, marginTop: 14 }}>Open: {tally}</p>}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>How it scores</h2>
            <p>Six areas that lenders look at, each rated from the document.</p>
          </div>
        </div>
        <ul className="panel dims">
          {breakdown.map((d) => {
            const tone = d.status === 'Vulnerable' ? 'var(--crit)' : d.status === 'Moderate' ? 'var(--med)' : 'var(--ok)';
            return (
              <li key={d.name} className="dim">
                <span className="dim-name">{d.name}</span>
                <span className="dim-bar" role="img" aria-label={`${d.score} out of 100, ${d.status}`}>
                  <i style={{ width: `${d.score}%`, background: tone }} />
                </span>
                <span className="dim-score">{d.score}</span>
                <span className="dim-note">{d.note}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid-2 section">
        <section>
          <div className="section-head">
            <div>
              <h2>Needs attention</h2>
              <p>Open findings, most severe first.</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('findings')}>
              See all <ArrowRight {...ICON} size={14} />
            </button>
          </div>
          {attention.length === 0 ? (
            <div className="panel panel-pad muted">Nothing open. Every finding is marked resolved.</div>
          ) : (
            <ul className="panel ledger">
              {attention.map((f) => (
                <li key={f.id}>
                  <button className={`ledger-row sev-${f.severity.toLowerCase()}`} onClick={() => onNavigate('findings')}>
                    <span className="ledger-bar" aria-hidden="true" />
                    <span className="ledger-main">
                      <span className="ledger-title" style={{ display: 'block' }}>{f.title}</span>
                      <span className="ledger-meta">
                        <Severity level={f.severity} />
                        <span>{f.category}</span>
                        <Ref value={f.source_reference} />
                      </span>
                      <span className="ledger-quote" style={{ display: '-webkit-box' }}>“{f.evidence}”</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="section-head">
            <div>
              <h2>Do next</h2>
              <p>In priority order.</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('report')}>
              Full plan <ArrowRight {...ICON} size={14} />
            </button>
          </div>
          <ol className="steps">
            {recs.map((r, i) => (
              <li key={i} className="step">
                <div className="step-top">
                  <span className="tag">{r.priority || 'P0'}</span>
                  <span className="faint" style={{ fontSize: 12.5 }}>{r.time_horizon}</span>
                </div>
                <div className="step-action">{r.action}</div>
                <div className="step-outcome">{r.expected_outcome}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
