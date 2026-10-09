import React from 'react';
import { Check } from 'lucide-react';
import { PageHead } from './ui';

export default function BusinessModelView({ businessModelData }) {
  if (!businessModelData) return null;
  const { value_proposition, target_segments, pricing_tiers, cost_structure } = businessModelData;

  return (
    <>
      <PageHead title="Business model">Planning notes: who this is for, what it could cost, and where the money goes.</PageHead>

      <section className="panel">
        <div className="panel-pad" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500 }}>{value_proposition.headline}</h2>
          <p className="muted" style={{ marginTop: 6, maxWidth: '70ch' }}>{value_proposition.summary}</p>
        </div>
        <div className="cols-3">
          {value_proposition.pillars.map((p) => (
            <div key={p.title}><div className="cell-title">{p.title}</div><div className="cell-body">{p.description}</div></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Who it's for</h2></div></div>
        <div className="panel cols-3">
          {target_segments.map((s) => (
            <div key={s.segment}>
              <span className="tag">{s.segment}</span>
              <div className="cell-title" style={{ marginTop: 10 }}>{s.audience}</div>
              <div className="cell-body">{s.need}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Pricing</h2><p>Proposed tiers, not yet on sale.</p></div></div>
        <div className="panel cols-4">
          {pricing_tiers.map((t) => (
            <div key={t.name}>
              <div className="cell-title">{t.name}</div>
              <div className="price">{t.price}{t.price.trim().startsWith('₹') && t.price.trim().length > 2 && !t.price.includes('Free') && <span> / month</span>}</div>
              <div className="faint" style={{ fontSize: 12.5 }}>{t.billing}</div>
              <ul className="ticks">
                {t.features.map((f) => <li key={f}><Check size={14} strokeWidth={2} />{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Cost structure</h2></div></div>
        <div className="panel cols-4">
          {cost_structure.map((c) => (
            <div key={c.item}>
              <div className="price num">{c.pct}%</div>
              <div className="cell-title" style={{ marginTop: 4 }}>{c.item}</div>
              <div className="cell-body">{c.description}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
