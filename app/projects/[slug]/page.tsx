import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, ChevronRight, CircleDot, ExternalLink, GitFork, Github, Globe2, Scale, Sparkles, Star, Tag, TrendingUp } from "lucide-react";
import { GrowthChart } from "@/components/growth-chart";
import { ProjectMark } from "@/components/project-mark";
import { getPortalData } from "@/lib/data";
import { formatDate, formatNumber, getGrowth, getHistoryPoints } from "@/lib/metrics";
import { categories, type Paper } from "@/lib/types";
import styles from "./detail.module.css";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPortalData();
  const project = data.projects.find((item) => item.slug === slug);
  return project ? { title: project.name, description: project.summary } : { title: "프로젝트를 찾을 수 없습니다" };
}

function changeLabel(value: number | null) {
  return value === null ? "집계 중" : `${value > 0 ? "+" : ""}${formatNumber(value)}`;
}

function PaperCard({ paper, relatedPapers }: { paper: Paper; relatedPapers: Paper[] }) {
  return <article className={styles.paperCard}>
    <div className={styles.paperMeta}><span className={paper.kind === "foundation" ? styles.foundationBadge : styles.researchBadge}>{paper.kind === "foundation" ? "기반 논문" : "연구 논문"}</span><span>{formatDate(paper.publishedAt)}</span></div>
    <h3><a href={paper.url} target="_blank" rel="noreferrer">{paper.title}<ArrowUpRight size={17} /></a></h3>
    <p className={styles.paperAuthors}>{paper.authors}</p>
    <p className={styles.paperSummary}>{paper.summary}</p>
    <div className={styles.paperRelation}><span><Sparkles size={13} />{paper.relationLabel}</span><p>{paper.reason}</p><a href={paper.evidenceUrl} target="_blank" rel="noreferrer">연결 근거 <ArrowUpRight size={12} /></a></div>
    {relatedPapers.length > 0 && <div className={styles.relatedReading}><span>이어 읽을 기반 논문</span>{relatedPapers.map((related) => <a href={related.url} target="_blank" rel="noreferrer" key={related.id}>{related.title}<ArrowUpRight size={12} /></a>)}</div>}
  </article>;
}

