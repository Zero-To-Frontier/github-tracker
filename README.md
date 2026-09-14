# Git Signal · GitHub Tracker

로그인 없이 AI 프로젝트, 공식 릴리스, 관련 연구를 함께 탐색하는 공개형 AI 트렌드 포털의 로컬 MVP입니다. 홈에서 분야별 프로젝트를 발견하고 상세 페이지에서 성장 지표와 논문의 연결 근거를 확인합니다.

주 메뉴의 **AI 생태계**에서는 모델·제품·오픈소스가 어떤 역할을 하고 서로 어떻게 연결되는지 인터랙티브 지도로 탐색합니다.

기획은 [PRD.md](PRD.md), 초기 검토 기록은 [plan](plan)에 있습니다. PRD는 목표 범위이며 현재 구현 상태는 아래를 기준으로 확인하세요. 서비스는 아직 배포하지 않았습니다.

후속 방향은 [AI 생태계 단계별 탐색 계획](docs/ecosystem-drilldown-plan.md)에 정리했습니다. 대표 항목에서 세부 지도로 들어갈 때 상위 화면에는 없던 중요한 연관 프로젝트·구성 기술이 나타나는 경험을 목표로 합니다. 단계별 지도와 분야 탭은 아직 구현하지 않았습니다.

## 실행

Node.js **22.6 이상**과 npm이 필요합니다. 로컬 개발에는 Node.js 26, 수집 워크플로에는 Node.js 24를 사용합니다.

```sh
npm install
npm run dev
```

