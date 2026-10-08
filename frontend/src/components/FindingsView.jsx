import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertOctagon, 
  X, 
  ArrowUpRight,
  BookOpen,
  Check
} from 'lucide-react';

export default function FindingsView({ findings, onUpdateStatus }) {
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFinding, setActiveFinding] = useState(null);

  const categories = ['All', 'Customer / Sales', 'Working Capital', 'Operations / Supply Chain', 'Compliance / Documentation', 'Financial / Capital Structure', 'Operations'];

  const filteredFindings = findings.filter((f) => {
    if (selectedSeverity !== 'All' && f.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && f.status !== selectedStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match = f.title.toLowerCase().includes(term) ||
                    f.evidence.toLowerCase().includes(term) ||
                    f.why_it_matters.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    if (status === 'Resolved') return 'badge-resolved';
    if (status === 'In Progress') return 'badge-progress';
    return 'badge-open';
  };

  const handleStatusChange = async (findingId, newStatus) => {
    await onUpdateStatus(findingId, newStatus);
    if (activeFinding && activeFinding.id === findingId) {
      setActiveFinding({ ...activeFinding, status: newStatus });
    }
  };

  return (
    <div className="findings-container">
      <div className="page-header">
        <div className="page-title">
          <h2>Evidence-Backed Findings Explorer</h2>
          <p>Inspect extracted business signals, document citations, and remediation status.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              className="form-control"
              placeholder="Search findings, citations, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px', paddingRight: searchTerm ? '32px' : '14px' }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Severity Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-dim)' }}>Severity:</span>
            {['All', 'Critical', 'High', 'Medium'].map((sev) => {
              const count = sev === 'All' ? findings.length : findings.filter(f => f.severity === sev).length;
              return (
                <button 
                  key={sev}
                  className={`btn btn-sm ${selectedSeverity === sev ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedSeverity(sev)}
                  style={{ padding: '5px 10px', fontSize: '11.5px', gap: '5px' }}
                >
                  <span>{sev}</span>
                  <span style={{ 
                    fontSize: '10px', 
                    opacity: 0.8,
                    background: selectedSeverity === sev ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    padding: '1px 5px',
                    borderRadius: '10px'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-dim)' }}>Status:</span>
            {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
              <button 
                key={st}
                className={`btn btn-sm ${selectedStatus === st ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedStatus(st)}
                style={{ padding: '5px 10px', fontSize: '11.5px' }}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Findings Count & List */}
      <div style={{ marginBottom: '14px', fontSize: '13px', color: 'var(--text-dim)' }}>
        Showing <strong>{filteredFindings.length}</strong> of {findings.length} total findings
      </div>

      {filteredFindings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
          No findings match the current filter selection. Try adjusting your search query or filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFindings.map((f) => (
            <div 
              key={f.id} 
              className="finding-card"
              onClick={() => setActiveFinding(f)}
            >
              <div className="finding-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-${f.severity.toLowerCase()}`}>{f.severity}</span>
                  <span className={`badge ${getStatusBadge(f.status)}`}>{f.status}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>• {f.category}</span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>Confidence: <strong>{f.confidence}</strong></span>
              </div>

              <div className="finding-title">{f.title}</div>

              {/* Document Evidence Snippet */}
              <div className="evidence-box">
                <div className="evidence-label">Document Citation / Evidence:</div>
                <div>"{f.evidence}"</div>
                <div className="source-tag">
                  <BookOpen size={12} />
                  <span>{f.source_reference}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong>Horizon:</strong> {f.time_horizon} • <strong>Effort:</strong> {f.effort}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#60a5fa' }}>
                  <span>Inspect Detail</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal / Drawer */}
      {activeFinding && (
        <div className="modal-overlay" onClick={() => setActiveFinding(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span className={`badge badge-${activeFinding.severity.toLowerCase()}`}>{activeFinding.severity}</span>
                  <span className={`badge ${getStatusBadge(activeFinding.status)}`}>{activeFinding.status}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{activeFinding.category}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                  {activeFinding.title}
                </h3>
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ padding: '6px' }}
                onClick={() => setActiveFinding(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Evidence block */}
            <div className="evidence-box" style={{ padding: '14px 16px', margin: '16px 0' }}>
              <div className="evidence-label" style={{ fontSize: '11px', marginBottom: '6px' }}>
                Verified Document Source Citation:
              </div>
              <div style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#f1f5f9' }}>
                "{activeFinding.evidence}"
              </div>
              <div className="source-tag" style={{ marginTop: '8px' }}>
                <BookOpen size={13} />
                <strong>Reference:</strong> {activeFinding.source_reference}
              </div>
            </div>

            {/* Risk & Explanation */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Why This Signal Matters:
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {activeFinding.why_it_matters}
              </p>
            </div>

            {/* Recommendation & Expected Outcome */}
            <div style={{ 
              backgroundColor: 'rgba(37, 99, 235, 0.08)', 
              border: '1px solid rgba(37, 99, 235, 0.25)', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#60a5fa', marginBottom: '6px' }}>
                Actionable Recommendation:
              </h4>
              <p style={{ fontSize: '13.5px', color: '#ffffff', marginBottom: '8px' }}>
                {activeFinding.recommendation}
              </p>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <strong>Expected Outcome:</strong> {activeFinding.expected_outcome}
              </div>
            </div>

            {/* Effort, Horizon & Workflow Status Transition */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                Horizon: <strong>{activeFinding.time_horizon}</strong> • Effort: <strong>{activeFinding.effort}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Update Status:</span>
                {['Open', 'In Progress', 'Resolved'].map((st) => (
                  <button 
                    key={st}
                    className={`btn btn-sm ${activeFinding.status === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11.5px', padding: '4px 10px' }}
                    onClick={() => handleStatusChange(activeFinding.id, st)}
                  >
                    {activeFinding.status === st && <Check size={12} />}
                    <span>{st}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
