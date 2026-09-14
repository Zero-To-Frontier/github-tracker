export const categories = [
  { id: "agents", name: "AI Agent", description: "스스로 판단하고 실행하는 에이전트", color: "#8b78ed" },
  { id: "coding", name: "Coding Agent", description: "코드를 함께 쓰는 새로운 동료", color: "#6398f3" },
  { id: "rag", name: "RAG", description: "더 정확한 답변을 위한 지식 연결", color: "#edaa65" },
  { id: "memory", name: "Memory", description: "맥락을 기억하는 AI", color: "#d781b4" },
  { id: "local", name: "Local AI", description: "내 환경에서 실행하는 모델", color: "#60bba5" },
] as const;

export type CategoryId = typeof categories[number]["id"];
export type Period = 1 | 7;

export interface ProjectSeed {
  slug: string;
  repo: string;
  name: string;
  summary: string;
  description: string;
  categories: CategoryId[];
  language: string;
  accent: string;
  featured?: boolean;
  paperIds: string[];
  website?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string;
  publishedAt: string;
  summary: string;
  category: CategoryId;
  kind: "research" | "foundation";
  url: string;
  projectSlugs: string[];
  reason: string;
  relatedPaperIds: string[];
  evidenceUrl: string;
  relationLabel: string;
}

export interface Catalog {
  projects: ProjectSeed[];
  papers: Paper[];
}

export interface Snapshot {
  date: string;
  observedAt: string;
  stars: number;
}

export interface HistoryWeek {
  week: number;
  total: number;
  days: number[];
}

export interface ProjectMetrics {
  repoId?: number;
  repo: string;
  stars?: number;
  forks?: number;
  language?: string;
  license?: string;
  archived?: boolean;
  url?: string;
  website?: string;
  collectedAt?: string;
  snapshots: Snapshot[];
  history: HistoryWeek[];
  historyCollectedAt?: string;
  error?: string;
}

export interface NewsItem {
  id: string;
  projectSlug: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  kind: "release";
  tag: string;
}

export interface Collection {
  collectedAt: string | null;
  attemptedAt: string | null;
  projects: Record<string, ProjectMetrics>;
  news: NewsItem[];
  papers?: Paper[];
  run: { successful: number; total: number; errors: string[] };
}

export interface Project extends ProjectSeed {
  metrics: ProjectMetrics;
}

export interface PortalData {
  projects: Project[];
  news: NewsItem[];
  papers: Paper[];
  collectedAt: string | null;
  attemptedAt: string | null;
  run: Collection["run"];
}
