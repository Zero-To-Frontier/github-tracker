import { nodes as agentNodes, edges as agentEdges } from "../data/ecosystem-agents";
import { nodes as foundationNodes, edges as foundationEdges } from "../data/ecosystem-foundations";
import { nodes as expandedAgentNodes, edges as expandedAgentEdges } from "../data/ecosystem-expansion-agents";
import { nodes as expandedFoundationNodes, edges as expandedFoundationEdges } from "../data/ecosystem-expansion-foundations";
import { nodes as modelNodes, edges as modelEdges } from "../data/ecosystem-coverage-models";
import { nodes as appNodes, edges as appEdges } from "../data/ecosystem-coverage-apps";
import { nodes as lifecycleNodes, edges as lifecycleEdges } from "../data/ecosystem-coverage-lifecycle";
import { nodes as platformNodes, edges as platformEdges } from "../data/ecosystem-coverage-platforms";
import type { EcosystemCategory, EcosystemEdge, EcosystemNode } from "./ecosystem-types";

export const ecosystemCategories: EcosystemCategory[] = [
  { id: "models", name: "모델과 제공자", subtitle: "이해하고 생성하는 모델", description: "텍스트와 코드를 이해하고 생성하는 모델, 그리고 모델을 제공하는 서비스입니다.", color: "#a78bfa" },
  { id: "coding", name: "코딩 에이전트", subtitle: "코드를 읽고 수정하는 도구", description: "코드베이스를 읽고 수정하며 개발 도구를 실행하는 에이전트입니다.", color: "#78b7ff" },
  { id: "agents", name: "범용 에이전트", subtitle: "여러 작업을 수행하는 에이전트", description: "여러 도구와 실행 환경을 이용해 일상의 작업을 수행하는 에이전트입니다.", color: "#67d9bf" },
  { id: "orchestration", name: "에이전트 조율", subtitle: "작업 흐름과 협업을 구성", description: "에이전트의 실행 순서, 상태, 협업과 사람의 개입을 구성하는 프레임워크입니다.", color: "#f3c17b" },
  { id: "tools", name: "도구 연결 · MCP", subtitle: "외부 앱과 기능을 연결", description: "모델과 에이전트가 외부 도구 및 데이터에 접근하도록 연결하는 규약과 구성 요소입니다.", color: "#f29ebc" },
  { id: "memory", name: "메모리 · 컨텍스트", subtitle: "기억과 대화 맥락을 유지", description: "여러 대화와 작업 사이에서 필요한 정보를 유지하고 다시 활용하는 구성 요소입니다.", color: "#baadf8" },
  { id: "data", name: "데이터 · 검색 · RAG", subtitle: "필요한 정보를 저장·검색", description: "문서를 정리하고 관련 정보를 검색해 모델의 답변에 근거를 제공하는 도구입니다.", color: "#86c9df" },
  { id: "infrastructure", name: "추론 · 실행 인프라", subtitle: "모델을 불러오고 실행", description: "모델을 로컬이나 서버에서 실행하고 추론 요청을 처리하는 기반 소프트웨어입니다.", color: "#aecb80" },
  { id: "open-models", name: "공개 모델 계열", subtitle: "가중치를 받아 직접 활용", description: "공개된 가중치를 내려받아 실행하거나 조정할 수 있는 모델 계열입니다. 공개 범위와 이용 조건은 모델마다 다릅니다.", color: "#b9a0f7" },
  { id: "training", name: "학습 · 미세 조정", subtitle: "모델을 만들고 목적에 맞게 조정", description: "모델을 구현하고 학습하며, 사전 학습된 모델을 목적에 맞게 조정하는 프레임워크와 라이브러리입니다.", color: "#e8ab86" },
  { id: "evaluation", name: "평가 · 운영 관측", subtitle: "품질·비용·실패 원인을 확인", description: "AI 실행 과정을 기록하고 평가 데이터로 품질을 비교하며 운영 중 문제를 찾아내는 도구입니다.", color: "#e0c57b" },
  { id: "deployment", name: "GPU · 클라우드", subtitle: "연산 기반과 관리형 AI 운영", description: "GPU 계산을 지원하는 기반과 모델·에이전트를 관리형 서비스로 배포하고 운영하는 플랫폼입니다.", color: "#86bfbb" },
];

export const ecosystemNodes: EcosystemNode[] = [...foundationNodes, ...agentNodes, ...expandedAgentNodes, ...expandedFoundationNodes, ...modelNodes, ...appNodes, ...lifecycleNodes, ...platformNodes];
export const ecosystemEdges: EcosystemEdge[] = [...foundationEdges, ...agentEdges, ...expandedAgentEdges, ...expandedFoundationEdges, ...modelEdges, ...appEdges, ...lifecycleEdges, ...platformEdges];

export interface EcosystemConnection {
  edge: EcosystemEdge;
  node: EcosystemNode;
  direction: "outgoing" | "incoming";
}

export function getConnections(nodeId: string): EcosystemConnection[] {
  return ecosystemEdges.flatMap((edge): EcosystemConnection[] => {
    const direction = edge.from === nodeId ? "outgoing" : edge.to === nodeId ? "incoming" : null;
    if (!direction) return [];
    const node = ecosystemNodes.find((item) => item.id === (direction === "outgoing" ? edge.to : edge.from));
    return node ? [{ edge, node, direction }] : [];
  });
}
