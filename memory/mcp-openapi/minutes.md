# mcp-openapi MCP 서버 브레인스토밍 회의록

**일시**: 2026-02-06
**참여**: 전문가 AI 패널 8명
**라운드**: 5단계 8라운드 (발산 2R + 수렴 2R + DX&스펙 2R + 기술 1R + 검증 1R)
**아이디어**: OpenAPI/Swagger 스펙 파일을 읽고 AI 에이전트가 API를 탐색, 테스트, 목 데이터 생성, 클라이언트 코드 스니펫 생성까지 할 수 있게 하는 MCP 서버

---

## 라운드 1 — 1단계: 아이디어 발산

### 🎙️ 사회자
좋습니다, 오늘 평가할 아이디어는 `mcp-openapi`입니다. OpenAPI/Swagger 스펙 파일을 AI 에이전트가 직접 읽고, API endpoint를 탐색하고, 테스트 호출까지 할 수 있게 하는 MCP 서버죠. 개발자가 새 API를 통합할 때마다 반복하는 스펙 읽기 → 이해 → 테스트 사이클을 자동화하겠다는 건데요. 1단계에서는 각자 전문 영역에서 이 아이디어의 강점, 약점, 기회, 위협을 자유롭게 던져주세요. MCP생태계분석가부터 시작합시다.

### 🔍 MCP생태계분석가
기존 MCP 생태계에서 OpenAPI 관련 서버를 조사해봤습니다.

| 서버명 | GitHub Stars | 핵심 기능 | 약점 |
|--------|-------------|-----------|------|
| mcp-openapi (janwilmake) | ~45 stars | OpenAPI 스펙 파싱, endpoint 목록 | 테스트 호출 불가, 코드 생성 없음 |
| openapi-mcp-server | ~30 stars | 스펙 로드 + 기본 탐색 | 목 데이터 없음, 유지보수 중단 의심 |
| mcp-api-tester | ~15 stars | HTTP 호출 범용 | OpenAPI 특화 아님, 스펙 파싱 없음 |

현재 생태계의 빈 자리가 명확합니다. OpenAPI 스펙을 "읽기만" 하는 MCP는 있지만, **스펙 파싱 + 대화형 탐색 + 실제 테스트 호출 + 목 데이터 + 코드 스니펫 생성**을 통합한 MCP는 없습니다. 가장 가까운 경쟁자가 45 stars 수준이라 100 stars 이하 — No-Go 기준에 걸리지 않습니다.
- npm 주간 다운로드: 기존 OpenAPI MCP들은 대부분 100회 미만
- 생태계 빈 자리: "OpenAPI 스펙 → 즉시 사용 가능한 API 통합" 원스톱 도구

### 💡 기발한놈
잠깐, 다들 "OpenAPI 스펙을 읽어서 endpoint 보여주기"에 집중하고 있는데, 이걸 완전히 뒤집어보면 어떨까?

**아이디어: "API를 대화로 탐색하는 인터랙티브 플레이그라운드"**
- 기존 접근: 스펙 파일 → 파싱 → 정적 목록 표시
- 뒤집기 제안: AI 에이전트한테 "이 API에서 사용자 생성하려면 어떻게 해?" 라고 물어보면, 스펙에서 관련 endpoint를 찾아 파라미터 설명하고, 예제 요청까지 만들어주는 **대화형 API 탐색기**
- 이렇게 되면 Swagger UI를 대체하는 게 아니라, AI 네이티브한 API 문서 경험을 제공하는 것. 블루오션 가능성이 있다.

추가로, 단순히 "내 API 탐색"뿐 아니라, **공개 API 스펙 URL을 던지면 즉석에서 분석**해주는 기능은 어때? GitHub API, Stripe API 등 유명 API의 OpenAPI 스펙을 URL로 지정하면 바로 탐색 가능.

### 🛠️ 빌더
MCP SDK 관점에서 이 아이디어는 구현 가능성이 높습니다. 핵심 아키텍처를 잡아보면:

```typescript
// 핵심 tool 후보
server.tool("load_spec", "OpenAPI 스펙 파일 로드", {
  source: z.string().describe("파일 경로 또는 URL")
}, async ({ source }) => { /* YAML/JSON 파싱 */ });

server.tool("list_endpoints", "엔드포인트 목록 조회", {
  tag: z.string().optional().describe("태그 필터"),
  method: z.enum(["GET","POST","PUT","DELETE","PATCH"]).optional()
}, async ({ tag, method }) => { /* 필터링된 목록 반환 */ });

server.tool("get_endpoint_detail", "엔드포인트 상세 정보", {
  path: z.string(), method: z.string()
}, async ({ path, method }) => { /* 파라미터, 요청/응답 스키마 반환 */ });
```

프로토콜 제약 사항은 크게 없습니다. OpenAPI 스펙은 정적 파일이라 외부 API 호출 의존성이 낮고, 파싱 라이브러리(`swagger-parser`)가 성숙합니다. 다만 **실제 HTTP 호출(test_call)** 기능은 보안 이슈를 고려해야 합니다 — 사용자 의도 없이 write endpoint를 호출하면 문제가 될 수 있으니까요.

구현 복잡도: 중간. `swagger-parser`로 스펙 파싱은 쉽고, 목 데이터 생성은 `json-schema-faker`로 가능합니다. 코드 스니펫 생성은 템플릿 기반으로 충분합니다.

### 👤 개발자대변인
실제 개발자 입장에서 솔직히 말하겠습니다. **이 아이디어는 실사용 빈도가 높습니다.**

새 API 통합할 때마다 하는 작업:
1. OpenAPI 스펙 문서 열기 (Swagger UI 또는 JSON/YAML 직접 읽기)
2. 필요한 endpoint 찾기
3. 파라미터 확인, 인증 방식 파악
4. cURL이나 Postman으로 테스트 호출
5. 동작 확인 후 클라이언트 코드 작성

이 5단계를 AI 에이전트한테 "Stripe API에서 결제 생성 endpoint 알려줘" 한마디로 끝낼 수 있다면? **매주 최소 2-3번은 쓸 것 같습니다.** 특히 마이크로서비스 환경에서 내부 API가 10개 이상이면 더더욱.

