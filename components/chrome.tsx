"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Radio } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="brand" aria-label="Git Signal 홈"><span className="brand-mark"><Radio size={21} strokeWidth={2} /></span>git<span className="brand-light">signal</span><span className="beta">BETA</span></Link>
    <nav aria-label="주 메뉴"><Link className={pathname === "/ecosystem" ? "nav-active" : ""} aria-current={pathname === "/ecosystem" ? "page" : undefined} href="/ecosystem">AI 생태계</Link><Link className={pathname === "/" || pathname.startsWith("/projects/") ? "nav-active" : ""} href="/">프로젝트</Link><Link href="/#news">AI 소식</Link><Link href="/#papers">논문</Link></nav>
    <a className="header-about" href="/about">데이터 안내 <ArrowUpRight size={14} /></a>
  </div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner"><div><Link href="/" className="footer-brand"><Radio size={17} /> git signal</Link><p>프로젝트를 발견하고, 변화의 맥락을 읽습니다.</p></div><div className="footer-meta"><Link href="/about">출처 및 집계 기준 <ArrowUpRight size={13} /></Link><span>공개 저장소 큐레이션 · GitHub 및 arXiv 기반</span></div></div></footer>;
}
