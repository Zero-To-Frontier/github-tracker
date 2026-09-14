import { execFileSync } from "node:child_process";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { XMLParser } from "fast-xml-parser";
import { collectCatalog, CollectionSourceError, emptyCollection } from "../lib/collection";
import type { ReleaseResponse, RepositoryResponse } from "../lib/collection";
import type { Catalog, Collection, HistoryWeek, Paper } from "../lib/types";

const dataDirectory = path.resolve("data");
const outputPath = path.join(dataDirectory, "collection.json");
const requestTimeoutMs = 20_000;

function githubToken(): string | undefined {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (process.env.CI) return undefined;
  try {
    return execFileSync("gh", ["auth", "token", "--hostname", "github.com"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 5_000,
    }).trim() || undefined;
  } catch {
    return undefined;
  }
}

const token = githubToken();
let githubBlocked: CollectionSourceError | undefined;

async function github<T>(endpoint: string, allowNotFound = false): Promise<T | null> {
  if (githubBlocked) throw githubBlocked;
  let response: Response;
  try {
    response = await fetch(`https://api.github.com/${endpoint}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
        "User-Agent": "GitHubTracker-Collector",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch {
    throw new CollectionSourceError("GitHub 연결에 실패했거나 응답 시간이 초과되었습니다.");
  }
  if (response.status === 404 && allowNotFound) return null;
  if (response.status === 401) {
    githubBlocked = new CollectionSourceError("GitHub 인증을 확인해야 합니다.", 401);
    throw githubBlocked;
  }
  if (response.status === 429 || (response.status === 403 && (response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after")))) {
    githubBlocked = new CollectionSourceError("GitHub 호출 제한에 도달하여 이번 실행의 추가 요청을 중단했습니다.", response.status);
    throw githubBlocked;
  }
  if (!response.ok) throw new CollectionSourceError(`GitHub 요청 실패 (HTTP ${response.status}).`, response.status);
  return await response.json() as T;
}

function repoEndpoint(repo: string): string {
  return `repos/${repo.split("/").map(encodeURIComponent).join("/")}`;
}

async function latestPapers(): Promise<Paper[]> {
  // This collector uses one connection and one arXiv query per run.
  await delay(3_000);
  const url = new URL("https://export.arxiv.org/api/query");
  url.searchParams.set("search_query", "cat:cs.AI AND all:agent");
  url.searchParams.set("sortBy", "submittedDate");
  url.searchParams.set("sortOrder", "descending");
  url.searchParams.set("max_results", "6");
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "GitHubTracker-Collector", Accept: "application/atom+xml" },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch {
    throw new CollectionSourceError("arXiv 연결에 실패했거나 응답 시간이 초과되었습니다.");
  }
  if (!response.ok) throw new CollectionSourceError(`arXiv 요청 실패 (HTTP ${response.status}).`, response.status);
  const parsed = new XMLParser({ ignoreAttributes: false }).parse(await response.text());
  if (!parsed.feed) throw new CollectionSourceError("arXiv 응답 형식이 올바르지 않습니다.");
  const entries = parsed.feed.entry ? (Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry]) : [];
  return entries.map((entry: Record<string, unknown>): Paper => {
    const paperId = String(entry.id ?? "").split("/abs/")[1]?.replace(/v\d+$/, "");
    if (!paperId || !entry.title || !entry.published) throw new CollectionSourceError("arXiv 논문 메타데이터가 올바르지 않습니다.");
    const authors = Array.isArray(entry.author) ? entry.author : entry.author ? [entry.author] : [];
    const abstract = String(entry.summary ?? "").replace(/\s+/g, " ").trim();
    const paperUrl = `https://arxiv.org/abs/${paperId}`;
    return {
      id: paperId,
      title: String(entry.title).replace(/\s+/g, " ").trim(),
      authors: authors.map((author: { name?: string }) => author.name ?? "").filter(Boolean).join(", "),
      publishedAt: new Date(String(entry.published)).toISOString(),
      summary: `${abstract.slice(0, 240)}${abstract.length > 240 ? "…" : ""}`,
      category: "agents",
      kind: "research",
      url: paperUrl,
      projectSlugs: [],
      reason: "arXiv의 cs.AI 분야에서 agent 키워드로 검색한 최신 논문입니다. 설명은 원문 초록의 일부입니다.",
      relatedPaperIds: [],
      evidenceUrl: paperUrl,
      relationLabel: "arXiv 검색 결과",
    };
  }).filter((paper: Paper) => Date.parse(paper.publishedAt) >= Date.now() - 14 * 86_400_000);
}

async function readPrevious(): Promise<Collection> {
  try {
    return JSON.parse(await readFile(outputPath, "utf8")) as Collection;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyCollection();
    throw new Error("기존 collection.json을 읽지 못했습니다. 원본을 보존하고 수집을 중단합니다.");
  }
}

async function atomicWrite(collection: Collection): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(collection, null, 2)}\n`, { flag: "wx" });
    await rename(temporaryPath, outputPath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

async function main(): Promise<void> {
  const catalog = JSON.parse(await readFile(path.join(dataDirectory, "catalog.json"), "utf8")) as Catalog;
  const previous = await readPrevious();
  const collection = await collectCatalog(catalog, previous, {
    repository: async (repo) => (await github<RepositoryResponse>(repoEndpoint(repo)))!,
    history: async (repo) => (await github<HistoryWeek[]>(`${repoEndpoint(repo)}/stargazers/history?per_page=30`))!,
    release: (repo) => github<ReleaseResponse>(`${repoEndpoint(repo)}/releases/latest`, true),
    papers: latestPapers,
  });
  await atomicWrite(collection);
  console.log(`수집 완료: 저장소 ${collection.run.successful}/${collection.run.total}, 릴리스 ${collection.news.length}, arXiv ${collection.papers?.length ?? 0}`);
  for (const error of collection.run.errors) console.warn(error);
  if (collection.run.errors.length > 0) process.exitCode = 1;
}

main().catch(() => {
  // Do not publish response bodies, environment values, or credential errors.
  console.error("수집을 완료하지 못했습니다. catalog.json과 collection.json, 파일 권한을 확인하세요. 기존 자료는 보존됩니다.");
  process.exitCode = 1;
});
