export interface Lobe {
  id: string;
  number: string;
  name: string;
  role: string;
  description: string;
  status: 'SEALED' | 'ACTIVE' | 'SUPERPOSITION' | 'EQUILIBRIUM';
  metric: string;
  metricLabel: string;
  governance: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  agent: string;
  lobe?: string;
  msg: string;
  type?: 'cyan' | 'amber' | 'green' | 'rose';
  yield?: boolean;
  yieldAmount?: number;
  hash?: string;
}

export interface DefenseModule {
  id: string;
  num: string;
  title: string;
  description: string;
  status: string;
  actionLabel: string;
  type: 'config' | 'audit' | 'sieve' | 'title' | 'shield';
}

export interface PricingTier {
  id: string;
  name: string;
  badge: string;
  upfront: string;
  recurring: string;
  sla: string;
  targetAudience: string;
  keySpecs: string[];
  deliverables: string[];
}