다만 걱정되는 건:
- **설치가 간단해야 합니다.** `npx mcp-openapi --spec ./api.yaml` 한 줄이면 좋겠는데, config 파일을 별도로 만들어야 한다면 불편해짐
- 인증이 필요한 API 테스트는 어떻게? Bearer 토큰 설정이 귀찮으면 test_call 기능은 안 쓸 수 있음

### 🔨 채찍맨
스코프를 보자. 현재 아이디어에 들어있는 기능:
1. 스펙 로드/파싱
2. endpoint 탐색 (목록 + 상세)
3. 테스트 호출
4. 목 데이터 생성
5. 클라이언트 코드 스니펫 생성

5개 기능 전부 MVP에 넣으면 1주일에 절대 못 끝낸다. 지금 당장 잘라야 할 것:
- ❌ 클라이언트 코드 스니펫 생성 — AI 에이전트가 이미 코드 생성 잘 함. 스펙 정보만 주면 에이전트가 알아서 코드 짬. 중복 기능.
- ❌ 테스트 호출 (실제 HTTP) — 보안 이슈 + 인증 처리 복잡도. v1.1로 미룸.

MVP에 남길 것: **스펙 로드 + endpoint 탐색 + 목 데이터 생성**. 이 3개면 tool 3-4개로 1주 안에 가능.

### 😈 비관론자
잠깐, 너무 긍정적인 분위기인데 현실 체크하겠습니다.

**핵심 의문: "AI 에이전트가 OpenAPI 스펙을 직접 읽으면 되는 거 아닌가?"**

Claude나 GPT한테 `openapi.yaml` 파일을 그냥 던져주면 이미 endpoint 설명, 파라미터, 예제 응답 다 알려줍니다. 그런데 왜 별도의 MCP 서버가 필요하죠?

반론 예상: "큰 스펙 파일은 컨텍스트 윈도우에 안 들어간다." — 맞는 말이긴 합니다. Kubernetes API 스펙은 10만 줄 넘으니까. 그래서 구조화된 탐색이 필요하다는 논리는 이해합니다.

하지만 No-Go 체크리스트를 한번 보죠:

| 지표 | 값 | 기준 | 판정 |
|------|-----|------|------|
| 기존 대안 | 최대 45 stars | < 100 stars | ✅ Pass |
| 개발자 필요성 | 주 2-3회 | > 주 1회 | ✅ Pass |
| MVP 개발 | 5-7일 (스코프 축소 시) | < 2주 | ✅ Pass |
| 차별점 | 목 데이터 + 구조화 탐색 | > 0개 | ⚠️ 약함 |
| 바이럴 잠재력 | 데모 GIF 가능 | 임팩트 있음 | ⚠️ 보통 |
| 유지보수 부담 | swagger-parser 1개 | < 3개 | ✅ Pass |

**현재 판정: 조건부 Go.** 하지만 차별점이 약합니다. "스펙 파싱 + 목 데이터"만으로는 "cool!" 반응을 끌어내기 어려움. 차별화 포인트를 더 만들지 않으면 GitHub 50 stars도 힘들 수 있습니다.

### 📢 바이럴전략가
비관론자의 "차별점 약함" 지적에 동의합니다. 확산 전략 관점에서 분석하면:

**타겟 개발자가 모이는 곳:**
- r/ClaudeAI, r/ChatGPTCoding — AI 코딩 도구에 관심 있는 개발자
- r/webdev, r/node — API 통합을 자주 하는 웹 개발자
- HN — "AI가 API 문서를 대체한다" 앵글이 먹힐 수 있음
- X(Twitter) #MCP — MCP 생태계 얼리어답터

**패키지명 후보:**
1. `mcp-openapi` — 직관적, 검색성 최고
2. `mcp-swagger` — Swagger라는 레거시 이름이 여전히 검색량 높음
3. `mcp-api-explorer` — 기능 설명적이지만 OpenAPI 특화가 약해 보임
4. `mcp-apispec` — 짧고 깔끔

추천: **`mcp-openapi`** — 이미 npm에서 가장 명확한 포지션.

**바이럴 앵글:** "Swagger UI는 이제 필요 없다 — AI 에이전트가 직접 API를 탐색한다"
이 앵글로 Show HN 포스트를 쓰면 논쟁을 유발하고 클릭을 끌 수 있습니다. 하지만 비관론자 말처럼 데모가 "cool!" 반응을 끌어야 합니다. 단순 목록 출력이 아니라 **"URL 하나 주면 AI가 알아서 API 분석해주는" 데모 GIF**가 필요합니다.

## 라운드 2 — 1단계: 아이디어 발산 (심화)

### 🎙️ 사회자
라운드 1에서 핵심 쟁점 두 가지가 나왔습니다. 첫째, 비관론자의 "AI가 스펙을 직접 읽으면 되는데 왜 MCP가 필요한가?" 질문. 둘째, 차별점 강화 필요성. 이번 라운드에서는 이 두 가지에 집중해서 토론합시다.

### 🔍 MCP생태계분석가
비관론자의 질문에 대해 생태계 데이터로 답하겠습니다. MCP 서버가 "AI가 이미 할 수 있는 일"을 구조화해서 성공한 사례가 있습니다. `mcp-filesystem`이 대표적인데요 — AI가 파일을 읽고 쓸 수 있지만, 구조화된 tool로 제공하면 정확도와 안정성이 올라가서 GitHub 500+ stars를 달성했습니다.

OpenAPI도 마찬가지입니다. 10만 줄짜리 Kubernetes API 스펙을 AI 컨텍스트에 넣는 건 비현실적이고, 특정 endpoint만 골라서 구조화된 JSON으로 반환하면 AI가 훨씬 정확하게 활용할 수 있습니다. **구조화된 접근 = MCP의 핵심 가치**입니다.

### 💡 기발한놈
비관론자 지적에 대한 킬러 답변을 찾았습니다. 차별점을 만들 아이디어:

**"API Diff" 기능** — 두 버전의 OpenAPI 스펙을 비교해서 변경사항을 알려주는 tool. API 버전 업그레이드할 때 "v1 → v2에서 뭐가 바뀌었어?"를 AI한테 물어보면 깨진 endpoint, 새 파라미터, deprecated된 것들을 한눈에 보여주는 거죠.

이건 기존 OpenAPI MCP 서버 어디에도 없는 기능이고, 마이크로서비스 환경에서 **매주 겪는 페인포인트**입니다. 데모에서도 시각적 임팩트가 크고요.

