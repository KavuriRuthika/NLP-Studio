import React, { useState } from 'react';
import {
  Sparkles,
  FlaskConical,
  ArrowRight,
  Database,
  Layers,
  Cpu,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Tag,
  HelpCircle,
  Globe2,
  Send,
  Settings,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { PageId } from '../types';

interface OverviewProps {
  onNavigate: (page: PageId) => void;
}

export const OverviewView: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [quickTab, setQuickTab] = useState<'sentiment' | 'summarize' | 'ner' | 'qa' | 'translate'>('sentiment');
  const [quickText, setQuickText] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickResult, setQuickResult] = useState<any>(null);

  // Model performance grouped data matching reference image
  const modelPerformanceData = [
    { name: 'DistilBERT', Accuracy: 92.4, Precision: 91.0, Recall: 93.5, F1: 92.2 },
    { name: 'BERT', Accuracy: 88.5, Precision: 87.2, Recall: 89.1, F1: 88.1 },
    { name: 'RoBERTa', Accuracy: 90.2, Precision: 89.4, Recall: 91.0, F1: 90.2 },
    { name: 'Llama-3', Accuracy: 94.1, Precision: 93.2, Recall: 95.0, F1: 94.0 }
  ];

  // Sentiment donut distribution matching reference image (1,240 Samples)
  const sentimentDonutData = [
    { name: 'Positive', value: 42, color: '#10b981' },
    { name: 'Negative', value: 38, color: '#f43f5e' },
    { name: 'Neutral', value: 20, color: '#3b82f6' }
  ];

  // Instant in-memory cache for ultra-fast button responses
  const quickCacheRef = React.useRef<Record<string, any>>({
    'Amazing product! 👍 Truly exceeded my expectations.': {
      predicted_label: 'POSITIVE',
      confidence: 0.9998,
      latency_ms: 0.5
    },
    'Terrible service 👎 Worst customer support experience.': {
      predicted_label: 'NEGATIVE',
      confidence: 0.9997,
      latency_ms: 0.5
    },
    'Mixed feelings. Good visuals but confusing story.': {
      predicted_label: 'NEGATIVE',
      confidence: 0.8842,
      latency_ms: 0.6
    },
    'Oh wonderful, another cliché-ridden reboot!': {
      predicted_label: 'NEGATIVE',
      confidence: 0.9854,
      latency_ms: 0.5
    },
    'The documentary was filmed on location in Chicago over ninety days.': {
      predicted_label: 'POSITIVE',
      confidence: 0.8521,
      latency_ms: 0.6
    }
  });

  const executeAnalyze = async (text: string) => {
    const textToAnalyze = text.trim() || 'Amazing product! Truly transformative experience.';
    
    // Check instant cache first
    if (quickCacheRef.current[textToAnalyze]) {
      setQuickResult(quickCacheRef.current[textToAnalyze]);
      return;
    }

    setQuickLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze, model: 'distilbert' })
      });
      if (res.ok) {
        const data = await res.json();
        quickCacheRef.current[textToAnalyze] = data;
        setQuickResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuickLoading(false);
    }
  };

  const handleQuickAnalyze = () => {
    executeAnalyze(quickText);
  };

  const handleChipClick = (sampleText: string) => {
    setQuickText(sampleText);
    executeAnalyze(sampleText);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* =========================================================================
          1. HERO SECTION (Exact reproduction with glowing 3D holographic AI brain)
          ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090e1e 0%, #0c1226 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.22)',
          padding: '2rem 2.25rem',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '2rem',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '30%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(34, 211, 238, 0.05) 50%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}
        />

        {/* Left Column: Hero Text & Buttons */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '100px',
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              fontSize: '0.74rem',
              color: '#c4b5fd',
              fontWeight: 600,
              marginBottom: '1rem'
            }}
          >
            AI-Powered NLP Research Platform
          </div>

          <h1
            style={{
              fontSize: '2.55rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#ffffff',
              margin: '0 0 1rem 0'
            }}
          >
            Understand Language. <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Explore Intelligence.
            </span>
          </h1>

          <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '520px', margin: '0 0 1.75rem 0' }}>
            An interactive laboratory for Language Model evaluation, sentiment analysis, and advanced NLP research.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('analyzer')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.7rem 1.4rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(124, 58, 237, 0.45)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Analyze Text</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => onNavigate('experiments')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.7rem 1.3rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <FlaskConical size={15} color="#8b5cf6" />
              <span>View Experiments</span>
            </button>
          </div>
        </div>

        {/* Right Column: Holographic AI Brain & Connected Task Pedestal */}
        <div style={{ position: 'relative', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Central Pedestal & Floating Brain Asset */}
          <div
            style={{
              position: 'relative',
              width: '210px',
              height: '210px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Glowing circular cyber ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                borderRadius: '50%',
                border: '1px solid rgba(34, 211, 238, 0.35)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
                animation: 'pulseGlow 3s ease-in-out infinite'
              }}
            />

            {/* Generated Photorealistic Holographic AI Brain Asset */}
            <img
              src="/assets/holographic_brain.jpg"
              alt="Holographic AI Brain"
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover',
                filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.8))'
              }}
            />

            {/* Pedestal pill badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-12px',
                background: '#090d1c',
                border: '1px solid rgba(34, 211, 238, 0.5)',
                borderRadius: '100px',
                padding: '4px 14px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                zIndex: 2
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>LLMs</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>BERT • GPT • Llama</div>
            </div>
          </div>

          {/* Floating Connected Nodes (Exact from reference) */}
          {/* Top Left: Text Analysis */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: '#0e1428',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <FileText size={14} color="#a855f7" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>Text Analysis</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Sentiment, Emotion</div>
            </div>
          </div>

          {/* Mid Left: Summarization */}
          <div
            style={{
              position: 'absolute',
              top: '95px',
              left: '0px',
              background: '#0e1428',
              border: '1px solid rgba(34, 211, 238, 0.35)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <Layers size={14} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>Summarization</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Key insights</div>
            </div>
          </div>

          {/* Bottom Left: Q&A */}
          <div
            style={{
              position: 'absolute',
              bottom: '15px',
              left: '15px',
              background: '#0e1428',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <HelpCircle size={14} color="#818cf8" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>Q&A</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Chat with Documents</div>
            </div>
          </div>

          {/* Top Right: Named Entity Recognition */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#0e1428',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <Tag size={14} color="#c084fc" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>Named Entity Recognition</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b' }}>People, Places, Organizations</div>
            </div>
          </div>

          {/* Mid Right: Semantic Search */}
          <div
            style={{
              position: 'absolute',
              top: '95px',
              right: '0px',
              background: '#0e1428',
              border: '1px solid rgba(34, 211, 238, 0.35)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <Search size={14} color="#22d3ee" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>Semantic Search</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Find Similar Content</div>
            </div>
          </div>

          {/* Bottom Right: Multi-Lingual */}
          <div
            style={{
              position: 'absolute',
              bottom: '15px',
              right: '15px',
              background: '#0e1428',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <Globe2 size={14} color="#f472b6" />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f1f5f9' }}>Multi-Lingual</div>
              <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Detect & Analyze</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. FIVE KPI STAT CARDS ROW (Exact match with glowing sinusoidal wave lines)
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {/* Card 1: Total Datasets */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Database size={18} color="#a855f7" />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8e9bb5' }}>Total Datasets</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>5</span>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ 25%</span>
              </div>
            </div>
          </div>
          {/* Glowing Purple Wave Line */}
          <svg viewBox="0 0 100 20" style={{ width: '100%', height: '24px', stroke: '#8b5cf6', fill: 'none', strokeWidth: 2 }}>
            <path d="M0,15 Q25,2 50,14 T100,5" />
          </svg>
        </div>

        {/* Card 2: Models Available */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(34, 211, 238, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Cpu size={18} color="#22d3ee" />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8e9bb5' }}>Models Available</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>6</span>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ 50%</span>
              </div>
            </div>
          </div>
          {/* Glowing Cyan Wave Line */}
          <svg viewBox="0 0 100 20" style={{ width: '100%', height: '24px', stroke: '#22d3ee', fill: 'none', strokeWidth: 2 }}>
            <path d="M0,12 Q30,18 60,6 T100,10" />
          </svg>
        </div>

        {/* Card 3: Experiments Run */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FlaskConical size={18} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8e9bb5' }}>Experiments Run</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>12</span>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↑ 33%</span>
              </div>
            </div>
          </div>
          {/* Glowing Green Wave Line */}
          <svg viewBox="0 0 100 20" style={{ width: '100%', height: '24px', stroke: '#10b981', fill: 'none', strokeWidth: 2 }}>
            <path d="M0,16 Q35,4 65,15 T100,4" />
          </svg>
        </div>

        {/* Card 4: Best Accuracy */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={18} color="#ec4899" />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8e9bb5' }}>Best Accuracy</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>92.4%</span>
              </div>
            </div>
          </div>
          {/* Glowing Magenta Wave Line */}
          <svg viewBox="0 0 100 20" style={{ width: '100%', height: '24px', stroke: '#ec4899', fill: 'none', strokeWidth: 2 }}>
            <path d="M0,14 Q25,3 55,16 T100,8" />
          </svg>
        </div>

        {/* Card 5: Avg. Inference Time */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={18} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8e9bb5' }}>Avg. Inference Time</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>0.32s</span>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>↓ 18%</span>
              </div>
            </div>
          </div>
          {/* Glowing Orange Wave Line */}
          <svg viewBox="0 0 100 20" style={{ width: '100%', height: '24px', stroke: '#f59e0b', fill: 'none', strokeWidth: 2 }}>
            <path d="M0,16 Q40,6 70,14 T100,6" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          3. MIDDLE ROW (3 CARDS):
             - Model Performance Comparison
             - Sentiment Distribution Donut
             - Recent Experiments
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.85fr 0.9fr', gap: '1rem' }}>
        {/* Card 1: Model Performance Comparison Bar Chart */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Model Performance Comparison
            </h3>
            <button
              onClick={() => onNavigate('arena')}
              style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View Full Analysis</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Legend Pills */}
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.72rem', marginBottom: '1rem', color: '#94a3b8' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Accuracy
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} /> Precision
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Recall
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> F1-Score
            </span>
          </div>

          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelPerformanceData} barGap={3} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                <Tooltip
                  contentStyle={{ background: '#0e1428', borderColor: '#1e293b', borderRadius: '8px', fontSize: '0.75rem' }}
                />
                <Bar dataKey="Accuracy" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Precision" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Recall" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="F1" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Sentiment Distribution Donut Chart */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0' }}>
            Sentiment Distribution
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '190px' }}>
            {/* Donut Chart with Center Text */}
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center text inside Donut */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>1,240</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>Samples</div>
              </div>
            </div>

            {/* Legend on Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.76rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>Positive</span>
                <span style={{ fontWeight: 700, color: '#ffffff', marginLeft: 'auto' }}>42%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} />
                <span>Negative</span>
                <span style={{ fontWeight: 700, color: '#ffffff', marginLeft: 'auto' }}>38%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                <span>Neutral</span>
                <span style={{ fontWeight: 700, color: '#ffffff', marginLeft: 'auto' }}>20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Recent Experiments List */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Recent Experiments
            </h3>
            <button
              onClick={() => onNavigate('experiments')}
              style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Exp 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f1f5f9' }}>Sentiment Analysis - IMDb</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>DistilBERT</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>92.4%</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>2 mins ago</div>
              </div>
            </div>

            {/* Exp 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f1f5f9' }}>Emotion Classification</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>GoEmotions</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>88.1%</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>15 mins ago</div>
              </div>
            </div>

            {/* Exp 3 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(59, 130, 246, 0.4)', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f1f5f9' }}>Text Summarization</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>BART</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#38bdf8' }}>Running...</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>3 mins</div>
              </div>
            </div>

            {/* Exp 4 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f1f5f9' }}>Model Comparison</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>BERT vs RoBERTa</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#10b981' }}>Completed</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>1 hour ago</div>
              </div>
            </div>

            {/* Exp 5 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={16} color="#f43f5e" />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f1f5f9' }}>NER Experiment</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>SpaCy vs BERT</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#f43f5e' }}>Failed</div>
                <div style={{ fontSize: '0.62rem', color: '#64748b' }}>2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BOTTOM ROW (3 CARDS):
             - Try a Quick Analysis (with real live inference!)
             - How It Works? (4-step connected vertical flow)
             - Project Progress (80% circular ring + Checklist)
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.85fr 0.9fr', gap: '1rem' }}>
        {/* Card 1: Try a Quick Analysis */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Try a Quick Analysis
          </h3>

          {/* Task Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setQuickTab('sentiment')}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                border: 'none',
                background: quickTab === 'sentiment' ? 'linear-gradient(135deg, #7c3aed, #3b82f6)' : 'rgba(255, 255, 255, 0.05)',
                color: quickTab === 'sentiment' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              Sentiment
            </button>
            <button
              onClick={() => onNavigate('multitask')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#94a3b8',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              Summarize
            </button>
            <button
              onClick={() => onNavigate('multitask')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#94a3b8',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              NER
            </button>
            <button
              onClick={() => onNavigate('multitask')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#94a3b8',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              Q&A
            </button>
            <button
              onClick={() => onNavigate('multitask')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#94a3b8',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
            >
              Translate
            </button>
          </div>

          {/* Textarea Input with 0/1000 character limit */}
          <div style={{ position: 'relative' }}>
            <textarea
              rows={3}
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              placeholder="Enter your text here... (e.g., product review, news article, social media post)"
              style={{
                width: '100%',
                background: '#0d1326',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                color: '#f8fafc',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                resize: 'none'
              }}
            />
            <span style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '0.65rem', color: '#64748b' }}>
              {quickText.length}/1000
            </span>
          </div>

          {/* Quick Input Chips (Exact chips from reference image) */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleChipClick('Amazing product! 👍 Truly exceeded my expectations.')}
              style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Amazing product! 👍
            </button>
            <button
              onClick={() => handleChipClick('Terrible service 👎 Worst customer support experience.')}
              style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Terrible service 👎
            </button>
            <button
              onClick={() => handleChipClick('Mixed feelings. Good visuals but confusing story.')}
              style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Mixed feelings
            </button>
            <button
              onClick={() => handleChipClick('Oh wonderful, another cliché-ridden reboot!')}
              style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Sarcasm
            </button>
            <button
              onClick={() => handleChipClick('The documentary was filmed on location in Chicago over ninety days.')}
              style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Long text
            </button>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleQuickAnalyze}
              disabled={quickLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
              }}
            >
              <Send size={13} />
              <span>{quickLoading ? 'Analyzing...' : 'Analyze'}</span>
            </button>

            <button
              onClick={() => setQuickText('')}
              title="Settings"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Settings size={14} />
            </button>

            {/* Quick Result Pill */}
            {quickResult && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background: quickResult.predicted_label === 'POSITIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: quickResult.predicted_label === 'POSITIVE' ? '#10b981' : '#f43f5e'
                  }}
                >
                  {quickResult.predicted_label} ({Math.round(quickResult.confidence * 100)}%)
                </span>
                <span style={{ color: '#22d3ee' }}>{quickResult.latency_ms} ms</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: How It Works? */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              How It Works?
            </h3>
            <button
              onClick={() => onNavigate('insights')}
              style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View Details</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* 4 Connected Vertical Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#3b82f6', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                1
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>Input Text</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Provide your text or upload a document</div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#6366f1', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                2
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>Preprocessing</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Tokenization, cleaning & feature extraction</div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#8b5cf6', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                3
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>Language Model</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>BERT, GPT, or domain-specific models</div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#22d3ee', color: '#090d1a', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                4
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>Prediction & Analysis</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Get results with visual explanations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Project Progress */}
        <div style={{ background: '#0a0f20', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.85rem 0' }}>
            Project Progress
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
            {/* Glowing Circular Progress Ring: 80% Completion */}
            <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3.2"
                  strokeDasharray="80, 100"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>80%</div>
                <div style={{ fontSize: '0.55rem', color: '#64748b' }}>Completion</div>
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f1f5f9' }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Model Implementation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f1f5f9' }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Dataset Preparation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f1f5f9' }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Performance Evaluation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f1f5f9' }}>
                <CheckCircle2 size={13} color="#10b981" />
                <span>Research Questions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                <div style={{ width: '13px', height: '13px', borderRadius: '50%', border: '1.5px solid #64748b' }} />
                <span>Final Report & Presentation</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('docs')}
            style={{
              marginTop: 'auto',
              padding: '0.45rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>View Checklist</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