export default async function ProjectDetail({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPortalData();
  const project = data.projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const metrics = project.metrics;
  const dayGrowth = getGrowth(project, 1, "net", data.attemptedAt ?? data.collectedAt);
  const weekGrowth = getGrowth(project, 7, "net", data.attemptedAt ?? data.collectedAt);
  const releaseNews = data.news.filter((item) => item.projectSlug === slug).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const directPapers = data.papers.filter((paper) => project.paperIds.includes(paper.id) || paper.projectSlugs.includes(slug));
  const relatedFoundationIds = new Set(directPapers.flatMap((paper) => paper.relatedPaperIds));
  const papers = data.papers.filter((paper) => directPapers.some((direct) => direct.id === paper.id) || (paper.kind === "foundation" && relatedFoundationIds.has(paper.id)));
  const projectCategories = categories.filter((category) => project.categories.includes(category.id));
  let website: string | undefined;
  try {
    const url = new URL(project.website || metrics.website || "");
    if (url.protocol === "https:" || url.protocol === "http:") website = url.href;
  } catch {
    // A repository's optional homepage can contain non-URL text.
  }
  const repoUrl = metrics.url || `https://github.com/${project.repo}`;

  return <main id="main" className={styles.page}>
    <div className={styles.breadcrumb}><Link href="/"><ArrowLeft size={14} /> 프로젝트 탐색</Link><span>/</span><span>{project.name}</span></div>

    <section className={styles.hero} aria-labelledby="project-title">
      <div className={styles.heroIdentity}>
        <ProjectMark name={project.name} accent={project.accent} size="large" />
        <div><a className={styles.repository} href={repoUrl} target="_blank" rel="noreferrer">{project.repo}<ArrowUpRight size={12} /></a><h1 id="project-title">{project.name}</h1></div>
      </div>
      <p className={styles.summary}>{project.summary}</p>
      <div className={styles.heroBottom}>
        <div className={styles.tags}>{projectCategories.map((category) => <Link key={category.id} href={`/?category=${category.id}`} style={{ "--category-color": category.color } as React.CSSProperties}><span />{category.name}</Link>)}{metrics.archived && <span className={styles.archived}>보관된 저장소</span>}</div>
        <div className={styles.actions}><a className={styles.githubButton} href={repoUrl} target="_blank" rel="noreferrer"><Github size={16} /> GitHub에서 보기 <ArrowUpRight size={15} /></a>{website && <a className={styles.websiteButton} href={website} target="_blank" rel="noreferrer"><Globe2 size={15} /> 웹사이트 <ArrowUpRight size={14} /></a>}</div>
      </div>
    </section>

    <section className={styles.metrics} aria-label="프로젝트 지표">
      <div><span className={styles.metricLabel}><Star size={14} /> 총 스타</span><strong>{formatNumber(metrics.stars)}</strong><span className={styles.metricCaption}>GitHub 전체 스타 수</span></div>
      <div><span className={styles.metricLabel}><TrendingUp size={14} /> 1일 순증가</span><strong className={dayGrowth === null ? styles.pending : dayGrowth >= 0 ? styles.positive : ""}>{changeLabel(dayGrowth)}</strong><span className={styles.metricCaption}>{dayGrowth === null ? "전일 관측값이 쌓이면 표시" : "전일 대비 관측 스타 변화"}</span></div>
      <div><span className={styles.metricLabel}><TrendingUp size={14} /> 7일 순증가</span><strong className={weekGrowth === null ? styles.pending : weekGrowth >= 0 ? styles.positive : ""}>{changeLabel(weekGrowth)}</strong><span className={styles.metricCaption}>{weekGrowth === null ? "7일 전 관측값이 쌓이면 표시" : "7일 전 대비 관측 스타 변화"}</span></div>
      <div><span className={styles.metricLabel}><GitFork size={14} /> 포크</span><strong>{formatNumber(metrics.forks)}</strong><span className={styles.metricCaption}>프로젝트에서 갈라진 저장소</span></div>
    </section>

    <div className={styles.contentGrid}>
      <div className={styles.mainColumn}>
        <GrowthChart snapshots={metrics.snapshots} historyPoints={getHistoryPoints(metrics)} />
        <section className={styles.releaseSection} aria-labelledby="releases-title">
          <div className={styles.sectionHeading}><h2 id="releases-title"><Tag size={18} /> 최근 릴리스</h2><a href={`${repoUrl}/releases`} target="_blank" rel="noreferrer">GitHub 전체 보기 <ArrowUpRight size={13} /></a></div>
          {releaseNews.length ? <div className={styles.releaseList}>{releaseNews.map((release) => <article className={styles.release} key={release.id}><div className={styles.releaseTop}><span><CircleDot size={12} />{release.tag}</span><time dateTime={release.publishedAt}>{formatDate(release.publishedAt)}</time></div><h3><a href={release.url} target="_blank" rel="noreferrer">{release.title}<ArrowUpRight size={16} /></a></h3><p>{release.summary}</p><a className={styles.releaseLink} href={release.url} target="_blank" rel="noreferrer">릴리스 노트 읽기 <ChevronRight size={13} /></a></article>)}</div> : <div className={styles.empty}><Tag size={21} /><p>아직 수집된 릴리스가 없습니다.</p><a href={`${repoUrl}/releases`} target="_blank" rel="noreferrer">GitHub에서 릴리스 확인 <ArrowUpRight size={13} /></a></div>}
        </section>
      </div>

      <aside className={styles.sidebar} aria-label="프로젝트 정보">
        <section className={styles.aboutCard}><span className={styles.eyebrow}>ABOUT THE PROJECT</span><h2>어떤 프로젝트인가요?</h2><p className={styles.description}>{project.description}</p><dl className={styles.facts}><div><dt><CircleDot size={13} /> 주요 언어</dt><dd>{metrics.language || project.language || "정보 없음"}</dd></div><div><dt><Scale size={13} /> 라이선스</dt><dd>{metrics.license === "NOASSERTION" ? "별도 확인" : metrics.license || "확인 전"}</dd></div><div><dt><Github size={13} /> 저장소 상태</dt><dd>{metrics.archived ? "보관됨" : metrics.collectedAt ? "공개 · 추적 중" : "수집 대기"}</dd></div></dl><a className={styles.readmeLink} href={`${repoUrl}#readme`} target="_blank" rel="noreferrer"><BookOpen size={14} /> 공식 README 읽기 <ArrowUpRight size={14} /></a></section>
        <section className={styles.dataNote}><span className={styles.noteIcon}><CircleDot size={15} /></span><div><h2>{metrics.error ? "최근 수집을 확인해 주세요" : "데이터는 이렇게 읽어주세요"}</h2><p>순증가는 수집 시점의 총 스타 수를 비교합니다. 관측 기간이 부족하면 집계 중으로 표시합니다.</p>{metrics.error && <p>최근 수집에 실패해 마지막으로 확인한 데이터를 표시합니다.</p>}{metrics.collectedAt && <span className={styles.updated}>마지막 수집 · {formatDate(metrics.collectedAt)}</span>}<Link href="/about">출처와 집계 기준 <ArrowUpRight size={12} /></Link></div></section>
      </aside>
    </div>

    <section className={styles.papersSection} aria-labelledby="papers-title">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>BEHIND THE PROJECT</span><h2 id="papers-title">프로젝트를 이해하는 논문</h2></div><span className={styles.paperCount}>{papers.length}편의 연결된 연구</span></div>
      <p className={styles.sectionDescription}>구현과 연구, 그리고 그 바탕이 된 아이디어를 함께 살펴보세요.</p>
      {papers.length ? <div className={styles.paperGrid}>{papers.map((paper) => <PaperCard key={paper.id} paper={paper} relatedPapers={data.papers.filter((related) => related.kind === "foundation" && paper.relatedPaperIds.includes(related.id))} />)}</div> : <div className={styles.empty}><BookOpen size={25} /><h3>연결 근거가 확인된 논문을 찾고 있어요</h3><p>프로젝트와의 관계를 확인한 연구 논문과 기반 논문을 소개합니다.</p><Link href="/#papers">다른 AI 논문 둘러보기 <ExternalLink size={13} /></Link></div>}
    </section>
    <Link href="/" className={styles.backLink}><ArrowLeft size={14} /> 다른 프로젝트 탐색하기</Link>
  </main>;
}
