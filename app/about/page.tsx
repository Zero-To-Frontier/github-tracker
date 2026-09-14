import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Database, Radio, TrendingUp } from "lucide-react";
import { getPortalData } from "@/lib/data";
import { formatDate } from "@/lib/metrics";
import "./about.css";

export const metadata: Metadata = { title: "데이터와 큐레이션 기준", description: "Git Signal이 프로젝트와 논문을 선정하고, 스타 성장과 데이터 출처를 표시하는 방법." };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const data = await getPortalData();
  return <main id="main" className="page-shell about-page"><Link href="/" className="back-link"><ArrowLeft size={14} />프로젝트로 돌아가기</Link><div className="eyebrow"><Radio size={14} />ABOUT THE SIGNAL</div><h1>변화를 읽는 데에도,<br /><span>분명한 기준이 필요하니까.</span></h1><p className="about-lead">Git Signal은 AI 프로젝트와 연구를 연결하는 공개 포털입니다.<br />무엇을 모으고, 어떻게 보여주는지 투명하게 공유합니다.</p>
    <div className="about-status"><span><span className={`status-dot ${data.run.successful > 0 ? "status-ok" : ""}`} />{data.run.successful}/{data.run.total}개 프로젝트 수집</span><span>마지막 갱신 {data.collectedAt ? formatDate(data.collectedAt) : "준비 중"}</span></div>
    <section className="about-section"><div className="about-section-title"><TrendingUp size={21} /><h2>스타 수보다 중요한 건, 그 의미</h2></div><div className="about-definitions"><article><span>01 / TOTAL</span><h3>전체 스타</h3><p>마지막 수집 시점의 GitHub 스타 수입니다. 실시간 수치와는 차이가 있을 수 있습니다.</p></article><article><span>02 / OBSERVED CHANGE</span><h3>관측 순증가</h3><p>매일 저장한 총스타 수의 차이입니다. 스타 취소도 반영되어 음수가 될 수 있습니다. 두 시점의 관측이 모두 있을 때만 계산합니다.</p></article><article><span>03 / GITHUB HISTORY</span><h3>GitHub 스타 활동</h3><p>GitHub가 제공한 일별 스타 집계입니다. 자체 관측 이력이 부족한 초기에는 완료된 최근 1일·7일의 값을 합산해 보여줍니다. 순증가나 과거 총스타와는 다른 지표입니다.</p></article></div><p className="about-note">홈의 지표 이름과 출처를 확인해 주세요. 직접 관측은 UTC 기준일을 사용하지만, GitHub 집계의 날짜 경계는 UTC와 일치하지 않을 수 있습니다. 진행 중인 날은 활동 집계에서 제외합니다.</p><a className="source-link" href="https://docs.github.com/en/rest/activity/starring#get-repository-star-history" target="_blank" rel="noreferrer">GitHub 공식 집계 문서<ArrowUpRight size={14} /></a></section>
    <section className="about-section"><div className="about-section-title"><Database size={21} /><h2>작게 선정하고, 꾸준히 관측합니다</h2></div><p>AI Agent, Coding Agent, RAG, Memory, Local AI의 공개 저장소를 선정합니다. 이 목록은 GitHub 전체의 순위가 아닙니다. 각 프로젝트의 공식 설명과 기능을 바탕으로 분야를 나누며, 한 프로젝트가 여러 분야에 포함될 수 있습니다.</p><p>하루 한 번 수집하도록 구성되어 있습니다. 실패한 자료를 0으로 채우지 않고 마지막 정상 값을 유지합니다. 비교 자료가 없는 프로젝트는 순위를 부여하지 않습니다. 데이터 수집일과 최종 성공 시각은 프로젝트 상세에서 확인할 수 있습니다.</p></section>
    <section className="about-section"><div className="about-section-title"><BookOpen size={21} /><h2>연구를 연결하되, 관계를 과장하지 않습니다</h2></div><p>프로젝트가 직접 인용한 논문과, 개념 이해를 위해 선정한 배경 자료를 구분합니다. 기반 논문은 최신 연구나 인기 순위가 아닙니다. 프로젝트 연구의 발표일과 관계 유형도 함께 표시합니다.</p><p>프로젝트 소개와 선정 논문 설명은 원문을 확인해 작성한 한국어 편집 요약입니다. 릴리스 카드는 공식 릴리스의 제목과 발췌문을 표시합니다. 현재 버전에는 자동 AI 요약을 적용하지 않았습니다.</p><div className="source-links"><a className="source-link" href="https://arxiv.org/" target="_blank" rel="noreferrer">arXiv 원문<ArrowUpRight size={14} /></a><a className="source-link" href="https://info.arxiv.org/help/api/tou.html" target="_blank" rel="noreferrer">arXiv 메타데이터 이용 기준<ArrowUpRight size={14} /></a></div></section>
    <Link className="button-primary" href="/">다음 프로젝트 발견하기<ArrowUpRight size={16} /></Link>
  </main>;
}
