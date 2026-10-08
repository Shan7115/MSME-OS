import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  FileCheck, 
  CheckCircle2, 
  Briefcase, 
  Compass, 
  RotateCcw,
  Sparkles,
  Building2
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, onResetDemo, onRunDemo, currentAnalysis, hasAnalysis }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyze', label: 'Intake & Analysis', icon: FileText },
    { id: 'findings', label: 'Findings Explorer', icon: AlertTriangle },
    { id: 'reports', label: 'Executive Report', icon: FileCheck },
    { id: 'validation', label: 'Validation Hub', icon: CheckCircle2 },
    { id: 'business_model', label: 'Business Model', icon: Briefcase },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
  ];

  return (
    <aside className="sidebar no-print">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo">M2</div>
          <div className="brand-text">
            <h1>MSMEOS2</h1>
            <span>Decision Intelligence</span>
          </div>
        </div>
      </div>

      {currentAnalysis && (
        <div style={{
          margin: '12px 14px 4px 14px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(37, 99, 235, 0.12)',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Building2 size={15} style={{ color: '#60a5fa', flexShrink: 0 }} />
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#93c5fd', fontWeight: '700', letterSpacing: '0.04em' }}>Active Dossier</div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentAnalysis.business_name}
            </div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: '16px', paddingLeft: '4px', paddingRight: '4px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', fontSize: '12px', padding: '8px 12px', gap: '6px' }}
            onClick={onRunDemo}
          >
            <Sparkles size={14} style={{ color: '#60a5fa' }} />
            <span>Launch Demo Analysis</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="system-badge">
            <span className="status-dot"></span>
            <span>Local Engine Active</span>
          </div>
          <button 
            className="btn btn-danger-outline btn-sm" 
            title="Reset demo data"
            onClick={onResetDemo}
            style={{ padding: '4px 8px', fontSize: '11px' }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
        <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textAlign: 'center' }}>
          MSMEOS2 v1.0 • Evidence-First
        </div>
      </div>
    </aside>
  );
}
