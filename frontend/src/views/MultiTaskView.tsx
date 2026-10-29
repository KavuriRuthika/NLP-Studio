import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Copy,
  Download,
  Clock,
  Cpu,
  Smile,
  FileText,
  Tag,
  HelpCircle,
  Compass,
  GitCompare,
  Globe2,
  Search,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

import { PageId } from '../types';

interface MultiTaskViewProps {
  onNavigate?: (page: PageId) => void;
}

type TaskTab =
  | 'sentiment'
  | 'emotion'
  | 'summarize'
  | 'ner'
  | 'qa'
  | 'zeroshot'
  | 'similarity'
  | 'langdetect'
  | 'search'
  | 'keywords';

export const MultiTaskView: React.FC<MultiTaskViewProps> = () => {
  const [activeTab, setActiveTab] = useState<TaskTab>('sentiment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Task-specific inputs
  const [sentimentText, setSentimentText] = useState('This film was an absolute triumph of visual imagination and emotional depth.');
  const [sentimentModel, setSentimentModel] = useState<'distilbert' | 'bert'>('distilbert');
  const [emotionText, setEmotionText] = useState('I was weeping during the final farewell scene; it was utterly heartbreaking and sorrowful.');
  const [summarizeText, setSummarizeText] = useState('Natural Language Processing has witnessed remarkable architectural transitions over the past decade. Initial approaches relied on recurrent neural networks like LSTMs to process sequential tokens. With the publication of Vaswani et al. in 2017, the Transformer architecture introduced multi-head self-attention. This eliminated sequential bottlenecks and facilitated parallelized training over billions of tokens.');
  const [summarizeRatio, setSummarizeRatio] = useState<number>(0.5);
  const [nerText, setNerText] = useState('David Lynch directed Mulholland Drive for Google in Chicago in October 2001.');
  const [qaContext, setQaContext] = useState('DistilBERT was proposed by Victor Sanh and colleagues at Hugging Face in late 2019. It uses a triple loss function combining distillation loss, masked language modeling loss, and cosine embedding loss to retain 97% of BERT understanding.');
  const [qaQuestion, setQaQuestion] = useState('Who proposed DistilBERT and what three losses does it use?');
  const [zeroShotText, setZeroShotText] = useState('The spacecraft successfully entered Martian orbit after a nine-month interplanetary cruise.');
  const [zeroShotLabels, setZeroShotLabels] = useState('Astrophysics, Financial Markets, Gourmet Cuisine, Ancient History');
  const [simText1, setSimText1] = useState('A deeply poetic and visually astonishing cinematic masterpiece.');
  const [simText2, setSimText2] = useState('An exceptional, gorgeous film with stunning imagery.');
  const [langText, setLangText] = useState('Esta película fue una verdadera joya con un guión excelente y grandes actuaciones.');
  const [searchCorpus, setSearchCorpus] = useState(
    '1. BERT employs bidirectional representations to understand context.\n' +
    '2. DistilBERT compresses the 110M parameter BERT model into 66M parameters.\n' +
    '3. Recurrent neural networks suffer from vanishing gradients across long contexts.\n' +
    '4. Transformers utilize multi-head self-attention for sequence modeling.'
  );
  const [searchQuery, setSearchQuery] = useState('How does DistilBERT achieve compression?');
  const [kwText, setKwText] = useState('Knowledge distillation enables compact student transformer models to match heavy teacher networks with reduced inference latency.');

  const runTask = async (tab: TaskTab) => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      let endpoint = '/api/analyze';
      let payload: any = {};

      if (tab === 'sentiment') {
        endpoint = '/api/analyze';
        payload = { text: sentimentText, model: sentimentModel };
      } else if (tab === 'emotion') {
        endpoint = '/api/multitask/emotion';
        payload = { text: emotionText };
      } else if (tab === 'summarize') {
        endpoint = '/api/multitask/summarize';
        payload = { text: summarizeText, ratio: summarizeRatio };
      } else if (tab === 'ner') {
        endpoint = '/api/multitask/ner';
        payload = { text: nerText };
      } else if (tab === 'qa') {
        endpoint = '/api/multitask/qa';
        payload = { context: qaContext, question: qaQuestion };
      } else if (tab === 'zeroshot') {
        endpoint = '/api/multitask/zeroshot';
        payload = {
          text: zeroShotText,
          candidate_labels: zeroShotLabels.split(',').map((s) => s.trim()).filter(Boolean)
        };
      } else if (tab === 'similarity') {
        endpoint = '/api/multitask/similarity';
        payload = { text1: simText1, text2: simText2 };
      } else if (tab === 'langdetect') {
        endpoint = '/api/multitask/langdetect';
        payload = { text: langText };
      } else if (tab === 'search') {
        endpoint = '/api/multitask/search';
        payload = {
          query: searchQuery,
          corpus: searchCorpus.split('\n').map((l) => l.trim()).filter(Boolean)
        };
      } else if (tab === 'keywords') {
        endpoint = '/api/multitask/keywords';
        payload = { text: kwText, top_n: 6 };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Inference execution failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nlp_result_${activeTab}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: Array<{ id: TaskTab; label: string; icon: React.FC<{ size?: number; className?: string }> }> = [
    { id: 'sentiment', label: '1. Sentiment', icon: Smile },
    { id: 'emotion', label: '2. Emotion', icon: Sparkles },
    { id: 'summarize', label: '3. Summarization', icon: FileText },
    { id: 'ner', label: '4. Named Entities', icon: Tag },
    { id: 'qa', label: '5. Question Answering', icon: HelpCircle },
    { id: 'zeroshot', label: '6. Zero-Shot', icon: Compass },
    { id: 'similarity', label: '7. Text Similarity', icon: GitCompare },
    { id: 'langdetect', label: '8. Language Detect', icon: Globe2 },
    { id: 'search', label: '9. Semantic Search', icon: Search },
    { id: 'keywords', label: '10. Keywords', icon: KeyRound }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.25rem 0.75rem', borderRadius: '100px', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.25)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Layers size={14} /> Unified Transformer Workspace (Feature 1)
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>
            Multi-Task NLP Playground
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '820px', margin: 0 }}>
            Unified execution bench for 10 distinct NLP disciplines using task-specific model heads, exact timing metrics, and structured response validation.
          </p>
        </div>
      </div>

      {/* Task Tabs Bar */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid var(--border-subtle)' }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setResult(null);
                setError(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                border: 'none',
                background: isActive ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Input Column & Output Column */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '1.5rem' }}>
        {/* Input Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Task Configuration & Input</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Task: {activeTab.toUpperCase()}</span>
          </div>

          {/* Conditional Inputs per Tab */}
          {activeTab === 'sentiment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Model Architecture</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSentimentModel('distilbert')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: sentimentModel === 'distilbert' ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-tertiary)',
                      border: `1px solid ${sentimentModel === 'distilbert' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    DistilBERT (66M)
                  </button>
                  <button
                    onClick={() => setSentimentModel('bert')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: sentimentModel === 'bert' ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-tertiary)',
                      border: `1px solid ${sentimentModel === 'bert' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    BERT-Base (110M)
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Input Review</label>
                <textarea
                  rows={4}
                  value={sentimentText}
                  onChange={(e) => setSentimentText(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'emotion' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Text for Affective Emotion Classification</label>
              <textarea
                rows={4}
                value={emotionText}
                onChange={(e) => setEmotionText(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'block' }}>Classifies Joy, Sadness, Anger, Fear, Love, Surprise.</span>
            </div>
          )}

          {activeTab === 'summarize' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Compression Target Ratio</label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{Math.round(summarizeRatio * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.1"
                  value={summarizeRatio}
                  onChange={(e) => setSummarizeRatio(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Document Passage</label>
                <textarea
                  rows={5}
                  value={summarizeText}
                  onChange={(e) => setSummarizeText(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'ner' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Input Text for Named Entity Recognition</label>
              <textarea
                rows={4}
                value={nerText}
                onChange={(e) => setNerText(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'block' }}>Extracts PERSON, ORGANIZATION, LOCATION, DATE, and PRODUCT spans.</span>
            </div>
          )}

          {activeTab === 'qa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Context Passage</label>
                <textarea
                  rows={4}
                  value={qaContext}
                  onChange={(e) => setQaContext(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Question</label>
                <input
                  type="text"
                  value={qaQuestion}
                  onChange={(e) => setQaQuestion(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'zeroshot' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Text to Categorize</label>
                <textarea
                  rows={3}
                  value={zeroShotText}
                  onChange={(e) => setZeroShotText(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Candidate Categories (Comma Separated)</label>
                <input
                  type="text"
                  value={zeroShotLabels}
                  onChange={(e) => setZeroShotLabels(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'similarity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Sequence A</label>
                <textarea
                  rows={3}
                  value={simText1}
                  onChange={(e) => setSimText1(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Sequence B</label>
                <textarea
                  rows={3}
                  value={simText2}
                  onChange={(e) => setSimText2(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'langdetect' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Multilingual Text</label>
              <textarea
                rows={4}
                value={langText}
                onChange={(e) => setLangText(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
              />
            </div>
          )}

          {activeTab === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Target Query</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Passage Corpus (One per line)</label>
                <textarea
                  rows={5}
                  value={searchCorpus}
                  onChange={(e) => setSearchCorpus(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Source Text for Salience Extraction</label>
              <textarea
                rows={4}
                value={kwText}
                onChange={(e) => setKwText(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-main)', fontSize: '0.88rem' }}
              />
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => runTask(activeTab)}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '0.5rem',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)'
            }}
          >
            {loading ? <Clock size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Running Transformer Inference...' : `Execute ${activeTab.toUpperCase()}`}
          </button>
        </div>

        {/* Output Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Inference Response</span>
            </div>
            {result && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={copyResult}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '4px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? <CheckCircle2 size={12} color="var(--status-pos)" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={exportJSON}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '4px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={12} /> JSON
                </button>
              </div>
            )}
          </div>

          {/* Empty / Error / Result States */}
          {error && (
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.82rem' }}>
              {error}
            </div>
          )}

          {!result && !loading && !error && (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              <Layers size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.88rem' }}>Select task parameters and click Execute to observe verified model inferences.</p>
            </div>
          )}

          {loading && (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ width: '28px', height: '28px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto 1rem' }} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Evaluating model representation on CPU...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Telemetry Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Cpu size={12} /> {result.model || 'Transformer'}
                </span>
                {result.latency_ms !== undefined && (
                  <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {result.latency_ms} ms
                  </span>
                )}
              </div>

              {/* Specific Visual Renderers */}
              {activeTab === 'sentiment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: result.predicted_label === 'POSITIVE' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${result.predicted_label === 'POSITIVE' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                    <span style={{ fontWeight: 700, color: result.predicted_label === 'POSITIVE' ? 'var(--status-pos)' : 'var(--status-neg)' }}>{result.predicted_label}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>Confidence: {Math.round(result.confidence * 1000) / 10}%</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{result.interpretation}</div>
                </div>
              )}

              {activeTab === 'emotion' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Primary Emotion: <span style={{ color: 'var(--accent-cyan)' }}>{result.primary_emotion}</span> ({Math.round(result.confidence * 100)}%)
                  </div>
                  {result.emotion_distribution && Object.entries(result.emotion_distribution).map(([emo, val]: any) => (
                    <div key={emo} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem' }}>
                      <span style={{ width: '70px', color: 'var(--text-muted)' }}>{emo}</span>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${val * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                      </div>
                      <span style={{ width: '42px', textAlign: 'right', color: 'var(--text-main)' }}>{Math.round(val * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'summarize' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Compression: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{result.compression_ratio}</span> ({result.summary_sentences} sentences retained)
                  </div>
                  <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                    {result.summary}
                  </div>
                </div>
              )}

              {activeTab === 'ner' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Identified {result.entity_count} Entity Spans:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.entities?.map((ent: any, idx: number) => (
                      <span key={idx} style={{ padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'rgba(34, 211, 238, 0.12)', border: '1px solid rgba(34, 211, 238, 0.3)', color: 'var(--text-main)', fontSize: '0.78rem' }}>
                        <strong>{ent.entity}</strong> <span style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>[{ent.label}]</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'qa' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Extracted Answer Span:</div>
                  <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
                    "{result.answer}"
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Relevance Confidence: {Math.round(result.confidence * 100)}%</span>
                </div>
              )}

              {activeTab === 'zeroshot' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Top Category: <span style={{ color: 'var(--status-pos)' }}>{result.top_label}</span> ({Math.round(result.top_confidence * 100)}%)
                  </div>
                  {result.scores && Object.entries(result.scores).map(([label, score]: any) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem' }}>
                      <span style={{ width: '130px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${score * 100}%`, height: '100%', background: 'var(--accent-gradient)' }} />
                      </div>
                      <span style={{ width: '42px', textAlign: 'right', color: 'var(--text-main)' }}>{Math.round(score * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'similarity' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{result.percentage}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Cosine Metric: {result.similarity_score}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-pos)', fontWeight: 600, marginTop: '4px' }}>{result.interpretation}</div>
                  </div>
                </div>
              )}

              {activeTab === 'langdetect' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.25)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{result.detected_language}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>N-gram Distribution Confidence: {Math.round(result.confidence * 100)}%</div>
                  </div>
                </div>
              )}

              {activeTab === 'search' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Top Ranked Passages:</div>
                  {result.results?.map((r: any) => (
                    <div key={r.rank} style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Rank #{r.rank}</span>
                        <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>Score: {r.similarity_score}</span>
                      </div>
                      <div style={{ color: 'var(--text-main)', lineHeight: 1.5 }}>{r.passage}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'keywords' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Salient Keyphrases:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.keywords?.map((k: any, idx: number) => (
                      <span key={idx} style={{ padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.14)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--text-main)', fontSize: '0.78rem' }}>
                        {k.keyword} <span style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>({k.score})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON Debug Expander */}
              <details style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <summary style={{ cursor: 'pointer' }}>View Raw JSON Contract</summary>
                <pre style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#080B14', borderRadius: '4px', overflowX: 'auto', color: '#94a3b8' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