### 🛠️ 빌더
기발한놈의 API Diff 아이디어, 기술적으로 가능합니다. `swagger-parser`가 두 스펙을 파싱한 뒤 deep-diff 비교를 하면 됩니다. tool 하나 추가하는 수준이라 MVP 스코프 부담도 크지 않습니다.

```typescript
server.tool("diff_specs", "두 OpenAPI 스펙 비교", {
  base: z.string().describe("기준 스펙 경로/URL"),
  target: z.string().describe("비교 대상 스펙 경로/URL")
}, async ({ base, target }) => {
  // 추가/삭제/변경된 endpoint, 파라미터, 스키마 반환
});
```

다만 개발자대변인에게 묻고 싶은데, 이 기능 실제로 자주 쓸 것 같나요?

### 👤 개발자대변인
빌더 질문에 답하겠습니다. **매주까지는 아니지만, 쓸 때는 정말 유용합니다.** 특히:
- 서드파티 API 버전 업그레이드 시 (Stripe v2024-12 → v2025-01 같은)
- 내부 마이크로서비스 API 변경 사항 추적
- 사용 빈도는 월 1-2회지만, 그때마다 수동으로 diff 하는 게 정말 고통스러움

그래서 MVP에 넣을 만큼 핵심은 아니지만, **v1.1에서 추가하면 차별화 킬러 피처**가 될 수 있습니다. "Show HN 후 첫 업데이트"로 좋겠네요.

### 🔨 채찍맨
동의한다. API Diff는 v1.1으로 미루고, MVP는 순수 탐색 + 목 데이터에 집중. 빌더가 제안한 3개 tool이면 됩니다:
1. `load_spec` — 스펙 로드
2. `list_endpoints` — 목록 조회
3. `get_endpoint_detail` — 상세 + 목 데이터 생성

tool 3개. 4일이면 충분하다.

### 😈 비관론자
MCP생태계분석가의 `mcp-filesystem` 비유는 인정합니다. 구조화된 접근의 가치가 있다는 건 동의합니다만, **한 가지 더 지적하겠습니다.**

OpenAPI 스펙의 품질 문제입니다. 실제 현업에서 "완벽한 OpenAPI 스펙"을 제공하는 API는 생각보다 적습니다. 스펙이 불완전하거나, 실제 API와 괴리가 있거나, 아예 스펙이 없는 경우가 많습니다. 이 MCP 서버의 가치는 "좋은 스펙이 있다"는 전제에 의존하는데, 그 전제가 깨지면?

리스크로 기록해야 합니다: **"스펙 품질 의존 리스크"**.

### 📢 바이럴전략가
비관론자의 "스펙 품질" 지적을 역이용할 수 있습니다. README에 이렇게 쓰는 겁니다:

> "OpenAPI 스펙이 있는 모든 API에서 작동합니다. 스펙이 없다면? 그건 API 제공자의 문제입니다 — 하지만 걱정 마세요, 주요 SaaS API(Stripe, GitHub, Twilio, Slack)의 공식 OpenAPI 스펙 URL을 내장 지원합니다."

**킬러 무브: 인기 API 프리셋 내장.** 사용자가 `load_spec("stripe")` 하면 자동으로 Stripe의 공식 OpenAPI 스펙을 로드하는 기능. 이러면:
- 설치 직후 "와, Stripe API를 AI한테 물어볼 수 있네!" 경험 제공
- 데모 GIF에서 "한 줄로 Stripe API 전체를 AI가 탐색" 장면 가능
- 목표: 출시 1주일 내 GitHub 100+ stars

## 라운드 3 — 2단계: 수렴 및 정제

### 🎙️ 사회자
1단계에서 나온 핵심 합의를 정리합니다:
- ✅ 생태계 빈 자리 확인됨 (기존 경쟁자 45 stars 이하)
- ✅ MVP: 스펙 로드 + endpoint 탐색 + 목 데이터 생성 (tool 3개)
- ✅ 차별화: 인기 API 프리셋 내장 (바이럴전략가 제안)
- ✅ v1.1: API Diff 기능 + 테스트 호출 (기발한놈 + 채찍맨 합의)
- ⚠️ 미결: 스펙 품질 의존 리스크 (비관론자)

이번 라운드에서는 **타겟 개발자 페르소나**와 **핵심 가치 제안(Value Proposition)**을 확정합시다.

### 🔍 MCP생태계분석가
MCP 생태계 트렌드로 보면, 성공한 MCP 서버들의 공통점은 **특정 개발 워크플로우에 깊게 통합**된다는 것입니다. `mcp-github`는 코드 리뷰, `mcp-filesystem`은 파일 작업. 우리의 포지셔닝도 명확해야 합니다.

추천 포지셔닝: **"AI 에이전트의 API 통합 가속기"** — 새 API를 연동할 때 스펙 읽기 → 이해 → 프로토타이핑까지의 시간을 10분에서 30초로 줄여주는 도구.

### 💡 기발한놈
타겟 개발자를 너무 좁게 잡으면 안 됩니다. 두 가지 페르소나를 생각해봅시다:

1. **Primary: "API 통합 개발자"** — 프론트엔드/백엔드 가리지 않고, 서드파티 API를 붙이는 업무가 주인 개발자. SaaS 연동, 결제 API, 소셜 로그인 등.
2. **Secondary: "API 설계자/문서 작성자"** — 자기 API의 OpenAPI 스펙을 관리하는 백엔드 개발자. 스펙 검증, 목 데이터로 프론트엔드 팀에 샘플 제공.

2번 페르소나가 의외로 킬러입니다. 자기 API 스펙을 MCP로 로드하면 "우리 API 맞게 사용하고 있는지" AI한테 검증 받을 수 있으니까요.

### 🛠️ 빌더
핵심 가치 제안을 기술적으로 정리하면:

**"OpenAPI 스펙을 AI 에이전트가 이해할 수 있는 구조화된 인터페이스로 변환"**

이것의 기술적 의미:
- 10만 줄짜리 YAML을 통째로 컨텍스트에 넣는 대신, 필요한 endpoint만 정확히 추출
- `$ref` 참조 해소, allOf/oneOf 병합 등 복잡한 스키마를 평탄화
- AI가 바로 사용할 수 있는 clean한 JSON 스키마 반환
- 목 데이터를 스키마 기반으로 realistic하게 생성 (이메일 필드엔 이메일 형식, 날짜 필드엔 ISO 날짜 등)

