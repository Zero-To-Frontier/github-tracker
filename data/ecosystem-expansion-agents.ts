import type { EcosystemEdge, EcosystemNode } from "../lib/ecosystem-types";

// Curated roles and documented integrations; edges are optional capabilities.
const verifiedAt = "2026-09-14";

export const nodes: EcosystemNode[] = [
  {
    id: "gemma", name: "Google · Gemma", category: "open-models", mark: "Gm",
    mapLabel: "직접 실행하는 공개 모델",
    tagline: "내 환경에서 실행하고 조정할 수 있는 공개 가중치 모델 계열",
    description: "Google DeepMind가 공개한 모델 계열입니다. 모델 가중치를 내려받아 장치나 서버에서 추론하고, 필요한 작업에 맞게 미세 조정할 수 있습니다. 모델마다 크기와 입력 형식이 다르며, Gemini API와는 별개입니다. 아래 GitHub 링크는 모델을 사용·조정하는 JAX 라이브러리이며 모델 가중치 자체의 배포 저장소를 뜻하지 않습니다.",
    problem: "AI 기능을 내 장치나 서버에서 운영하거나 특정 업무에 맞는 모델로 조정하고 싶을 때 활용합니다.",
    role: "실행 엔진이 불러오는 모델 계층입니다. 에이전트가 사용할 응답과 판단을 생성하며, 작업 실행과 서비스 운영은 별도 도구가 담당합니다.",
    useCases: ["Ollama로 로컬 문서 도우미의 모델 실행", "서버에 모델을 배포하거나 업무 데이터로 미세 조정"],
    features: ["내려받아 실행할 수 있는 모델 가중치", "일반 생성·임베딩 등 목적별 모델 변형", "Ollama·vLLM과 미세 조정 도구 지원"],
    openness: "open-weight",
    license: "모델별 조건 상이 · Gemma 4는 Apache-2.0, Gemma 1~3·일부 변형은 Gemma Terms · 연결된 JAX 라이브러리는 Apache-2.0",
    licenseUrl: "https://ai.google.dev/gemma/terms",
    website: "https://ai.google.dev/gemma/", docs: "https://ai.google.dev/gemma/docs",
    github: "https://github.com/google-deepmind/gemma",
    sources: [
      { title: "Gemma 모델 계열과 활용 안내", url: "https://ai.google.dev/gemma/docs" },
      { title: "모델별 약관 적용 범위", url: "https://ai.google.dev/gemma/terms" },
      { title: "Gemma 4 Apache-2.0 라이선스", url: "https://ai.google.dev/gemma/apache_2" },
      { title: "JAX 라이브러리와 별도 코드 라이선스", url: "https://github.com/google-deepmind/gemma" },
    ], verifiedAt,
  },
  {
    id: "gemini-cli", name: "Gemini CLI", category: "coding", mark: ">G",
    mapLabel: "Gemini 터미널 에이전트",
    tagline: "Gemini와 로컬 개발 도구를 연결하는 터미널 에이전트",
    description: "Google의 google-gemini/gemini-cli 저장소에서 개발하는 오픈소스 에이전트입니다. 터미널에서 프로젝트 파일을 읽고 수정하며 셸 명령을 실행해 개발 작업을 진행합니다. 코드 이해뿐 아니라 스크립트와 반복 작업에도 사용할 수 있고, 프로젝트 지침과 MCP 도구로 작업 문맥을 확장합니다.",
    problem: "코드 탐색·수정·명령 실행을 오가며 처리하던 개발 작업을 자연어 요청으로 이어서 수행하도록 돕습니다.",
    role: "Gemini 모델의 판단을 로컬 파일과 터미널 작업으로 이어 주는 코딩 실행 계층입니다.",
    useCases: ["기존 프로젝트의 구조를 파악하고 기능 수정", "프로젝트 지침과 외부 도구를 함께 사용하는 반복 개발 작업"],
    features: ["파일 관리와 셸 명령 실행", "GEMINI.md 기반 프로젝트 문맥", "MCP·확장 기능과 비대화형 실행"],
    openness: "open-source", license: "Apache-2.0 · CLI 코드 기준, 모델 이용 조건 별도",
    licenseUrl: "https://github.com/google-gemini/gemini-cli/blob/main/LICENSE",
    website: "https://geminicli.com/", docs: "https://geminicli.com/docs/",
    github: "https://github.com/google-gemini/gemini-cli",
    sources: [
      { title: "Gemini CLI 공식 문서", url: "https://geminicli.com/docs/" },
      { title: "google-gemini/gemini-cli 공식 저장소", url: "https://github.com/google-gemini/gemini-cli" },
      { title: "Gemini CLI의 MCP 연결", url: "https://geminicli.com/docs/tools/mcp-server/" },
    ], verifiedAt,
  },
  {
    id: "dify", name: "Dify", category: "agents", mark: "Df",
    mapLabel: "AI 앱·에이전트 빌더",
    tagline: "모델·지식·도구를 조합해 AI 애플리케이션을 만드는 플랫폼",
    description: "AI 앱과 에이전트를 시각적으로 설계하고 운영하는 플랫폼입니다. 프롬프트, 모델, 지식 검색, 도구 호출을 연결한 흐름을 만들고 웹 앱이나 API 등으로 공개합니다. 완성된 비서 한 제품을 제공하는 항목이 아니라, 팀이 목적에 맞는 앱과 에이전트를 만드는 환경을 나타냅니다.",
    problem: "모델 연결부터 문서 검색·도구 호출·배포·실행 기록까지 AI 앱의 여러 구성 요소를 함께 관리해야 할 때 사용합니다.",
    role: "모델 제공자와 데이터·도구 계층을 묶어 사용자에게 제공할 AI 앱과 에이전트를 만드는 제작·운영 계층입니다.",
    useCases: ["사내 문서를 검색하는 상담 앱 제작", "업무 도구를 호출하는 에이전트를 API로 제공"],
    features: ["시각적 워크플로와 에이전트 구성", "지식 검색과 여러 모델 제공자 연결", "앱·API·MCP 공개와 실행 기록 확인"],
    openness: "source-available",
    license: "Apache-2.0에 추가 조건 · 멀티테넌트 운영 및 프런트엔드 로고·저작권 표시 관련 조건 적용",
    licenseUrl: "https://github.com/langgenius/dify/blob/main/LICENSE",
    website: "https://www.dify.ai/", docs: "https://docs.dify.ai/en/home",
    github: "https://github.com/langgenius/dify",
    sources: [
      { title: "Dify의 앱·에이전트·워크플로 기능", url: "https://www.dify.ai/" },
      { title: "Dify 공식 문서", url: "https://docs.dify.ai/en/home" },
      { title: "Dify 코드의 추가 라이선스 조건", url: "https://github.com/langgenius/dify/blob/main/LICENSE" },
    ], verifiedAt,
  },
  {
    id: "n8n", name: "n8n", category: "orchestration", mark: "n8",
    mapLabel: "업무·AI 워크플로 연결",
    tagline: "업무 시스템과 AI 처리를 연결하는 워크플로 자동화 플랫폼",
    description: "시각적 캔버스에 트리거와 처리 단계를 연결해 업무를 자동화하는 플랫폼입니다. 정해진 데이터 처리와 분기에 AI 모델이나 에이전트를 넣고, 기존 업무 서비스와 연결합니다. 자체 호스팅과 클라우드 이용 방식을 제공하며, 소스 공개형 fair-code 라이선스를 사용합니다.",
    problem: "여러 서비스에 흩어진 데이터와 반복 업무를 연결하고 필요한 단계에 AI 판단을 추가할 때 활용합니다.",
    role: "업무 이벤트·외부 API·모델·도구를 하나의 실행 흐름으로 이어 주는 오케스트레이션 계층입니다.",
    useCases: ["문의가 들어오면 AI가 분류하고 담당 업무 시스템에 전달", "정기적으로 자료를 수집·요약해 내부 업무 흐름에 반영"],
    features: ["시각적 노드와 조건·데이터 처리", "모델·에이전트·MCP 도구 연결", "사용자 코드와 자체 호스팅 지원"],
    openness: "source-available",
    license: "Sustainable Use License · 사용·배포 조건이 있는 소스 공개형, Enterprise 코드는 별도 라이선스",
    licenseUrl: "https://github.com/n8n-io/n8n/blob/master/LICENSE.md",
    website: "https://n8n.io/", docs: "https://docs.n8n.io/",
    github: "https://github.com/n8n-io/n8n",
    sources: [
      { title: "n8n 공식 저장소와 기능·라이선스 안내", url: "https://github.com/n8n-io/n8n" },
      { title: "n8n의 AI 워크플로 안내", url: "https://docs.n8n.io/build/integrate-ai" },
      { title: "Sustainable Use License 원문", url: "https://github.com/n8n-io/n8n/blob/master/LICENSE.md" },
    ], verifiedAt,
  },
];

