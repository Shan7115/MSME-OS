import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { ICON, PageHead } from './ui';

function Rating({ label, value, onChange }) {
  return (
    <div className="field">
      <span className="label" id={`r-${label}`}>{label}</span>
      <div className="rating" role="radiogroup" aria-labelledby={`r-${label}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} onClick={() => onChange(n)}>{n}</button>
        ))}
      </div>
    </div>
  );
}

const ROLES = [
  ['MSME Owner', 'MSME owner or promoter'],
  ['Accountant', 'Chartered accountant or tax practitioner'],
  ['Business Advisor', 'Credit advisor or consultant'],
  ['Student/Research Participant', 'Academic or researcher'],
  ['Other', 'Other'],
];

const blank = { understanding: '', mostUseful: '', biggestConcern: '' };

export default function ValidationView({ validationData, onSubmitFeedback }) {
  const [role, setRole] = useState('MSME Owner');
  const [text, setText] = useState(blank);
  const [usefulness, setUsefulness] = useState(4);
  const [clarity, setClarity] = useState(4);
  const [trust, setTrust] = useState(4);
  const [intent, setIntent] = useState('Yes');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setText((t) => ({ ...t, [k]: e.target.value }));
  const has = validationData && validationData.participant_count > 0;
  const avg = (v) => (has ? v.toFixed(1) : '–');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await onSubmitFeedback({
      participant_type: role,
      understanding: text.understanding,
      usefulness, clarity, trust,
      intent_to_use: intent,
      most_useful: text.mostUseful,
      biggest_concern: text.biggestConcern,
      changes: '',
      additional_feedback: '',
    });
    setBusy(false);
    if (ok) setText(blank);
  };

  return (
    <>
      <PageHead title="Pilot feedback">
        Record what pilot users say about the product. These are the only numbers shown here; nothing is simulated.
      </PageHead>

      <div className="kpis">
        <div className="kpi"><small>Responses</small><b>{validationData ? validationData.participant_count : 0}</b></div>
        <div className="kpi"><small>Usefulness</small><b>{avg(validationData?.avg_usefulness ?? 0)} <span>/ 5</span></b></div>
        <div className="kpi"><small>Clarity</small><b>{avg(validationData?.avg_clarity ?? 0)} <span>/ 5</span></b></div>
        <div className="kpi"><small>Trust in citations</small><b>{avg(validationData?.avg_trust ?? 0)} <span>/ 5</span></b></div>
      </div>

      <div className="grid-2">
        <section>
          <div className="section-head"><div><h2>Add a response</h2></div></div>
          <form className="panel panel-pad" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="field">
              <label htmlFor="role">Who is giving feedback</label>
              <select id="role" className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="und">In their words, what does this product do?</label>
              <input id="und" className="input" required value={text.understanding} onChange={set('understanding')} />
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <Rating label="Usefulness" value={usefulness} onChange={setUsefulness} />
              <Rating label="Clarity" value={clarity} onChange={setClarity} />
              <Rating label="Trust" value={trust} onChange={setTrust} />
            </div>
            <div className="field">
              <span className="label" id="intent">Would they use it with their own business or clients?</span>
              <div className="seg" role="radiogroup" aria-labelledby="intent" style={{ alignSelf: 'flex-start' }}>
                {[['Yes', 'Yes'], ['Maybe', 'Maybe'], ['No', 'No']].map(([v, l]) => (
                  <button key={v} type="button" role="radio" aria-checked={intent === v} onClick={() => setIntent(v)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label htmlFor="useful">What was most useful?</label>
              <input id="useful" className="input" value={text.mostUseful} onChange={set('mostUseful')} />
            </div>
            <div className="field">
              <label htmlFor="concern">What was missing or concerning?</label>
              <textarea id="concern" className="textarea" value={text.biggestConcern} onChange={set('biggestConcern')} />
            </div>
            <div>
              <button type="submit" className="btn btn-primary" disabled={busy}><Send {...ICON} /> {busy ? 'Saving…' : 'Save response'}</button>
            </div>
          </form>
        </section>

        <section>
          <div className="section-head"><div><h2>Responses</h2></div></div>
          {!has ? (
            <div className="panel panel-pad muted">No responses yet. Saved responses show up here with their ratings.</div>
          ) : (
            <div className="panel panel-pad" style={{ maxHeight: 620, overflowY: 'auto' }}>
              {(validationData.feedbacks || []).map((fb) => (
                <div key={fb.id} className="feedback">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <span className="tag">{fb.participant_type}</span>
                    <span className="faint" style={{ fontSize: 12.5 }}>Would use: {fb.intent_to_use}</span>
                  </div>
                  <p style={{ color: 'var(--ink)' }}>“{fb.understanding}”</p>
                  <p className="muted num" style={{ fontSize: 12.5, marginTop: 6 }}>
                    Usefulness {fb.usefulness} · Clarity {fb.clarity} · Trust {fb.trust}
                  </p>
                  {fb.most_useful && <p style={{ fontSize: 13, marginTop: 6 }}><span className="faint">Useful: </span>{fb.most_useful}</p>}
                  {fb.biggest_concern && <p style={{ fontSize: 13, marginTop: 2 }}><span className="faint">Concern: </span>{fb.biggest_concern}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
