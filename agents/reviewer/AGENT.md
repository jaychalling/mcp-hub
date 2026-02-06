# MCP 서버 기획서 검수 에이전트 (Reviewer)

> Task tool로 스폰: `subagent_type: "general-purpose"`, model: `"sonnet"`
> prompt: `"agents/reviewer/AGENT.md를 읽고 검수 진행. 대상: src/app/{id}/"`

## 역할

brainstorm 에이전트가 생성한 산출물(기획서, 회의록, 기술문서)을 **검수하고 보강/수정**하는 에이전트.
deployer 호출 전에 반드시 실행한다.

## 에이전트 체인 위치

```
brainstorm → ⭐ reviewer (여기) → deployer
```

---

## 입력 (reviewer가 받는 것)

메인 세션에서 아래 정보와 함께 호출됨:
- **프로젝트 id** (예: `mcp-interview`)
- **deployer 전달 정보**: title, subtitle, tags, color, stars

## 대상 파일 (reviewer가 읽고 수정하는 것)

```
src/app/{id}/docs/page.tsx      ← 통합 Docs (기획서+PRD+기술문서) - 검수 + 수정 대상
memory/{id}/config.json         ← 프로젝트 설정 - 검증 대상 (필수 필드 확인)
memory/{id}/minutes.md          ← 회의록 원문 - 품질 검증만 (수정 금지)
STYLE_GUIDE.md                  ← 스타일 기준 (읽기 전용)
src/app/page.tsx                ← 홈페이지 (보호 대상, 변경 시 원복)
```

**자동 생성 파일 (reviewer가 수정하지 않음):**
- `src/app/{id}/page.tsx` — generate-all.mts가 자동 생성
- `src/app/{id}/minutes/page.tsx` — generate-all.mts가 minutes.md에서 자동 생성

**2탭 구조**: Docs + 회의록 (기존 main/docs/report 통합 → Docs 하나로)

---

## 실행 흐름 (8단계)

```
1. STYLE_GUIDE.md 읽기
2. 대상 파일 읽기 (docs/page.tsx, config.json, minutes.md)
3. [A] 통합 Docs 구조 검증 (docs/page.tsx) → 위반 시 즉시 Edit 수정
4. [B] config.json 검증 → 필수 필드 누락 시 추가
5. [C] 회의록 품질 검증 (minutes.md) → 품질 미달 시 경고 + 진행 여부 판단
6. [D] STYLE_GUIDE 준수 검증 → 위반 시 즉시 Edit 수정
7. [E] 홈페이지 보호 확인 → 변경 시 git checkout 원복
8. [F] 빌드 검증 (npm run build) → 실패 시 수정 후 재빌드
9. 결과 보고 출력
```

**원칙: 검증과 수정을 동시에 한다.** 위반을 발견하면 보고만 하지 말고 즉시 Edit으로 수정한 후 다음 항목으로 넘어간다.

---

## [A] 통합 Docs 구조 검증 (docs/page.tsx)

**참고**: 2탭 구조에서는 기획서+PRD+기술문서가 `docs/page.tsx`에 통합됨.

### Part 1 — MCP 서버 기획서 필수 섹션 (9개)

| # | 섹션 | 확인 방법 | 위반 시 조치 |
|---|------|----------|-------------|
| 1 | 서비스 개요 | "서비스 개요" h2 존재 + 한 줄 요약 + 핵심 가치 + 왜 지금 + **유저 이득 Before/After** | 누락 항목 추가, 유저 이득이 추상적이면 구체화 |
| 2 | 타겟 개발자 | "타겟" h2 + Primary/Secondary/Tertiary 3단계 + 규모 수치 + **"이걸 쓰면 뭐가 좋아지는가" 쉬운 문장** | 구분/수치 추가, 이득 문장 보강 |
| 3 | 기존 대안 분석 | 기존 대안 테이블 (최소 3개) + 빈 자리(포지셔닝) | 테이블/대안 추가 |
| 4 | MCP 스펙 설계 | tools/resources/prompts 정의 + **JSON schema 코드 블록** 존재 | JSON schema 추가 |
| 5 | 차별점 & 해자 | 우위 항목 나열 + **Phase별 해자 구축 로드맵** | 섹션 통째로 추가 |
| 6 | 확산 전략 | 타겟 개발자가 실제로 모이는 곳 기반 (GitHub/Reddit/Discord 등) | 채널 재설계 |
| 7 | 리스크 매트릭스 | 최소 4개, 확률/영향/대책 3열 테이블 | 부족 시 추가 |
| 8 | 검토 후 기각된 대안 | 최소 5개 + 기각 사유 테이블 | 부족 시 추가 |
| 9 | Go/No-Go 최종 판정 | 수치 기준 테이블 (PASS/FAIL) + 성공 조건 + 실패 출구 | 테이블/출구 추가 |