특히 `$ref` 해소가 핵심입니다. OpenAPI 스펙의 가장 복잡한 부분이 중첩된 `$ref` 참조인데, 이걸 자동으로 풀어서 AI에게 전달하면 정확도가 크게 올라갑니다.

### 👤 개발자대변인
기발한놈의 2번 페르소나에 동의합니다. 실제로 제가 백엔드 API를 만들 때, 프론트엔드 팀에게 "이 endpoint 이렇게 쓰면 돼"라고 설명하는 게 시간 많이 걸립니다. MCP로 우리 API 스펙을 로드해두면 프론트엔드 개발자가 AI한테 직접 물어볼 수 있고요.

**사용 시나리오 정리:**
- "이 API에서 사용자 목록 가져오려면 어떤 endpoint?" → `list_endpoints` + 필터
- "POST /users 의 필수 파라미터는?" → `get_endpoint_detail`
- "테스트용 사용자 데이터 만들어줘" → mock 데이터 생성
- 이 3가지가 **주간 3회 이상** 발생하는 실제 개발 시나리오입니다.

### 🔨 채찍맨
페르소나 2개, 가치 제안 확정됐으니 넘어가자. 핵심은 **MVP 3-4일, tool 3개**. 인기 API 프리셋은 데이터 파일만 추가하면 되니 0.5일이면 된다. 총 4.5일.

### 😈 비관론자
타겟 페르소나와 사용 빈도는 인정합니다. 하지만 **경쟁 리스크**를 하나 더 지적합니다.

AI 플랫폼들이 자체적으로 OpenAPI 통합을 내장하기 시작했습니다. ChatGPT의 GPT Actions가 이미 OpenAPI 스펙을 직접 읽고 API 호출을 합니다. Claude MCP 생태계에서는 아직 이 기능이 없지만, Anthropic이 공식 지원을 시작하면 이 MCP 서버가 obsolete 될 수 있습니다.

**리스크 추가: "플랫폼 내재화 리스크"** — Anthropic이 OpenAPI 통합을 공식 기능으로 넣을 가능성.

대응책이 필요합니다. "공식 지원과 겹치더라도 커뮤니티 버전이 살아남을 수 있는 이유"를 만들어야 합니다.

### 📢 바이럴전략가
비관론자의 플랫폼 리스크에 대한 대응:

**커뮤니티 버전의 생존 전략:**
1. **속도 우위** — 공식 지원은 항상 느리다. 우리가 먼저 시장을 점유하면 "de facto standard"가 됨
2. **커스터마이징** — 인기 API 프리셋, 팀별 config, 조직 내부 API 지원 등 공식 버전이 못 하는 영역
3. **오픈소스 lock-in** — GitHub stars + npm downloads가 쌓이면 공식 버전이 나와도 마이그레이션 코스트 때문에 유지

**확산 전략 구체화:**
- Show HN 제목: "Show HN: mcp-openapi – AI agents can now explore and understand any API with one command"
- 데모 GIF 시나리오: `load_spec("stripe")` → "결제 API 어떻게 쓰는지 알려줘" → AI가 endpoint + 파라미터 + 예제 코드 즉시 설명
- 1차 타겟: r/ClaudeAI (MCP 사용자 집중), Show HN
- 2차 타겟: r/webdev (API 통합 개발자), X #MCP

## 라운드 4 — 2단계: 수렴 및 정제 (확정)

### 🎙️ 사회자
2단계 마지막 라운드입니다. 핵심 확정 사항을 정리하고, 다음 단계(DX & MCP 스펙)로 넘어가기 위한 기반을 만듭니다.

**확정 사항:**
- 패키지명: `mcp-openapi`
- 포지셔닝: AI 에이전트의 API 통합 가속기
- Primary 타겟: API 통합 개발자 (서드파티 API 연동)
- Secondary 타겟: API 설계자/문서 관리자
- MVP tool: load_spec, list_endpoints, get_endpoint_detail (+ mock 생성 내장)
- 차별화: 인기 API 프리셋, $ref 해소, realistic mock 데이터

미결 쟁점 처리합시다. 비관론자가 제기한 "플랫폼 내재화 리스크"에 대해 빌더의 의견은?

### 🔍 MCP생태계분석가
플랫폼 리스크 관련 데이터 보충: MCP 생태계에서 Anthropic이 공식 MCP 서버를 만든 건 `mcp-filesystem`, `mcp-github` 등 극히 기본적인 것들뿐입니다. OpenAPI 통합은 "기본"이라기보다 "도메인 특화"에 가깝습니다. 앞으로 1-2년 내 공식 지원될 가능성은 낮다고 봅니다.

### 💡 기발한놈
하나 더 차별점을 던지겠습니다. **"스펙 요약(spec_summary)"** tool — 스펙 전체를 한 눈에 파악할 수 있는 요약 정보. 총 endpoint 수, 인증 방식, 주요 태그/카테고리, API 버전 등을 한 번에 반환. 마치 API의 "프로필 카드" 같은 것.

이게 데모 첫 화면에서 좋습니다. "Stripe API를 분석합니다... 총 312개 endpoint, OAuth2 + API Key 인증, 15개 카테고리..." 이런 식으로 보여주면 임팩트 있음.

### 🛠️ 빌더
기발한놈의 spec_summary 아이디어, 구현 간단하고 DX 임팩트 큽니다. tool 하나 추가로 부담도 적고요.

**플랫폼 리스크 대응 전략 (기술적 관점):**
- MCP 프로토콜 자체가 "서드파티 확장"을 전제로 설계됨
- 우리 MCP가 잘 만들어지면 Anthropic이 "공식 추천 MCP"로 지정할 수도 있음 (모범 사례)
- 핵심은 프로토콜 준수 + 코드 품질 + 문서 품질

빌더로서 확정: MVP tool 4개.
1. `load_spec` — 스펙 로드 (파일/URL/프리셋)
2. `list_endpoints` — endpoint 필터링 목록
3. `get_endpoint_detail` — 상세 + mock 데이터
4. `get_spec_summary` — 스펙 요약 프로필

### 👤 개발자대변인
spec_summary에 강력 동의합니다. 새 API를 처음 볼 때 "이 API 전체적으로 뭐 하는 건지" 파악하는 게 첫 번째 작업이니까요. DX 관점에서 이게 entry point가 됩니다.

