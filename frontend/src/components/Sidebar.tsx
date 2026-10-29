import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  FlaskConical,
  BarChart3,
  AlertTriangle,
  HelpCircle,
  BrainCircuit,
  ShieldCheck,
  BookOpen,
  Database,
  FileText,
  Search,
  Settings,
  Brain
} from 'lucide-react';
import { PageId } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analyzer', label: 'Live NLP Analyzer', icon: Cpu },
  { id: 'models', label: 'Model Laboratory', icon: Layers },
  { id: 'experiments', label: 'Experiment Center', icon: FlaskConical },
  { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
  { id: 'errors', label: 'Error Analysis', icon: AlertTriangle },
  { id: 'dataset', label: 'Dataset Manager', icon: Database },
  { id: 'multitask', label: 'Multi-Task Playground', icon: BrainCircuit },
  { id: 'multilingual-docs', label: 'Semantic Search (RAG)', icon: Search },
  { id: 'research', label: 'Research Questions', icon: HelpCircle },
  { id: 'insights', label: 'Model Insights', icon: Brain },
  { id: 'responsible-ai', label: 'Responsible AI', icon: ShieldCheck },
  { id: 'docs', label: 'Report Generator', icon: FileText },
  { id: 'docs', label: 'Documentation', icon: BookOpen }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isMobileOpen = false,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 6, 12, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      <aside
        style={{
          width: '252px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#090d1a',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          padding: '1.25rem 0.85rem 1rem',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Brand Header */}
        <div
          onClick={() => onSelectPage('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.25rem 0.5rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {/* Glowing Purple Brain Logo Icon */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
              flexShrink: 0
            }}
          >
            <Brain size={22} color="#ffffff" />
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
              NLP
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
              Intelligence Studio
            </div>
            <div style={{ fontSize: '0.66rem', color: '#64748b', letterSpacing: '0.04em', marginTop: '2px' }}>
              Explore • Experiment • Analyze
            </div>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}
        >
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.label === 'Dashboard' && currentPage === 'overview') ||
              (item.label === 'Report Generator' && currentPage === 'docs');

            return (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => {
                  onSelectPage(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '0.58rem 0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive
                    ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)'
                    : 'transparent',
                  color: isActive ? '#ffffff' : '#8e9bb5',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 16px rgba(124, 58, 237, 0.45)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#8e9bb5';
                  }
                }}
              >
                <Icon size={17} color={isActive ? '#ffffff' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: System Status & User Profile */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
          {/* System Status Card */}
          <div
            style={{
              padding: '0.75rem 0.85rem',
              backgroundColor: '#0f1424',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f1f5f9' }}>System Status</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '2px 6px',
                  borderRadius: '100px',
                  border: '1px solid rgba(16, 185, 129, 0.25)'
                }}
              >
                ● Online
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.7rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>API Server</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>Models</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>Database</span>
              </div>
            </div>
          </div>

          {/* User Profile Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 0.2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
                }}
              >
                K
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#f1f5f9', letterSpacing: '0.02em' }}>
                  KAVURI RUTHIKA
                </div>
                <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                  Student • AI Researcher
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPage('overview')}
              title="Settings"
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
