import type { Period, Project, ProjectMetrics } from "./types";

export type MetricKind = "net" | "history";
const DAY = 86_400_000;
export const formatNumber = (value: number | undefined | null) => value == null ? "—" : new Intl.NumberFormat("en-US").format(value);
export const formatCompact = (value: number | undefined | null) => value == null ? "—" : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
export const formatDate = (value: string) => new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" }).format(new Date(value));

export function getNetChange(metrics: ProjectMetrics, period: Period): number | null {
  if (!metrics.collectedAt) return null;
  const date = metrics.collectedAt.slice(0, 10);
  const previousDate = new Date(Date.parse(`${date}T00:00:00Z`) - DAY * period).toISOString().slice(0, 10);
  const current = metrics.snapshots.find((snapshot) => snapshot.date === date);
  const previous = metrics.snapshots.find((snapshot) => snapshot.date === previousDate);
  return current && previous ? current.stars - previous.stars : null;
}

export function getHistoryPoints(metrics: ProjectMetrics) {
  const asOf = metrics.historyCollectedAt ?? metrics.collectedAt;
  if (!asOf) return [];
  const before = Date.parse(asOf);
  const points = new Map<number, { timestamp: number; date: string; stars: number }>();
  for (const week of metrics.history) {
    week.days.forEach((stars, index) => {
      const timestamp = week.week * 1000 + index * DAY;
      if (timestamp + DAY <= before) {
        points.set(timestamp, { timestamp, date: new Date(timestamp).toISOString().slice(0, 10), stars });
      }
    });
  }
  return [...points.values()].sort((a, b) => a.timestamp - b.timestamp);
}

export function getGrowth(project: Project, period: Period, kind: MetricKind, asOf: string | null): number | null {
  const metrics = project.metrics;
  if (metrics.archived || metrics.error || !metrics.collectedAt) return null;
  if (asOf && metrics.collectedAt.slice(0, 10) !== asOf.slice(0, 10)) return null;
  if (kind === "net") return getNetChange(metrics, period);
  if (!metrics.historyCollectedAt || metrics.historyCollectedAt.slice(0, 10) !== metrics.collectedAt.slice(0, 10)) return null;
  if (Date.parse(metrics.historyCollectedAt) < Date.parse(metrics.collectedAt)) return null;
  const points = getHistoryPoints(metrics).slice(-period);
  if (points.length !== period) return null;
  if (Date.parse(metrics.historyCollectedAt) - points.at(-1)!.timestamp > 2 * DAY) return null;
  if (points.some((point, index) => index > 0 && point.timestamp - points[index - 1].timestamp !== DAY)) return null;
  return points.reduce((sum, point) => sum + point.stars, 0);
}

export function metricForPeriod(projects: Project[], period: Period, asOf: string | null): MetricKind {
  return projects.some((project) => getGrowth(project, period, "net", asOf) !== null) ? "net" : "history";
}

export function rankProjects(projects: Project[], period: Period, kind: MetricKind, asOf: string | null): Project[] {
  return [...projects].sort((a, b) => {
    const av = getGrowth(a, period, kind, asOf);
    const bv = getGrowth(b, period, kind, asOf);
    if (av === null && bv !== null) return 1;
    if (av !== null && bv === null) return -1;
    return (bv ?? 0) - (av ?? 0) || (b.metrics.stars ?? 0) - (a.metrics.stars ?? 0) || a.repo.localeCompare(b.repo);
  });
}