**설치 플로우 확정 제안:**
```bash
# Claude Desktop config
{
  "mcpServers": {
    "openapi": {
      "command": "npx",
      "args": ["-y", "mcp-openapi"],
      "env": {}
    }
  }
}
```
설정 끝. 추가 config 파일 없이, 사용 시 `load_spec("stripe")` 또는 `load_spec("./my-api.yaml")`로 바로 시작. **이게 핵심입니다 — zero-config.**

### 🔨 채찍맨
tool 4개? 3개라고 했는데. spec_summary가 추가됐지만, 구현 난이도가 낮으니 허용한다. 다만 **4개가 한계다.** 더 추가하면 가차없이 자른다.

일정 재계산: 4개 tool × 1일 + 프리셋 데이터 0.5일 + 테스트/문서 0.5일 = **5일.** 1주 안에 가능.

### 😈 비관론자
MCP생태계분석가의 "공식 지원 가능성 낮음" 분석은 합리적입니다. 플랫폼 리스크를 **중간**으로 하향 조정합니다.

하지만 새로운 우려: **프리셋 유지보수 부담.** 인기 API 프리셋을 내장한다고 했는데, Stripe이 OpenAPI 스펙 URL을 바꾸거나 구조를 변경하면? 프리셋 URL이 깨지면 사용자 첫 경험이 박살납니다.

대응책: 프리셋은 URL만 저장하고, 실제 스펙은 항상 원본에서 fetch. URL 변경은 GitHub issue로 빠르게 대응. 이 정도면 유지보수 가능.

### 📢 바이럴전략가
spec_summary 기능이 추가되면서 **데모 시나리오가 완벽해졌습니다:**

1. "Stripe API를 분석해줘" → spec_summary 실행 → "312개 endpoint, 15개 카테고리..."
2. "결제 관련 endpoint 보여줘" → list_endpoints(tag: "Payment") → 필터된 목록
3. "POST /v1/charges 상세 알려줘" → get_endpoint_detail → 파라미터 + 목 데이터

이 3단계를 30초 GIF로 만들면 **Reddit에서 "shut up and take my stars" 반응** 나올 수 있습니다.

**Show HN 포스트 본문 초안:**
> mcp-openapi gives AI agents structured access to any OpenAPI spec. Load Stripe, GitHub, or your own API — get summaries, explore endpoints, and generate mock data. One command: `load_spec("stripe")`

## 라운드 5 — 3단계: DX & MCP 스펙 설계

### 🎙️ 사회자
3단계입니다. 빌더가 MCP 프로토콜 스펙을 구체화하고, 개발자대변인이 DX를 검증합니다. JSON 스키마 수준까지 내려가야 합니다.

### 🔍 MCP생태계분석가
인기 MCP 서버들의 tool 네이밍 패턴을 분석하면:
- `mcp-filesystem`: `read_file`, `write_file`, `list_directory` — 동사_명사 패턴
- `mcp-github`: `create_issue`, `get_pull_request` — 동사_명사 패턴
- 일관성을 위해 우리도 동사_명사 패턴을 권장합니다.

현재 tool 이름 중 `load_spec`은 좋고, `list_endpoints`도 좋습니다. `get_endpoint_detail`은 `describe_endpoint`가 더 직관적일 수 있습니다. `get_spec_summary`는 `summarize_spec`이 동사 패턴에 맞습니다.

### 💡 기발한놈
잠깐, resource도 활용해야 합니다. MCP는 tool만 있는 게 아닙니다. **resource**를 통해 현재 로드된 스펙의 상태를 AI가 항상 알 수 있게 하면 어떨까요?

예를 들어 `openapi://current/summary` 같은 resource URI로 현재 로드된 스펙의 요약 정보를 항상 제공. 이러면 AI가 매번 tool을 호출하지 않아도 컨텍스트를 가질 수 있습니다.

### 🛠️ 빌더
좋습니다. 전체 MCP 스펙을 구체적으로 정의하겠습니다.

**Tools (4개):**

```json
{
  "name": "load_spec",
  "description": "OpenAPI/Swagger 스펙을 로드합니다. 파일 경로, URL, 또는 프리셋 이름을 지원합니다.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "source": {
        "type": "string",
        "description": "파일 경로(/path/to/spec.yaml), URL(https://...), 또는 프리셋 이름(stripe, github, slack)"
      }
    },
    "required": ["source"]
  }
}
```

```json
{
  "name": "list_endpoints",
  "description": "로드된 스펙의 API endpoint 목록을 반환합니다. 태그, HTTP 메서드, 키워드로 필터링 가능합니다.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "tag": { "type": "string", "description": "OpenAPI 태그로 필터링" },
      "method": { "type": "string", "enum": ["GET","POST","PUT","DELETE","PATCH"], "description": "HTTP 메서드 필터" },
      "search": { "type": "string", "description": "경로 또는 설명에서 키워드 검색" }
    }
  }
}
```

```json
{
  "name": "describe_endpoint",
  "description": "특정 endpoint의 상세 정보를 반환합니다. 파라미터, 요청/응답 스키마, 예제 데이터를 포함합니다.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": { "type": "string", "description": "API 경로 (예: /v1/charges)" },
      "method": { "type": "string", "description": "HTTP 메서드 (예: POST)" },
      "include_mock": { "type": "boolean", "description": "목 요청/응답 데이터 포함 여부", "default": true }
    },
    "required": ["path", "method"]
  }
}
```

```json
{
  "name": "summarize_spec",
  "description": "로드된 OpenAPI 스펙의 전체 요약을 반환합니다. endpoint 수, 인증 방식, 카테고리 등을 포함합니다.",
  "inputSchema": {
    "type": "object",
    "properties": {}
  }
}
```

**Resources (1개):**

```json
{
  "uri": "openapi://current/info",
  "name": "현재 로드된 스펙 정보",
  "description": "현재 로드된 OpenAPI 스펙의 기본 정보 (이름, 버전, base URL)",
  "mimeType": "application/json"
}
```

기발한놈의 resource 아이디어를 반영했습니다. 다만 resource는 가볍게 유지하고, 상세 정보는 tool로 제공합니다.

### 👤 개발자대변인
DX 관점에서 검증합니다.

