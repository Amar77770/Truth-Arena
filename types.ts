
export enum ClaimSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum VerdictType {
  SUPPORTED = 'SUPPORTED',
  CONTRADICTED = 'CONTRADICTED',
  UNVERIFIABLE = 'UNVERIFIABLE',
  MISLEADING = 'MISLEADING'
}

export interface Source {
  title: string;
  uri: string;
}

export interface Claim {
  id: string;
  text: string;
  category: 'Date' | 'Eligibility' | 'Result' | 'Pattern' | 'Other';
  severity: ClaimSeverity;
  verdict: VerdictType;
  confidenceScore: number; // 0-100
  reasoning: string;
  evidencePoints: string[]; // Detailed evidence bullets
  relatedSources: number[]; // Indices of sources in the main source list
}

export interface DebateTurn {
  speaker: 'Advocate Rumor' | 'Advocate Fact' | 'Judge';
  text: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface FactCheckReport {
  topic: string;
  summary: string;
  timestamp: string;
  claims: Claim[];
  sources: Source[];
  overallConfidence: number;
  debateScript: DebateTurn[];
  officialTimeline: TimelineEvent[];
  commonMisconceptions: string[];
  actionRecommendation: string;
  isSimulation?: boolean; // New Flag for Quota/Error handling
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export type ViewState = 'LANDING' | 'LOGIN' | 'FIGHT' | 'CASES' | 'ABOUT' | 'COMMUNITY' | 'NEWS' | 'ADMIN';

export interface CaseHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  verdict: string;
  confidence: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