### Part 2 — PRD 필수 섹션 (5개)

| # | 섹션 | 확인 방법 | 위반 시 조치 |
|---|------|----------|-------------|
| 1 | MVP 스코프 | 주차별 작업 목록 + 기능 리스트 | 추가 |
| 2 | MCP Tool/Resource 설계 | **JSON schema 코드 블록 필수** — tool input/output schema, resource URI 패턴 | JSON schema 추가 |
| 3 | 기술 스택 | 테이블 (카테고리/선택) | 추가 |
| 4 | 개발 일정 | 일차별 마일스톤 테이블 (1주 기준) | 추가 |
| 5 | Post-MVP 로드맵 | v1.1 → v2.0 → v3.0 단계별 기능 | 추가 |

### JSON Schema 존재 검증 (MCP 특화 — 필수!)

MCP 서버 기획이므로 **JSON schema가 반드시 존재해야 한다.** 아래 두 곳 중 최소 하나에서 JSON schema 코드 블록을 확인:

1. **Part 1 — 4. MCP 스펙 설계**: tool의 inputSchema, resource의 URI 패턴
2. **Part 2 — 2. MCP Tool/Resource 설계**: 상세 JSON schema

**확인 방법:**
- `<pre>` 또는 `<code>` 블록 내에 `"type"`, `"properties"`, `"inputSchema"` 등 JSON schema 키워드 존재
- tool 이름, description, parameters 정의가 구체적으로 명시됨

**미달 시:**
- JSON schema 코드 블록이 하나도 없으면 → PRD 섹션에 기본 schema 추가
- schema가 있으나 불완전하면 (type/properties 누락) → 보강

### 메타 배지 필수 항목

| 항목 | 확인 | 위반 시 |
|------|------|---------|
| 별점 배지 | `Star` 아이콘 + N/5 텍스트 | 배지 추가 |
| 날짜 배지 | 날짜 존재 | 추가 |
| 전문가/라운드 배지 | "8인 전문가", "8라운드" | 추가 |
| 태그 배지 | 최소 3개 | 추가 |

---

## [B] config.json 검증

| # | 필수 필드 | 기준 | 위반 시 조치 |
|---|----------|------|-------------|
| 1 | `id` | 문자열, 라우트 슬러그 | 추가 |
| 2 | `title` | 문자열 | 추가 |
| 3 | `subtitle` | 문자열 | 추가 |
| 4 | `date` | YYYY-MM-DD 형식 | 추가 |
| 5 | `createdAt` | ISO timestamp | 추가 |
| 6 | `pages.minutes.sources` | `["minutes.md"]` | **필수** — 없으면 회의록 자동 생성 안 됨 |
| 7 | `color` | blue/green/orange/violet/indigo 등 | 기본값 blue로 추가 |
| 8 | `stars` | 1~5 숫자 | 기본값 3으로 추가 |

```json
// 최소 필수 구조
{
  "id": "project-id",
  "title": "프로젝트명",
  "subtitle": "한줄 설명",
  "date": "2026-02-06",
  "createdAt": "2026-02-06T00:00:00.000Z",
  "pages": {
    "docs": null,
    "minutes": { "sources": ["minutes.md"] }
  }
}
```

---

## [C] 회의록 품질 검증

**minutes.md와 minutes/page.tsx는 수정하지 않는다!**
- minutes.md: brainstorm이 생성한 원문
- minutes/page.tsx: generate-all.mts가 자동 생성

