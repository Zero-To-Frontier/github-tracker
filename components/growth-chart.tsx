"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined, Clock3 } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/metrics";
import type { Snapshot } from "@/lib/types";
import styles from "./growth-chart.module.css";

interface HistoryPoint {
  timestamp: number;
  date: string;
  stars: number;
}

interface GrowthChartProps {
  snapshots: Snapshot[];
  historyPoints: HistoryPoint[];
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", timeZone: "UTC" }).format(new Date(date));
}

export function GrowthChart({ snapshots, historyPoints }: GrowthChartProps) {
  const [activeSnapshot, setActiveSnapshot] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const observations = [...snapshots].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const days = historyPoints.slice(-30);
  const selectedObservation = observations[activeSnapshot ?? observations.length - 1];
  const selectedDay = activeDay === null ? undefined : days[activeDay];
  const minimum = Math.min(...observations.map((point) => point.stars));
  const maximum = Math.max(...observations.map((point) => point.stars));
  const spread = Math.max(maximum - minimum, 1);
  const padding = Math.max(spread * 0.2, 1);
  const lower = Math.max(0, minimum - padding);
  const upper = maximum + padding;
  const start = observations.length ? Date.parse(observations[0].date) : 0;
  const finish = observations.length ? Date.parse(observations[observations.length - 1].date) : 0;
  const coordinates = observations.map((point) => ({
    x: 64 + ((Date.parse(point.date) - start) / Math.max(finish - start, 1)) * 564,
    y: 178 - ((point.stars - lower) / Math.max(upper - lower, 1)) * 150,
  }));
  const segments: (typeof coordinates)[] = [];
  coordinates.forEach((point, index) => {
    if (index === 0 || Date.parse(observations[index].date) - Date.parse(observations[index - 1].date) !== 86_400_000) {
      segments.push([point]);
    } else {
      segments[segments.length - 1].push(point);
    }
  });
  const largestDay = Math.max(1, ...days.map((point) => point.stars));
  const historyTotal = days.reduce((total, day) => total + day.stars, 0);

  return <div className={styles.charts}>
    <section className={styles.card} aria-labelledby="star-history-title">
      <div className={styles.cardHeading}>
        <div><span className={styles.eyebrow}>STAR HISTORY</span><h2 id="star-history-title">총 스타 관측 기록</h2></div>
        <span className={styles.period}>최근 30개 관측</span>
      </div>
      {observations.length > 1 ? <>
        <div className={styles.readout} aria-live="polite">
          <strong>{formatNumber(selectedObservation.stars)}<span>stars</span></strong>
          <span>{formatDate(selectedObservation.date)}</span>
        </div>
        <svg className={styles.lineChart} viewBox="0 0 660 212" role="group" aria-label="수집 시점별 총 스타 수. 각 점에 초점을 맞추면 날짜와 값을 확인할 수 있습니다.">
          {[0, 1, 2].map((index) => {
            const y = 28 + index * 75;
            const value = upper - (upper - lower) * index / 2;
            return <g key={index}><line x1="64" y1={y} x2="628" y2={y} className={styles.gridline} /><text x="51" y={y + 4} textAnchor="end" className={styles.axis}>{formatNumber(Math.round(value))}</text></g>;
          })}
          {segments.filter((segment) => segment.length > 1).map((segment) => {
            const line = segment.map((point) => `${point.x},${point.y}`).join(" ");
            return <g key={segment[0].x}><polygon points={`${segment[0].x},178 ${line} ${segment[segment.length - 1].x},178`} className={styles.area} /><polyline points={line} className={styles.line} /></g>;
          })}
          {coordinates.map((point, index) => <circle key={observations[index].date} cx={point.x} cy={point.y} r={activeSnapshot === index ? 6 : 4} className={styles.point} tabIndex={0} role="img" aria-label={`${formatDate(observations[index].date)}, 총 ${formatNumber(observations[index].stars)} 스타`} onFocus={() => setActiveSnapshot(index)} onBlur={() => setActiveSnapshot(null)} onMouseEnter={() => setActiveSnapshot(index)} onMouseLeave={() => setActiveSnapshot(null)}><title>{formatDate(observations[index].date)} · {formatNumber(observations[index].stars)} stars</title></circle>)}
          <text x="64" y="206" className={styles.axis}>{shortDate(observations[0].date)}</text>
          <text x="628" y="206" textAnchor="end" className={styles.axis}>{shortDate(observations[observations.length - 1].date)}</text>
        </svg>
      </> : <div className={styles.waiting}>
        <span className={styles.waitingIcon}><ChartNoAxesCombined size={24} strokeWidth={1.6} /></span>
        <h3>{observations.length ? "첫 번째 관측을 기록했어요" : "첫 번째 관측을 기다리고 있어요"}</h3>
        <p>{observations.length ? `${formatDate(observations[0].date)} · ${formatNumber(observations[0].stars)} stars` : "GitHub 데이터를 수집하면 총 스타 수가 표시됩니다."}</p>
        <span>관측 기록이 쌓이면 실제 성장 추이를 보여드립니다.</span>
      </div>}
      <div className={styles.chartFooter}><span>GitHub API · 수집 시점의 전체 스타 수</span><Link href="/about">집계 기준 <ArrowUpRight size={12} /></Link></div>
      {observations.length > 0 && <details className={styles.tableDetails}><summary>날짜별 관측값 보기</summary><div className={styles.tableScroll}><table><thead><tr><th scope="col">관측 날짜</th><th scope="col">총 스타</th></tr></thead><tbody>{observations.map((point) => <tr key={point.date}><th scope="row">{formatDate(point.date)}</th><td>{formatNumber(point.stars)}</td></tr>)}</tbody></table></div></details>}
    </section>

    <section className={styles.card} aria-labelledby="daily-activity-title">
      <div className={styles.cardHeading}>
        <div><span className={styles.eyebrow}>DAILY ACTIVITY</span><h2 id="daily-activity-title">GitHub 일별 스타 집계</h2></div>
        <span className={styles.period}>최근 {days.length || 30}일</span>
      </div>
      {days.length ? <>
        <div className={styles.readout} aria-live="polite">
          <strong>{formatNumber(selectedDay?.stars ?? historyTotal)}<span>stars</span></strong>
          <span>{selectedDay ? formatDate(selectedDay.date) : `${shortDate(days[0].date)} – ${shortDate(days[days.length - 1].date)} 합계`}</span>
        </div>
        <div className={styles.barChart} role="group" aria-label="날짜별 GitHub 스타 집계. 각 막대에 초점을 맞추면 날짜와 값을 확인할 수 있습니다.">
          <div className={styles.barGuides} aria-hidden="true"><span>{formatNumber(largestDay)}</span><span>0</span></div>
          <div className={styles.bars}>
            {days.map((point, index) => <button type="button" key={point.date} className={`${styles.barButton} ${activeDay === index ? styles.barActive : ""}`} aria-label={`${formatDate(point.date)}, ${formatNumber(point.stars)} 스타`} onFocus={() => setActiveDay(index)} onBlur={() => setActiveDay(null)} onMouseEnter={() => setActiveDay(index)} onMouseLeave={() => setActiveDay(null)} onClick={() => setActiveDay(index)}><span style={{ height: `${(point.stars / largestDay) * 100}%`, minHeight: point.stars > 0 ? "2px" : "0" }} /><span className={styles.zeroMarker} aria-hidden="true" /></button>)}
          </div>
        </div>
        <div className={styles.barDates}><span>{shortDate(days[0].date)}</span><span>{shortDate(days[days.length - 1].date)}</span></div>
      </> : <div className={styles.waiting}>
        <span className={styles.waitingIcon}><Clock3 size={24} strokeWidth={1.6} /></span>
        <h3>일별 활동을 집계하고 있어요</h3>
        <p>GitHub에서 활동 기록이 수집되면 표시됩니다.</p>
      </div>}
      <div className={styles.chartFooter}><span>GitHub 스타 기록 · 취소를 반영한 순증가와 다릅니다</span><Link href="/about">출처 <ArrowUpRight size={12} /></Link></div>
      {days.length > 0 && <details className={styles.tableDetails}><summary>날짜별 활동값 보기</summary><div className={styles.tableScroll}><table><thead><tr><th scope="col">날짜</th><th scope="col">GitHub 스타 집계</th></tr></thead><tbody>{[...days].reverse().map((point) => <tr key={point.date}><th scope="row">{formatDate(point.date)}</th><td>{formatNumber(point.stars)}</td></tr>)}</tbody></table></div></details>}
    </section>
  </div>;
}
