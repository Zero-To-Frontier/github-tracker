import type { EcosystemEdge, EcosystemNode } from "../lib/ecosystem-types";

const verifiedAt = "2026-09-14";

export const nodes: EcosystemNode[] = [
  {
    id: "cuda", name: "NVIDIA CUDA", category: "deployment", mark: "Cu",
    mapLabel: "NVIDIA GPU 병렬 연산",
    tagline: "NVIDIA GPU에서 학습과 추론 계산을 실행하는 기반",
    description: "NVIDIA의 GPU 병렬 계산 플랫폼과 프로그래밍 모델입니다. 개발자는 커널을 직접 작성하거나 PyTorch 같은 프레임워크를 통해 GPU 연산을 사용합니다. CUDA Toolkit은 컴파일러·런타임·개발 도구를 제공하며, 실제 실행에는 호환되는 GPU와 드라이버가 필요합니다. 특정 모델이나 에이전트 제품이 아니라 그 아래의 계산 기반을 나타냅니다.",
    problem: "신경망의 대규모 행렬 연산을 GPU에서 병렬 처리하고 장치 메모리와 실행 흐름을 관리해야 할 때 사용합니다.",
    role: "학습 프레임워크와 추론 엔진이 NVIDIA GPU를 활용하도록 연결하는 연산 계층입니다. 다른 하드웨어를 위한 실행 경로도 있으므로 모든 AI 소프트웨어의 필수 의존성은 아닙니다.",
    useCases: ["PyTorch 모델의 학습·추론을 NVIDIA GPU에서 실행", "특정 연산에 맞춘 GPU 커널 작성과 성능 분석"],
    features: ["GPU 병렬 프로그래밍과 메모리 관리", "컴파일러·런타임·개발 도구", "스트림·그래프를 이용한 연산 실행 제어"],
    openness: "proprietary", license: "CUDA Toolkit은 NVIDIA SDK 라이선스·CUDA 부속 약관 적용 · 일부 구성 요소는 별도 라이선스",
    licenseUrl: "https://docs.nvidia.com/cuda/eula/index.html",
    website: "https://developer.nvidia.com/cuda-toolkit", docs: "https://docs.nvidia.com/cuda/cuda-programming-guide/index.html",
    sources: [
      { title: "NVIDIA CUDA 공식 프로그래밍 안내", url: "https://docs.nvidia.com/cuda/cuda-programming-guide/index.html" },
      { title: "CUDA Toolkit 라이선스와 구성 요소 조건", url: "https://docs.nvidia.com/cuda/eula/index.html" },
      { title: "PyTorch의 CUDA 실행 방식", url: "https://docs.pytorch.org/docs/stable/notes/cuda.html" },
    ], verifiedAt,
  },
  {
    id: "bedrock", name: "Amazon Bedrock", category: "deployment", mark: "AWS",
    mapLabel: "AWS 관리형 모델 서비스",
    tagline: "여러 제공자의 생성형 모델을 AWS에서 이용하는 관리형 플랫폼",
    description: "Amazon과 외부 제공자의 기반 모델을 AWS API로 이용하는 서비스입니다. 모델 실행용 서버를 직접 구성하는 부담을 줄이고, 기존 AWS 권한과 운영 환경 안에서 생성형 AI 앱을 구축하도록 돕습니다. 모델별로 지원 API·리전·접근 조건이 다르며, 관리형 서비스와 공개 모델 가중치의 이용 조건은 별개입니다.",
    problem: "모델 선택과 호출을 기업의 클라우드 권한·배포·운영 체계에 연결하면서 직접 추론 서버를 관리하는 부담을 줄입니다.",
    role: "모델 제공자와 애플리케이션 사이에서 모델 접근과 실행을 관리하는 클라우드 계층입니다.",
    useCases: ["AWS 애플리케이션에서 Claude 등 지원 모델 호출", "업무 데이터와 모델을 연결한 생성형 AI 기능 운영"],
    features: ["여러 기반 모델의 관리형 API", "모델·리전별 호출 방식과 접근 관리", "지원 모델의 조정·평가와 생성형 AI 구성 기능"],
    openness: "service", license: "상용 관리형 서비스 · AWS 서비스 약관 및 모델별 이용 조건 적용",
    licenseUrl: "https://aws.amazon.com/service-terms/",
    website: "https://aws.amazon.com/bedrock/", docs: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
    sources: [
      { title: "Amazon Bedrock 공식 개요", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html" },
      { title: "모델별 가용성과 API 호환성", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models.html" },
      { title: "AWS 서비스 약관", url: "https://aws.amazon.com/service-terms/" },
    ], verifiedAt,
  },
  {
    id: "foundry", name: "Microsoft Foundry", category: "deployment", mark: "Ms",
    mapLabel: "Azure 모델·에이전트 운영",
    tagline: "Azure에서 모델과 에이전트를 구축·배포·관리하는 플랫폼",
    description: "이전 Azure AI Foundry에서 이어지는 Microsoft의 AI 앱·에이전트 플랫폼입니다. 모델 선택과 배포, 에이전트 실행, 추적·평가를 Azure 리소스와 권한 체계 안에서 구성합니다. Azure OpenAI 모델은 이 플랫폼의 모델 제공 방식 중 하나이며, Foundry 자체가 한 종류의 언어 모델을 뜻하지는 않습니다.",
    problem: "모델과 도구, 에이전트의 실행·품질 관리를 기업의 접근 권한과 네트워크 정책 안에서 함께 운영하도록 돕습니다.",
    role: "모델·에이전트 개발과 운영을 묶는 관리형 클라우드 계층입니다. 공개 SDK의 라이선스가 호스팅 서비스 전체에 적용되지는 않습니다.",
    useCases: ["Azure OpenAI 모델을 사내 애플리케이션에 배포", "업무 에이전트의 실행 기록과 평가를 조직 권한 체계에서 관리"],
    features: ["모델 카탈로그와 배포", "에이전트 개발·실행 서비스", "추적·평가 및 Azure 접근 권한 관리"],
    openness: "service", license: "상용 관리형 서비스 · Microsoft Azure 계약·제품 약관 및 모델별 조건 적용",
    licenseUrl: "https://azure.microsoft.com/en-us/support/legal/",
    website: "https://ai.azure.com/", docs: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry",
    sources: [
      { title: "Microsoft Foundry 공식 개요와 명칭", url: "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry" },
      { title: "Foundry의 Azure OpenAI 모델 제공", url: "https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure?pivots=azure-openai" },
      { title: "Microsoft Azure 이용 계약 안내", url: "https://azure.microsoft.com/en-us/support/legal/" },
    ], verifiedAt,
  },
  {
    id: "google-agent-platform", name: "Google Agent Platform", category: "deployment", mark: "GC",
    mapLabel: "Google Cloud AI 운영",
    tagline: "모델과 에이전트를 개발·배포하는 Gemini Enterprise Agent Platform",
    description: "정식 명칭은 Gemini Enterprise Agent Platform이며, 이전 Vertex AI의 기능을 이어받은 Google Cloud 플랫폼입니다. Google 모델과 파트너·공개 모델을 선택하고, 에이전트를 개발·배포하며 실행과 품질을 관리합니다. 지도에는 읽기 쉽게 Google Agent Platform으로 표시했습니다. Gemini 모델 API 자체나 최종 사용자를 위한 Gemini 앱과는 역할이 다릅니다.",
    problem: "모델 실험부터 에이전트 배포·접근 제어·운영 관측까지 이어지는 개발 과정을 클라우드에서 관리하도록 돕습니다.",
    role: "모델과 에이전트를 실제 서비스로 제공하는 Google Cloud의 개발·운영 계층입니다. 모델 제공과 직접 배포는 선택한 모델의 지원 방식에 따릅니다.",
    useCases: ["Gemini를 이용하는 업무 애플리케이션을 클라우드에서 운영", "ADK로 개발한 에이전트를 관리형 실행 환경에 배포"],
    features: ["Model Garden의 모델 선택과 배포", "ADK 등으로 만든 에이전트의 관리형 실행", "평가·관측·접근 제어를 포함한 운영 기능"],
    openness: "service", license: "상용 관리형 서비스 · Google Cloud 약관 및 모델별 이용 조건 적용",
    licenseUrl: "https://cloud.google.com/terms",
    website: "https://cloud.google.com/products/gemini-enterprise-agent-platform", docs: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview",
    sources: [
      { title: "Gemini Enterprise Agent Platform 공식 개요", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview" },
      { title: "Vertex AI에서 변경된 제품 명칭", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes" },
      { title: "모델 선택과 제공 방식", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models" },
      { title: "에이전트 개발·실행 경로", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents" },
    ], verifiedAt,
  },
];

export const edges: EcosystemEdge[] = [
  {
    id: "cp-pytorch-cuda", from: "pytorch", to: "cuda", label: "GPU 연산",
    description: "PyTorch는 CUDA 장치의 텐서와 연산을 지원합니다. CUDA를 지원하는 빌드와 호환 GPU·드라이버를 사용하는 실행 경로이며, CPU 등 다른 실행 경로도 있습니다.",
    source: { title: "PyTorch CUDA semantics", url: "https://docs.pytorch.org/docs/stable/notes/cuda.html" }, verifiedAt,
  },
  {
    id: "cp-bedrock-anthropic", from: "bedrock", to: "anthropic", label: "모델 제공",
    description: "Amazon Bedrock에서 지원하는 Anthropic Claude 모델을 관리형 API로 이용할 수 있습니다. Anthropic의 직접 API에 대한 의존 관계가 아니라 AWS를 통한 모델 제공 경로입니다. 모델·API·리전별 지원을 확인해야 합니다.",
    source: { title: "Bedrock 공식 Claude 호출 예제", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html" }, verifiedAt,
  },
  {
    id: "cp-foundry-openai", from: "foundry", to: "openai", label: "모델 제공",
    description: "Microsoft Foundry의 Azure OpenAI에서 지원 OpenAI 모델을 배포하고 호출할 수 있습니다. OpenAI 직접 API와는 별도의 Azure 배포·인증·가용성 조건을 사용합니다.",
    source: { title: "Azure OpenAI in Foundry Models", url: "https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure?pivots=azure-openai" }, verifiedAt,
  },
  {
    id: "cp-google-platform-gemini", from: "google-agent-platform", to: "gemini", label: "모델 제공",
    description: "Google Cloud의 Agent Platform은 Gemini 모델을 관리형 서비스로 제공합니다. Google AI의 직접 API 이용과는 구분되는 클라우드 모델 접근 경로입니다.",
    source: { title: "Agent Platform의 Google 모델", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models" }, verifiedAt,
  },
  {
    id: "cp-adk-google-platform", from: "google-adk", to: "google-agent-platform", label: "관리형 배포",
    description: "Agent Platform은 ADK로 개발하는 에이전트와 관리형 실행 경로를 제공합니다. ADK의 배포 선택지 중 하나이며 ADK를 사용하려면 반드시 이 클라우드를 이용해야 한다는 뜻은 아닙니다.",
    source: { title: "Agent Platform 에이전트 개발과 실행", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents" }, verifiedAt,
  },
];
