import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  FileCheck,
  RefreshCw,
  Download
} from 'lucide-react';

const SAMPLE_OPTIONS = [
  {
    id: "agro",
    title: "Sri Murugan Agro Foods & Spices Pvt. Ltd.",
    sector: "Food Processing & Spice Manufacturing",
    location: "Erode, Tamil Nadu",
    pages: "6 Pages",
    badge: "Agro-Processing",
    badgeClass: "badge-medium",
    revenue: "₹142.50 L",
    loanReq: "₹30.00 L",
    signals: "38% customer concentration (Kaveri Hypermarkets), 92.5% CC drawing power stress, packaging line bottleneck, warehouse Fire Safety NOC deficit.",
    filename: "01_agro_foods_credit_appraisal.pdf"
  },
  {
    id: "solar",
    title: "Surya Prakash Solar Tech Solutions Pvt. Ltd.",
    sector: "Renewable Energy & Smart Grid Inverters",
    location: "Peenya, Bengaluru",
    pages: "3 Pages",
    badge: "CleanTech & Solar",
    badgeClass: "badge-resolved",
    revenue: "₹245.80 L",
    loanReq: "₹50.00 L",
    signals: "42.5% EPC customer concentration, 94.2% CC limit stress, inverter testing rig bottleneck, KSPCB consent renewal gap, ₹6.5L promoter capex shortfall.",
    filename: "02_solar_tech_expansion_dpr.pdf"
  },
  {
    id: "cnc",
    title: "Kavitha Precision CNC Engineering Works Pvt. Ltd.",
    sector: "Precision Machining & Automotive Fasteners",
    location: "Ambattur, Chennai",
    pages: "3 Pages",
    badge: "Automotive Machining",
    badgeClass: "badge-low",
    revenue: "₹188.40 L",
    loanReq: "₹35.00 L",
    signals: "46.8% Tier-1 auto concentration (Lucas-TVS), 91% CC limit stress, 18% CNC idle time from operator shortage, NABL gauge calibration renewal.",
    filename: "03_precision_engineering_term_loan.pdf"
  },
  {
    id: "textiles",
    title: "Sri Lakshmi Knits & Garment Exports LLP",
    sector: "Export-Oriented Cotton Knitwear & Garments",
    location: "Tiruppur, Tamil Nadu",
    pages: "3 Pages",
    badge: "Apparel Exports",
    badgeClass: "badge-critical",
    revenue: "₹315.00 L",
    loanReq: "₹30.00 L",
    signals: "39.5% European buyer concentration (Germany), 78-day cotton yarn inventory holding stress, Zero Liquid Discharge (ZLD) effluent audit, rooftop solar capex.",
    filename: "04_textiles_export_credit_dossier.pdf"
  }
];