| # | 검증 항목 | 기준 | 미달 시 |
|---|----------|------|---------|
| 1 | minutes.md 줄 수 | **200줄 이상** | 경고 |
| 2 | 라운드 헤더 수 | `## 라운드` **8개** | 경고 |
| 3 | 역할 헤더 수 | `### ` 등 **60개 이상** | 경고 |

### 품질 미달 시 대응

| 미달 수준 | 조치 |
|----------|------|
| 경미 (1개 항목 미달) | 경고 출력 후 **deployer 진행** |
| 심각 (2개+ 항목 미달) | **deployer 진행 중단** + 결과 보고에 "brainstorm 재실행 권고" 포함 |

**심각 미달 예시:**
- 줄 수 120줄 미만 + 라운드 4개 이하 → 회의록이 너무 짧음, 재실행 필요

---

## [D] STYLE_GUIDE 준수 검증

| # | 규칙 | 위반 패턴 | 수정 방법 |
|---|------|----------|----------|
| 1 | 시맨틱 토큰 필수 | `bg-white`, `bg-gray-50` 등 하드코딩 | `bg-card`, `bg-secondary` 등으로 교체 |
| 2 | 컬러 텍스트 `-600` | `text-{color}-400`, `text-{color}-300` | `text-{color}-600`으로 교체 |
| 3 | table-wrap 필수 | `<table>` 바로 위에 `<div className="table-wrap">` 없음 | table-wrap div 추가 |
| 4 | ScrollArea 금지 | `ScrollArea` import 존재 | import 제거 + div로 교체 |
| 5 | Lucide 아이콘 | 섹션 제목에 이모지 사용 (회의록 역할 이모지는 예외) | Lucide 아이콘으로 교체 |
| 6 | 다크 테마 잔재 | `bg-gray-900`, `text-white` (colored bg 외), `border-white/10` | 시맨틱 토큰으로 교체 |

**참고**: minutes/page.tsx는 generate-all.mts가 자동 생성하므로 스타일 검증 대상에서 제외.

---

## [E] 홈페이지 보호 검증

```bash
git diff src/app/page.tsx
```

변경이 감지되면 **즉시 원복**:
```bash
git checkout -- src/app/page.tsx
```

**이유**: 홈페이지는 메인 세션에서 `--update-home`으로만 동기화. 서브에이전트가 직접 수정하면 다른 프로젝트 데이터 깨짐.

---

## [F] 빌드 검증

```bash
npm run build
```

빌드 실패 시:
1. 에러 메시지에서 파일/줄 번호 확인
2. 해당 파일 Edit으로 수정
3. 재빌드
4. 통과할 때까지 반복 (최대 3회)

`.next/lock` 에러 시: `rm -f .next/lock` 후 재시도

---

## 누락 섹션 추가 시 JSX 구조

### 섹션 추가 위치 결정

기획서의 섹션 번호 순서를 유지한다. 예를 들어 "5. 차별점 & 해자"가 누락이면, 4번과 6번 사이에 삽입.

### 차별점 & 해자 섹션 추가 예시

```tsx
{/* 5. 차별점 & 해자 */}
<h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2"><Shield size={20} />5. 차별점 &amp; 해자</h2>

<h3 className="text-lg font-semibold mt-6 mb-3">차별점</h3>
<ol className="list-decimal pl-6 space-y-1 text-muted-foreground mb-4">
  <li><span className="font-bold">차별점 1</span>: 설명</li>
  <li><span className="font-bold">차별점 2</span>: 설명</li>
  <li><span className="font-bold">차별점 3</span>: 설명</li>
</ol>

<h3 className="text-lg font-semibold mt-6 mb-3">해자 구축 로드맵</h3>
<ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
  <li><span className="font-bold">Phase 1 (W1-2)</span>: 기술 해자 — MCP 스펙 완전 준수 + 에지케이스 처리</li>
  <li><span className="font-bold">Phase 2 (M1-3)</span>: 커뮤니티 해자 — GitHub Stars + 기여자 확보</li>
  <li><span className="font-bold">Phase 3 (M3-6)</span>: 생태계 해자 — 다른 MCP 서버와 연동 + 플러그인 시스템</li>
</ul>
<hr className="my-6" />
```

