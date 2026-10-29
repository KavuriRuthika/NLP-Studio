import React from 'react';
import { ShieldCheck, AlertOctagon, Scale, Leaf, EyeOff, UserCheck, AlertTriangle } from 'lucide-react';

export const ResponsibleAIView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Intro Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Responsible AI, Governance & Ethical Audit
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Evaluating algorithmic fairness, data privacy, confidence miscalibration, and environmental sustainability. Responsible deployment requires understanding the systemic boundaries between statistical correlation and real-world truth.
        </p>
      </div>

      {/* Warning Box: Prohibited High-Stakes Use Cases */}
      <div style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <AlertOctagon size={24} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--status-danger)', marginBottom: '4px' }}>
            Prohibited High-Stakes Applications
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            Automated sentiment classifiers must <strong>NEVER</strong> be deployed autonomously for consequential decisions regarding human individuals, such as mental health diagnosis, depression screening, employment termination, court sentencing, or automated academic grading.
          </p>
        </div>
      </div>

      {/* Ethical Dimensions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Data Bias */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <Scale size={20} color="var(--accent-violet)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Training Data & Dialectal Bias</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Pretrained models inherit racial, gender, and socio-economic biases present in scraped web text (Wikipedia, Reddit, BookCorpus). In sentiment tasks, dialectal variations (such as African American Vernacular English - AAVE) are frequently misclassified as negative due to lexical shifts.
          </p>
        </div>

        {/* Card 2: Privacy */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <EyeOff size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Zero-Egress Data Privacy</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            By running DistilBERT entirely on local CPU rather than dispatching customer text to proprietary cloud APIs (such as OpenAI or Anthropic), zero user reviews leave the private security perimeter, fully satisfying GDPR, HIPAA, and CCPA privacy mandates.
          </p>
        </div>

        {/* Card 3: Confidence Calibration */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <AlertTriangle size={20} color="var(--status-warning)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Softmax Confidence Miscalibration</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            As proven in our stress tests, DistilBERT produced <strong>93.4% confidence on an incorrect sarcastic sentence</strong> and <strong>97.3% on a neutral sentence</strong>. Softmax probability reflects vector alignment with SST-2 features, NOT epistemic certainty.
          </p>
        </div>

        {/* Card 4: Environmental Sustainability */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <Leaf size={20} color="var(--status-success)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Green NLP & Carbon Reduction</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Knowledge distillation cuts model parameters by 40% (66M vs. 110M) and inference latency by 39.8%. Across enterprise pipelines handling millions of daily inference requests, choosing DistilBERT saves megawatt-hours of data center electricity and cooling.
          </p>
        </div>
      </div>

      {/* Human Oversight Protocol */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <UserCheck size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recommended Human-in-the-Loop Safeguards
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>1. Confidence Thresholding</div>
            <div style={{ color: 'var(--text-muted)' }}>Flag all reviews with softmax confidence below 0.70 for manual human moderator review.</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>2. 3-Class Re-architecture</div>
            <div style={{ color: 'var(--text-muted)' }}>Fine-tune models with an explicit Neutral class to eliminate forced polar distortion.</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>3. Regular Bias Auditing</div>
            <div style={{ color: 'var(--text-muted)' }}>Perform counterfactual token testing on demographic names to identify systemic sentiment bias.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