export const edges: EcosystemEdge[] = [
  {
    id: "e-gemini-cli-gemini", from: "gemini-cli", to: "gemini", label: "모델 사용",
    description: "Gemini CLI는 Gemini 모델에 프로젝트 문맥과 요청을 전달하고, 모델 응답에 따라 로컬 도구를 실행합니다. CLI 코드의 라이선스와 연결한 모델 서비스의 이용 조건은 별개입니다.",
    source: { title: "Gemini CLI 개요", url: "https://geminicli.com/docs/" }, verifiedAt,
  },
  {
    id: "e-gemini-cli-mcp", from: "gemini-cli", to: "mcp", label: "도구 연결",
    description: "Gemini CLI에 MCP 서버를 설정하면 서버가 제공하는 도구·리소스를 작업에 연결할 수 있습니다. 기본 개발 작업을 실행하는 데 MCP 서버가 필수인 것은 아닙니다.",
    source: { title: "Gemini CLI의 MCP 서버 설정", url: "https://geminicli.com/docs/tools/mcp-server/" }, verifiedAt,
  },
  {
    id: "e-dify-ollama", from: "dify", to: "ollama", label: "모델 연결",
    description: "Dify의 공식 Ollama 제공자 플러그인으로 Ollama의 채팅·임베딩 모델을 연결할 수 있습니다. 접속 주소와 모델을 설정하며, 도구 호출이나 이미지 입력은 선택한 모델의 지원 범위에 따릅니다.",
    source: { title: "Dify 공식 Ollama 플러그인", url: "https://marketplace.dify.ai/plugin/langgenius/ollama" }, verifiedAt,
  },
  {
    id: "e-dify-mcp", from: "dify", to: "mcp", label: "도구 연결",
    description: "Dify에서 HTTP 전송을 사용하는 외부 MCP 서버를 도구로 등록해 앱과 에이전트에 연결할 수 있습니다. Dify 앱을 MCP 서버로 공개하는 별도 방향의 기능도 지원하며, 이 선은 외부 도구를 사용하는 관계를 나타냅니다.",
    source: { title: "Dify의 도구와 MCP 서버 구성", url: "https://docs.dify.ai/en/cloud/use-dify/workspace/tools" }, verifiedAt,
  },
  {
    id: "e-n8n-ollama", from: "n8n", to: "ollama", label: "모델 연결",
    description: "n8n의 Ollama Chat Model 노드를 워크플로의 모델 연결점에 추가할 수 있습니다. Ollama 서버의 모델을 사용하는 선택지이며, n8n 전체가 Ollama에 의존한다는 의미는 아닙니다.",
    source: { title: "n8n Ollama Chat Model 노드", url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatollama" }, verifiedAt,
  },
  {
    id: "e-n8n-mcp", from: "n8n", to: "mcp", label: "도구 연결",
    description: "n8n의 MCP Client Tool로 외부 서버의 도구를 AI 에이전트에 제공할 수 있습니다. 어떤 도구를 노출할지 선택하고 서버 인증을 구성하는 통합입니다.",
    source: { title: "n8n MCP Client Tool 노드", url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolmcp" }, verifiedAt,
  },
  {
    id: "e-ollama-gemma", from: "ollama", to: "gemma", label: "모델 실행",
    description: "Ollama에서 지원하는 Gemma 모델을 내려받아 명령줄이나 로컬 API로 실행할 수 있습니다. 모델 변형별 태그와 기능을 확인하며, 모든 Gemma 변형의 지원을 뜻하지는 않습니다.",
    source: { title: "Google의 Gemma·Ollama 실행 안내", url: "https://ai.google.dev/gemma/docs/integrations/ollama" }, verifiedAt,
  },
  {
    id: "e-vllm-gemma", from: "vllm", to: "gemma", label: "모델 서빙",
    description: "vLLM 공식 Gemma 4 가이드는 모델을 불러와 추론 API로 제공하는 방법을 설명합니다. 지원 모델과 하드웨어·실행 버전에 맞는 설정이 필요한 선택적 배포 경로입니다.",
    source: { title: "vLLM의 Gemma 4 실행 가이드", url: "https://docs.vllm.ai/projects/recipes/en/latest/Google/Gemma4.html" }, verifiedAt,
  },
];
