import assert from "node:assert/strict";
import test from "node:test";
import { collectCatalog, CollectionSourceError, emptyCollection } from "../lib/collection";
import type { CollectionSources, RepositoryResponse } from "../lib/collection";
import type { Catalog, Collection } from "../lib/types";

const catalog: Catalog = {
  projects: [{ slug: "example", repo: "owner/example", name: "Example", summary: "", description: "", categories: ["agents"], language: "TypeScript", accent: "#000", paperIds: [] }],
  papers: [],
};

const repo: RepositoryResponse = {
  id: 42, full_name: "owner/example", stargazers_count: 100, forks_count: 5,
  language: "TypeScript", license: { spdx_id: "MIT" }, archived: false,
  private: false, html_url: "https://github.com/owner/example", homepage: null,
};

function sources(overrides: Partial<CollectionSources> = {}): CollectionSources {
  return {
    repository: async () => repo,
    history: async () => [{ week: 1789257600, total: 3, days: [3, 0, 0, 0, 0, 0, 0] }],
    release: async () => ({ id: 123, tag_name: "v1.0", name: "Version 1", body: "A release.", html_url: "https://github.com/owner/example/releases/tag/v1.0", published_at: "2026-09-13T00:00:00Z" }),
    ...overrides,
  };
}

async function baseline(): Promise<Collection> {
  return collectCatalog(catalog, emptyCollection(), sources(), new Date("2026-09-14T01:00:00Z"));
}

test("same UTC day rerun updates one snapshot and deduplicates releases and history", async () => {
  const previous = await baseline();
  const result = await collectCatalog(catalog, previous, sources({ repository: async () => ({ ...repo, stargazers_count: 105 }) }), new Date("2026-09-14T16:00:00Z"));
  assert.equal(result.projects.example.snapshots.length, 1);
  assert.equal(result.projects.example.snapshots[0].stars, 105);
  assert.equal(result.projects.example.snapshots[0].date, "2026-09-14");
  assert.equal(result.news.length, 1);
  assert.equal(result.projects.example.history.length, 1);
  assert.equal(previous.projects.example.stars, 100);
});

test("next day lower total is retained as a negative change and history remains separate", async () => {
  const result = await collectCatalog(catalog, await baseline(), sources({ repository: async () => ({ ...repo, stargazers_count: 94 }) }), new Date("2026-09-15T01:00:00Z"));
  const snapshots = result.projects.example.snapshots;
  assert.equal(snapshots.length, 2);
  assert.equal(snapshots[1].stars - snapshots[0].stars, -6);
  assert.equal(result.projects.example.history[0].total, 3);
});

test("repository failure preserves last good metadata, snapshots, news, and collection timestamp", async () => {
  const previous = await baseline();
  let downstreamRequests = 0;
  const result = await collectCatalog(catalog, previous, sources({
    repository: async () => { throw new CollectionSourceError("GitHub 호출 제한", 403); },
    history: async () => { downstreamRequests++; return []; },
    release: async () => { downstreamRequests++; return null; },
  }), new Date("2026-09-15T01:00:00Z"));
  assert.equal(result.run.successful, 0);
  assert.equal(result.collectedAt, previous.collectedAt);
  assert.equal(result.projects.example.collectedAt, previous.projects.example.collectedAt);
  assert.deepEqual(result.projects.example.snapshots, previous.projects.example.snapshots);
  assert.deepEqual(result.news, previous.news);
  assert.equal(downstreamRequests, 0);
});

test("history and release failures preserve their last good data without discarding metadata", async () => {
  const previous = await baseline();
  const result = await collectCatalog(catalog, previous, sources({
    history: async () => { throw new CollectionSourceError("이력 응답 실패"); },
    release: async () => { throw new CollectionSourceError("릴리스 응답 실패"); },
  }), new Date("2026-09-15T01:00:00Z"));
  assert.equal(result.run.successful, 1);
  assert.equal(result.run.errors.length, 2);
  assert.equal(result.projects.example.snapshots.length, 2);
  assert.deepEqual(result.projects.example.history, previous.projects.example.history);
  assert.equal(result.projects.example.historyCollectedAt, previous.projects.example.historyCollectedAt);
  assert.deepEqual(result.news, previous.news);
});

test("different repository identity cannot overwrite the old series", async () => {
  const previous = await baseline();
  const result = await collectCatalog(catalog, previous, sources({ repository: async () => ({ ...repo, id: 999 }) }));
  assert.equal(result.run.successful, 0);
  assert.equal(result.projects.example.repoId, 42);
  assert.deepEqual(result.projects.example.snapshots, previous.projects.example.snapshots);
});

test("arXiv failure preserves papers and unknown errors do not leak into public JSON", async () => {
  const previous = await baseline();
  previous.papers = [{ id: "paper-1", title: "Title", authors: "Author", publishedAt: "2026-09-14", summary: "", category: "agents", kind: "research", url: "https://arxiv.org/abs/1234.5678", projectSlugs: [], reason: "", relatedPaperIds: [], evidenceUrl: "https://arxiv.org/abs/1234.5678", relationLabel: "" }];
  const result = await collectCatalog(catalog, previous, sources({ papers: async () => { throw new Error("secret-token"); } }));
  assert.deepEqual(result.papers, previous.papers);
  assert.equal(JSON.stringify(result).includes("secret-token"), false);
});
