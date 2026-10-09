import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ICON, PageHead, Ref, Severity, Drawer, statusTag } from './ui';

const SEVERITIES = ['All', 'Critical', 'High', 'Medium'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

export default function FindingsView({ findings, onUpdateStatus, onNavigate }) {
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [term, setTerm] = useState('');
  const [activeId, setActiveId] = useState(null);

  const categories = useMemo(() => ['All', ...new Set(findings.map((f) => f.category))], [findings]);
  const active = findings.find((f) => f.id === activeId) || null;

  const shown = findings.filter((f) => {
    if (severity !== 'All' && f.severity !== severity) return false;
    if (status !== 'All' && f.status !== status) return false;
    if (category !== 'All' && f.category !== category) return false;
    if (term) {
      const t = term.toLowerCase();
      if (![f.title, f.evidence, f.why_it_matters].some((s) => (s || '').toLowerCase().includes(t))) return false;
    }
    return true;
  });
  const filtered = severity !== 'All' || status !== 'All' || category !== 'All' || term;

  if (findings.length === 0) {
    return (
      <>
        <PageHead title="Findings" />
        <div className="panel empty">
          <h2>No findings yet</h2>
          <p>Findings appear here once a document has been reviewed.</p>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('documents')}>Go to documents</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title="Findings">
        Each finding quotes the document and names the page, so you can check it before you act on it.
      </PageHead>

      <div className="toolbar">
        <div className="search">
          <Search size={16} strokeWidth={1.75} />
          <input
            className="input"
            type="search"
            placeholder="Search titles and quotes"
            aria-label="Search findings"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <div className="seg" role="group" aria-label="Severity">
          {SEVERITIES.map((s) => (
            <button key={s} aria-pressed={severity === s} onClick={() => setSeverity(s)}>
              {s}
              <span className="count">{s === 'All' ? findings.length : findings.filter((f) => f.severity === s).length}</span>
            </button>
          ))}
        </div>
        <select className="select" style={{ width: 150 }} aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">Any status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="select" style={{ width: 200 }} aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c === 'All' ? 'Any category' : c}</option>)}
        </select>
      </div>

      <p className="muted" style={{ fontSize: 13, marginBottom: 10 }} aria-live="polite">
        {filtered ? `${shown.length} of ${findings.length} findings` : `${findings.length} findings`}
      </p>

      {shown.length === 0 ? (
        <div className="panel empty">
          <h2>Nothing matches</h2>
          <p>Try a different search or clear the filters.</p>
          <div className="page-actions">
            <button className="btn" onClick={() => { setSeverity('All'); setStatus('All'); setCategory('All'); setTerm(''); }}>Clear filters</button>
          </div>
        </div>
      ) : (
        <ul className="panel ledger">
          {shown.map((f) => (
            <li key={f.id}>
              <button className={`ledger-row sev-${f.severity.toLowerCase()}`} onClick={() => setActiveId(f.id)}>
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
                <span className="ledger-side">
                  <span className={statusTag(f.status)}>{f.status}</span>
                  <span>{f.time_horizon}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {active && (
        <Drawer
          label="Finding detail"
          onClose={() => setActiveId(null)}
          head={
            <>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Severity level={active.severity} />
                <span className="muted" style={{ fontSize: 13 }}>{active.category}</span>
              </div>
              <h2>{active.title}</h2>
            </>
          }
          foot={
            <>
              <span className="muted" style={{ fontSize: 13 }}>Status</span>
              <div className="seg" role="radiogroup" aria-label="Status">
                {STATUSES.map((s) => (
                  <button key={s} role="radio" aria-checked={active.status === s} onClick={() => onUpdateStatus(active.id, s)}>{s}</button>
                ))}
              </div>
            </>
          }
        >
          <div>
            <div className="block-label">From the document</div>
            <div className="quote">
              <p>“{active.evidence}”</p>
              <Ref value={active.source_reference} />
            </div>
          </div>
          <div>
            <div className="block-label">Why it matters</div>
            <p style={{ color: 'var(--ink)' }}>{active.why_it_matters}</p>
          </div>
          <div className="callout">
            <div className="block-label">Recommended action</div>
            <p>{active.recommendation}</p>
            <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>Expected outcome: {active.expected_outcome}</p>
          </div>
          <dl className="dl">
            <dt>Timeframe</dt><dd>{active.time_horizon}</dd>
            <dt>Effort</dt><dd>{active.effort}</dd>
            <dt>Confidence</dt><dd>{active.confidence}</dd>
          </dl>
        </Drawer>
      )}
    </>
  );
}
