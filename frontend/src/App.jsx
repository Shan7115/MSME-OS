import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OverviewView from './components/OverviewView';
import AnalyzeView from './components/AnalyzeView';
import FindingsView from './components/FindingsView';
import ReportsView from './components/ReportsView';
import ValidationView from './components/ValidationView';
import BusinessModelView from './components/BusinessModelView';
import RoadmapView from './components/RoadmapView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [findings, setFindings] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [validationData, setValidationData] = useState(null);
  const [businessModelData, setBusinessModelData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);

  // Load initial application data
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async (targetAnalysisId = null) => {
    try {
      const dashUrl = targetAnalysisId ? `/api/dashboard?analysis_id=${targetAnalysisId}` : '/api/dashboard';
      const findUrl = targetAnalysisId ? `/api/findings?analysis_id=${targetAnalysisId}` : '/api/findings';

      const [dashRes, docsRes, findRes, valRes, bmRes, rmRes] = await Promise.all([
        fetch(dashUrl).then((r) => r.json()),
        fetch('/api/documents').then((r) => r.json()),
        fetch(findUrl).then((r) => r.json()),
        fetch('/api/validation/feedback').then((r) => r.json()),
        fetch('/api/business-model').then((r) => r.json()),
        fetch('/api/roadmap').then((r) => r.json()),
      ]);

      setDashboardData(dashRes);
      setDocuments(docsRes || []);
      setFindings(findRes || []);
      setValidationData(valRes);
      setBusinessModelData(bmRes);
      setRoadmapData(rmRes);

      const activeAnalysisId = targetAnalysisId || (dashRes && dashRes.latest_analysis_id);
      if (activeAnalysisId) {
        fetch(`/api/analyses/${activeAnalysisId}`)
          .then((r) => r.json())
          .then((data) => setCurrentAnalysis(data))
          .catch((err) => console.error("Error fetching analysis:", err));
      } else {
        setCurrentAnalysis(null);
      }
    } catch (err) {
      console.error("Error loading application data:", err);
    }
  };

  const handleRunDemo = async (option = 'agro') => {
    setIsProcessing(true);
    setCurrentTab('analyze');
    setProcessingStep(1);

    // Multi-step progressive animation
    setTimeout(() => setProcessingStep(2), 600);
    setTimeout(() => setProcessingStep(3), 1200);
    setTimeout(() => setProcessingStep(4), 1800);

    try {
      const optStr = typeof option === 'string' ? option : 'agro';
      const res = await fetch(`/api/demo/load?option=${encodeURIComponent(optStr)}`, { method: 'POST' });
      const data = await res.json();
      
      setTimeout(async () => {
        setIsProcessing(false);
        if (data.analysis) {
          setCurrentAnalysis(data.analysis);
          await refreshAllData(data.analysis.id);
        } else {
          await refreshAllData();
        }
        setCurrentTab('overview');
      }, 2300);
    } catch (err) {
      console.error("Error running demo:", err);
      setIsProcessing(false);
    }
  };

  const handleResetDemo = async () => {
    const confirmReset = window.confirm("Reset all demo documents, analyses, and findings? This will restore the clean empty state.");
    if (!confirmReset) return;

    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      await refreshAllData();
      setCurrentTab('overview');
    } catch (err) {
      console.error("Error resetting demo:", err);
    }
  };

  const handleUploadFile = async (file) => {
    setIsProcessing(true);
    setProcessingStep(1);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) {
        const errJson = await uploadRes.json();
        alert(errJson.detail || "Upload error");
        setIsProcessing(false);
        return;
      }
      const uploadData = await uploadRes.json();

      setProcessingStep(2);
      setTimeout(() => setProcessingStep(3), 500);

      // Trigger analysis
      const analyzeRes = await fetch(`/api/documents/${uploadData.id}/analyze`, { method: 'POST' });
      const analysisJson = await analyzeRes.json();

      setProcessingStep(4);
      setTimeout(async () => {
        setIsProcessing(false);
        setCurrentAnalysis(analysisJson);
        await refreshAllData(analysisJson.id);
        setCurrentTab('overview');
      }, 800);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to process document.");
      setIsProcessing(false);
    }
  };

  const handleAnalyzeExistingDoc = async (docId) => {
    setIsProcessing(true);
    setProcessingStep(2);
    try {
      const analyzeRes = await fetch(`/api/documents/${docId}/analyze`, { method: 'POST' });
      const analysisJson = await analyzeRes.json();
      setProcessingStep(4);
      setTimeout(async () => {
        setIsProcessing(false);
        setCurrentAnalysis(analysisJson);
        await refreshAllData(analysisJson.id);
        setCurrentTab('overview');
      }, 700);
    } catch (err) {
      console.error("Analyze doc error:", err);
      setIsProcessing(false);
    }
  };

  const handleUpdateFindingStatus = async (findingId, newStatus) => {
    try {
      await fetch(`/api/findings/${findingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      await refreshAllData();
    } catch (err) {
      console.error("Error updating finding status:", err);
    }
  };

  const handleSubmitFeedback = async (feedbackPayload) => {
    try {
      await fetch('/api/validation/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
      });
      // Refresh validation metrics
      const valRes = await fetch('/api/validation/feedback').then((r) => r.json());
      setValidationData(valRes);
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        onResetDemo={handleResetDemo}
        onRunDemo={handleRunDemo}
        currentAnalysis={currentAnalysis}
        hasAnalysis={dashboardData && dashboardData.has_analysis}
      />

      <main className="main-content">
        {currentTab === 'overview' && (
          <OverviewView 
            dashboardData={dashboardData} 
            analysis={currentAnalysis}
            onNavigate={setCurrentTab} 
            onRunDemo={handleRunDemo} 
          />
        )}

        {currentTab === 'analyze' && (
          <AnalyzeView 
            onRunDemo={handleRunDemo}
            onUploadFile={handleUploadFile}
            onAnalyzeDoc={handleAnalyzeExistingDoc}
            documents={documents}
            isProcessing={isProcessing}
            processingStep={processingStep}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'findings' && (
          <FindingsView 
            findings={findings}
            onUpdateStatus={handleUpdateFindingStatus}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView 
            analysis={currentAnalysis}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'validation' && (
          <ValidationView 
            validationData={validationData}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {currentTab === 'business_model' && (
          <BusinessModelView 
            businessModelData={businessModelData}
          />
        )}

        {currentTab === 'roadmap' && (
          <RoadmapView 
            roadmapData={roadmapData}
          />
        )}
      </main>
    </div>
  );
}
