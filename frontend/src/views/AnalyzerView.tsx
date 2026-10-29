import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Copy,
  Download,
  Check,
  Cpu,
  Clock,
  Layers,
  Shield,
  HelpCircle,
  FileSpreadsheet,
  FileJson,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { AnalyzeResult } from '../types';
import { useToast } from '../components/Toast';

export const AnalyzerView: React.FC = () => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState<string>(
    'An absolute masterpiece with profound emotional depth and remarkable direction.'
  );
  const [selectedModel, setSelectedModel] = useState<'distilbert' | 'bert'>('distilbert');
  const [selectedTask, setSelectedTask] = useState<'sentiment' | 'emotion' | 'ner'>('sentiment');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; text: string; label: string; conf: number; latency: number; time: string }>>([]);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const EXAMPLE_CHIPS = [
    { label: 'Strong Positive', text: 'An absolute masterpiece with profound emotional depth and remarkable direction.' },
    { label: 'Strong Negative', text: 'A completely uninspired, tedious and dreadfully boring disaster that wasted brilliant actors.' },
    { label: 'Sarcasm / Irony', text: 'Oh wonderful, another reboot full of uninspired clichés, just what the world needed.' },
    { label: 'Neutral Statement', text: 'The documentary is ninety minutes long and was filmed on location in Chicago.' },
    { label: 'Informal Slang', text: 'Dis movi was sooooo fire bro, total banger fr no cap!!' }
  ];

  const runAnalysis = async (textToRun = inputText, modelToRun = selectedModel) => {
    if (!textToRun.trim()) {
      showToast('Input Required', 'Please enter some text before analyzing.', 'error');
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToRun, model: modelToRun })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server returned ${res.status}`);
      }

      const data: AnalyzeResult = await res.json();
      setResult(data);

      // Append to session history
      const newEntry = {
        id: `HIST-${Date.now()}`,
        text: textToRun,
        label: data.predicted_label,
        conf: data.confidence,
        latency: data.latency_ms,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setHistory((prev) => [newEntry, ...prev.slice(0, 19)]);
      showToast('Analysis Complete', `Classified as ${data.predicted_label} (${(data.confidence * 100).toFixed(1)}%) in ${data.latency_ms} ms`, 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Could not connect to inference backend.');
      showToast('Inference Error', err.message || 'Model execution failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    showToast('Copied Input Text', 'Text copied to clipboard.', 'info');
  };

  const clearInput = () => {
    setInputText('');
    setResult(null);
    setErrorMsg(null);
  };

  const exportHistoryJSON = () => {
    if (history.length === 0) {
      showToast('No History', 'Execute at least one analysis first.', 'info');
      return;
    }
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `prediction_history_${Date.now()}.json`);
    showToast('Exported JSON', 'Prediction history downloaded.', 'success');
  };

  const exportHistoryCSV = () => {
    if (history.length === 0) {
      showToast('No History', 'Execute at least one analysis first.', 'info');
      return;
    }
    let csv = 'Timestamp,Text,Predicted_Label,Confidence,Latency_ms\n';
    history.forEach((h) => {
      const sanitized = `"${h.text.replace(/"/g, '""')}"`;
      csv += `${h.time},${sanitized},${h.label},${h.conf},${h.latency}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, `prediction_history_${Date.now()}.csv`);
    showToast('Exported CSV', 'Prediction history downloaded.', 'success');
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Controls Grid: Input Workspace & Live Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem' }}>
        {/* Left Column: Input Workspace */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header & Model Selectors */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Text Input Workspace
            </h2>

            {/* Model Selector Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-tertiary)',
                padding: '3px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <button
                onClick={() => setSelectedModel('distilbert')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  background: selectedModel === 'distilbert' ? 'var(--accent-gradient)' : 'transparent',
                  color: selectedModel === 'distilbert' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                DistilBERT (66M)
              </button>
              <button
                onClick={() => setSelectedModel('bert')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: 'none',
                  background: selectedModel === 'bert' ? 'var(--accent-gradient)' : 'transparent',
                  color: selectedModel === 'bert' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                BERT-Base (110M)
              </button>
            </div>
          </div>

          {/* Example Input Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {EXAMPLE_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(chip.text);
                  runAnalysis(chip.text, selectedModel);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-violet)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Main Text Editor */}
          <div style={{ position: 'relative' }}>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter customer review, film reaction, or sentence for transformer inference..."
              style={{
                width: '100%',
                padding: '1rem',
                paddingBottom: '2.5rem',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                resize: 'vertical'
              }}
            />

            {/* Editor Stats Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                display: 'flex',
                gap: '12px',
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                pointerEvents: 'none'
              }}
            >
              <span>{charCount} Characters</span>
              <span>{wordCount} Words</span>
              <span>Max: 512 Tokens</span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={clearInput}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }}
              >
                <RotateCcw size={13} />
                <span>Clear</span>
              </button>
              <button
                onClick={copyText}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }}
              >
                <Copy size={13} />
                <span>Copy</span>
              </button>
            </div>

            <button
              onClick={() => runAnalysis()}
              disabled={loading}
              className="btn-primary"
              style={{ padding: '0.65rem 1.4rem' }}
            >
              {loading ? <Clock size={15} className="animate-spin" /> : <Sparkles size={15} />}
              <span>{loading ? 'Evaluating Model...' : 'Analyze Sentiment'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Prediction Results */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                Inference Result
              </h3>
            </div>
            {result && (
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {result.model}
              </span>
            )}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.82rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Empty State */}
          {!result && !loading && !errorMsg && (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              <Layers size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.35 }} />
              <p style={{ margin: 0, fontSize: '0.88rem' }}>Enter text and click Analyze Sentiment to observe live transformer outputs.</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ width: '28px', height: '28px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: 'var(--accent-violet)', borderRadius: '50%', margin: '0 auto 1rem' }} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Computing bidirectional self-attention representation...</p>
            </div>
          )}

          {/* Real Prediction Results Card */}
          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Primary Label Card */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  background: result.predicted_label === 'POSITIVE' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: `1px solid ${result.predicted_label === 'POSITIVE' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Predicted Polarity
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: result.predicted_label === 'POSITIVE' ? 'var(--status-pos)' : 'var(--status-neg)', margin: '2px 0' }}>
                    {result.predicted_label}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Softmax Confidence
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0' }}>
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Probability Distribution Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Positive Class Probability</span>
                  <span style={{ color: 'var(--status-pos)', fontWeight: 600 }}>
                    {Math.round((result.probabilities.positive || 0) * 1000) / 10}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(result.probabilities.positive || 0) * 100}%`, height: '100%', background: 'var(--status-pos)', transition: 'width 0.4s ease' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Negative Class Probability</span>
                  <span style={{ color: 'var(--status-neg)', fontWeight: 600 }}>
                    {Math.round((result.probabilities.negative || 0) * 1000) / 10}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(result.probabilities.negative || 0) * 100}%`, height: '100%', background: 'var(--status-neg)', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              {/* Latency & Subwords Chip */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
                  <Clock size={12} /> Latency: {result.latency_ms} ms
                </span>
                <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>
                  <Layers size={12} /> WordPiece Tokens: {result.token_count}
                </span>
              </div>

              {/* Scientific Interpretation */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                {result.interpretation}
              </div>

              {/* LangChain Decoupled Output Expander */}
              {result.langchain_output && (
                <details style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <summary style={{ cursor: 'pointer', color: 'var(--accent-cyan)' }}>
                    View LangChain LCEL Decoupled Output
                  </summary>
                  <pre style={{ marginTop: '0.5rem', padding: '0.65rem', background: '#060913', borderRadius: '4px', color: '#94a3b8', overflowX: 'auto' }}>
                    {JSON.stringify(result.langchain_output, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>

      {/* WordPiece Subword Token Breakdown Table (When available) */}
      {result && result.tokens && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                WordPiece Subword Token Decomposition
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Deconstructed subword stems with 30,522 vocabulary IDs and special tokens
              </p>
            </div>
            <span className="badge badge-purple">{result.token_count} Tokens</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {result.tokens.map((t, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: t.is_special ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-tertiary)',
                  border: `1px solid ${t.is_special ? 'rgba(245, 158, 11, 0.35)' : 'var(--border-subtle)'}`,
                  color: t.is_special ? '#f59e0b' : 'var(--text-main)',
                  fontSize: '0.8rem'
                }}
              >
                <span style={{ fontWeight: 700 }}>{t.token}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>#{t.token_id}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Session Prediction History & Export Toolbar */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              Session Prediction History
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Persistent within active tab session ({history.length} records)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={exportHistoryJSON}
              disabled={history.length === 0}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
            >
              <FileJson size={13} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={exportHistoryCSV}
              disabled={history.length === 0}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
            >
              <FileSpreadsheet size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
            No evaluations run yet. Type a sentence above to populate history.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Time</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Analyzed Text</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Label</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Confidence</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Latency</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{h.time}</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-main)', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{h.text}"
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span className={`badge ${h.label === 'POSITIVE' ? 'badge-positive' : 'badge-negative'}`}>
                        {h.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {(h.conf * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--accent-cyan)' }}>
                      {h.latency} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
