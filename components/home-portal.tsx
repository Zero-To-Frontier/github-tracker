"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Box, BrainCircuit, Check, ChevronRight, CircleHelp, Code2, Cpu, ExternalLink, Flame, GitFork, Layers3, Radio, Sparkles, Star, Terminal, TrendingUp } from "lucide-react";
import { categories, type CategoryId, type Paper, type Period, type PortalData, type Project } from "@/lib/types";
import { formatCompact, formatDate, formatNumber, getGrowth, getHistoryPoints, metricForPeriod, rankProjects } from "@/lib/metrics";
import { ProjectMark } from "./project-mark";

const categoryIcons = { agents: BrainCircuit, coding: Code2, rag: Layers3, memory: Box, local: Cpu };

function Sparkline({ project }: { project: Project }) {
  const values = getHistoryPoints(project.metrics).slice(-14).map((point) => point.stars);
  if (values.length < 2) return <span className="sparkline-empty" aria-label="차트 집계 준비 중">—</span>;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const points = values.map((value, index) => `${index / (values.length - 1) * 84},${29 - (value - min) / Math.max(max - min, 1) * 23}`).join(" ");
  return <svg className="sparkline" viewBox="0 0 86 34" role="img" aria-label="GitHub 일별 스타 활동 추이"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function PaperCard({ paper, projects }: { paper: Paper; projects: Project[] }) {
  const linked = projects.filter((project) => paper.projectSlugs.includes(project.slug));
  return <article className="paper-card"><div className="paper-top"><span className="paper-kind"><BookOpen size={13} />{paper.kind === "foundation" ? "FOUNDATION" : "RESEARCH"}</span><span>{new Date(paper.publishedAt).getUTCFullYear()}</span></div><a href={paper.url} target="_blank" rel="noreferrer" className="paper-title">{paper.title}<ArrowUpRight size={16} /></a><p>{paper.summary}</p><div className="paper-bottom"><span>{paper.authors}</span>{linked.length > 0 && <Link href={`/projects/${linked[0].slug}`} className="linked-project"><span style={{ background: linked[0].accent }} />{linked[0].name}<ChevronRight size={12} /></Link>}</div></article>;
}

export function HomePortal({ data, initialCategory = "all" }: { data: PortalData; initialCategory?: CategoryId | "all" }) {
  const [period, setPeriod] = useState<Period>(7);
  const [category, setCategory] = useState<CategoryId | "all">(initialCategory);
  const [paperTab, setPaperTab] = useState<"research" | "foundation">("research");
  const reference = data.attemptedAt ?? data.collectedAt;
  const kind = metricForPeriod(data.projects, period, reference);
  const filtered = useMemo(() => rankProjects(data.projects.filter((project) => category === "all" || project.categories.includes(category)), period, kind, reference), [data.projects, category, period, kind, reference]);
  const rankedCount = filtered.filter((project) => (getGrowth(project, period, kind, reference) ?? 0) > 0).length;
  const spotlight = data.projects.find((project) => project.slug === "mem0") ?? data.projects[0];
  const papers = data.papers.filter((paper) => paper.kind === paperTab).slice(0, 3);
  const dateLabel = data.collectedAt ? formatDate(data.collectedAt) : "첫 수집 준비 중";

  return <main id="main" className="page-shell">
    <section className="intro" aria-labelledby="home-heading"><div><div className="eyebrow"><span className="eyebrow-line" />OPEN SOURCE, IN FOCUS</div><h1 id="home-heading">AI의 다음 흐름을 <span>발견하세요.</span></h1><p>프로젝트와 연구, AI의 흐름을 한곳에서.</p></div><div className="edition"><span className="edition-caption"><Radio size={13} /> THE DAILY SIGNAL</span><span className="edition-date">{dateLabel}</span><span>{data.projects.length}개 프로젝트 · {categories.length}개 분야</span></div></section>

    <div className="portal-grid"><section className="trending-panel" aria-labelledby="trending-heading">
      <div className="section-heading"><div className="heading-title"><Flame size={20} className="flame" /><h2 id="trending-heading">주목할 프로젝트</h2><span className="count-badge">{data.projects.length}</span></div><div className="period-tabs" role="group" aria-label="스타 집계 기간"><button aria-pressed={period === 1} onClick={() => setPeriod(1)}>최근 1일</button><button aria-pressed={period === 7} onClick={() => setPeriod(7)}>최근 7일</button></div></div>
      <div className="category-tabs" role="group" aria-label="프로젝트 분야"><button className={category === "all" ? "selected" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>전체</button>{categories.map((item) => <button key={item.id} className={category === item.id ? "selected" : ""} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}><span style={{ backgroundColor: item.color }} />{item.name}</button>)}</div>
      <div className="ranking-meta"><span><span className={`status-dot ${data.run.successful > 0 ? "status-ok" : ""}`} />{data.run.successful > 0 ? `${data.run.successful}/${data.run.total}개 수집 완료` : "관측 데이터 준비 중"}</span><Link href="/about">{kind === "net" ? "직접 관측한 스타 순증가" : "GitHub 일별 스타 집계"}<CircleHelp size={13} /></Link></div>
      <div className="project-table" role="table" aria-label="AI 프로젝트 목록"><div className="table-head" role="row"><span role="columnheader">#</span><span role="columnheader">프로젝트</span><span role="columnheader">전체 스타</span><span role="columnheader">{period}일 {kind === "net" ? "순증가" : "스타 활동"}<ArrowDown size={11} /></span><span role="columnheader">활동 추이</span></div>
        <div role="rowgroup">{filtered.map((project, index) => {
          const growth = getGrowth(project, period, kind, reference);
          const eligible = growth !== null && growth > 0;
          return <div className="project-row" role="row" key={project.slug}><span className={`rank ${index < 3 && eligible ? "rank-top" : ""}`} role="cell">{eligible ? String(index + 1).padStart(2, "0") : "—"}</span><div className="project-info" role="cell"><ProjectMark name={project.name} accent={project.accent} /><div className="project-text"><Link href={`/projects/${project.slug}`} className="project-name">{project.name}<ArrowUpRight size={13} /></Link><p>{project.summary}</p><div className="project-tags"><span className="language-dot" style={{ background: project.accent }} /><span>{project.metrics.language ?? project.language}</span><span className="tag-separator">/</span><span>{categories.find((item) => item.id === project.categories[0])?.name}</span>{project.metrics.archived && <span>보관됨</span>}</div></div></div><span className="star-value" role="cell"><Star size={12} />{formatCompact(project.metrics.stars)}</span><span className={`growth-value ${eligible ? "positive" : ""}`} role="cell">{growth === null ? <span className="pending-label">집계 중</span> : `${growth > 0 ? "+" : ""}${formatNumber(growth)}`}</span><span role="cell" className="row-chart"><Sparkline project={project} /></span></div>;
        })}</div></div>
      {filtered.length === 0 && <div className="empty-panel"><Layers3 size={25} /><p>이 분야에서 추적 중인 프로젝트가 없습니다.</p><button onClick={() => setCategory("all")}>전체 프로젝트 보기</button></div>}
      <div className="table-footer"><span>{filtered.length}개 프로젝트 · {rankedCount > 0 ? `${rankedCount}개 성장 신호` : "성장 이력을 모으고 있어요"}</span><span>선정한 공개 저장소 기준</span></div>
    </section>

    <aside className="side-column" aria-label="추천 프로젝트와 분야">
      {spotlight && <section className="spotlight"><span className="eyebrow"><Sparkles size={13} />PROJECT SPOTLIGHT</span><div className="spotlight-mark"><ProjectMark name={spotlight.name} accent={spotlight.accent} size="large" /><span className="spotlight-category">MEMORY & AGENTS</span></div><h2>{spotlight.name}</h2><h3>기억하는 AI,<br />이어지는 대화.</h3><p>{spotlight.summary}</p><div className="spotlight-stats"><span><Star size={14} />{formatCompact(spotlight.metrics.stars)}<small>GitHub stars</small></span><span><GitFork size={14} />{formatCompact(spotlight.metrics.forks)}<small>Forks</small></span></div><Link className="spotlight-link" href={`/projects/${spotlight.slug}`}>프로젝트 살펴보기<ArrowRight size={16} /></Link></section>}
      <section className="explore-panel"><div className="small-section-heading"><h2>관심 분야 둘러보기</h2><Layers3 size={15} /></div>{categories.map((item) => { const Icon = categoryIcons[item.id]; return <button key={item.id} className={`explore-category ${category === item.id ? "explore-selected" : ""}`} onClick={() => { setCategory(item.id); document.getElementById("trending-heading")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><span className="category-icon" style={{ color: item.color }}><Icon size={17} /></span><span>{item.name}</span><span className="category-count">{data.projects.filter((project) => project.categories.includes(item.id)).length}</span><ChevronRight size={13} /></button>; })}</section>
      <div className="curation-note"><span><Check size={14} /> 작게 모으고, 깊게 연결합니다.</span><p>분야별로 선정한 공개 프로젝트와<br />출처가 확인된 연구를 소개합니다.</p><Link href="/about">큐레이션 기준 <ArrowUpRight size={12} /></Link></div>
    </aside></div>

    <section id="news" className="news-section" aria-labelledby="news-heading"><div className="section-heading"><div><div className="eyebrow section-eyebrow">FROM THE REPOSITORIES</div><h2 id="news-heading">프로젝트 업데이트 <span className="subtle-count">{data.news.length}</span></h2></div><span className="section-note">공식 릴리스에서 전하는 변화 <ArrowUpRight size={14} /></span></div><div className="news-grid">{data.news.slice(0, 3).map((news) => { const project = data.projects.find((item) => item.slug === news.projectSlug); return <article className="news-card" key={news.id}><div className="news-meta">{project && <Link href={`/projects/${project.slug}`}><ProjectMark name={project.name} accent={project.accent} size="small" />{project.name}</Link>}<span>{formatDate(news.publishedAt)}</span></div><a href={news.url} target="_blank" rel="noreferrer"><span className="release-label">RELEASE</span><h3>{news.title}<ArrowUpRight size={15} /></h3></a><p>{news.summary}</p><div className="news-card-footer"><span><Terminal size={12} />{news.tag}</span><a href={news.url} target="_blank" rel="noreferrer">릴리스 노트 <ExternalLink size={12} /></a></div></article>; })}</div>{data.news.length === 0 && <div className="empty-panel"><Terminal size={25} /><p>공식 릴리스 소식을 수집하고 있습니다.</p><span>프로젝트 상세에서 GitHub 원문을 먼저 확인할 수 있어요.</span></div>}</section>

    <section id="papers" className="papers-section" aria-labelledby="papers-heading"><div className="section-heading"><div><div className="eyebrow section-eyebrow">BEHIND THE CODE</div><h2 id="papers-heading">코드 너머의 아이디어</h2></div><div className="paper-tabs" role="group" aria-label="논문 종류"><button aria-pressed={paperTab === "research"} onClick={() => setPaperTab("research")}>프로젝트 연구</button><button aria-pressed={paperTab === "foundation"} onClick={() => setPaperTab("foundation")}>기반 논문</button></div></div><div className="papers-grid">{papers.map((paper) => <PaperCard paper={paper} projects={data.projects} key={paper.id} />)}</div>{papers.length === 0 && <div className="empty-panel"><BookOpen size={24} /><p>확인된 연구 자료를 준비 중입니다.</p></div>}<div className="papers-caption"><BookOpen size={13} />프로젝트와 연결된 연구를 소개합니다. 최신순 인기 순위와는 다릅니다.</div></section>
  </main>;
}
