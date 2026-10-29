import React from 'react';
import { BrainCircuit, Layers, GitCommit, Split, ArrowDown, Shield, Sparkles } from 'lucide-react';

export const ModelInsightsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Intro Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Transformer Architecture & Linguistic Mechanics
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          An educational dissection of how DistilBERT transforms characters into discrete subwords, projects them into continuous vector embeddings, computes bidirectional multi-head self-attention, and produces calibrated sentiment predictions.
        </p>
      </div>

      {/* Step-by-Step Architectural Flow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Stage 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
            01
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              WordPiece Subword Tokenization & Positional Encoding
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              Raw text strings are decomposed using a fixed vocabulary of 30,522 tokens. Unknown or complex words are segmented into subword stems with double-hash prefixes (e.g., <code>"charming"</code> $\to$ <code>["charm", "##ing"]</code>). The special classification token <code>[CLS]</code> is prepended at index 0, and sine/cosine positional embeddings are added to preserve word order.
            </p>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
            02
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Dense 768-Dimensional Embedding Lookup
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              Each integer token ID indexes a learned continuous embedding matrix of shape $[30522 \times 768]$. Semantically related words occupy nearby vector geometric space, initializing the input sequence tensor for the transformer stack.
            </p>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.25)', color: '#c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
            03
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              6-Layer Multi-Head Self-Attention (12 Attention Heads per Layer)
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              Every token computes scaled dot-product attention across all other tokens simultaneously:
              <br />
              <code style={{ color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', margin: '4px 0' }}>
                Attention(Q, K, V) = softmax( (Q · K^T) / √d_k ) · V
              </code>
              <br />
              This allows the model to dynamically resolve grammatical negation across distant clauses (e.g., connecting <code>"wasn't"</code> directly to <code>"bad"</code>).
            </p>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
            04
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              [CLS] Pooling & Linear Classification Head
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              The final 768-dimensional contextual vector corresponding to the <code>[CLS]</code> token aggregates the sentence-level representation. It passes through a Dropout layer (p=0.2) into a linear feed-forward projection [768 → 2], followed by Softmax normalization to yield class probabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Knowledge Distillation Theory */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Knowledge Distillation Triple-Loss Formulation
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          DistilBERT compresses the 12-layer BERT teacher into a 6-layer student by optimizing a convex combination of three losses during training:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-violet)', marginBottom: '4px' }}>1. Distillation Loss (L_ce)</div>
            <div style={{ color: 'var(--text-muted)' }}>
              Cross-entropy matching the student's softmax probabilities to the teacher's softened probability distribution over temperature T.
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>2. Masked LM Loss (L_mlm)</div>
            <div style={{ color: 'var(--text-muted)' }}>
              Supervised masked language modeling predicting dynamic 15% masked words from raw training text.
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, color: 'var(--status-success)', marginBottom: '4px' }}>3. Cosine Loss (L_cos)</div>
            <div style={{ color: 'var(--text-muted)' }}>
              Cosine distance aligning the directions of student and teacher hidden state vector representations.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
