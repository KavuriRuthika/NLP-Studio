import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, FlaskConical, Target, Award } from 'lucide-react';
import { ResearchQuestion } from '../types';

export const ResearchQuestionsView: React.FC = () => {
  const [questions, setQuestions] = useState<ResearchQuestion[]>([]);

  useEffect(() => {
    fetch('/api/research')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Intro Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Scientific Research Questions & Empirical Hypotheses
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Transforming standard model inference into scientific discovery. Each research question is anchored by a testable hypothesis, rigorous evaluation metric, and actual empirical evidence collected during benchmark execution.
        </p>
      </div>

      {/* Research Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {questions.map((rq) => (
          <div key={rq.id} className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                  {rq.id}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {rq.title}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} />
                  <span>{rq.status}</span>
                </span>
                <span className="badge badge-cyan">
                  <Award size={12} />
                  <span>Hypothesis {rq.decision}</span>
                </span>
              </div>
            </div>

            {/* Core Question and Hypothesis Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', margin: '1rem 0' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Formal Research Question
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500, marginTop: '4px' }}>
                  {rq.question}
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Testable Hypothesis
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500, marginTop: '4px' }}>
                  {rq.hypothesis}
                </div>
              </div>
            </div>

            {/* Evidence & Conclusion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>Empirical Evidence: </strong>
                {rq.evidence}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--status-success)' }}>Scientific Conclusion: </strong>
                {rq.conclusion}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
