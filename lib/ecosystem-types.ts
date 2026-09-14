export type EcosystemCategoryId = "models" | "coding" | "agents" | "orchestration" | "tools" | "memory" | "data" | "infrastructure" | "open-models" | "training" | "evaluation" | "deployment";

export interface EcosystemSource { title: string; url: string }
export interface EcosystemNode {
  id: string;
  name: string;
  category: EcosystemCategoryId;
  mark: string;
  mapLabel: string;
  tagline: string;
  description: string;
  problem: string;
  role: string;
  useCases: string[];
  features: string[];
  openness: "open-source" | "source-available" | "service" | "open-standard" | "open-weight" | "proprietary";
  license: string;
  licenseUrl?: string;
  website: string;
  docs: string;
  github?: string;
  sources: EcosystemSource[];
  verifiedAt: string;
}
export interface EcosystemEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  description: string;
  source: EcosystemSource;
  verifiedAt: string;
}
export interface EcosystemCategory {
  id: EcosystemCategoryId;
  name: string;
  subtitle: string;
  description: string;
  color: string;
}