[http://127.0.0.1:3000](http://127.0.0.1:3000)에서 확인합니다. 저장된 공개 데이터가 포함되어 있어 웹 화면을 실행하는 데 API 키가 필요하지 않습니다.

| 명령 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 빌드 결과로 로컬 서버 실행 |
| `npm test` | 수집·집계·생태계 데이터 정합성 테스트 |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run collect` | 외부 공개 데이터를 수집해 JSON 갱신 |

`npm start` 전에는 `npm run build`를 실행하세요. 테스트와 수집 스크립트는 `node --import tsx`로 TypeScript를 실행합니다.

## 구현된 화면

- 홈: 1일·7일 지표 전환, 분야 필터, 프로젝트 목록, 공식 릴리스와 논문 카드.
- 프로젝트 상세: 소개, 저장소·웹사이트 링크, 스타·포크·순증가, 성장 차트, 릴리스와 관련 논문.
- 자료 연결: 프로젝트 연구와 기반 논문을 구분하고 선정 이유·관계 유형·근거 원문을 표시.
- 데이터 안내: 수집 출처, 관측 순증가와 GitHub 집계의 차이, 큐레이션 기준.
- AI 생태계(`/ecosystem`): 역할별 지도, 이름·역할 검색, 선택한 항목의 방향성 관계, 데스크톱 상세 패널과 모바일 상세 시트.
- 모바일 화면, 키보드 탐색, 프로젝트별 직접 URL과 메타데이터.

## AI 생태계 지도와 콘텐츠 편집

[AI 생태계 지도](http://127.0.0.1:3000/ecosystem)는 **2026-09-14** 공식 자료를 확인한 **12개 영역·52개 항목·79개 관계**를 제공합니다. 생성형 AI·에이전트를 중심으로 각 역할을 이해하는 데 필요한 대표 항목을 선정한 정적 편집 자료이며, 시장 규모·사용량·스타 순위나 AI 전체의 완전한 목록을 뜻하지 않습니다. 기존 추적 저장소 10개에 제한하지 않고 서비스와 공개 표준·공개 가중치 모델, GPU 기반 소프트웨어도 포함합니다. 전통적 머신러닝·로보틱스·미디어 제작 제품 전체는 이번 범위에 포함하지 않습니다.

역할별 큰 상자 안에 항목을 배치하고, 항목 선택 시 연결된 노드·화살표를 강조합니다. 상자는 역할 분류이고 화살표는 공식 근거가 있는 기술 관계입니다. 설정 가능한 연동도 포함하므로 화살표가 항상 필수 의존성을 뜻하지는 않습니다. 상세에서는 문제·역할·사용 상황·기능·라이선스·관계 설명과 공식 홈페이지·문서·공개 GitHub·출처·확인 날짜를 읽을 수 있습니다. Hermes와 OpenCode는 각각 `NousResearch/hermes-agent`, `anomalyco/opencode`를 기준으로 식별했습니다.

기존 8개 영역의 순서와 지도·상세 패널 구조를 유지하고 **공개 모델 계열, 학습·미세 조정, 평가·운영 관측, GPU·클라우드** 영역을 뒤에 추가했습니다. Gemma는 공개 모델 계열로 옮겨 Qwen·DeepSeek·Llama·Mistral AI와 함께 배치합니다. Cursor·GitHub Copilot, LangChain·Google ADK·A2A, PyTorch·Transformers·PEFT·Diffusers, Langfuse·LangSmith·Phoenix, CUDA·AWS·Microsoft·Google의 관리형 AI 플랫폼을 보강했습니다.

지도 항목의 둘째 줄에는 라이선스 대신 짧은 역할 설명을 표시하고, 분류 설명도 한국어로 제공합니다. 노드 이름과 상세 본문의 글자 크기·줄 간격을 확보하고, 선택하지 않은 항목도 읽을 수 있도록 글자 대비를 유지합니다. 공개 범위와 라이선스 원문은 상세 패널에서 확인합니다. Google의 관리형 플랫폼은 지도에 `Google Agent Platform`으로 줄여 표시하며, 상세에 정식 명칭 `Gemini Enterprise Agent Platform`과 이전 Vertex AI 명칭을 제공합니다.

| 파일 | 편집 대상 |
|---|---|
| [data/ecosystem-agents.ts](data/ecosystem-agents.ts) | 모델 제공자·코딩 에이전트·범용 에이전트·오케스트레이션 항목과 관계 |
| [data/ecosystem-foundations.ts](data/ecosystem-foundations.ts) | 도구 연결·메모리·데이터·실행 인프라 항목과 관계 |
| [data/ecosystem-expansion-agents.ts](data/ecosystem-expansion-agents.ts) | Gemma·Gemini CLI·Dify·n8n 추가 항목과 관계 |
| [data/ecosystem-expansion-foundations.ts](data/ecosystem-expansion-foundations.ts) | FastMCP·Graphiti·Chroma·SGLang 추가 항목과 관계 |
| [data/ecosystem-coverage-models.ts](data/ecosystem-coverage-models.ts) | Qwen·DeepSeek·Llama·Mistral AI 공개 모델 계열과 실행·모델 계보 관계 |
| [data/ecosystem-coverage-apps.ts](data/ecosystem-coverage-apps.ts) | Cursor·GitHub Copilot·LangChain·Google ADK·A2A 항목과 관계 |
| [data/ecosystem-coverage-lifecycle.ts](data/ecosystem-coverage-lifecycle.ts) | 학습·미세 조정 라이브러리와 평가·운영 관측 도구 및 관계 |
| [data/ecosystem-coverage-platforms.ts](data/ecosystem-coverage-platforms.ts) | CUDA·Amazon Bedrock·Microsoft Foundry·Google Agent Platform과 연산·모델 제공·배포 관계 |
| [lib/ecosystem-types.ts](lib/ecosystem-types.ts) | 항목·관계·분류의 데이터 계약 |
| [lib/ecosystem.ts](lib/ecosystem.ts) | 영역의 표시 순서·이름·색상, 데이터 통합과 양방향 관계 조회 |
| [components/ecosystem-map.tsx](components/ecosystem-map.tsx) | 지도와 상세 패널의 상호작용 |
| [tests/ecosystem.test.ts](tests/ecosystem.test.ts) | 데이터 정합성과 양방향 탐색 검증 |

항목을 추가할 때 고유 `id`와 주 역할 `category`, 지도에 표시할 18자 이하의 역할 설명 `mapLabel`을 지정하고 설명·사용 상황·특징·공개 범위·라이선스·공식 링크·`sources`·`verifiedAt`을 함께 작성합니다. 관계는 `from`·`to`의 실제 항목 ID, 의미가 있는 `label`, `description`, 공식 근거 `source`, 확인 날짜를 지정합니다. 같은 범주라는 이유만으로 관계를 만들지 않습니다. 공개 저장소가 SDK나 클라이언트만 제공한다면 서비스 전체의 소스나 라이선스로 표현하지 않습니다. 공개 가중치 모델은 `open-weight`, CUDA 같은 독점 소프트웨어는 `proprietary`로 구분하고 적용 범위가 명확한 `licenseUrl`을 지정합니다. 모델 계열의 라이선스와 통합 지원을 모든 세대·변형에 일괄 적용하지 않으며, 베타·실험적 기능은 관계 설명에서 구분합니다.

편집 후 `npm test`, `npm run typecheck`, `npm run build`로 확인합니다. 현재 테스트는 기존 수집·집계 13개와 생태계 검증 5개를 합쳐 **18개가 통과**했습니다. `npm run collect`는 생태계 편집 데이터를 변경하지 않으며, 수정 사항은 다음 웹 빌드에 반영됩니다. 트래킹·뉴스·논문과의 깊은 연계와 자동 관계 갱신은 후속 범위입니다.

## 현재 데이터와 지표

2026-09-14 최초 수집 결과는 **공개 저장소 10개, 공식 릴리스 10개**입니다. 별도로 공식 자료를 확인해 선정한 **논문 7개(프로젝트 연구 2개·기반 논문 5개)**를 제공합니다. 선정 논문을 최신 논문이나 인기 순위로 표시하지 않습니다.

각 프로젝트의 자체 일별 스냅샷은 현재 1개입니다. 따라서 **자체 관측 1일·7일 순증가는 아직 집계 중**이며, 없는 과거 값을 만들어 채우지 않습니다.

| 지표 | 의미 |
|---|---|
| 총스타 | 마지막 성공 수집 시점의 GitHub 스타 수 |
| 관측 순증가 | 최신 총스타와 1일·7일 전 실제 스냅샷의 차이. 스타 취소로 음수가 될 수 있음 |
| GitHub 스타 활동 | 공식 history API의 완료된 일별 집계. 자체 관측이 부족한 초기 홈에서 별도 이름으로 표시 |

GitHub 스타 활동은 **순증가나 과거 총스타가 아닙니다**. 자체 관측은 UTC 기준일을 사용하지만, GitHub 집계의 날짜 경계는 UTC와 다를 수 있습니다. 지표를 혼합하지 않고 수집 실패·관측 누락은 0과 구분합니다. [GitHub 스타 이력 문서](https://docs.github.com/en/rest/activity/starring#get-repository-star-history)

최초 arXiv 자동 수집은 HTTP 429로 실패했습니다. 현재 자동 수집 논문은 없으며, 검증한 선정 논문 7개를 계속 표시합니다. 최신 논문 수집은 현재 `cs.AI` 분야의 `agent` 검색 결과를 최대 6개 조회하는 초기 범위입니다.

## 데이터 갱신과 인증

```sh
npm run collect
```

수집기는 공개 저장소 메타데이터, 스타 이력, 최신 릴리스를 조회하고 arXiv 논문 수집을 시도합니다. 같은 UTC 날짜의 스냅샷과 같은 원문은 갱신하며, 부분 실패 시 정상 수집 결과와 기존 자료를 보존합니다. 일부 소스만 실패해도 저장 후 종료코드 `1`을 반환하므로 출력의 소스별 오류를 확인하세요.

GitHub 인증은 다음 순서로 사용합니다.

1. 수집 프로세스에 설정한 `GITHUB_TOKEN` 환경변수.
2. `GH_TOKEN` 환경변수.
3. 로컬에서 로그인된 GitHub CLI의 인증 정보(`gh auth token`; macOS Keychain 등). CI에서는 이 대체 경로를 사용하지 않습니다.

GitHub CLI를 사용한다면 먼저 `gh auth login`으로 로그인한 뒤 수집할 수 있습니다. 인증 없이도 공개 API 호출을 시도하지만 호출 제한이 더 낮습니다. 토큰은 수집 환경에서만 사용하며 화면·JSON·로그에 기록하지 않습니다.

**`npm run collect`는 `.env`나 `.env.local`을 자동으로 읽지 않습니다.** [.env.example](.env.example)은 변수 이름 참고용입니다. 토큰을 사용할 때는 셸 또는 실행 환경의 비밀값으로 주입하고 `NEXT_PUBLIC_` 접두사를 사용하지 마세요.

## 구조와 편집 위치

Next.js App Router와 React를 사용하며, 별도 DB 없이 JSON 파일을 서버에서 읽어 렌더링합니다. 화면 요청 중 외부 API를 호출하지 않고 수집 작업을 별도로 실행합니다. 정적 파일만 호스팅하는 방식이 아닌 Node.js 서버 실행 구조입니다.

| 파일 | 역할 |
|---|---|
| [data/catalog.json](data/catalog.json) | 추적 프로젝트·분야·한국어 소개·선정 논문·관계 근거 편집 |
| [data/collection.json](data/collection.json) | 수집된 메트릭·스냅샷·릴리스·논문·실행 결과. 수집기가 갱신 |
| [lib/types.ts](lib/types.ts) | 데이터 타입과 분야 정의 |
| [lib/data.ts](lib/data.ts) | 편집 자료와 수집 결과를 합쳐 화면에 제공 |
| [lib/metrics.ts](lib/metrics.ts) | 순증가·스타 활동·정렬 계산 |
| [scripts/collect.ts](scripts/collect.ts) | API 호출, 로컬 인증 조회, 수집 파일 저장 |
| [.github/workflows/collect.yml](.github/workflows/collect.yml) | 예약·수동 수집과 결과 커밋 |

추적 프로젝트를 추가할 때 `slug`와 저장소 경로를 지정하고, 프로젝트의 `paperIds`와 논문의 `projectSlugs`를 함께 맞춥니다. 자동 수집은 편집 원본인 `catalog.json`을 덮어쓰지 않습니다. 별도 관리자 화면과 게시 승인 기능은 아직 없습니다.

## 예약 수집과 배포 상태

수집 워크플로는 매일 UTC 00:17(한국 09:17) 실행과 수동 실행을 정의합니다. **기본 브랜치에 워크플로가 반영되고 GitHub Actions가 활성화되어 있어야** 실행됩니다. 예약 실행의 실제 성공 여부는 아직 검증하지 않았습니다.

워크플로는 `GITHUB_TOKEN`으로 수집하고 변경된 `data/collection.json`만 기본 브랜치에 커밋합니다. 저장소 정책에서 Actions의 쓰기 권한과 해당 push를 허용해야 합니다. 이 작업에는 웹 서비스 배포가 포함되지 않으며, 배포 환경에 갱신 JSON을 반영하는 방식도 별도로 정해야 합니다.

## 남은 작업

- 실제 7일 간격 스냅샷의 순증가 대조와 연속 예약 실행·복구 검증.
- arXiv 호출 제한 해소 후 최신 논문 수집 검증과 분야·기간 범위 확장.
- 자동 AI 요약, 공식 발표 소스 확대, 요약·관계 검수와 게시 관리.
- 공개 배포·운영 환경 구성과 성능 검증.
- 계정, 저장·읽음, 알림, 개인화는 후속 범위.

현재 프로젝트 소개와 선정 논문 설명은 원문을 확인해 작성한 한국어 편집 요약입니다. 릴리스 설명은 공식 본문 발췌이며, 자동 AI 요약은 적용하지 않았습니다.

## 참고 프로젝트와 라이선스

[agents-radar](https://github.com/duanyytop/agents-radar), [OSSInsight](https://github.com/pingcap/ossinsight), [Star History](https://github.com/star-history/star-history) 등의 구조와 데이터 수집 방식을 검토했습니다. **현재 구현에는 이 프로젝트들의 소스를 복사하지 않았으며**, 오픈소스 도입 후보의 상세 비교는 PRD에 있습니다.

주요 의존성은 Next.js·React·React DOM·fast-xml-parser·tsx(MIT), Lucide(ISC), TypeScript(Apache-2.0)입니다. 정확한 설치 버전은 `package-lock.json`, 라이선스 원문은 각 패키지의 고지를 확인하고 배포 시 유지하세요. 이 저장소 자체의 배포 라이선스는 아직 지정하지 않았습니다.

뉴스·논문은 원문 링크와 메타데이터 중심으로 제공합니다. 코드의 라이선스가 외부 콘텐츠의 이용 조건을 대신하지 않으며, arXiv 메타데이터와 논문 본문의 조건도 구분합니다. [arXiv API 이용 조건](https://info.arxiv.org/help/api/tou.html)
