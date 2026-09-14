import type { Catalog, Collection, HistoryWeek, NewsItem, Paper, ProjectMetrics, Snapshot } from "./types";

export interface RepositoryResponse {
  id: number;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  license: { spdx_id: string } | null;
  archived: boolean;
  private: boolean;
  html_url: string;
  homepage: string | null;
}

export interface ReleaseResponse {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  published_at: string;
}

export interface CollectionSources {
  repository: (repo: string) => Promise<RepositoryResponse>;
  history: (repo: string) => Promise<HistoryWeek[]>;
  release: (repo: string) => Promise<ReleaseResponse | null>;
  papers?: () => Promise<Paper[]>;
}

export function emptyCollection(): Collection {
  return {
    collectedAt: null,
    attemptedAt: null,
    projects: {},
    news: [],
    papers: [],
    run: { successful: 0, total: 0, errors: [] },
  };
}

export function upsertSnapshot(snapshots: Snapshot[], snapshot: Snapshot): Snapshot[] {
  const byDate = new Map(snapshots.map((item) => [item.date, item]));
  byDate.set(snapshot.date, snapshot);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function mergeById<T extends { id: string; publishedAt: string }>(previous: T[], incoming: T[]): T[] {
  const byId = new Map(previous.map((item) => [item.id, item]));
  for (const item of incoming) byId.set(item.id, item);
  return [...byId.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function releaseNews(release: ReleaseResponse, projectSlug: string): NewsItem {
  const summary = (release.body ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*`_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return {
    id: `github-release-${release.id}`,
    projectSlug,
    title: release.name || release.tag_name,
    summary: summary ? `${summary.slice(0, 240)}${summary.length > 240 ? "…" : ""}` : "공식 GitHub 릴리스에서 변경 사항을 확인하세요.",
    url: release.html_url,
    publishedAt: release.published_at,
    kind: "release",
    tag: release.tag_name,
  };
}

export class CollectionSourceError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "CollectionSourceError";
  }
}

function errorMessage(error: unknown): string {
  // Only errors produced by our adapters are safe to publish in public JSON.
  return error instanceof CollectionSourceError ? error.message : "데이터를 가져오지 못했습니다.";
}

export async function collectCatalog(
  catalog: Catalog,
  previous: Collection,
  sources: CollectionSources,
  now?: Date,
): Promise<Collection> {
  const attemptedAt = (now ?? new Date()).toISOString();
  const projects: Record<string, ProjectMetrics> = { ...previous.projects };
  const incomingNews: NewsItem[] = [];
  const errors: string[] = [];
  let successful = 0;

  for (const project of catalog.projects) {
    const existing = previous.projects[project.slug] ?? { repo: project.repo, snapshots: [], history: [] };
    let metrics: ProjectMetrics;
    try {
      const repo = await sources.repository(existing.repo || project.repo);
      if (repo.private) throw new CollectionSourceError("공개 저장소에 접근할 수 없습니다.");
      if (!Number.isSafeInteger(repo.id) || repo.id <= 0 || !Number.isSafeInteger(repo.stargazers_count) || repo.stargazers_count < 0) {
        throw new CollectionSourceError("GitHub 응답의 저장소 ID 또는 스타 수가 올바르지 않습니다.");
      }
      if (existing.repoId !== undefined && existing.repoId !== repo.id) {
        throw new CollectionSourceError("저장소 ID가 변경되어 기존 이력과 연결하지 않았습니다.");
      }
      const observedAt = (now ?? new Date()).toISOString();
      metrics = {
        ...existing,
        repoId: repo.id,
        repo: repo.full_name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language ?? undefined,
        license: repo.license?.spdx_id,
        archived: repo.archived,
        url: repo.html_url,
        website: repo.homepage || undefined,
        collectedAt: observedAt,
        snapshots: upsertSnapshot(existing.snapshots, { date: observedAt.slice(0, 10), observedAt, stars: repo.stargazers_count }),
        error: undefined,
      };
      successful++;
    } catch (error) {
      const message = errorMessage(error);
      projects[project.slug] = { ...existing, error: message };
      errors.push(`${project.repo}: ${message}`);
      continue;
    }

    try {
      const history = await sources.history(metrics.repo);
      const weeks = new Map(existing.history.map((week) => [week.week, week]));
      for (const week of history) {
        if (!Number.isSafeInteger(week.week) || !Number.isSafeInteger(week.total) || week.total < 0 || !Array.isArray(week.days) || week.days.length !== 7 || week.days.some((count) => !Number.isSafeInteger(count) || count < 0)) {
          throw new CollectionSourceError("GitHub 스타 이력 응답 형식이 올바르지 않습니다.");
        }
        weeks.set(week.week, week);
      }
      metrics.history = [...weeks.values()].sort((a, b) => a.week - b.week);
      metrics.historyCollectedAt = (now ?? new Date()).toISOString();
    } catch (error) {
      errors.push(`${project.repo} 스타 이력: ${errorMessage(error)}`);
    }

    try {
      const release = await sources.release(metrics.repo);
      if (release) incomingNews.push(releaseNews(release, project.slug));
    } catch (error) {
      errors.push(`${project.repo} 릴리스: ${errorMessage(error)}`);
    }
    projects[project.slug] = metrics;
  }

  let papers = previous.papers ?? [];
  if (sources.papers) {
    try {
      papers = mergeById(papers, await sources.papers()).slice(0, 30);
    } catch (error) {
      errors.push(`arXiv: ${errorMessage(error)}`);
    }
  }

  return {
    collectedAt: successful > 0 ? (now ?? new Date()).toISOString() : previous.collectedAt,
    attemptedAt,
    projects,
    news: mergeById(previous.news, incomingNews),
    papers,
    run: { successful, total: catalog.projects.length, errors },
  };
}
