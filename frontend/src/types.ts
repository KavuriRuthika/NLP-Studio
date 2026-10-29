export type PageId =
  | 'overview'
  | 'multitask'
  | 'analyzer'
  | 'arena'
  | 'models'
  | 'explainability'
  | 'dataset'
  | 'robustness'
  | 'multilingual-docs'
  | 'experiments'
  | 'analytics'
  | 'reliability'
  | 'errors'
  | 'research'
  | 'insights'
  | 'responsible-ai'
  | 'docs';

export interface TokenItem {
  position: number;
  token: string;
  token_id: number;
  is_special: boolean;
}

export interface AnalyzeResult {
  text: string;
  model: string;
  predicted_label: 'POSITIVE' | 'NEGATIVE';
  confidence: number;
  latency_ms: number;
  probabilities: {
    positive?: number;
    negative?: number;
  };
  tokens: TokenItem[];
  token_count: number;
  interpretation: string;
  langchain_output?: {
    orchestration_framework: string;
    input_prompt: string;
    predicted_sentiment: string;
    confidence_score: number;
    engine: string;
  };
}

export interface ModelCard {
  id: string;
  name: string;
  model_hub_id: string;
  family: string;
  architecture_type: string;
  layers: number;
  attention_heads: number;
  hidden_size: number;
  parameters: string;
  status: string;
  intended_task: string;
  latency_estimate_cpu: string;
  compression_method: string;
  strengths: string[];
  limitations: string[];
}

export interface ErrorRecord {
  id: string;
  category: string;
  input_text: string;
  ground_truth: string;
  predicted_label: string;
  confidence: number;
  status: string;
  hypothesis: string;
}

export interface ResearchQuestion {
  id: string;
  title: string;
  question: string;
  hypothesis: string;
  metric: string;
  status: string;
  decision: string;
  evidence: string;
  conclusion: string;
}

export interface SystemMetrics {
  benchmark_name: string;
  sample_size: number;
  class_distribution: {
    positive_count: number;
    negative_count: number;
    balance_ratio: string;
  };
  distilbert: {
    model_name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    mean_latency_ms: number;
    confusion_matrix: {
      true_negative: number;
      false_positive: number;
      false_negative: number;
      true_positive: number;
    };
  };
  bert_base: {
    model_name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    mean_latency_ms: number;
    speedup_vs_bert: string;
  };
  latency_profile: Array<{
    tokens: number;
    mean_latency_ms: number;
    std_latency_ms: number;
  }>;
}
