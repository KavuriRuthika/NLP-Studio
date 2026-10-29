import React, { useState, useEffect } from 'react';
import { AlertTriangle, Filter, Search, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { ErrorRecord } from '../types';

export const ErrorAnalysisView: React.FC = () => {
  const [errors, setErrors] = useState<ErrorRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeError, setActiveError] = useState<ErrorRecord | null>(null);

  useEffect(() => {
    fetch('/api/errors')
      .then(res => res.json())
      .then(data => setErrors(data))
      .catch(err => console.error(err));
  }, []);

  const filteredErrors = errors.filter(e => {
    if (selectedCategory === 'all') return true;
    return e.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Model Failure Analysis & Error Taxonomy
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Systematic failure case breakdown. Transformer encoder heads rely on statistical attention weights that fail predictably when confronted with non-literal sarcasm, out-of-distribution slang, or neutral non-polar text.
        </p>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {['all', 'Sarcasm', 'Neutral', 'Slang', 'Ambiguity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '5px 12px',
                borderColor: selectedCategory === cat ? 'var(--accent-violet)' : 'var(--border-subtle)',
                background: selectedCategory === cat ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)'
              }}
            >
              {cat === 'all' ? 'All Failure Modes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Failure Cases Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredErrors.map((err) => (
          <div
            key={err.id}
            className="glass-panel"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              borderLeft: '4px solid var(--status-warning)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-warning">{err.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {err.id}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', margin: '0.75rem 0' }}>
                "{err.input_text}"
              </div>

              {/* Labels Comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', margin: '0.75rem 0' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>GROUND TRUTH</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{err.ground_truth}</div>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '6px 10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--status-danger)' }}>MODEL PREDICTION</div>
                  <div style={{ fontWeight: 700, color: 'var(--status-danger)' }}>
                    {err.predicted_label} ({(err.confidence * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Hypothesis */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>Scientific Hypothesis: </strong>
                {err.hypothesis}
              </div>
            </div>

            <button
              onClick={() => setActiveError(err)}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', width: '100%', justifyContent: 'center' }}
            >
              <Eye size={13} />
              <span>Inspect Failure Details</span>
            </button>
          </div>
        ))}
      </div>

      {/* Failure Inspection Modal */}
      {activeError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '2rem', background: '#101625' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-warning">{activeError.category}</span>
              <button
                onClick={() => setActiveError(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              "{activeError.input_text}"
            </h3>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>FAILURE MECHANISM:</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {activeError.hypothesis}
              </p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--status-success)', marginBottom: '4px' }}>
                RECOMMENDED ENGINEERING MITIGATION:
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                Augment classification head to a 3-class structure (Positive, Neutral, Negative) or implement an uncertainty threshold flag when softmax confidence is below calibrated confidence thresholds.
              </p>
            </div>

            <button onClick={() => setActiveError(null)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Diagnostics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
