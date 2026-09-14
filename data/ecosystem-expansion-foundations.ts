import type { EcosystemEdge, EcosystemNode } from "../lib/ecosystem-types";

const verifiedAt = "2026-09-14";

export const nodes: EcosystemNode[] = [
  {
    id: "fastmcp", name: "FastMCP", category: "tools", mark: "Fm",
    mapLabel: "MCP 도구 만들기",
    tagline: "Python 함수와 데이터를 MCP 도구로 만드는 프레임워크",
    description: "Prefect가 관리하는 MCP 서버·클라이언트 개발 프레임워크입니다. Python 함수에 도구 선언을 붙이면 입력 형식과 검증을 처리하고, 모델이 호출할 수 있는 MCP 도구로 노출합니다. 이 항목은 PrefectHQ/fastmcp의 독립 Python 프로젝트를 다룹니다. 초기 버전이 포함된 공식 MCP Python SDK와는 별도 배포 프로젝트입니다.",
    problem: "자체 API나 업무 로직을 에이전트에 연결할 때 통신 규약과 입력 검증을 매번 직접 구현해야 하는 부담을 줄입니다.",
    role: "MCP라는 연결 규약을 실제 서버와 클라이언트 코드로 구현하도록 돕는 개발 도구입니다.",
    useCases: ["사내 데이터 조회 함수를 에이전트가 부를 수 있는 도구로 제공", "로컬·원격 MCP 서버를 연결하는 Python 클라이언트 구현"],
    features: ["Python 함수에서 도구 스키마·입력 검증 생성", "도구·리소스·프롬프트를 제공하는 서버", "전송 방식·인증·연결 수명 주기를 처리하는 클라이언트"],
    openness: "open-source", license: "Apache-2.0 · Python 프레임워크 코드 기준",
    licenseUrl: "https://github.com/PrefectHQ/fastmcp/blob/main/LICENSE",
    website: "https://gofastmcp.com/", docs: "https://gofastmcp.com/getting-started/welcome",
    github: "https://github.com/PrefectHQ/fastmcp",
    sources: [
      { title: "FastMCP 공식 개요", url: "https://gofastmcp.com/getting-started/welcome" },
      { title: "PrefectHQ/fastmcp 공식 저장소", url: "https://github.com/PrefectHQ/fastmcp" },
    ], verifiedAt,
  },
  {
    id: "graphiti", name: "Graphiti", category: "memory", mark: "Gt",
    mapLabel: "시간을 기억하는 그래프",
    tagline: "사실과 관계의 변화를 시간과 함께 기록하는 기억 프레임워크",
    description: "대화·문서·업무 데이터에서 개체와 관계를 추출해 시간 정보를 가진 지식 그래프로 구성합니다. 새로운 사실이 들어오면 전체를 다시 만들지 않고 그래프를 갱신하며, 과거와 현재의 맥락을 검색합니다. Zep 서비스의 기반이 되는 별도 오픈소스 프레임워크로, 직접 운영할 때는 그래프 저장소와 모델 연결을 구성합니다.",
    problem: "대화 기록을 쌓기만 해서는 사람·사건의 관계나 시간이 지나 바뀐 사실을 정확하게 꺼내기 어렵습니다.",
    role: "에이전트가 사용할 기억을 개체·관계·시간으로 구조화하고 검색하는 계층입니다.",
    useCases: ["고객의 상황 변화와 이전 대화를 기억하는 상담 에이전트", "인물·조직·업무 사건의 관계와 과거 상태를 조회하는 도우미"],
    features: ["사실의 유효 시점과 출처를 보존하는 그래프", "의미·키워드·그래프 탐색을 결합한 검색", "전체 재계산 없이 새 대화와 데이터를 반영하는 증분 갱신"],
    openness: "open-source", license: "Apache-2.0 · Graphiti 프레임워크 코드 기준",
    licenseUrl: "https://github.com/getzep/graphiti/blob/main/LICENSE",
    website: "https://www.getzep.com/platform/graphiti/", docs: "https://help.getzep.com/graphiti/getting-started/welcome",
    github: "https://github.com/getzep/graphiti",
    sources: [
      { title: "Graphiti 공식 개요", url: "https://help.getzep.com/graphiti/getting-started/welcome" },
      { title: "getzep/graphiti 공식 저장소", url: "https://github.com/getzep/graphiti" },
      { title: "Graphiti와 Zep의 역할", url: "https://www.getzep.com/platform/graphiti/" },
    ], verifiedAt,
  },
  {
    id: "chroma", name: "Chroma", category: "data", mark: "Ch",
    mapLabel: "문서·벡터 검색",
    tagline: "문서와 임베딩을 저장해 필요한 맥락을 찾아주는 검색 데이터베이스",
    description: "문서·메타데이터·임베딩을 저장하고 질문과 관련된 자료를 찾는 검색 인프라입니다. 로컬 프로그램이나 직접 운영하는 서버에서 시작할 수 있고, 별도 관리형 Chroma Cloud도 제공합니다. 이 지도의 오픈소스 표시는 공개 데이터베이스 코드에 해당하며 관리형 서비스 이용 조건과는 구분합니다.",
    problem: "모델이 학습하지 않은 사내 문서나 사용자 자료에서 답변에 필요한 근거를 찾아야 할 때 사용합니다.",
    role: "RAG와 에이전트가 참고할 자료를 저장하고 검색하는 데이터 계층입니다. 답변 생성과 에이전트 판단은 연결된 모델·애플리케이션이 맡습니다.",
    useCases: ["문서 검색 결과를 근거로 답하는 RAG 애플리케이션", "에이전트가 쌓은 기억을 유사도와 사용자 조건으로 조회"],
    features: ["문서·메타데이터·임베딩을 묶는 컬렉션", "벡터 유사도 검색과 메타데이터 필터", "임베딩 모델과 LlamaIndex·Mem0 등의 연결"],
    openness: "open-source", license: "Apache-2.0 · 데이터베이스 코드 기준, Cloud 별도",
    licenseUrl: "https://github.com/chroma-core/chroma/blob/main/LICENSE",
    website: "https://www.trychroma.com/", docs: "https://docs.trychroma.com/docs/overview/introduction",
    github: "https://github.com/chroma-core/chroma",
    sources: [
      { title: "Chroma 공식 개요", url: "https://docs.trychroma.com/docs/overview/introduction" },
      { title: "chroma-core/chroma 공식 저장소", url: "https://github.com/chroma-core/chroma" },
      { title: "Chroma 공식 연동 목록", url: "https://docs.trychroma.com/integrations/chroma-integrations" },
    ], verifiedAt,
  },
  {
    id: "sglang", name: "SGLang", category: "infrastructure", mark: "SG",
    mapLabel: "모델 추론 서버",
    tagline: "언어·멀티모달 모델을 효율적으로 실행하는 추론 프레임워크",
    description: "모델 가중치를 불러와 생성 요청에 응답하는 추론 서버와 실행 엔진입니다. 공통 입력의 계산 결과를 재사용하는 캐시와 여러 GPU의 병렬 실행으로 응답 지연과 처리량을 다룹니다. 직접 모델 서비스를 운영하는 데 쓰이며, 사용할 수 있는 모델·기능은 하드웨어와 지원 목록에 따라 달라집니다.",
    problem: "공개 모델을 여러 사용자의 요청에 맞춰 실행하면서 계산 자원과 응답 속도를 관리해야 할 때 활용합니다.",
    role: "모델 파일과 애플리케이션 사이에서 실제 추론을 수행하고 API로 제공하는 실행 계층입니다.",
    useCases: ["지원하는 공개 모델을 자체 GPU 서버의 API로 제공", "많은 문서나 프롬프트를 묶어 처리하는 배치 추론"],
    features: ["RadixAttention과 입력 접두부 캐시", "여러 GPU와 분산 환경에서의 추론", "OpenAI 호환 API와 서버 없는 배치 실행"],
    openness: "open-source", license: "Apache-2.0 · 추론 코드 기준, 모델별 라이선스 별도",
    licenseUrl: "https://github.com/sgl-project/sglang/blob/main/LICENSE",
    website: "https://www.sglang.io/", docs: "https://docs.sglang.io/",
    github: "https://github.com/sgl-project/sglang",
    sources: [
      { title: "SGLang 공식 개요", url: "https://docs.sglang.io/" },
      { title: "SGLang 서버·배치 실행 안내", url: "https://docs.sglang.io/docs/get-started/quickstart" },
      { title: "sgl-project/sglang 공식 저장소", url: "https://github.com/sgl-project/sglang" },
    ], verifiedAt,
  },
];

