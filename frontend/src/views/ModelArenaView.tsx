import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Zap,
  Clock,
  Cpu,
  Trophy,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LeaderboardItem {
  rank: number;
  model_name: string;
  architecture: string;
  parameters: string;
  accuracy: number;
  f1_score: number;
  precision: number;
  recall: number;
  mean_latency_ms: number;
  throughput_seq_sec: number;
  efficiency_ratio: string;
  recommendation: string;
}

export const ModelArenaView: React.FC = () => {
  const [inputText, setInputText] = useState('An astonishingly crafted narrative with unforgettable performances, despite a slightly rushed climax.');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [metricFilter, setMetricFilter] = useState<'latency' | 'accuracy' | 'f1'>('accuracy');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/arena/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const runArena = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/arena/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      if (res.ok) {
        const data = await res.json();
        setComparison(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'An astonishingly crafted narrative with unforgettable performances, despite a slightly rushed climax.',
    'A boring, tedious and formulaic disaster that wasted brilliant actors on a hollow script.',
    'The documentary is eighty-two minutes long and discusses the geological history of the Great Lakes.',
    'Oh wonderful, another cliché-ridden sequel that insults the intelligence of the audience.'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.25rem 0.75rem', borderRadius: '100px', background: 'rgba(34, 211, 238, 0.12)', border: '1px solid rgba(34, 211, 238, 0.25)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.75rem' }}>
          <GitCompare size={14} /> Side-by-Side Model Arena (Feature 2)
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          Model Benchmark Arena
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '820px', margin: 0 }}>
          Side-by-side comparative evaluation of DistilBERT vs BERT-Base on identical inputs and held-out benchmarks. Compare labels, soft probabilities, CPU latencies, parameter footprints, and efficiency ratios.
        </p>
      </div>

      {/* Input Arena Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Arbitration Input</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Dual Model Execution</span>
        </div>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to arbitrate between DistilBERT and BERT-Base..."
          style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setInputText(p)}
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
                Sample {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={runArena}
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
            {loading ? <Clock size={15} className="animate-spin" /> : <Zap size={15} />}
            {loading ? 'Evaluating Dual Models...' : 'Run Arena Comparison'}
          </button>
        </div>
      </div>

      {/* Comparison Split Cards */}
      {comparison && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Verdict Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: comparison.comparison.agreement ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${comparison.comparison.agreement ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {comparison.comparison.agreement ? <CheckCircle2 size={22} color="var(--status-pos)" /> : <AlertCircle size={22} color="var(--status-neg)" />}
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: comparison.comparison.agreement ? 'var(--status-pos)' : 'var(--status-neg)' }}>
                  {comparison.comparison.verdict}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  DistilBERT Speedup: {comparison.comparison.distilbert_speedup} • Latency Reduced by {comparison.comparison.latency_reduction_pct}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Confidence Delta</div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                {Math.round(comparison.comparison.confidence_difference * 1000) / 10}%
              </div>
            </div>
          </div>

          {/* Dual Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* DistilBERT Card */}
            <div className="card" style={{ borderTop: '3px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>DistilBERT SST-2</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student Model • 6 Layers • 66.9M Parameters</div>
                </div>
                <span className={`badge ${comparison.distilbert.label === 'POSITIVE' ? 'badge-positive' : 'badge-negative'}`}>
                  {comparison.distilbert.label}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ padding: '0.65rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Confidence</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {Math.round(comparison.distilbert.confidence * 1000) / 10}%
                  </div>
                </div>
                <div style={{ padding: '0.65rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Latency</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {comparison.distilbert.latency_ms} ms
                  </div>
                </div>
                <div style={{ padding: '0.65rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Tokens</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {comparison.distilbert.token_count}
                  </div>
                </div>
              </div>
            </div>

            {/* BERT-Base Card */}
            <div className="card" style={{ borderTop: '3px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>BERT-Base SST-2</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Teacher Model • 12 Layers • 109.5M Parameters</div>
                </div>
                <span className={`badge ${comparison.bert_base.label === 'POSITIVE' ? 'badge-positive' : 'badge-negative'}`}>
                  {comparison.bert_base.label}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ padding: '0.65rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Confidence</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {Math.round(comparison.bert_base.confidence * 1000) / 10}%
                  </div>
                </div>
                <div style={{ padding: '0.65rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Latency</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {comparison.bert_base.latency_ms} ms
                  </div>
                </div>
                <div style={{ padding: '0.65rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Tokens</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {comparison.bert_base.token_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Benchmark Leaderboard */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} color="#f59e0b" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Model Leaderboard</h2>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Standardized on 100-sample balanced SST-2 held-out evaluation corpus.</div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setMetricFilter('accuracy')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                background: metricFilter === 'accuracy' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: '#fff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Accuracy
            </button>
            <button
              onClick={() => setMetricFilter('latency')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                background: metricFilter === 'latency' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: '#fff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Latency (CPU)
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Rank</th>
                <th style={{ padding: '0.75rem' }}>Model</th>
                <th style={{ padding: '0.75rem' }}>Parameters</th>
                <th style={{ padding: '0.75rem' }}>Accuracy</th>
                <th style={{ padding: '0.75rem' }}>Macro F1</th>
                <th style={{ padding: '0.75rem' }}>Mean Latency</th>
                <th style={{ padding: '0.75rem' }}>Efficiency Ratio</th>
                <th style={{ padding: '0.75rem' }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item) => (
                <tr key={item.rank} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 800, color: item.rank === 1 ? '#f59e0b' : 'var(--text-muted)' }}>
                    #{item.rank}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.model_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{item.architecture}</div>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{item.parameters}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--status-pos)' }}>
                    {(item.accuracy * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{item.f1_score.toFixed(4)}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {item.mean_latency_ms} ms
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {item.efficiency_ratio}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {item.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
