import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return <main id="main" className="not-found"><SearchX size={40} /><span className="eyebrow">404 / SIGNAL NOT FOUND</span><h1>아직 발견하지 못한 프로젝트예요.</h1><p>프로젝트 주소를 확인하거나, 새로운 프로젝트를 탐색해 보세요.</p><Link className="button-primary" href="/"><ArrowLeft size={16} /> 프로젝트 탐색</Link></main>;
}
