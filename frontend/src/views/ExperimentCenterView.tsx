import React, { useState } from 'react';
import { FlaskConical, Play, Download, CheckCircle2, AlertCircle, BarChart3, Clock, Check } from 'lucide-react';

export const ExperimentCenterView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('benchmark');
  const [selectedModel, setSelectedModel] = useState<string>('distilbert');
  const [sampleSize, setSampleSize] = useState<number>(100);
  const [running, setRunning] = useState<boolean>(false);
  const [expResult, setExpResult] = useState<any>(null);

  const runExperiment = async () => {
    setRunning(true);
    setExpResult(null);

    try {
      const res = await fetch('/api/experiments/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory === 'stress' ? 'stress' : 'benchmark',
          model: selectedModel,
          sample_size: sampleSize
        })
      });

      const data = await res.json();
      setExpResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const exportResultsCSV = () => {
    if (!expResult) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (expResult.results) {
      const headers = Object.keys(expResult.results[0]).join(',');
      const rows = expResult.results.map((r: any) => Object.values(r).map(v => `"${v}"`).join(',')).join('\n');
      csvContent += headers + '\n' + rows;
    } else {
      csvContent += `Metric,Value\nAccuracy,${expResult.accuracy}\nPrecision,${expResult.precision}\nRecall,${expResult.recall}\nF1-Score,${expResult.f1_score}\nMean Latency (ms),${expResult.mean_latency_ms}\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `experiment_${expResult.experiment_id || 'results'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Configuration Panel */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Research Experiment Workspace
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Configure scientific test suites, benchmark held-out data subsets, and execute automated evaluation runs on CPU.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {/* Select Category */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Experiment Suite
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="benchmark">Held-out Labeled Benchmark (SST-2 / IMDb)</option>
              <option value="stress">10 Linguistic Stress-Test Categories</option>
            </select>
          </div>

          {/* Select Model */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Target Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="distilbert">DistilBERT SST-2 (66M Parameters)</option>
              <option value="bert">BERT-Base SST-2 (110M Parameters)</option>
            </select>
          </div>

          {/* Sample Size */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Evaluation Subset Size
            </label>
            <select
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
              disabled={selectedCategory === 'stress'}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                opacity: selectedCategory === 'stress' ? 0.5 : 1
              }}
            >
              <option value={20}>20 Samples (Quick Verification)</option>
              <option value={50}>50 Samples (Moderate Run)</option>
              <option value={100}>100 Samples (Full Benchmark N=100)</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={runExperiment}
            disabled={running}
            className="btn-primary"
            style={{ padding: '0.7rem 1.8rem' }}
          >
            <Play size={16} />
            <span>{running ? 'Executing Evaluation...' : 'Execute Experiment Suite'}</span>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {expResult && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-success">Completed</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                {expResult.type} Results
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Experiment ID: {expResult.experiment_id} • Completed in {expResult.duration_ms} ms
              </div>
            </div>
            <button onClick={exportResultsCSV} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Metric Summary Cards if Benchmark */}
          {expResult.accuracy !== undefined && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {(expResult.accuracy * 100).toFixed(2)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Accuracy</div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {expResult.precision.toFixed(4)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Precision</div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {expResult.recall.toFixed(4)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Recall</div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-violet)' }}>
                  {expResult.f1_score.toFixed(4)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Macro F1-Score</div>
              </div>
            </div>
          )}

          {/* Stress Test Table View */}
          {expResult.results && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                    <th style={{ padding: '8px 12px' }}>Category</th>
                    <th style={{ padding: '8px 12px' }}>Input Sentence</th>
                    <th style={{ padding: '8px 12px' }}>Expected</th>
                    <th style={{ padding: '8px 12px' }}>Prediction</th>
                    <th style={{ padding: '8px 12px' }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {expResult.results.map((row: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>{row.Category}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>"{row.Input_Text}"</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className="badge badge-cyan">{row.Expected_Sentiment}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={row.Predicted_Label === 'POSITIVE' ? 'badge badge-success' : 'badge badge-warning'}>
                          {row.Predicted_Label}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-cyan)' }}>
                        {(row.Confidence * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
