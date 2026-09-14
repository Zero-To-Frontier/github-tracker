import type { Metadata } from "next";
import { EcosystemMap } from "@/components/ecosystem-map";

export const metadata: Metadata = {
  title: "AI 생태계 지도",
  description: "생성형 AI·에이전트 중심의 생태계 지도. 공개 모델, 개발 도구, 학습·평가, GPU·클라우드까지 역할과 공식 자료로 확인한 관계를 탐색하세요.",
};

export default function EcosystemPage() {
  return <EcosystemMap />;
}
