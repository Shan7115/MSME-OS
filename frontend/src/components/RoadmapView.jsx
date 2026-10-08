import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Milestone, 
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function RoadmapView({ roadmapData }) {
  if (!roadmapData) return null;

  const { phases } = roadmapData;

  return (
    <div className="roadmap-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Product & Commercialization Roadmap</h2>
          <p>Four-phase evolution from local-first MVP to institutional MSME decision platform.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {phases.map((ph, idx) => {
          const isCurrent = ph.phase.includes('Phase 1');
          return (
            <div 
              key={idx}
              className="card"
              style={{
                border: isCurrent ? '1.5px solid #2563eb' : '1px solid var(--border-subtle)',
                padding: '22px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCurrent ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                      {ph.phase}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      <span>{ph.timeline}</span>
                    </div>
                  </div>
                </div>

                <span className={`badge ${isCurrent ? 'badge-open' : 'badge-low'}`}>
                  {isCurrent ? 'Active Execution' : 'Planned'}
                </span>
              </div>

              {/* Milestones list */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '10px' }}>
                {ph.milestones.map((m, mIdx) => (
                  <div key={mIdx} style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    {m.done ? (
                      <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <Circle size={16} style={{ color: 'var(--text-dim)', flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: m.done ? '#ffffff' : 'var(--text-muted)', marginBottom: '2px' }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                        {m.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