export const edges: EcosystemEdge[] = [
  {
    id: "xf-fastmcp-mcp", from: "fastmcp", to: "mcp", label: "규약 구현",
    description: "FastMCP는 Python 함수·데이터를 MCP 도구와 리소스로 노출하고 MCP 클라이언트도 구현합니다. MCP는 연결 규약이고 FastMCP는 그 규약을 사용하는 개발 프레임워크입니다.",
    source: { title: "FastMCP 공식 개요", url: "https://gofastmcp.com/getting-started/welcome" }, verifiedAt,
  },
  {
    id: "xf-graphiti-mcp", from: "graphiti", to: "mcp", label: "기억 제공",
    description: "Graphiti의 MCP 서버는 대화 추가와 사실·개체 검색 기능을 MCP 도구로 제공합니다. 공식 문서에서 실험적 구현으로 안내하며 별도의 서버 설정이 필요합니다.",
    source: { title: "Graphiti MCP 서버", url: "https://help.getzep.com/graphiti/getting-started/mcp-server" }, verifiedAt,
  },
  {
    id: "xf-zep-graphiti", from: "zep", to: "graphiti", label: "기반 활용",
    description: "Zep은 Graphiti를 맥락 그래프의 기반 프레임워크로 사용한다고 설명합니다. 자체 운영하는 Graphiti와 관리형 Zep 서비스는 제공 범위가 서로 다릅니다.",
    source: { title: "Graphiti와 Zep의 역할", url: "https://www.getzep.com/platform/graphiti/" }, verifiedAt,
  },
  {
    id: "xf-graphiti-openai", from: "graphiti", to: "openai", label: "모델 사용",
    description: "Graphiti의 기본 설정은 개체·관계 추출에 사용할 언어 모델과 임베딩을 OpenAI에 연결합니다. 다른 제공자를 선택할 수도 있으며 그래프 저장소는 별도로 구성합니다.",
    source: { title: "Graphiti 모델 설정과 시작 안내", url: "https://github.com/getzep/graphiti#quick-start" }, verifiedAt,
  },
  {
    id: "xf-llamaindex-chroma", from: "llamaindex", to: "chroma", label: "벡터 검색",
    description: "LlamaIndex의 ChromaVectorStore 연동으로 문서 임베딩을 Chroma에 저장하고 검색할 수 있습니다. 공식 예제는 문서 분할부터 컬렉션 생성과 질의까지의 연결을 보여줍니다.",
    source: { title: "LlamaIndex의 Chroma 연동", url: "https://developers.llamaindex.ai/python/framework/integrations/vector_stores/chromaindexdemo/" }, verifiedAt,
  },
  {
    id: "xf-chroma-ollama", from: "chroma", to: "ollama", label: "임베딩 생성",
    description: "Chroma의 OllamaEmbeddingFunction은 실행 중인 Ollama 서버에 문서·질의의 임베딩 생성을 요청합니다. 텍스트 답변 생성이 아닌 검색용 벡터 생성 관계입니다.",
    source: { title: "Chroma의 Ollama 임베딩 연동", url: "https://docs.trychroma.com/integrations/embedding-models/ollama" }, verifiedAt,
  },
  {
    id: "xf-mem0-chroma", from: "mem0", to: "chroma", label: "기억 저장",
    description: "Mem0의 오픈소스 설정에서 Chroma를 벡터 저장소로 선택해 기억을 저장하고 검색할 수 있습니다. Python과 Node SDK의 연결 방식은 해당 공식 설정을 따릅니다.",
    source: { title: "Mem0의 Chroma 저장소 설정", url: "https://docs.mem0.ai/components/vectordbs/dbs/chroma" }, verifiedAt,
  },
  {
    id: "xf-sglang-huggingface", from: "sglang", to: "huggingface", label: "모델 로드",
    description: "SGLang의 공식 시작 예제는 Hugging Face 모델 ID로 가중치를 불러오고 토크나이저의 채팅 템플릿을 사용합니다. 모든 Hub 모델이 실행되는 것은 아니며 지원 모델·하드웨어·접근 권한을 확인해야 합니다.",
    source: { title: "SGLang 모델 서버 시작 안내", url: "https://docs.sglang.io/docs/get-started/quickstart" }, verifiedAt,
  },
];
