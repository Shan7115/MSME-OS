import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Building,
  Target,
  DollarSign
} from 'lucide-react';

export default function BusinessModelView({ businessModelData }) {
  const [isAnnual, setIsAnnual] = useState(false);

  if (!businessModelData) return null;

  const { value_proposition, target_segments, pricing_tiers, cost_structure } = businessModelData;

  return (
    <div className="business-model-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Business Model & Commercialization Strategy</h2>
          <p>Commercial framework, beachhead unit economics, and multi-tier pricing per PRD Section 37 & 38.</p>
        </div>
      </div>

      {/* Value Proposition Hero */}
      <div className="card" style={{ 
        marginBottom: '22px',
        padding: '26px'
      }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#60a5fa', fontWeight: '700', marginBottom: '6px' }}>
          Core Value Proposition
        </div>
        <h3 style={{ fontSize: '19px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
          {value_proposition.headline}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '780px', lineHeight: '1.6', marginBottom: '20px' }}>
          {value_proposition.summary}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {value_proposition.pillars.map((p, i) => (
            <div key={i} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{p.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.4' }}>{p.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Beachhead Customer Segments */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Target Customer Segments & Beachhead Strategy</div>
            <div className="card-subtitle">Focused initial acquisition in Indian agro-processing and light manufacturing hubs</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {target_segments.map((seg, idx) => (
            <div key={idx} style={{ 
              background: '#0e1422', 
              border: idx === 0 ? '1px solid var(--primary)' : '1px solid var(--border-subtle)', 
              borderRadius: 'var(--radius-md)', 
              padding: '18px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`badge ${idx === 0 ? 'badge-open' : 'badge-low'}`} style={{ fontSize: '10px' }}>
                  {seg.segment}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
                {seg.audience}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>Key Need:</strong> {seg.need}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Pricing Tiers */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Commercialization & Pricing Structure</div>
            <div className="card-subtitle">Freemium diagnostic on-ramp converting into monthly subscription retainers</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: isAnnual ? 'var(--text-dim)' : '#ffffff' }}>Monthly</span>
            <button 
              className={`btn btn-sm ${isAnnual ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              Annual Billing (Save 20%)
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {pricing_tiers.map((tier, i) => {
            const isBeachhead = tier.name.includes('Growth');
            return (
              <div key={i} style={{
                background: isBeachhead ? 'linear-gradient(180deg, #162444 0%, #0e1629 100%)' : '#0e1422',
                border: isBeachhead ? '2px solid #2563eb' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  {isBeachhead && (
                    <div style={{ fontSize: '9.5px', textTransform: 'uppercase', fontWeight: '800', color: '#60a5fa', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      ★ Recommended Beachhead
                    </div>
                  )}
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
                    {tier.name}
                  </h4>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
                    {isAnnual && tier.price.includes('2,499') ? '₹ 1,999' : tier.price}
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '400' }}> / month</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '16px' }}>
                    {tier.billing}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        <Check size={13} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className={`btn ${isBeachhead ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ width: '100%', marginTop: '20px' }}
                >
                  {tier.price === 'Custom Quote' ? 'Contact Enterprise' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Structure Breakdown */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Projected Operating Cost Structure</div>
            <div className="card-subtitle">Efficient unit economics optimized for high-margin SaaS operations</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {cost_structure.map((item, idx) => (
            <div key={idx} style={{ background: '#0e1422', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#60a5fa', marginBottom: '2px' }}>{item.pct}%</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{item.item}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', lineHeight: '1.4' }}>{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
