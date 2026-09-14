import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Catalog, Collection, PortalData } from "./types";

export async function getPortalData(): Promise<PortalData> {
  const catalog: Catalog = JSON.parse(await readFile(path.join(process.cwd(), "data/catalog.json"), "utf8"));
  let collection: Collection = {
    collectedAt: null, attemptedAt: null, projects: {}, news: [],
    run: { successful: 0, total: catalog.projects.length, errors: [] },
  };
  try {
    collection = JSON.parse(await readFile(path.join(process.cwd(), "data/collection.json"), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const papers = new Map(catalog.papers.map((paper) => [paper.id, paper]));
  for (const paper of collection.papers ?? []) {
    if (!papers.has(paper.id)) papers.set(paper.id, paper);
  }
  return {
    projects: catalog.projects.map((project) => ({
      ...project,
      metrics: collection.projects[project.slug] ?? { repo: project.repo, snapshots: [], history: [] },
    })),
    news: collection.news,
    papers: [...papers.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    collectedAt: collection.collectedAt,
    attemptedAt: collection.attemptedAt,
    run: collection.run,
  };
}
