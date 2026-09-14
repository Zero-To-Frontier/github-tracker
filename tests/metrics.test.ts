import assert from "node:assert/strict";
import test from "node:test";
import { getGrowth, getHistoryPoints, getNetChange, metricForPeriod, rankProjects } from "../lib/metrics";
import type { Project } from "../lib/types";

const asOf = "2026-09-14T02:00:00.000Z";
function project(): Project {
  return {
    slug: "example", repo: "org/example", name: "Example", summary: "", description: "", categories: ["agents"], language: "TypeScript", accent: "#fff", paperIds: [],
    metrics: { repo: "org/example", collectedAt: asOf, historyCollectedAt: asOf, stars: 100, snapshots: [{ date: "2026-09-14", observedAt: asOf, stars: 100 }], history: [
      { week: Date.parse("2026-09-06T00:00:00Z") / 1000, total: 28, days: [1, 2, 3, 4, 5, 6, 7] },
      { week: Date.parse("2026-09-13T00:00:00Z") / 1000, total: 8, days: [8, 999, 0, 0, 0, 0, 0] },
    ] },
  };
}

test("first observation has no fabricated net growth; completed API days can be used separately", () => {
  const p = project();
  assert.equal(getNetChange(p.metrics, 1), null);
  assert.equal(getNetChange(p.metrics, 7), null);
  assert.equal(getGrowth(p, 1, "history", asOf), 8);
  assert.equal(getGrowth(p, 7, "history", asOf), 35);
  assert.equal(getHistoryPoints(p.metrics).at(-1)?.date, "2026-09-13");
});

test("net growth preserves losses and only uses the exact comparison date", () => {
  const p = project();
  p.metrics.snapshots.push({ date: "2026-09-13", observedAt: "2026-09-13T02:00:00Z", stars: 120 });
  p.metrics.snapshots.push({ date: "2026-09-06", observedAt: "2026-09-06T02:00:00Z", stars: 70 });
  assert.equal(getNetChange(p.metrics, 1), -20);
  assert.equal(getNetChange(p.metrics, 7), null);
});

test("same-day failed history refresh cannot reuse earlier data in a fresh ranking", () => {
  const p = project();
  p.metrics.historyCollectedAt = "2026-09-14T01:00:00Z";
  assert.equal(getGrowth(p, 7, "history", asOf), null);
});

test("failed, stale and archived projects are excluded from growth ranking", () => {
  const p = project();
  p.metrics.error = "수집 실패";
  assert.equal(getGrowth(p, 7, "history", asOf), null);
  delete p.metrics.error;
  assert.equal(getGrowth(p, 7, "history", "2026-09-15T02:00:00Z"), null);
  p.metrics.archived = true;
  assert.equal(getGrowth(p, 7, "history", asOf), null);
});

test("missing API days are not summed as a complete seven-day period", () => {
  const p = project();
  p.metrics.history = p.metrics.history.slice(1);
  assert.equal(getGrowth(p, 7, "history", asOf), null);
  assert.equal(getGrowth(p, 1, "history", asOf), 8);
});

test("zero activity is a real observation and is distinct from missing data", () => {
  const p = project();
  p.metrics.history[1].days[0] = 0;
  assert.equal(getGrowth(p, 1, "history", asOf), 0);
  p.metrics.history = [];
  assert.equal(getGrowth(p, 1, "history", asOf), null);
});

test("a single metric is chosen for the whole period, with deterministic tie ordering", () => {
  const first = project();
  const second = project();
  first.repo = "org/z";
  second.repo = "org/a";
  assert.equal(metricForPeriod([first, second], 7, asOf), "history");
  assert.equal(rankProjects([first, second], 7, "history", asOf)[0].repo, "org/a");
  first.metrics.snapshots.push({ date: "2026-09-07", observedAt: "2026-09-07T02:00:00Z", stars: 70 });
  assert.equal(metricForPeriod([first, second], 7, asOf), "net");
  assert.equal(getGrowth(second, 7, "net", asOf), null);
});
