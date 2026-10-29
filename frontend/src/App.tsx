import React, { useState } from 'react';
import { PageId } from './types';
import { ToastProvider } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { OverviewView } from './views/OverviewView';
import { AnalyzerView } from './views/AnalyzerView';
import { ModelLabView } from './views/ModelLabView';
import { ExperimentCenterView } from './views/ExperimentCenterView';
import { AnalyticsView } from './views/AnalyticsView';
import { ErrorAnalysisView } from './views/ErrorAnalysisView';
import { ResearchQuestionsView } from './views/ResearchQuestionsView';
import { ModelInsightsView } from './views/ModelInsightsView';
import { ResponsibleAIView } from './views/ResponsibleAIView';
import { DocumentationView } from './views/DocumentationView';
import { MultiTaskView } from './views/MultiTaskView';
import { ModelArenaView } from './views/ModelArenaView';
import { ExplainabilityView } from './views/ExplainabilityView';
import { DatasetCenterView } from './views/DatasetCenterView';
import { RobustnessLabView } from './views/RobustnessLabView';
import { DocumentQAView } from './views/DocumentQAView';
import { ReliabilityView } from './views/ReliabilityView';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewView onNavigate={setCurrentPage} />;
      case 'analyzer':
        return <AnalyzerView />;
      case 'multitask':
        return <MultiTaskView onNavigate={setCurrentPage} />;
      case 'arena':
        return <ModelArenaView />;
      case 'explainability':
        return <ExplainabilityView />;
      case 'dataset':
        return <DatasetCenterView />;
      case 'robustness':
        return <RobustnessLabView />;
      case 'multilingual-docs':
        return <DocumentQAView />;
      case 'models':
        return <ModelLabView />;
      case 'experiments':
        return <ExperimentCenterView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'reliability':
        return <ReliabilityView />;
      case 'errors':
        return <ErrorAnalysisView />;
      case 'research':
        return <ResearchQuestionsView />;
      case 'insights':
        return <ModelInsightsView />;
      case 'responsible-ai':
        return <ResponsibleAIView />;
      case 'docs':
        return <DocumentationView />;
      default:
        return <OverviewView onNavigate={setCurrentPage} />;
    }
  };

  const sidebarWidth = isCollapsed ? '76px' : '260px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="ambient-bg" />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectPage={setCurrentPage}
      />

      {/* Left Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.25s ease'
        }}
      >
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          isCollapsed={isCollapsed}
        />

        <main
          style={{
            flex: 1,
            padding: '2rem 2.5rem',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}
        >
          {renderCurrentView()}
        </main>

        <footer
          style={{
            padding: '1.25rem 2rem',
            textAlign: 'center',
            fontSize: '0.76rem',
            color: 'var(--text-dim)',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(7, 10, 19, 0.65)'
          }}
        >
          NLP Intelligence Studio • Final Year Engineering Academic Submission • PyTorch 2.x & Hugging Face Transformers
        </footer>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
