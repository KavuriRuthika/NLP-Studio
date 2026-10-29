import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Download,
  Info,
  RefreshCw
} from 'lucide-react';

export const RobustnessLabView: React.FC = () => {
  const [inputText, setInputText] = useState('This movie was an extraordinary cinematic achievement with deeply moving themes.');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runTest = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/robustness/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, model: 'distilbert' })
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sampleInputs = [
    'This movie was an extraordinary cinematic achievement with deeply moving themes.',
    'A dreadfully boring and completely uninspired disaster of a film.',
    'The acting wasn\'t bad at all and the visuals were captivating.',
    'An utterly pretentious and painfully slow experiment that failed completely.'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.25rem 0.75rem', borderRadius: '100px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.75rem', color: '#f87171', fontWeight: 600, marginBottom: '0.75rem' }}>
          <ShieldAlert size={14} /> Adversarial Robustness (Feature 5)
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          Robustness & Adversarial Testing Laboratory
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '820px', margin: 0 }}>
          Evaluate model vulnerability against 8 controlled linguistic perturbations including syntax inversion, casing noise, character swaps, informal slang, irrelevant distractors, and sequence stress.
        </p>
      </div>

      {/* Input Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Baseline Input String</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>8 Synthetic Transformations</span>
        </div>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {sampleInputs.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(s)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '4px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                Sample {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={runTest}
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
            {loading ? <Clock size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            {loading ? 'Perturbing & Evaluating...' : 'Run Robustness Stress Suite'}
          </button>
        </div>
      </div>

      {/* Robustness Results */}
      {report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary Metric Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Original Sentiment</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: report.original_prediction?.label === 'POSITIVE' ? 'var(--status-pos)' : 'var(--status-neg)', margin: '4px 0' }}>
                {report.original_prediction?.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {Math.round(report.original_prediction?.confidence * 1000) / 10}% Confidence
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Robustness Score</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '4px 0' }}>
                {report.robustness_score}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Preserved Decisions</div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prediction Flip Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: report.flip_rate_pct > 30 ? 'var(--status-neg)' : '#f59e0b', margin: '4px 0' }}>
                {report.flip_rate_pct}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {report.flipped_predictions} / {report.total_transformations} Flipped
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Certification Scope</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0' }}>
                Empirical Test
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Non-certified heuristic</div>
            </div>
          </div>

          {/* Transformation Breakdown Cards */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-main)' }}>
              Perturbation Response Matrix
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.evaluations?.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: `1px solid ${item.prediction_flipped ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent-primary)' }}>
                        {item.id} • {item.name}
                      </span>
                      <span className={`badge ${item.preserves_meaning === true ? 'badge-positive' : item.preserves_meaning === false ? 'badge-negative' : 'badge-purple'}`} style={{ fontSize: '0.68rem' }}>
                        {item.preserves_meaning === true ? 'MEANING PRESERVED' : item.preserves_meaning === false ? 'INTENDED INVERSION' : 'PARTIAL PRESERVATION'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${item.new_label === 'POSITIVE' ? 'badge-positive' : 'badge-negative'}`}>
                        {item.new_label} ({Math.round(item.new_confidence * 100)}%)
                      </span>
                      {item.prediction_flipped ? (
                        <span className="badge badge-negative" style={{ fontSize: '0.68rem' }}>FLIPPED</span>
                      ) : (
                        <span className="badge badge-positive" style={{ fontSize: '0.68rem' }}>STABLE</span>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(8, 11, 20, 0.4)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontStyle: 'italic' }}>
                    "{item.transformed_text}"
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.rationale}</span>
                    <span>Delta: {item.confidence_delta > 0 ? `+${item.confidence_delta}` : item.confidence_delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