**좋은 점:**
- tool 이름이 직관적: `load_spec`, `list_endpoints`, `describe_endpoint`, `summarize_spec`
- `search` 파라미터: "결제" 같은 키워드로 검색 가능 — 이게 핵심. endpoint 경로 모르는 상태에서 시작하니까.
- `include_mock` 옵션: 항상 목 데이터가 필요한 건 아니므로 선택적으로 제공 — 좋음.

**개선 필요:**
- `load_spec`에서 프리셋 목록을 볼 수 있어야 합니다. "어떤 프리셋이 있어?" 물어볼 때 AI가 답하려면 프리셋 목록 tool이 필요하거나, `load_spec`의 description에 목록을 포함해야 합니다.
- 제안: `load_spec` description에 `"지원 프리셋: stripe, github, slack, twilio, openai"` 명시.

**거부권 행사 없음.** 이 설계면 개발자가 충분히 쓸 수 있습니다.

### 🔨 채찍맨
tool 4개 + resource 1개. 범위 안이다. 빌더의 JSON 스키마가 깔끔하고, 불필요한 파라미터 없다. 승인.

다만 프리셋은 **5개로 제한**: stripe, github, slack, twilio, openai. 이 이상 넣으면 유지보수 지옥이다. 사용자가 PR로 추가하게 하면 된다.

### 😈 비관론자
스펙 설계는 괜찮습니다. 하지만 **describe_endpoint의 목 데이터 품질**을 우려합니다. `json-schema-faker`가 만드는 목 데이터는 종종 비현실적입니다. 예를 들어 `email` 필드에 `"lorem ipsum"` 같은 값이 들어가면 개발자 신뢰를 잃습니다.

`format` 필드(`email`, `date-time`, `uri` 등)를 제대로 인식해서 realistic한 값을 생성해야 합니다. 이건 구현 시 반드시 테스트해야 할 부분입니다.

### 📢 바이럴전략가
DX 흐름이 완성됐습니다. README 구조를 확정합니다:

```
# mcp-openapi 🔌
AI agents can now explore any API

## Quick Start (30초)
Claude Desktop config 3줄 → 즉시 사용

## Demo
[30초 GIF: load_spec("stripe") → summarize → list → describe]

## Features
- 📋 스펙 요약: 한눈에 API 파악
- 🔍 스마트 검색: 키워드로 endpoint 탐색
- 🎯 상세 분석: 파라미터, 스키마, 인증 정보
- 🧪 목 데이터: realistic한 테스트 데이터 자동 생성
- ⚡ 인기 API 프리셋: Stripe, GitHub, Slack, Twilio, OpenAI

## Built-in Presets
| API | Command |
|-----|---------|
| Stripe | load_spec("stripe") |
| GitHub | load_spec("github") |
...
```

이 README 구조면 GitHub 방문자가 **3초 안에** 뭐 하는 프로젝트인지 파악 가능합니다.

## 라운드 6 — 3단계: DX & MCP 스펙 설계 (심화)

### 🎙️ 사회자
스펙 설계가 확정됐습니다. 이번 라운드에서는 **설치/설정 플로우**와 **에러 핸들링**을 구체화합니다. 비관론자의 목 데이터 품질 우려도 해결해야 합니다.

### 🔍 MCP생태계분석가
MCP 서버의 설치 방식 트렌드: 최근 인기 MCP 서버 대부분이 `npx -y mcp-xxx` 패턴을 사용합니다. 추가 설정 없이 바로 실행 가능한 zero-config가 표준이 됐습니다. 우리도 이 패턴을 따라야 합니다.

한 가지 추가: `--spec` 인자로 기본 스펙을 지정할 수 있으면 좋습니다. `npx -y mcp-openapi --spec ./api.yaml` 하면 시작과 동시에 스펙이 로드된 상태로 시작.

### 💡 기발한놈
에러 핸들링에 대해 한 가지. 스펙이 invalid할 때 단순히 "파싱 에러"라고 하면 안 됩니다. **"이 스펙의 어디가 문제인지"를 알려주는 검증 기능**을 겸하면 어떨까요?

`load_spec`이 실패하면 "line 42: missing required field 'responses'" 같은 구체적 에러를 반환. 이러면 OpenAPI 스펙 작성할 때도 유용합니다. API 설계자(Secondary 타겟)에게 특히 가치 있는 부가 기능.

### 🛠️ 빌더
좋은 지적입니다. `swagger-parser`가 이미 상세한 validation 에러를 제공하므로, 이걸 그대로 전달하면 됩니다.

**에러 핸들링 설계:**

```typescript
// load_spec 에러 응답 예시
{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "스펙 로드 실패: 유효하지 않은 OpenAPI 스펙입니다.\n\n오류 목록:\n- /paths/users/get: 'responses' 필드가 필수입니다\n- /components/schemas/User: 'type' 필드가 필수입니다\n\n총 2개 오류 발견."
  }]
}
```

**--spec 인자 지원:**
```json
{
  "mcpServers": {
    "openapi": {
      "command": "npx",
      "args": ["-y", "mcp-openapi", "--spec", "./api.yaml"]
    }
  }
}
```

이렇게 하면 Claude Desktop 실행 시 자동으로 스펙이 로드됩니다. 내부 API를 항상 사용하는 팀에게 유용합니다.

**목 데이터 품질 개선 (비관론자 대응):**
`json-schema-faker`의 `format` 인식 + 커스텀 generator 설정:
- `email` → `user@example.com` 패턴
- `date-time` → 현재 시각 기준 ISO 형식
- `uri` → `https://example.com/resource/123`
- `uuid` → 실제 UUID v4 생성
- string 필드명에 `name`이 포함되면 → 이름 생성

### 👤 개발자대변인
빌더의 에러 핸들링 설계 좋습니다. 특히 `--spec` 인자는 **팀 환경에서 킬러 기능**입니다. 팀 README에 "Claude Desktop에 이 config 추가하세요" 한 줄만 써두면 모든 팀원이 같은 API 스펙을 공유할 수 있으니까요.

**DX 최종 검증:**
- 설치: `npx -y mcp-openapi` ✅ zero-config
- 첫 사용: "Stripe API 분석해줘" → load_spec("stripe") ✅ 즉시 동작
- 에러: 친절한 한국어/영어 에러 메시지 ✅
- 문서: README + 프리셋 테이블 ✅

**DX 승인합니다.**

