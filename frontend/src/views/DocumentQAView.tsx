import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  HelpCircle,
  Globe2,
  Upload,
  BookOpen,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const DocumentQAView: React.FC = () => {
  const [subTab, setSubTab] = useState<'docs' | 'multilingual'>('docs');

  // Document QA state
  const [docs, setDocs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('How does knowledge distillation compress BERT?');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [question, setQuestion] = useState('What loss function does DistilBERT use during pretraining?');
  const [qaAnswer, setQaAnswer] = useState<any>(null);
  const [docTitle, setDocTitle] = useState('Transformer_Distillation_Mechanics.txt');
  const [docBody, setDocBody] = useState(
    'Knowledge distillation is a compression technique in which a compact student model is trained to reproduce the behavior of a larger teacher model.\n\n' +
    'DistilBERT uses a triple loss function combining: 1) Distillation loss against the teacher soft probabilities, 2) Masked language modeling loss on hard ground-truth tokens, and 3) Cosine embedding loss to align student and teacher hidden vectors.\n\n' +
    'This allows DistilBERT to retain 97% of language understanding while reducing parameter count by 40% and running 60% faster on CPU.'
  );
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  // Multilingual state
  const [multiData, setMultiData] = useState<any>(null);
  const [multiLoading, setMultiLoading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents/list');
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadDocument = async () => {
    if (!docBody.trim() || !docTitle.trim()) return;
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: docTitle, content: docBody })
      });
      if (res.ok) {
        const data = await res.json();
        setUploadMsg(`Indexed "${data.filename}" (${data.chunks_indexed} passages)`);
        fetchDocs();
        setTimeout(() => setUploadMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchPassages = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch('/api/documents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, top_k: 3 })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const askGrounded = async () => {
    if (!question.trim()) return;
    try {
      const res = await fetch('/api/documents/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      if (res.ok) {
        const data = await res.json();
        setQaAnswer(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const runMultilingual = async () => {
    setMultiLoading(true);
    try {
      const res = await fetch('/api/multilingual/evaluate');
      if (res.ok) {
        const data = await res.json();
        setMultiData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMultiLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.25rem 0.75rem', borderRadius: '100px', background: 'rgba(34, 211, 238, 0.12)', border: '1px solid rgba(34, 211, 238, 0.25)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.75rem' }}>
          <BookOpen size={14} /> Knowledge Retrieval & Cross-Lingual (Features 6 & 7)
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
          Document Search, Grounded Q&A & Multilingual
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '820px', margin: 0 }}>
          Index research papers, retrieve semantically relevant passages, ask grounded questions with verifiable citations or explicit refusal notices, and audit cross-lingual model transfer.
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
        <button
          onClick={() => setSubTab('docs')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            border: 'none',
            background: subTab === 'docs' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
            color: subTab === 'docs' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontWeight: subTab === 'docs' ? 700 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            borderBottom: subTab === 'docs' ? '2px solid var(--accent-primary)' : '2px solid transparent'
          }}
        >
          <FileText size={16} /> Semantic Search & Grounded Q&A
        </button>
        <button
          onClick={() => {
            setSubTab('multilingual');
            if (!multiData) runMultilingual();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            border: 'none',
            background: subTab === 'multilingual' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
            color: subTab === 'multilingual' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontWeight: subTab === 'multilingual' ? 700 : 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            borderBottom: subTab === 'multilingual' ? '2px solid var(--accent-primary)' : '2px solid transparent'
          }}
        >
          <Globe2 size={16} /> Multilingual Evaluation (6 Languages)
        </button>
      </div>

      {subTab === 'docs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Grounded Question Answering Box */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '3px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="var(--accent-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Grounded Document Question Answering
                </span>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Passage Retrieval Grounding</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any research question about indexed papers..."
                style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
              />
              <button
                onClick={askGrounded}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Ask Grounded
              </button>
            </div>

            {/* Answer Display */}
            {qaAnswer && (
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: qaAnswer.grounded ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', border: `1px solid ${qaAnswer.grounded ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: qaAnswer.grounded ? 'var(--status-pos)' : 'var(--status-neg)' }}>
                    {qaAnswer.grounded ? 'VERIFIED GROUNDED ANSWER' : 'HONEST GROUNDED REFUSAL'}
                  </span>
                  {qaAnswer.confidence && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Confidence: {Math.round(qaAnswer.confidence * 100)}%
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {qaAnswer.answer}
                </div>

                {qaAnswer.supporting_passage && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: '4px', borderLeft: '3px solid var(--accent-cyan)' }}>
                    <strong>Supporting Passage:</strong> "{qaAnswer.supporting_passage}"
                    {qaAnswer.citation && (
                      <div style={{ marginTop: '4px', color: 'var(--accent-cyan)', fontSize: '0.72rem' }}>
                        Source: {qaAnswer.citation.document} (Passage #{qaAnswer.citation.passage_index + 1}) • Similarity: {qaAnswer.citation.similarity_score}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Semantic Search & Document Indexer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Left: Semantic Passage Search */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={16} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Semantic Passage Search</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search semantic corpus..."
                  style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.55rem', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
                <button
                  onClick={searchPassages}
                  style={{ padding: '0.55rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-primary)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Search
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {searchResults.map((r) => (
                  <div key={r.rank} style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-cyan)', fontSize: '0.72rem', marginBottom: '2px' }}>
                      <span>Rank #{r.rank} • {r.source_document}</span>
                      <span>Score: {r.similarity_score}</span>
                    </div>
                    <div style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{r.passage}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Upload & Index Research Documents */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={16} color="var(--status-pos)" />
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Index Research Document</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Indexed: {docs.length} files</span>
              </div>

              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Document filename (e.g. paper.txt)"
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.82rem' }}
              />

              <textarea
                rows={5}
                value={docBody}
                onChange={(e) => setDocBody(e.target.value)}
                placeholder="Paste document text (paragraphs separated by blank lines)..."
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.55rem', color: 'var(--text-main)', fontSize: '0.82rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {uploadMsg && <span style={{ fontSize: '0.75rem', color: 'var(--status-pos)' }}>{uploadMsg}</span>}
                <button
                  onClick={uploadDocument}
                  style={{ marginLeft: 'auto', padding: '0.55rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-gradient)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Chunk & Index
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'multilingual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {multiLoading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ width: '28px', height: '28px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto 1rem' }} />
              <p>Evaluating cross-lingual transfer across 6 European languages...</p>
            </div>
          )}

          {multiData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Multilingual Overview Banner */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cross-Lingual Accuracy</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '4px 0' }}>
                    {Math.round(multiData.multilingual_accuracy * 100)}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>6 Language Samples Tested</div>
                </div>

                <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Native Training Language</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-pos)', margin: '4px 0' }}>
                    English (SST-2)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Zero-shot cross-lingual transfer</div>
                </div>

                <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vocabulary Coverage</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
                    WordPiece OOV Risk
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Subword fragmentation on non-English</div>
                </div>
              </div>

              {/* Multilingual Language Table */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-main)' }}>
                  Per-Language Diagnostic Matrix
                </h3>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Language</th>
                        <th style={{ padding: '0.75rem' }}>Sample Sentence</th>
                        <th style={{ padding: '0.75rem' }}>Expected</th>
                        <th style={{ padding: '0.75rem' }}>Predicted</th>
                        <th style={{ padding: '0.75rem' }}>Confidence</th>
                        <th style={{ padding: '0.75rem' }}>Detected Lang</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {multiData.results?.map((r: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{r.language}</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '300px' }}>"{r.sample_text}"</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className={`badge ${r.expected_sentiment === 'POSITIVE' ? 'badge-positive' : 'badge-negative'}`}>{r.expected_sentiment}</span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className={`badge ${r.predicted_sentiment === 'POSITIVE' ? 'badge-positive' : 'badge-negative'}`}>{r.predicted_sentiment}</span>
                          </td>
                          <td style={{ padding: '0.75rem', color: 'var(--accent-cyan)' }}>{Math.round(r.confidence * 100)}%</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{r.detected_language}</td>
                          <td style={{ padding: '0.75rem' }}>
                            {r.is_correct ? <span className="badge badge-positive">CORRECT</span> : <span className="badge badge-negative">MISALIGNED</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
