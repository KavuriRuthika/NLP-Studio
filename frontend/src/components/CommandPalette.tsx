import React, { useState, useEffect } from 'react';
import {
  Search,
  Command,
  LayoutDashboard,
  Layers,
  Cpu,
  GitCompare,
  Eye,
  Database,
  ShieldAlert,
  BookOpen,
  BarChart3,
  Activity,
  AlertTriangle,
  HelpCircle,
  BrainCircuit,
  ShieldCheck,
  FileDown,
  X
} from 'lucide-react';
import { PageId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (page: PageId) => void;
}

interface CommandItem {
  id: PageId;
  title: string;
  category: string;
  description: string;
  icon: React.FC<{ size?: number; color?: string }>;
  shortcut?: string;
}

const COMMAND_LIST: CommandItem[] = [
  { id: 'overview', title: 'System Overview', category: 'Core Platform', description: 'Architecture, pipeline diagram, and empirical KPIs', icon: LayoutDashboard },
  { id: 'multitask', title: 'Multi-Task NLP Playground', category: 'Playground', description: '10 NLP tasks: Sentiment, Emotion, Summarization, NER, QA, etc.', icon: Layers, shortcut: 'F1' },
  { id: 'analyzer', title: 'Live NLP Analyzer', category: 'Core Platform', description: 'Real-time DistilBERT inference with WordPiece token inspection', icon: Cpu },
  { id: 'arena', title: 'Model Benchmark Arena', category: 'Comparative', description: 'DistilBERT vs BERT-Base arbitration and model leaderboard', icon: GitCompare, shortcut: 'F2' },
  { id: 'explainability', title: 'Explainability Workspace', category: 'Research', description: 'Subword saliency, systematic perturbations, and attribution disclaimer', icon: Eye, shortcut: 'F3' },
  { id: 'dataset', title: 'Dataset Intelligence Center', category: 'Research', description: 'Data profiling, class balance, length percentiles, and seeded splits', icon: Database, shortcut: 'F4' },
  { id: 'robustness', title: 'Robustness & Adversarial Lab', category: 'Diagnostics', description: '8 controlled linguistic transformations and flip rate tracker', icon: ShieldAlert, shortcut: 'F5' },
  { id: 'multilingual-docs', title: 'Document Search, Q&A & Multilingual', category: 'Retrieval', description: 'Semantic vector search, passage QA grounding, and 6-language audit', icon: BookOpen },
  { id: 'models', title: 'Model Laboratory', category: 'Architecture', description: 'Detailed model cards: DistilBERT, BERT-Base, and GPT-2', icon: Layers },
  { id: 'analytics', title: 'Performance Analytics', category: 'Benchmarking', description: 'Empirical benchmark metrics, confusion matrix, and latency vs length', icon: BarChart3 },
  { id: 'reliability', title: 'AI Reliability & Monitoring', category: 'Observability', description: 'Operational telemetry, hardware load, latency distribution, low confidence', icon: Activity },
  { id: 'errors', title: 'Error Analysis & Edge Cases', category: 'Diagnostics', description: 'Qualitative analysis of sarcasm, neutral statements, and slang', icon: AlertTriangle },
  { id: 'research', title: 'Research Questions (RQ1-RQ5)', category: 'Academic', description: 'Five empirical research hypotheses, decisions, and statistical evidence', icon: HelpCircle },
  { id: 'insights', title: 'Mathematical Insights', category: 'Academic', description: 'Self-attention, WordPiece tokenization, and distillation loss equations', icon: BrainCircuit },
  { id: 'responsible-ai', title: 'Responsible AI & Ethics', category: 'Governance', description: 'Algorithmic bias, privacy, calibration, and environmental sustainability', icon: ShieldCheck },
  { id: 'docs', title: 'Documentation & Viva Hub', category: 'Academic Submission', description: 'Academic checklist, 30+ Viva Q&A, 2-minute speech, and report generator', icon: FileDown }
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectPage }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setSelectedIndex(0);
      }
      if (isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMAND_LIST.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: PageId) => {
    onSelectPage(id);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(4, 6, 12, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '640px',
          maxWidth: '92vw',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(139, 92, 246, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <Search size={18} color="var(--accent-primary)" />
          <input
            autoFocus
            type="text"
            placeholder="Type a feature name, task, or module (e.g. Arena, Explain, Viva)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.95rem'
            }}
          />
          <kbd style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              No matching modules found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>{item.shortcut}</kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ padding: '0.65rem 1.25rem', background: 'rgba(8, 11, 20, 0.5)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          <span>Navigate with arrows, press Enter to jump</span>
          <span>Shortcut: Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
