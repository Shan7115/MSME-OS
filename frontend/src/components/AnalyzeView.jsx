import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Check, Loader2, AlertCircle } from 'lucide-react';
import { ICON, PageHead, statusTag } from './ui';

const SAMPLES = [
  { id: 'agro', title: 'Sri Murugan Agro Foods & Spices Pvt. Ltd.', sector: 'Food processing', location: 'Erode, Tamil Nadu', pages: 6, revenue: '₹142.50 L', loan: '₹30.00 L',
    signals: '38% of revenue from one buyer, cash credit 92.5% drawn, packaging line bottleneck, no fire safety NOC for the warehouse.', filename: '01_agro_foods_credit_appraisal.pdf' },
  { id: 'solar', title: 'Surya Prakash Solar Tech Solutions Pvt. Ltd.', sector: 'Solar inverters', location: 'Peenya, Bengaluru', pages: 3, revenue: '₹245.80 L', loan: '₹50.00 L',
    signals: '42.5% EPC customer concentration, cash credit 94.2% drawn, inverter test rig bottleneck, pollution board consent due, ₹6.5 L promoter contribution gap.', filename: '02_solar_tech_expansion_dpr.pdf' },
  { id: 'cnc', title: 'Kavitha Precision CNC Engineering Works Pvt. Ltd.', sector: 'Precision machining', location: 'Ambattur, Chennai', pages: 3, revenue: '₹188.40 L', loan: '₹35.00 L',
    signals: '46.8% from one Tier-1 buyer, cash credit 91% drawn, 18% CNC idle time from operator shortage, NABL calibration renewal due.', filename: '03_precision_engineering_term_loan.pdf' },
  { id: 'textiles', title: 'Sri Lakshmi Knits & Garment Exports LLP', sector: 'Knitwear exports', location: 'Tiruppur, Tamil Nadu', pages: 3, revenue: '₹315.00 L', loan: '₹30.00 L',
    signals: '39.5% from one German buyer, 78 days of yarn inventory, zero liquid discharge audit pending, rooftop solar capex.', filename: '04_textiles_export_credit_dossier.pdf' },
];

const STEPS = ['Reading the document', 'Extracting figures and schedules', 'Checking risk signals', 'Writing the 30/60/90 plan'];
const ALLOWED = ['.pdf', '.docx', '.xlsx', '.txt', '.csv'];

export default function AnalyzeView({ onRunDemo, onUploadFile, onAnalyzeDoc, documents, isProcessing, processingStep }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const input = useRef(null);

  const choose = (f) => {
    setError('');
    if (!f) return;
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) return setError(`${ext} files aren't supported. Use PDF, DOCX, XLSX, TXT or CSV.`);
    if (f.size > 25 * 1024 * 1024) return setError('That file is over the 25 MB limit.');
    setFile(f);
  };

  const submit = async () => {
    const f = file;
    setFile(null);
    await onUploadFile(f);
  };

  return (
    <>
      <PageHead title="Documents">Add a dossier to review. Supported: PDF, DOCX, XLSX, TXT and CSV up to 25 MB.</PageHead>

      {isProcessing && (
        <section className="panel progress" role="status" aria-live="polite">
          <strong style={{ color: 'var(--ink)' }}>Reviewing the document</strong>
          <div className="progress-bar"><i style={{ width: `${Math.min(100, (processingStep / 5) * 100)}%` }} /></div>
          <ol>
            {STEPS.map((label, i) => {
              const n = i + 1;
              const state = processingStep > n ? 'done' : processingStep === n ? 'doing' : 'todo';
              return (
                <li key={label} data-state={state}>
                  {state === 'done' ? <Check size={15} strokeWidth={2} /> : state === 'doing' ? <Loader2 size={15} className="spin" /> : <span style={{ width: 15 }} />}
                  {label}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <div
        className={`drop ${drag ? 'is-active' : ''}`}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); choose(e.dataTransfer.files?.[0]); }}
        onClick={() => input.current?.click()}
      >
        <input ref={input} type="file" hidden accept={ALLOWED.join(',')} onChange={(e) => choose(e.target.files?.[0])} />
        <div className="drop-icon"><Upload size={20} strokeWidth={1.75} /></div>
        <div>
          <h3>{file ? file.name : 'Drop a document here'}</h3>
          <p>{file ? `${(file.size / 1024).toFixed(0)} KB, ready to review` : 'or choose a file from your computer'}</p>
        </div>
        <div className="drop-actions" onClick={(e) => e.stopPropagation()}>
          {file ? (
            <>
              <button className="btn btn-ghost" onClick={() => setFile(null)}>Remove</button>
              <button className="btn btn-primary" disabled={isProcessing} onClick={submit}>Review document</button>
            </>
          ) : (
            <button className="btn" onClick={() => input.current?.click()}>Choose file</button>
          )}
        </div>
      </div>
      {error && <div className="inline-error" role="alert"><AlertCircle size={16} /> {error}</div>}

      <section className="section">
        <div className="section-head"><div><h2>Your documents</h2></div></div>
        {documents.length === 0 ? (
          <div className="panel panel-pad muted">Nothing here yet. Add a file above, or try one of the sample dossiers below.</div>
        ) : (
          <div className="panel table-wrap">
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Size</th><th>Pages</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td><div className="fname"><FileText size={16} strokeWidth={1.75} /><span>{d.filename}</span></div></td>
                    <td className="muted" style={{ textTransform: 'uppercase', fontSize: 12 }}>{d.file_type}</td>
                    <td className="muted num">{(d.file_size / 1024).toFixed(0)} KB</td>
                    <td className="muted num">{d.page_count}</td>
                    <td><span className={statusTag(d.status === 'analyzed' ? 'Resolved' : 'Open')}>{d.status === 'analyzed' ? 'Reviewed' : 'Not reviewed'}</span></td>
                    <td className="r">
                      <button className="btn btn-sm" disabled={isProcessing} onClick={() => onAnalyzeDoc(d.id)}>
                        {d.status === 'analyzed' ? 'Open review' : 'Review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Sample dossiers</h2>
            <p>Four realistic appraisals to try the review on before you add your own.</p>
          </div>
        </div>
        <div className="panel">
          {SAMPLES.map((s) => (
            <article key={s.id} className="sample">
              <div>
                <h3>{s.title}</h3>
                <div className="sample-meta">
                  <span>{s.sector}</span><span>{s.location}</span><span>{s.pages} pages</span>
                  <span>Turnover <b className="num" style={{ color: 'var(--ink)', fontWeight: 550 }}>{s.revenue}</b></span>
                  <span>Facility <b className="num" style={{ color: 'var(--ink)', fontWeight: 550 }}>{s.loan}</b></span>
                </div>
                <p className="sample-sig">{s.signals}</p>
              </div>
              <div className="sample-actions">
                <a className="btn btn-ghost btn-icon" href={`/api/sample-documents/${s.id}/download`} download={s.filename} aria-label={`Download ${s.title} as PDF`} title="Download PDF">
                  <Download {...ICON} />
                </a>
                <button className="btn" disabled={isProcessing} onClick={() => onRunDemo(s.id)}>Review sample</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