### PRD 섹션 추가 예시

Part 2 구분선이 없으면 먼저 추가:
```tsx
{/* ========= Part 2: PRD ========= */}
<div className="flex items-center gap-2 mt-8 mb-4"><Wrench size={22} className="text-blue-600" /><h2 className="text-xl font-bold text-blue-600">Part 2: PRD (Product Requirements)</h2></div>
<hr className="mb-6" />
```

### MCP Tool/Resource JSON Schema 추가 예시

```tsx
<h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2"><Code size={20} />MCP Tool/Resource 설계</h2>

<h3 className="text-lg font-semibold mt-6 mb-3">Tool: tool_name</h3>
<pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-4"><code>{`{
  "name": "tool_name",
  "description": "Tool description",
  "inputSchema": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Parameter description"
      }
    },
    "required": ["param1"]
  }
}`}</code></pre>

<h3 className="text-lg font-semibold mt-6 mb-3">Resource: resource://uri-pattern</h3>
<pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-4"><code>{`{
  "uri": "resource://namespace/path",
  "name": "Resource Name",
  "description": "Resource description",
  "mimeType": "application/json"
}`}</code></pre>
```

### 별점 배지 추가 예시

메타 배지 영역(`flex flex-wrap items-center gap-1.5 mb-8`) 안에 추가:
```tsx
<span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-600 gap-1"><Star size={10} />{N}/5</span>
```
`Star`를 import에 추가하는 것도 잊지 않는다.

### Go/No-Go 판정 테이블 예시

```tsx
<div className="rounded-lg border-2 border-green-600 p-4 mb-4 bg-card">
  <p className="font-semibold text-green-600 text-lg mb-2">Go</p>
  <div className="table-wrap mt-2">
    <table className="w-full text-sm border-collapse">
      <thead><tr className="border-b bg-secondary">
        <th className="text-left px-2 py-2 font-semibold text-muted-foreground">지표</th>
        <th className="text-left px-2 py-2 font-semibold text-muted-foreground">값</th>
        <th className="text-left px-2 py-2 font-semibold text-muted-foreground">판정</th>
      </tr></thead>
      <tbody>
        <tr className="border-b"><td className="px-2 py-2">MCP 스펙 준수</td><td className="px-2 py-2">완전</td><td className="px-2 py-2 text-green-600 font-bold">PASS</td></tr>
        <tr className="border-b"><td className="px-2 py-2">기존 대안 대비 차별점</td><td className="px-2 py-2">N개</td><td className="px-2 py-2 text-green-600 font-bold">PASS</td></tr>
        <tr className="border-b"><td className="px-2 py-2">MVP 개발</td><td className="px-2 py-2">N일</td><td className="px-2 py-2 text-green-600 font-bold">PASS</td></tr>
        <tr className="border-b"><td className="px-2 py-2">타겟 개발자 규모</td><td className="px-2 py-2">N명+</td><td className="px-2 py-2 text-green-600 font-bold">PASS</td></tr>
        <tr className="border-b"><td className="px-2 py-2">확산 가능성</td><td className="px-2 py-2">높음</td><td className="px-2 py-2 text-green-600 font-bold">PASS</td></tr>
        <tr className="border-b"><td className="px-2 py-2">기술 리스크</td><td className="px-2 py-2">낮음</td><td className="px-2 py-2 text-green-600 font-bold">PASS</td></tr>
      </tbody>
    </table>
  </div>
</div>

<h3 className="text-lg font-semibold mt-6 mb-3">성공 조건</h3>
<ol className="list-decimal pl-6 space-y-1 text-muted-foreground mb-4">
  <li>조건 1</li>
  <li>조건 2</li>
</ol>

<h3 className="text-lg font-semibold mt-6 mb-3">실패 시 출구</h3>
<ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
  <li>출구 1</li>
  <li>출구 2</li>
  <li>총 투입 시간 최대: N일</li>
</ul>
```

---

## 보강 기준

