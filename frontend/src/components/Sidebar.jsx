import React from 'react';
import { LayoutGrid, FileText, ListChecks, ScrollText, MessageSquareText, Layers, Route } from 'lucide-react';
import { ICON } from './ui';

const WORK = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'findings', label: 'Findings', icon: ListChecks },
  { id: 'report', label: 'Report', icon: ScrollText },
];
const PROJECT = [
  { id: 'validation', label: 'Pilot feedback', icon: MessageSquareText },
  { id: 'model', label: 'Business model', icon: Layers },
  { id: 'roadmap', label: 'Roadmap', icon: Route },
];

export default function Sidebar({ currentTab, onNavigate, onReset, currentAnalysis, openCount }) {
  const renderItem = (item) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        className="nav-link"
        aria-current={currentTab === item.id ? 'page' : undefined}
        onClick={() => onNavigate(item.id)}
      >
        <Icon {...ICON} />
        <span>{item.label}</span>
        {item.id === 'findings' && openCount > 0 && <span className="nav-count" aria-label={`${openCount} open`}>{openCount}</span>}
      </button>
    );
  };

  return (
    <aside className="sidebar no-print">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">M</div>
        <div className="brand-name">MSMEOS</div>
      </div>

      {currentAnalysis && (
        <button className="dossier-chip" onClick={() => onNavigate('documents')} title="Switch dossier">
          <small>Current dossier</small>
          <span>{currentAnalysis.business_name}</span>
        </button>
      )}

      <nav className="nav" aria-label="Main">
        {WORK.map(renderItem)}
        <div className="nav-group">Project</div>
        {PROJECT.map(renderItem)}
      </nav>

      <div className="sidebar-foot">
        <div className="engine"><i aria-hidden="true" /> Local engine ready</div>
        <button className="link-btn" onClick={onReset}>Clear workspace</button>
      </div>
    </aside>
  );
}
