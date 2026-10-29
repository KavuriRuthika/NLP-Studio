import React, { useState } from 'react';
import {
  Eye,
  Sliders,
  AlertTriangle,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const ExplainabilityView: React.FC = () => {
  const [inputText, setInputText] = useState('The acting was undeniably brilliant and touching throughout.');
  const [model, setModel] = useState<'distilbert' | 'bert'>('distilbert');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runExplain = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/explain/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, model })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.25rem 0.75rem', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.25)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
          <Eye size={14} /> Interpretability & Attribution (Feature 3)
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          Advanced Explainability Workspace
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '820px', margin: 0 }}>
          Inspect WordPiece subwords, token IDs, heuristic attribution heatmaps, systematic input perturbation tests, and counterfactual candidates with scientific attribution disclaimers.
        </p>
      </div>

      {/* Input Configuration Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Inspection Text</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setModel('distilbert')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                background: model === 'distilbert' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: '#fff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              DistilBERT (66M)
            </button>
            <button
              onClick={() => setModel('bert')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                background: model === 'bert' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: '#fff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              BERT-Base (110M)
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={runExplain}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <Clock size={15} className="animate-spin" /> : <Eye size={15} />}
            {loading ? 'Analyzing Tokens & Perturbations...' : 'Inspect Representations'}
          </button>
        </div>
      </div>

      {/* Attribution Heatmap & Tokens */}
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Scientific Disclaimer Alert */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '0.82rem',
            lineHeight: 1.5
          }}>
            <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Academic Interpretability Notice:</strong> Saliency scores and simulated attention weights represent post-hoc heuristic hypotheses. As demonstrated by Jain & Wallace (2019) (*Attention is not Explanation*) and Wiegreffe & Pinter (2019), raw self-attention patterns do not establish definitive causal mechanisms for individual classification decisions.
            </div>
          </div>

          {/* Token Saliency Chips */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              WordPiece Token Saliency & Heatmap
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
              {data.tokens?.map((t: any, idx: number) => {
                const alpha = Math.max(0.15, Math.min(0.9, t.importance_score || 0.2));
                return (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '4px',
                      background: `rgba(139, 92, 246, ${alpha})`,
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      color: '#ffffff'
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.token}</span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>ID: {t.token_id}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Systematic Perturbation Tests */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              Prediction Shifts Under Systematic Perturbations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.perturbations?.map((p: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{p.type}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>"{p.modified_text}"</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${p.new_label === 'POSITIVE' ? 'badge-positive' : 'badge-negative'}`}>
                        {p.new_label}
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Delta: {p.confidence_shift > 0 ? `+${p.confidence_shift}` : p.confidence_shift}
                      </div>
                    </div>
                    {p.prediction_flipped && (
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                        PREDICTION FLIPPED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Token Breakdown Table */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              Exact WordPiece Vocabulary Manifest
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.6rem' }}>Pos</th>
                    <th style={{ padding: '0.6rem' }}>Subword Token</th>
                    <th style={{ padding: '0.6rem' }}>Token ID</th>
                    <th style={{ padding: '0.6rem' }}>Special Token</th>
                    <th style={{ padding: '0.6rem' }}>Attribution Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tokens?.map((t: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', color: 'var(--text-dim)' }}>{t.position}</td>
                      <td style={{ padding: '0.6rem', fontWeight: 600, color: 'var(--text-main)' }}>{t.token}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--accent-cyan)' }}>{t.token_id}</td>
                      <td style={{ padding: '0.6rem', color: t.is_special ? '#f59e0b' : 'var(--text-dim)' }}>
                        {t.is_special ? 'TRUE' : 'FALSE'}
                      </td>
                      <td style={{ padding: '0.6rem', color: 'var(--text-main)' }}>{t.importance_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