export default function AnalyzeView({ 
  onRunDemo, 
  onUploadFile, 
  onAnalyzeDoc,
  documents, 
  isProcessing, 
  processingStep,
  onNavigate 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setUploadError('');
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const allowed = ['.pdf', '.docx', '.xlsx', '.txt', '.csv'];
    if (!allowed.includes(ext)) {
      setUploadError(`Unsupported format '${ext}'. Please upload PDF, DOCX, XLSX, TXT, or CSV.`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25 MB maximum limit.');
      return;
    }
    setSelectedFile(file);
  };

  const triggerUpload = async () => {
    if (!selectedFile) return;
    await onUploadFile(selectedFile);
    setSelectedFile(null);
  };

  return (
    <div className="analyze-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Document Intake & Analysis Engine</h2>
          <p>Choose from 4 pre-built Indian MSME appraisal dossiers or upload any arbitrary document for diagnostic evaluation.</p>
        </div>
      </div>

      {/* Processing Animation Modal / Box */}
      {isProcessing && (
        <div className="card" style={{ 
          marginBottom: '32px', 
          background: 'linear-gradient(135deg, #101c36 0%, #0d1222 100%)',
          borderColor: '#2563eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <Loader2 className="animate-spin" size={24} style={{ color: '#60a5fa' }} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                Analyzing Business Documentation...
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Multi-pass fact extraction and deterministic evidence verification
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { step: 1, label: 'Reading & Parsing Document' },
              { step: 2, label: 'Extracting Schedules & Facts' },
              { step: 3, label: 'Evaluating Risk Signals' },
              { step: 4, label: 'Synthesizing 30/60/90 Plan' }
            ].map((s) => {
              const isPast = processingStep > s.step;
              const isCurrent = processingStep === s.step;
              return (
                <div key={s.step} style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: isCurrent ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: isCurrent ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {isPast ? (
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                  ) : isCurrent ? (
                    <Loader2 size={16} className="animate-spin" style={{ color: '#60a5fa' }} />
                  ) : (
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--border-subtle)', display: 'inline-block' }} />
                  )}
                  <span style={{ fontSize: '11.5px', fontWeight: isCurrent ? '600' : '400', color: isCurrent ? '#ffffff' : 'var(--text-muted)' }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pre-packaged Executive Dossier Options (4 Sectors) */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
              Select a Pre-built Credit Dossier Specimen (4 Industry Options)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Click any option below to run end-to-end diagnostic appraisal, or download the executive PDF.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {SAMPLE_OPTIONS.map((opt) => (
            <div 
              key={opt.id} 
              className="card" 
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '28px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className={`badge ${opt.badgeClass}`}>
                    {opt.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '500' }}>
                    {opt.pages} • {opt.location}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '4px', lineHeight: '1.35' }}>
                  {opt.title}
                </h4>
                <div style={{ fontSize: '12px', color: '#60a5fa', marginBottom: '12px', fontWeight: '500' }}>
                  {opt.sector}
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  fontSize: '11.5px', 
                  color: 'var(--text-dim)', 
                  marginBottom: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>Turnover: <strong style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>{opt.revenue}</strong></div>
                  <div>Facility: <strong style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>{opt.loanReq}</strong></div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                  <strong style={{ color: '#cbd5e1' }}>Key Signals:</strong> {opt.signals}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ flex: 1 }}
                  onClick={() => onRunDemo(opt.id)}
                  disabled={isProcessing}
                >
                  <Sparkles size={13} />
                  <span>Analyze Dossier</span>
                </button>
                <a 
                  href={`/api/sample-documents/${opt.id}/download`} 
                  download={opt.filename}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}
                  title="Download Executive PDF"
                >
                  <Download size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Arbitrary File Upload Zone */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
          Or Upload Any Random / Custom Document
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Upload any business report, bank proposal, or financial ledger in PDF, DOCX, XLSX, TXT, or CSV format.
        </p>

        <div 
          className="card"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px dashed var(--primary)' : '1px dashed var(--border-highlight)',
            background: dragActive ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '40px 30px',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('file-upload-input').click()}
        >
          <input 
            type="file" 
            id="file-upload-input" 
            style={{ display: 'none' }} 
            onChange={handleFileInput}
            accept=".pdf,.docx,.xlsx,.txt,.csv"
          />

          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            color: 'var(--text-muted)'
          }}>
            <UploadCloud size={24} />
          </div>

          <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
            {selectedFile ? selectedFile.name : 'Choose or drop your custom document here'}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', maxWidth: '360px', marginBottom: '14px' }}>
            Supported formats: PDF, DOCX, XLSX, TXT, CSV (Up to 25 MB)
          </p>

          {selectedFile ? (
            <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-primary btn-sm" onClick={triggerUpload} disabled={isProcessing}>
                <FileCheck size={14} />
                <span>Upload & Extract</span>
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedFile(null)}>
                Clear
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={(e) => {
              e.stopPropagation();
              document.getElementById('file-upload-input').click();
            }}>
              Browse Files
            </button>
          )}

          {uploadError && (
            <div style={{ marginTop: '12px', color: '#f87171', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ingested Documents List */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Ingested Enterprise Documents</div>
            <div className="card-subtitle">Locally stored dossiers ready for diagnostic appraisal</div>
          </div>
        </div>

        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)', fontSize: '13px' }}>
            No documents uploaded yet. Use the demo button above to load the sample appraisal dossier.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '10px 14px' }}>Document Name</th>
                  <th style={{ padding: '10px 14px' }}>Type</th>
                  <th style={{ padding: '10px 14px' }}>Size</th>
                  <th style={{ padding: '10px 14px' }}>Pages</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '500', color: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} style={{ color: 'var(--primary)' }} />
                        <span>{doc.filename}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', textTransform: 'uppercase', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {doc.file_type}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {(doc.file_size / 1024).toFixed(1)} KB
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {doc.page_count}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${doc.status === 'analyzed' ? 'badge-resolved' : 'badge-open'}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onAnalyzeDoc(doc.id)}
                        disabled={isProcessing}
                      >
                        <RefreshCw size={12} />
                        <span>{doc.status === 'analyzed' ? 'View Analysis' : 'Run Analysis'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