### 🔨 채찍맨
목 데이터 커스텀 generator는 오버엔지니어링 위험이 있다. `json-schema-faker`의 기본 format 인식만으로 충분하다. 커스텀 필드명 매칭(`name` 포함 → 이름 생성)은 v1.1으로 미룬다.

MVP에서는: format 기반 기본 목 데이터. 끝.

### 😈 비관론자
채찍맨의 스코프 컷에 동의합니다. format 기반 목 데이터면 충분히 쓸 만합니다. `json-schema-faker`가 `format: "email"`을 인식하면 `alice@example.com` 같은 값을 생성하니까 비현실적인 데이터 문제는 해결됩니다.

**남은 리스크 정리:**
1. 스펙 품질 의존 — 대응: validation 에러 메시지 제공
2. 플랫폼 내재화 — 대응: 속도 우위 + 커스터마이징
3. 프리셋 URL 변경 — 대응: URL only 저장 + 커뮤니티 PR

3개 모두 대응책이 있으므로, 리스크 수준은 **관리 가능**입니다.

### 📢 바이럴전략가
DX 흐름이 완전히 확정됐으니, **데모 스크립트**를 확정합니다:

**30초 데모 GIF 스크립트:**
1. (0-5초) Claude Desktop에서 "Stripe API를 분석해줘" 입력
2. (5-10초) AI가 `load_spec("stripe")` + `summarize_spec` 실행 → "312개 endpoint, OAuth2 + API Key..."
3. (10-20초) "결제 생성 endpoint 알려줘" → `list_endpoints(search: "charge")` → `describe_endpoint("/v1/charges", "POST")` → 파라미터 목록 + 목 데이터
4. (20-30초) "이 API로 1000원 결제하는 예제 코드 만들어줘" → AI가 스펙 기반으로 정확한 코드 생성

이 데모가 바이럴 포인트입니다. **"AI가 API 문서를 대체한다"**는 메시지를 시각적으로 보여줍니다.

## 라운드 7 — 4단계: 기술 구현 & MVP

### 🎙️ 사회자
4단계입니다. 기술 스택, MVP 스코프, 개발 일정을 확정합니다. 빌더가 주도하고, 채찍맨이 스코프를 감시합니다.

### 🔍 MCP생태계분석가
기술 스택 관련: MCP 생태계에서 TypeScript MCP 서버가 압도적 다수(약 80%)입니다. npm 배포 편의성, MCP SDK 공식 지원 등을 고려하면 TypeScript가 최선입니다. Python MCP 서버도 있지만 `npx` 원클릭 설치의 이점을 포기해야 합니다.

### 💡 기발한놈
한 가지 재밌는 기술적 아이디어: **다중 스펙 동시 로드.** 마이크로서비스 환경에서 내부 API가 10개면, 한번에 로드해서 "사용자 서비스와 결제 서비스의 연동 흐름 알려줘" 같은 크로스-API 질문도 가능하게 하는 것.

채찍맨이 자르겠지만 v1.1 후보로 기록해두자.

### 🛠️ 빌더
기술 스택을 확정합니다:

| 카테고리 | 선택 | 이유 |
|----------|------|------|
| 런타임 | Node.js 20+ | MCP SDK TypeScript 공식 지원 |
| 언어 | TypeScript (strict) | 타입 안전성 + MCP 생태계 표준 |
| MCP SDK | @modelcontextprotocol/sdk | 공식 SDK, tools/resources 지원 |
| 전송 | stdio | Claude Desktop 표준 |
| 스펙 파싱 | @apidevtools/swagger-parser | 가장 성숙한 라이브러리, OpenAPI 2.0/3.0/3.1 지원 |
| 목 데이터 | json-schema-faker | JSON Schema → realistic 샘플 데이터 |
| 빌드 | tsup | 번들링 + ESM/CJS 지원 |
| 패키지 매니저 | npm | npx 호환 필수 |

**의존성 최소화:** 핵심 deps는 `@modelcontextprotocol/sdk`, `@apidevtools/swagger-parser`, `json-schema-faker` — 총 3개. 나머지는 dev deps.