검증 통과 후에도, 아래 항목은 **내용 품질** 기준으로 보강한다.
brainstorm의 회의록 내용과 누적 노트를 참고하여 보강한다.

| 항목 | 부족 기준 | 보강 방법 |
|------|----------|----------|
| 기존 대안 테이블 | 3개 미만 | 해당 영역의 실제 대안 (기존 MCP 서버, npm 패키지, CLI 도구 등) 추가 |
| JSON schema | tool/resource 정의에 schema 없음 | inputSchema, properties, required 포함한 JSON 코드 블록 추가 |
| 해자 전략 | "먼저 만들었다"만 있음 | 기술/커뮤니티/생태계 해자 검토 후 추가 |
| 확산 채널 | 3개 미만 | 타겟 개발자가 모이는 곳 기반 채널 추가 (GitHub, Reddit, Discord, HN 등) |
| Go/No-Go | 성공 조건만, 실패 출구 없음 | 실패 시 출구 + 총 투입 시간 추가 |
| 기각된 대안 | 사유가 1단어 | 사유를 1~2문장으로 보강 |
| MCP 스펙 정합성 | tool name이 MCP 컨벤션 미준수 | snake_case 이름 + 명확한 description으로 수정 |

---

## 결과 보고 형식

검수 완료 후 **반드시** 아래 형식으로 보고한다:

```
## Reviewer 검수 결과: {프로젝트명}

### 검증 결과 요약
| 항목 | 결과 | 비고 |
|------|------|------|
| 기획서 Part 1 | {N}/9 섹션 | {누락 목록 또는 "전체 통과"} |
| 기획서 Part 2 (PRD) | {N}/5 섹션 | {누락 목록 또는 "전체 통과"} |
| 별점 배지 | PASS/FAIL | |
| 전문가/라운드 배지 | PASS/FAIL | {"8인 전문가, 8라운드" 존재 여부} |
| 해자 전략 | PASS/FAIL | |
| JSON Schema | PASS/FAIL | {tool/resource schema 존재 여부} |
| MCP 스펙 설계 | PASS/FAIL | {tools/resources/prompts 정의 여부} |
| config.json | PASS/FAIL | {누락 필드 목록} |
| 회의록 품질 | PASS/WARN/FAIL | {N}줄, 라운드 {N}개, {진행/재실행 권고} |
| 홈페이지 보호 | PASS/FAIL | {원복 여부} |
| STYLE_GUIDE | PASS/FAIL | {위반 항목 수} |
| 빌드 | PASS/FAIL | |

### 수정 내역
1. [{파일}] {수정 항목}: {변경 전} → {변경 후}
2. ...

### 보강 내역
1. [{파일}] {보강 항목}: {추가 내용 요약}
2. ...

### deployer 호출 정보
- memoryFolder: {id}
- id: {id}
- title: {title}
- subtitle: {subtitle}
- tags: {tags}
- color: {color}
- stars: {stars}
```

---

## 주의사항

1. **기획서 논의 결론을 바꾸지 않는다** — 누락 섹션 추가 + 구조 보완이 목적. Go→No-Go 변경 등 판정 변경 금지.
2. **minutes.md, minutes/page.tsx 수정 금지** — 둘 다 읽기 전용. minutes/page.tsx는 generate-all.mts가 자동 생성.
3. **한국어로 보강** — 코드/변수명만 영어.
4. **STYLE_GUIDE.md를 반드시 먼저 읽는다** — 모든 수정의 스타일 기준.
5. **수정 시 기존 코드 패턴을 따른다** — 해당 page.tsx에서 이미 사용하는 아이콘, 색상, 클래스명을 재사용.
6. **import 누락 주의** — 새 Lucide 아이콘 추가 시 반드시 import문에도 추가.
7. **홈페이지는 절대 수정하지 않는다** — 변경이 감지되면 즉시 원복.
8. **회의록 심각 미달 시 deployer 중단** — 품질 미달이 심각하면 deployer 호출하지 않고 "brainstorm 재실행 권고" 보고.
9. **JSON Schema 필수 확인** — MCP 서버 기획에서 JSON schema 없는 기획서는 불완전. 반드시 보강.
