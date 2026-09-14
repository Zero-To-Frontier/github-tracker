import type { EcosystemEdge, EcosystemNode } from "../lib/ecosystem-types";

// Representative development products and agent frameworks, not a popularity ranking.
const verifiedAt = "2026-09-14";

export const nodes: EcosystemNode[] = [
  {
    id: "cursor", name: "Cursor", category: "coding", mark: "Cu",
    mapLabel: "AI 편집기·코딩 에이전트",
    tagline: "코드 편집 환경에서 탐색·수정·실행을 이어 가는 AI 개발 도구",
    description: "코드 편집기와 에이전트를 결합한 개발 제품입니다. 프로젝트 코드와 지침을 읽고 파일을 수정하거나 터미널 명령을 실행하며, 선택한 모델에 맞춰 개발 도구를 연결합니다. 에디터의 코드 완성과 대화형 개발 외에 CLI와 클라우드 에이전트도 제공합니다.",
    problem: "프로젝트 문맥을 매번 복사하거나 여러 파일과 명령을 직접 오가며 처리하던 개발 작업을 줄여 줍니다.",
    role: "모델의 판단을 개발자의 코드와 실행 환경으로 연결하는 제품 계층입니다. 모델 제공자 자체와는 역할이 다릅니다.",
    useCases: ["기존 코드베이스를 탐색한 뒤 여러 파일에 걸친 기능 수정", "에이전트가 만든 변경과 실행 결과를 편집기에서 검토"],
    features: ["코드 완성과 프로젝트 문맥 기반 에이전트", "파일 수정·코드 검색·터미널 도구", "여러 모델 선택과 MCP·프로젝트 규칙 연결"],
    openness: "service", license: "상용 제품·서비스 · Cursor 이용약관 적용",
    licenseUrl: "https://cursor.com/terms-of-service",
    website: "https://cursor.com/", docs: "https://cursor.com/docs",
    sources: [
      { title: "Cursor Agent의 역할과 개발 도구", url: "https://cursor.com/docs/agent/overview" },
      { title: "Cursor 공식 문서와 제공 환경", url: "https://cursor.com/docs" },
      { title: "Cursor의 지원 모델", url: "https://cursor.com/docs/models-and-pricing" },
      { title: "Cursor 이용약관", url: "https://cursor.com/terms-of-service" },
    ], verifiedAt,
  },
  {
    id: "copilot", name: "GitHub Copilot", category: "coding", mark: "Cp",
    mapLabel: "IDE·GitHub 개발 도우미",
    tagline: "개발 도구와 GitHub 작업 흐름에 AI 지원을 제공하는 서비스",
    description: "IDE의 코드 제안과 대화부터 명령줄 지원, 코드 변경과 풀 리퀘스트 작성까지 제공하는 GitHub의 개발 서비스입니다. 개발자는 익숙한 편집기에서 도움을 받거나 작업을 에이전트에 맡기고 결과를 검토할 수 있습니다. 여기서는 전체 Copilot 제품을 나타내며, 개별 공개 확장 코드나 SDK와 구분합니다.",
    problem: "코드 작성·질문·변경 검토를 개발자의 기존 도구와 저장소 작업 흐름 안에서 처리하도록 돕습니다.",
    role: "모델과 저장소 문맥을 개발 작업에 적용하는 서비스 계층입니다. IDE 지원과 GitHub의 협업 흐름을 함께 설명하는 항목입니다.",
    useCases: ["IDE에서 코드 설명·수정·테스트 작성 도움 받기", "개발 작업을 맡긴 뒤 만들어진 풀 리퀘스트 검토"],
    features: ["코드 제안과 프로젝트 문맥 기반 대화", "IDE·CLI·GitHub에서의 에이전트 작업", "여러 모델과 MCP 서버 연결"],
    openness: "service", license: "GitHub 서비스 약관 · Business·Enterprise에는 제품별 약관 적용",
    licenseUrl: "https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#github-copilot",
    website: "https://github.com/features/copilot", docs: "https://docs.github.com/en/copilot",
    sources: [
      { title: "GitHub Copilot의 기능과 제공 환경", url: "https://docs.github.com/en/copilot/get-started/what-is-github-copilot" },
      { title: "GitHub Copilot 지원 모델", url: "https://docs.github.com/en/copilot/reference/ai-models/supported-models" },
      { title: "Copilot에 적용되는 약관 안내", url: "https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#github-copilot" },
    ], verifiedAt,
  },
  {
    id: "langchain", name: "LangChain", category: "orchestration", mark: "LC",
    mapLabel: "모델·도구로 에이전트 구성",
    tagline: "모델·도구·프롬프트를 조합해 에이전트를 만드는 프레임워크",
    description: "모델 호출과 도구 사용을 묶어 목적에 맞는 에이전트를 구현하는 오픈소스 프레임워크입니다. 공통 인터페이스로 여러 모델 제공자를 연결하고, 미들웨어로 에이전트의 동작을 조정할 수 있습니다. LangChain의 에이전트는 LangGraph 실행 기반 위에 구축되며, LangSmith 같은 별도 운영 서비스와 구분합니다.",
    problem: "모델마다 다른 API와 도구 호출 흐름을 직접 연결하는 부담을 줄이고 앱에 필요한 에이전트 동작을 구성하게 합니다.",
    role: "모델과 도구 위에서 에이전트의 동작을 구성하는 개발 계층입니다. LangGraph보다 높은 수준의 구성 인터페이스를 제공합니다.",
    useCases: ["업무 도구를 호출하는 맞춤형 에이전트 구현", "모델을 교체하면서 프롬프트·도구·실행 정책을 조정"],
    features: ["모델 제공자 공통 인터페이스", "create_agent와 미들웨어 구성", "LangGraph 기반 실행·상태 유지와 사람의 개입"],
    openness: "open-source", license: "MIT · LangChain 프레임워크 코드 기준",
    licenseUrl: "https://github.com/langchain-ai/langchain/blob/master/LICENSE",
    website: "https://www.langchain.com/", docs: "https://docs.langchain.com/oss/python/langchain/overview",
    github: "https://github.com/langchain-ai/langchain",
    sources: [
      { title: "LangChain 개요와 LangGraph와의 관계", url: "https://docs.langchain.com/oss/python/langchain/overview" },
      { title: "LangChain의 MCP 도구 연결", url: "https://docs.langchain.com/oss/python/langchain/mcp" },
      { title: "LangChain MIT 라이선스", url: "https://github.com/langchain-ai/langchain/blob/master/LICENSE" },
    ], verifiedAt,
  },
  {
    id: "google-adk", name: "Google ADK", category: "orchestration", mark: "AD",
    mapLabel: "에이전트 개발·협업 SDK",
    tagline: "에이전트와 협업 흐름을 구현·평가·배포하는 개발 도구 모음",
    description: "Google이 공개한 Agent Development Kit입니다. 코드로 에이전트와 도구를 정의하고, 여러 에이전트의 작업 순서와 분기·반복을 구성하며 개발 화면에서 실행을 확인할 수 있습니다. Gemini와의 통합을 제공하지만 다른 모델과 배포 환경도 지원하는 프레임워크입니다.",
    problem: "여러 에이전트가 역할을 나누는 앱에서 도구·작업 흐름·상태·실행 검증을 일관되게 구성할 때 사용합니다.",
    role: "모델과 도구를 조합한 에이전트를 만들고 협업과 실행을 관리하는 개발·오케스트레이션 계층입니다.",
    useCases: ["조사·작성·검토 에이전트를 연결한 업무 흐름 구현", "에이전트를 로컬에서 평가한 뒤 서버나 클라우드에 배포"],
    features: ["단일·멀티 에이전트와 워크플로 구성", "개발 UI·평가·상태 관리", "Gemini·MCP 연결과 선택적 A2A 통신"],
    openness: "open-source", license: "Apache-2.0 · 연결된 Python SDK 기준, 모델·클라우드 이용 조건 별도",
    licenseUrl: "https://github.com/google/adk-python/blob/main/LICENSE",
    website: "https://adk.dev/", docs: "https://adk.dev/",
    github: "https://github.com/google/adk-python",
    sources: [
      { title: "ADK 공식 문서", url: "https://adk.dev/" },
      { title: "ADK Python 기능과 Apache-2.0 라이선스", url: "https://github.com/google/adk-python" },
      { title: "ADK의 A2A 지원과 실험적 상태", url: "https://adk.dev/a2a/" },
    ], verifiedAt,
  },
  {
    id: "a2a", name: "A2A", category: "tools", mark: "A2A",
    mapLabel: "에이전트 간 통신 규약",
    tagline: "서로 다른 시스템의 에이전트가 작업과 결과를 주고받는 공개 규약",
    description: "Agent2Agent의 약자로, 독립적으로 만들어진 에이전트들이 서로를 발견하고 작업을 위임하며 결과를 교환하는 통신 규약입니다. 내부 도구나 구현을 모두 공개하지 않아도 공통 방식으로 협업하도록 설계되었습니다. Google에서 시작해 Linux Foundation에 기증되었으며, 도구 연결용 MCP와는 다른 통신 역할을 담당합니다.",
    problem: "조직·프레임워크·제공자가 다른 에이전트마다 개별 통신 방식을 만들어야 하는 문제를 줄입니다.",
    role: "완성된 에이전트 사이의 통신 계층입니다. 에이전트를 만드는 SDK나 개별 도구를 호출하는 규약 자체를 제공하는 것은 아닙니다.",
    useCases: ["내부 에이전트가 외부 전문 에이전트에 하위 작업 요청", "작업 진행 상태와 결과를 다른 시스템의 에이전트와 교환"],
    features: ["에이전트 발견과 역량 안내", "작업 위임·진행 상태·결과 교환", "내부 구현을 분리한 상호 운용과 공식 SDK"],
    openness: "open-standard", license: "Apache-2.0 · 공개 프로토콜 저장소 기준",
    licenseUrl: "https://github.com/a2aproject/A2A/blob/main/LICENSE",
    website: "https://a2a-protocol.org/", docs: "https://a2a-protocol.org/latest/",
    github: "https://github.com/a2aproject/A2A",
    sources: [
      { title: "A2A 역할·MCP와의 구분·프로젝트 운영", url: "https://a2a-protocol.org/latest/" },
      { title: "A2A Apache-2.0 라이선스", url: "https://github.com/a2aproject/A2A/blob/main/LICENSE" },
    ], verifiedAt,
  },
];