**프로젝트 구조:**
```
mcp-openapi/
├── src/
│   ├── index.ts          # MCP 서버 진입점
│   ├── tools/
│   │   ├── load-spec.ts
│   │   ├── list-endpoints.ts
│   │   ├── describe-endpoint.ts
│   │   └── summarize-spec.ts
│   ├── resources/
│   │   └── current-info.ts
│   ├── lib/
│   │   ├── spec-store.ts   # 로드된 스펙 상태 관리
│   │   ├── mock-generator.ts
│   │   └── presets.ts       # 인기 API 프리셋 URL
│   └── types.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

### 👤 개발자대변인
기술 스택 좋습니다. 특히 `tsup`으로 번들링하면 `npx`로 설치할 때 빠르고 가볍습니다.

**개발자가 신경 쓰는 것 체크:**
- `npx -y mcp-openapi` 실행 시간: 3초 이내여야 함 (설치 + 시작)
- 메모리 사용: 대형 스펙(Kubernetes 10만줄) 로드 시 메모리 이슈 없어야 함
- 에러: 스펙이 없거나 URL이 틀리면 명확한 에러 메시지

빌더에게 묻겠는데, Kubernetes 같은 초대형 스펙 로드 시 메모리 걱정 없나요?

### 🔨 채찍맨
기발한놈의 다중 스펙 로드 — ❌ v1.1으로. MVP는 단일 스펙만 지원.

**개발 일정 (5일):**

| 일차 | 작업 | 산출물 |
|------|------|--------|
| 1일차 | 프로젝트 셋업 + load_spec + spec_store | 스펙 로드/파싱 동작 |
| 2일차 | list_endpoints + describe_endpoint | 핵심 탐색 기능 완성 |
| 3일차 | summarize_spec + mock_generator + resource | 전체 tool 완성 |
| 4일차 | 프리셋 데이터 + --spec 인자 + 에러 핸들링 | 프리셋 5개 동작 |
| 5일차 | 테스트 + README + npm 배포 + 데모 GIF | 출시 |

tool 4개 + resource 1개. **이 이상 추가하면 6일차로 넘어간다. 절대 불가.**

### 😈 비관론자
개발자대변인의 메모리 질문에 대해 — 이건 실제 리스크입니다. Kubernetes OpenAPI 스펙은 파싱 후 메모리에 수십 MB를 차지할 수 있습니다. `swagger-parser`의 `dereference()` 메서드가 `$ref`를 전부 풀면 메모리가 폭발할 수 있습니다.

**대응책 제안:** `$ref` 해소를 lazy하게 처리. 전체 스펙을 한 번에 dereference하지 말고, `describe_endpoint` 호출 시 해당 endpoint의 스키마만 선택적으로 해소. 이러면 메모리 사용량을 크게 줄일 수 있습니다.

빌더, 이거 구현 가능한가요?

### 📢 바이럴전략가
기술 구현 얘기에 끼어들진 않겠습니다. 다만 **출시 5일차 계획**을 구체화합니다:

**출시 당일 체크리스트:**
1. npm publish
2. GitHub repo 공개 (README + 데모 GIF 포함)
3. Show HN 포스트: "Show HN: mcp-openapi – AI agents can now explore any API with one command"
4. Reddit 포스트: r/ClaudeAI + r/ChatGPTCoding
5. X 트윗: 데모 GIF + #MCP #AI #OpenAPI

**1주일 목표:** GitHub 80+ stars, npm 200+ weekly downloads

## 라운드 8 — 5단계: 최종 검증 & 확산 전략

### 🎙️ 사회자
마지막 라운드입니다. Go/No-Go 판정과 리스크 매트릭스를 확정합니다. 비관론자, 수치 기준표 기반으로 최종 판정 해주세요.

### 🔍 MCP생태계분석가
최종 생태계 포지셔닝 확인: `mcp-openapi`는 현재 MCP 생태계에서 **"API 통합 도구"라는 빈 카테고리의 선점자**입니다. 가장 가까운 경쟁자가 45 stars로 우리의 차별점(프리셋, 구조화 탐색, realistic mock)이 명확합니다. 생태계 관점에서 **Go**입니다.

### 💡 기발한놈
마지막으로 하나만. 장기 비전을 던져둡니다. v2.0에서 **"API 간 연결 그래프"** — 여러 API 스펙을 로드하면 API 간 데이터 흐름을 시각화하는 기능. 마이크로서비스 아키텍처의 "API 지도"를 AI가 만들어주는 것. 이건 정말 아무도 안 하고 있습니다.

당장은 아니지만, 로드맵에 넣어두면 "이 프로젝트는 비전이 있다"는 인상을 줄 수 있습니다.

### 🛠️ 빌더
비관론자의 lazy dereference 제안에 답합니다. 구현 가능합니다. `swagger-parser`의 `parse()` (참조 해소 없이) + 수동 `$ref` 해소 유틸리티를 조합하면 됩니다.

**최종 기술 판정:**
- 핵심 의존성 3개: 모두 안정적이고 활발히 유지보수됨
- 구현 복잡도: 중하 (5일 충분)
- 유지보수: 낮음 (외부 API 호출 없음, 스펙 파싱만)
- 확장성: 높음 (tool 추가 용이)

기술적으로 **Go**입니다.

### 👤 개발자대변인
최종 DX 판정입니다.

**설치부터 첫 사용까지 30초:**
1. Claude Desktop config 3줄 추가 (10초)
2. "Stripe API 분석해줘" 입력 (5초)
3. AI가 스펙 로드 + 요약 제공 (15초)

이 경험이 가능하다면 **개발자가 쓸 겁니다.** 주간 사용 빈도 3회 이상 예상. DX 관점에서 **Go**입니다.

### 🔨 채찍맨
최종 스코프 확인:
- MVP: tool 4개 + resource 1개 + 프리셋 5개
- 개발: 5일
- 1인 개발 가능: ✅

스코프 초과 없음. 일정 리스크 없음. **Go.**

### 😈 비관론자
**최종 No-Go 판정표:**

| 지표 | 값 | 기준 | 판정 |
|------|-----|------|------|
| 기존 대안 | 최대 45 stars | < 100 stars | ✅ PASS |
| 개발자 필요성 | 주 3회+ (API 통합 시) | > 주 1회 | ✅ PASS |
| MVP 개발 | 5일 | < 2주 | ✅ PASS |
| 차별점 | 3개 (프리셋, 구조화 탐색, realistic mock) | > 0개 | ✅ PASS |
| 바이럴 잠재력 | 데모 GIF 임팩트 있음 (Stripe 분석 시나리오) | 임팩트 있음 | ✅ PASS |
| 유지보수 부담 | 외부 API 0개, deps 3개 | < 3개 외부 API | ✅ PASS |

**6개 항목 전부 PASS.**

남은 리스크:
1. **스펙 품질 의존** — 확률 중간, 영향 중간, 대응: validation 메시지
2. **플랫폼 내재화** — 확률 낮음, 영향 높음, 대응: 속도 우위 + 커스터마이징
3. **프리셋 URL 변경** — 확률 낮음, 영향 낮음, 대응: 커뮤니티 PR
4. **대형 스펙 메모리** — 확률 중간, 영향 중간, 대응: lazy dereference

**내 최종 판정: Go.** 모든 No-Go 기준을 통과했고, 리스크는 관리 가능합니다. 다만 "쿨한 데모"를 반드시 만들어야 합니다 — 데모 없이 출시하면 묻힙니다.

### 📢 바이럴전략가
**전원 Go! 최종 확산 전략을 확정합니다.**

**런칭 계획:**

1. **D-day (출시일):**
   - npm publish: `mcp-openapi`
   - GitHub repo 공개: MIT 라이선스
   - Show HN: "Show HN: mcp-openapi – AI agents can now explore any API with one command"
   - r/ClaudeAI: "I built an MCP server that lets Claude explore any OpenAPI spec"
   - X: 30초 데모 GIF + 스레드

2. **D+1~3:**
   - r/ChatGPTCoding, r/webdev 크로스포스트
   - DEV.to 블로그: "How I built an MCP server for OpenAPI in 5 days"

3. **D+7:**
   - v1.1 발표 (API Diff + 다중 스펙 지원)
   - GitHub Discussions 활성화

**성공 지표:**
- 1주: GitHub 80+ stars, npm 200+ downloads
- 1개월: GitHub 200+ stars, npm 500+ weekly downloads
- 3개월: MCP 공식 추천 목록 등재 시도

**실패 시 출구:** 2주 내 GitHub 20 stars 미만이면 피벗 검토. 가능한 피벗: "mcp-api-testing" (OpenAPI 스펙 기반 자동 API 테스트)으로 방향 전환.

