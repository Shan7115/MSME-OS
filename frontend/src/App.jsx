import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import OverviewView from './components/OverviewView';
import AnalyzeView from './components/AnalyzeView';
import FindingsView from './components/FindingsView';
import ReportsView from './components/ReportsView';
import ValidationView from './components/ValidationView';
import BusinessModelView from './components/BusinessModelView';
import RoadmapView from './components/RoadmapView';
import { ConfirmDialog, Toasts } from './components/ui';

const TABS = ['overview', 'documents', 'findings', 'report', 'validation', 'model', 'roadmap'];
const TITLES = {
  overview: 'Overview', documents: 'Documents', findings: 'Findings', report: 'Report',
  validation: 'Pilot feedback', model: 'Business model', roadmap: 'Roadmap',
};

const tabFromHash = () => {
  const t = window.location.hash.replace(/^#\/?/, '');
  return TABS.includes(t) ? t : 'overview';
};

async function api(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).detail; } catch { /* non-JSON error body */ }
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export default function App() {
  const [currentTab, setTab] = useState(tabFromHash);
  const [dashboardData, setDashboardData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [findings, setFindings] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [validationData, setValidationData] = useState(null);
  const [businessModelData, setBusinessModelData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  const navigate = useCallback((tab) => {
    window.location.hash = `/${tab}`;
  }, []);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = `${TITLES[currentTab]} · MSMEOS`;
    window.scrollTo(0, 0);
  }, [currentTab]);

  const notify = useCallback((message, kind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'error' ? 6000 : 3500);
  }, []);

  const refreshAllData = useCallback(async (targetAnalysisId = null) => {
    try {
      const q = targetAnalysisId ? `?analysis_id=${targetAnalysisId}` : '';
      const [dash, docs, finds, val, bm, rm] = await Promise.all([
        api(`/api/dashboard${q}`),
        api('/api/documents'),
        api(`/api/findings${q}`),
        api('/api/validation/feedback'),
        api('/api/business-model'),
        api('/api/roadmap'),
      ]);
      setDashboardData(dash);
      setDocuments(docs || []);
      setFindings(finds || []);
      setValidationData(val);
      setBusinessModelData(bm);
      setRoadmapData(rm);

      const activeId = targetAnalysisId || dash?.latest_analysis_id;
      if (activeId) {
        api(`/api/analyses/${activeId}`).then(setCurrentAnalysis).catch(() => notify('Could not load the analysis.', 'error'));
      } else {
        setCurrentAnalysis(null);
      }
    } catch (err) {
      notify(`Could not reach the server. ${err.message}`, 'error');
    } finally {
      setLoaded(true);
    }
  }, [notify]);

  useEffect(() => { refreshAllData(); }, [refreshAllData]);

  // Steps advance while the request runs and jump to done when it returns.
  const runSteps = (stepsMs) => {
    timers.current.forEach(clearTimeout);
    setProcessingStep(1);
    timers.current = stepsMs.map((ms, i) => setTimeout(() => setProcessingStep(i + 2), ms));
  };
  const stopSteps = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const finishAnalysis = async (analysis) => {
    stopSteps();
    setProcessingStep(5);
    setCurrentAnalysis(analysis);
    await refreshAllData(analysis.id);
    setIsProcessing(false);
    navigate('overview');
    notify(`Review ready for ${analysis.business_name}.`);
  };

  const handleRunDemo = async (option = 'agro') => {
    setIsProcessing(true);
    navigate('documents');
    runSteps([500, 1100, 1700]);
    try {
      const optStr = typeof option === 'string' ? option : 'agro';
      const data = await api(`/api/demo/load?option=${encodeURIComponent(optStr)}`, { method: 'POST' });
      if (data.analysis) await finishAnalysis(data.analysis);
      else { stopSteps(); setIsProcessing(false); await refreshAllData(); }
    } catch (err) {
      stopSteps();
      setIsProcessing(false);
      notify(`Could not load the sample. ${err.message}`, 'error');
    }
  };

  const handleResetDemo = async () => {
    setConfirmReset(false);
    try {
      await api('/api/demo/reset', { method: 'POST' });
      await refreshAllData();
      navigate('overview');
      notify('Workspace cleared.');
    } catch (err) {
      notify(`Could not reset. ${err.message}`, 'error');
    }
  };

  const handleUploadFile = async (file) => {
    setIsProcessing(true);
    runSteps([600, 1400, 2200]);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploaded = await api('/api/documents/upload', { method: 'POST', body: formData });
      const analysis = await api(`/api/documents/${uploaded.id}/analyze`, { method: 'POST' });
      await finishAnalysis(analysis);
    } catch (err) {
      stopSteps();
      setIsProcessing(false);
      notify(err.message || 'Could not process that document.', 'error');
    }
  };

  const handleAnalyzeExistingDoc = async (docId) => {
    setIsProcessing(true);
    runSteps([400, 1000, 1600]);
    try {
      const analysis = await api(`/api/documents/${docId}/analyze`, { method: 'POST' });
      await finishAnalysis(analysis);
    } catch (err) {
      stopSteps();
      setIsProcessing(false);
      notify(`Analysis failed. ${err.message}`, 'error');
    }
  };

  const handleUpdateFindingStatus = async (findingId, newStatus) => {
    // Optimistic: the list reflects the change immediately, rolled back on failure.
    const previous = findings;
    setFindings((fs) => fs.map((f) => (f.id === findingId ? { ...f, status: newStatus } : f)));
    try {
      await api(`/api/findings/${findingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      setFindings(previous);
      notify(`Status not saved. ${err.message}`, 'error');
    }
  };

  const handleSubmitFeedback = async (payload) => {
    try {
      await api('/api/validation/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setValidationData(await api('/api/validation/feedback'));
      notify('Feedback recorded.');
      return true;
    } catch (err) {
      notify(`Feedback not saved. ${err.message}`, 'error');
      return false;
    }
  };

  const openCount = findings.filter((f) => f.status !== 'Resolved').length;

  return (
    <div className="shell">
      <a href="#main" className="skip-link no-print" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <Sidebar
        currentTab={currentTab}
        onNavigate={navigate}
        onReset={() => setConfirmReset(true)}
        currentAnalysis={currentAnalysis}
        openCount={openCount}
      />

      <main className="main" id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <div className="page">
          {currentTab === 'overview' && (
            <OverviewView
              loaded={loaded}
              dashboardData={dashboardData}
              analysis={currentAnalysis}
              findings={findings}
              onNavigate={navigate}
            />
          )}
          {currentTab === 'documents' && (
            <AnalyzeView
              onRunDemo={handleRunDemo}
              onUploadFile={handleUploadFile}
              onAnalyzeDoc={handleAnalyzeExistingDoc}
              documents={documents}
              isProcessing={isProcessing}
              processingStep={processingStep}
            />
          )}
          {currentTab === 'findings' && (
            <FindingsView findings={findings} onUpdateStatus={handleUpdateFindingStatus} onNavigate={navigate} />
          )}
          {currentTab === 'report' && <ReportsView analysis={currentAnalysis} onNavigate={navigate} />}
          {currentTab === 'validation' && (
            <ValidationView validationData={validationData} onSubmitFeedback={handleSubmitFeedback} />
          )}
          {currentTab === 'model' && <BusinessModelView businessModelData={businessModelData} />}
          {currentTab === 'roadmap' && <RoadmapView roadmapData={roadmapData} />}
        </div>
      </main>

      {confirmReset && (
        <ConfirmDialog
          title="Clear this workspace?"
          body="All uploaded documents, analyses and finding statuses will be deleted. This can't be undone."
          confirmLabel="Clear workspace"
          onConfirm={handleResetDemo}
          onCancel={() => setConfirmReset(false)}
        />
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