export const edges: EcosystemEdge[] = [
  {
    id: "c-cursor-anthropic", from: "cursor", to: "anthropic", label: "모델 사용",
    description: "Cursor에서 지원하는 Claude 모델을 개발 에이전트의 모델로 선택할 수 있습니다. 여러 모델 제공자 중 하나를 사용하는 관계이며, 이용 가능한 모델은 요금제와 시점에 따라 달라집니다.",
    source: { title: "Cursor의 지원 모델 목록", url: "https://cursor.com/docs/models-and-pricing" }, verifiedAt,
  },
  {
    id: "c-cursor-mcp", from: "cursor", to: "mcp", label: "도구 연결",
    description: "Cursor에 MCP 서버를 등록하면 서버의 도구와 데이터 소스를 에이전트 작업에 연결할 수 있습니다. 프로젝트 설정이나 사용자 설정에서 필요한 서버를 선택하는 통합입니다.",
    source: { title: "Cursor MCP 공식 문서", url: "https://cursor.com/docs/mcp" }, verifiedAt,
  },
  {
    id: "c-copilot-openai", from: "copilot", to: "openai", label: "모델 사용",
    description: "GitHub Copilot은 지원 모델 목록에 있는 OpenAI 모델을 코드 대화와 에이전트 작업에 사용할 수 있습니다. 지원 모델과 기능은 요금제·이용 환경·조직 정책에 따라 달라지며, Copilot 전체가 단일 모델로 동작한다는 의미는 아닙니다.",
    source: { title: "GitHub Copilot 지원 모델", url: "https://docs.github.com/en/copilot/reference/ai-models/supported-models" }, verifiedAt,
  },
  {
    id: "c-copilot-mcp", from: "copilot", to: "mcp", label: "도구 연결",
    description: "Copilot의 IDE·CLI·앱·GitHub 에이전트에 MCP 서버를 설정해 외부 시스템의 도구를 사용할 수 있습니다. 연결 설정과 지원 범위는 이용 환경 및 조직 정책에 따릅니다.",
    source: { title: "GitHub Copilot의 MCP 지원", url: "https://docs.github.com/en/copilot/concepts/context/mcp" }, verifiedAt,
  },
  {
    id: "c-langchain-langgraph", from: "langchain", to: "langgraph", label: "실행 기반",
    description: "LangChain의 에이전트 구현은 LangGraph 위에 구축되어 실행 지속성, 상태 유지, 사람의 개입 기능을 활용합니다. 같은 회사의 프로젝트라는 분류 관계가 아니라 공식 문서가 명시한 실행 기반 관계입니다.",
    source: { title: "LangChain 에이전트의 LangGraph 실행 기반", url: "https://docs.langchain.com/oss/python/langchain/overview" }, verifiedAt,
  },
  {
    id: "c-langchain-mcp", from: "langchain", to: "mcp", label: "도구 연결",
    description: "LangChain은 MCP 서버의 도구를 에이전트가 호출할 수 있는 도구로 변환합니다. 현재 공식 문서의 langchain.mcp MCPAdapter는 FastMCP 기반이며, LangChain 1.4 이상에서 제공하는 베타 API로 안내되어 있습니다.",
    source: { title: "LangChain MCPAdapter와 지원 상태", url: "https://docs.langchain.com/oss/python/langchain/mcp" }, verifiedAt,
  },
  {
    id: "c-adk-gemini", from: "google-adk", to: "gemini", label: "모델 사용",
    description: "ADK의 에이전트에 Gemini 모델과 인증을 설정해 모델의 응답과 도구 호출 판단을 사용할 수 있습니다. Gemini는 ADK가 지원하는 모델 연결 경로이며, ADK 사용이 Gemini에만 한정되는 것은 아닙니다.",
    source: { title: "ADK의 Gemini 모델 연결", url: "https://adk.dev/agents/models/google-gemini/" }, verifiedAt,
  },
  {
    id: "c-adk-mcp", from: "google-adk", to: "mcp", label: "도구 연결",
    description: "ADK의 McpToolset은 MCP 서버에 연결해 도구를 발견하고 ADK 에이전트용 도구로 변환합니다. 에이전트가 호출하면 요청을 서버로 전달하고 결과를 돌려받는 선택적 통합입니다.",
    source: { title: "ADK의 MCP 도구 연결", url: "https://adk.dev/tools-custom/mcp-tools/" }, verifiedAt,
  },
  {
    id: "c-adk-a2a", from: "google-adk", to: "a2a", label: "에이전트 통신",
    description: "ADK는 에이전트를 A2A로 공개하거나 원격 A2A 에이전트를 호출하는 안내를 제공합니다. 공식 문서가 실험적 기능으로 표시하므로, 사용하는 언어와 SDK 버전별 지원 범위를 확인해야 합니다.",
    source: { title: "ADK의 A2A 에이전트 공개·호출", url: "https://adk.dev/a2a/" }, verifiedAt,
  },
];
