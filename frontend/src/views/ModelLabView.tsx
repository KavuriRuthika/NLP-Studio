import React, { useState, useEffect } from 'react';
import { Layers, Cpu, Zap, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { ModelCard } from '../types';

export const ModelLabView: React.FC = () => {
  const [models, setModels] = useState<ModelCard[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelCard | null>(null);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        setModels(data);
        if (data.length > 0) setSelectedModel(data[0]);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Intro Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Language Model Architecture Laboratory
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Investigate the mathematical trade-offs between full-scale transformer representations (BERT-Base) and distilled, student models (DistilBERT). Contrast bidirectional encoder-only architectures against autoregressive decoder-only models (GPT-2).
        </p>
      </div>

      {/* Model Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {models.map((m) => {
          const isSelected = selectedModel?.id === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedModel(m)}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-violet)' : 'var(--border-subtle)',
                background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span className={m.id === 'distilbert' ? 'badge badge-success' : 'badge badge-violet'}>
                    {m.status}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '8px' }}>
                    {m.name}
                  </h3>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-cyan)' }}>
                    {m.model_hub_id}
                  </div>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} color="var(--accent-violet)" />
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', margin: '1rem 0' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '6px 10px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Parameters: </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.parameters}</span>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '6px 10px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Architecture: </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.architecture_type.split(' ')[0]}</span>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '6px 10px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Layers: </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.layers} Encoder</span>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '6px 10px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-dim)' }}>CPU Latency: </span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{m.latency_estimate_cpu}</span>
                </div>
              </div>

              {/* Strengths & Limitations preview */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Key Advantage:</div>
                <div>{m.strengths[0]}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Model Deep-Dive Drawer */}
      {selectedModel && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {selectedModel.name} Architectural Deep-Dive
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {selectedModel.compression_method}
              </div>
            </div>
            <a
              href={`https://huggingface.co/${selectedModel.model_hub_id}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <BookOpen size={14} />
              <span>Hugging Face Model Card</span>
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Strengths */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={16} />
                <span>Empirical Strengths</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedModel.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                <AlertTriangle size={16} />
                <span>Known Limitations & Edge Cases</span>
              </div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedModel.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Model Selection Criteria Comparison Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Language Model Selection Matrix
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '10px 14px' }}>Feature / Criterion</th>
                <th style={{ padding: '10px 14px' }}>DistilBERT (Selected Primary)</th>
                <th style={{ padding: '10px 14px' }}>BERT-Base (Comparison)</th>
                <th style={{ padding: '10px 14px' }}>GPT-2 (Reference)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feat: 'Architectural Family', m1: 'Encoder-Only', m2: 'Encoder-Only', m3: 'Decoder-Only' },
                { feat: 'Self-Attention Direction', m1: 'Bidirectional (Full Context)', m2: 'Bidirectional (Full Context)', m3: 'Causal Masked (Left-to-Right)' },
                { feat: 'Transformer Encoder Layers', m1: '6 Layers (Distilled)', m2: '12 Layers', m3: '12 Layers' },
                { feat: 'Hidden State Dimension', m1: '768 Dimensions', m2: '768 Dimensions', m3: '768 Dimensions' },
                { feat: 'Attention Heads', m1: '12 Heads per layer', m2: '12 Heads per layer', m3: '12 Heads per layer' },
                { feat: 'Parameter Footprint', m1: '66.9 Million (~268 MB)', m2: '109.5 Million (~438 MB)', m3: '124 Million (~500 MB)' },
                { feat: 'Benchmark Accuracy (SST-2)', m1: '99.00% Verified', m2: '99.00% Verified', m3: 'Requires Generative Prompting' },
                { feat: 'Mean CPU Inference Latency', m1: '25.22 ms (Fast)', m2: '42.10 ms (+67% slower)', m3: '~65 ms per token generated' },
                { feat: 'Classification Head', m1: '[CLS] Linear Projection (768->2)', m2: '[CLS] Linear Projection (768->2)', m3: 'LM Head (Vocab 50k->Logits)' }
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>{row.feat}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--accent-cyan)' }}>{row.m1}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{row.m2}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-dim)' }}>{row.m3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
