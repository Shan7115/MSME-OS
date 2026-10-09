import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { PageHead } from './ui';

export default function RoadmapView({ roadmapData }) {
  if (!roadmapData) return null;
  const { phases } = roadmapData;

  return (
    <>
      <PageHead title="Roadmap">From a local-first MVP to a platform that institutions can adopt.</PageHead>
      <div className="panel">
        {phases.map((ph) => {
          const current = ph.phase.includes('Phase 1');
          return (
            <section key={ph.phase} className="phase">
              <div className="phase-head">
                <h3>{ph.phase}</h3>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span className="faint" style={{ fontSize: 13 }}>{ph.timeline}</span>
                  <span className={`tag ${current ? 'tag-accent' : ''}`}>{current ? 'In progress' : 'Planned'}</span>
                </div>
              </div>
              <ul className="milestones">
                {ph.milestones.map((m) => (
                  <li key={m.title} className={m.done ? 'done' : 'todo'}>
                    {m.done ? <CheckCircle2 size={16} strokeWidth={1.75} aria-label="Done" /> : <Circle size={16} strokeWidth={1.75} aria-label="Not done" />}
                    <div><strong>{m.title}</strong><span>{m.detail}</span></div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
