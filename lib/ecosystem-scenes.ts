import { nodes as drilldownNodes, edges as drilldownEdges } from "../data/ecosystem-drilldown";
import { ecosystemEdges, ecosystemNodes } from "./ecosystem";
import type { EcosystemEdge, EcosystemNode } from "./ecosystem-types";

export type EcosystemScene = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  centerId: string;
  color: string;
  groups: Array<{ id: string; title: string; description: string; nodeIds: string[] }>;
  edgeIds: string[];
  entrances: Record<string, string>;
};

// Keep the existing overview arrays intact. A scene selects IDs from the shared catalog.
export const allEcosystemNodes: EcosystemNode[] = [...ecosystemNodes, ...drilldownNodes];
export const allEcosystemEdges: EcosystemEdge[] = [...ecosystemEdges, ...drilldownEdges];

export const overviewEntrances: Record<string, string> = { mcp: "mcp-ecosystem" };

export const ecosystemScenes: EcosystemScene[] = [
  {
    id: "mcp-ecosystem", title: "MCP 생태계", subtitle: "도구와 AI가 연결되는 방식",
    description: "서버를 만들고, 발견하고, 연결하고, 검사하는 요소를 살펴보세요. TypeScript SDK에서 개발 생태계로 더 들어갈 수 있습니다.",
    centerId: "mcp", color: "#f29ebc",
    groups: [
      { id: "build", title: "서버 · 클라이언트 개발", description: "내 기능을 MCP로 연결", nodeIds: ["mcp-typescript-sdk", "mcp-python-sdk", "fastmcp"] },
      { id: "discover", title: "서버와 발견", description: "실제 도구와 접속 정보를 찾기", nodeIds: ["playwright-mcp", "mcp-registry"] },
      { id: "transport", title: "메시지 전송", description: "로컬 프로세스 또는 HTTP로 통신", nodeIds: ["mcp-stdio", "mcp-streamable-http"] },
      { id: "inspect", title: "검사와 접근 권한", description: "호출을 확인하고 접근 범위를 구성", nodeIds: ["mcp-inspector", "mcp-authorization"] },
    ],
    edgeIds: ["d-ts-mcp", "d-python-mcp", "xf-fastmcp-mcp", "f-playwright-mcp", "d-registry-mcp", "d-mcp-stdio", "d-mcp-http", "d-inspector-mcp", "d-mcp-auth", "d-auth-http", "d-ts-stdio", "d-ts-http", "d-inspector-stdio", "d-inspector-http"],
    entrances: { "mcp-typescript-sdk": "mcp-typescript-development" },
  },
  {
    id: "mcp-typescript-development", title: "TypeScript SDK 생태계", subtitle: "하나의 MCP 서버가 만들어지는 과정",
    description: "도구의 입력을 정의하고, 기능과 자료를 등록하고, 전송 방식을 연결합니다. 각 요소를 눌러 역할과 선택 가능한 구성을 확인하세요.",
    centerId: "mcp-typescript-sdk", color: "#78b7ff",
    groups: [
      { id: "libraries", title: "함께 쓰는 라이브러리", description: "입력을 검증하고 웹 앱에 연결", nodeIds: ["zod", "express"] },
      { id: "capabilities", title: "서버가 제공하는 것", description: "실행 기능 · 참고 자료 · 작업 템플릿", nodeIds: ["mcp-tools", "mcp-resources", "mcp-prompts"] },
      { id: "transport", title: "서버 연결 방식", description: "실행 환경에 맞는 전송을 선택", nodeIds: ["mcp-stdio", "mcp-streamable-http"] },
      { id: "reference", title: "규약과 검사 도구", description: "규약을 구현하고 호출을 확인", nodeIds: ["mcp", "mcp-inspector"] },
    ],
    edgeIds: ["d-ts-mcp", "d-ts-zod", "d-ts-express", "d-ts-tools", "d-ts-resources", "d-ts-prompts", "d-ts-stdio", "d-ts-http", "d-express-http", "d-inspector-mcp", "d-inspector-stdio", "d-inspector-http", "d-mcp-tools", "d-mcp-resources"],
    entrances: {},
  },
];
