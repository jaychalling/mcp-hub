'use client';

import { PageShell } from '@/components/page-shell';
import { Star, Target, Users, Shield, Zap, Package, GitBranch, AlertTriangle, XCircle, CheckCircle, Code, FileText, Search, Layers, Calendar, Rocket, TrendingUp, ArrowRight } from 'lucide-react';

export default function DocsPage() {
  return (
    <PageShell
      projectId="mcp-openapi"
      projectTitle="mcp-openapi"
      subtitle="OpenAPI/Swagger 스펙을 AI 에이전트가 탐색하고 활용할 수 있게 하는 MCP 서버"
      activeTab="docs"
      date="2026-02-06"
      badges={[
        { label: 'MCP', className: 'bg-blue-500/20 text-blue-600' },
        { label: 'OpenAPI', className: 'bg-purple-500/20 text-purple-600' },
        { label: 'DX', className: 'bg-emerald-500/20 text-emerald-600' },
        { label: 'API Tooling', className: 'bg-orange-500/20 text-orange-600' },
      ]}
    >
      {/* 별점 배지 */}
      <div className="flex items-center gap-2 mb-8">
        <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-600 gap-1">
          <Star size={10} />4/5
        </span>
        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-border text-muted-foreground">
          전문가 8명 · 8라운드
        </span>
        <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">
          Go 판정
        </span>
      </div>

      {/* =========================================== */}
      {/* Part 1: MCP 서버 기획서 */}
      {/* =========================================== */}

      <div className="rounded-lg border-2 border-blue-500 p-4 mb-8 bg-card">
        <p className="font-semibold text-lg text-foreground">Part 1 — MCP 서버 기획서</p>
        <p className="text-muted-foreground text-sm mt-1">아이디어 검증, 시장 분석, 차별화 전략, 리스크 평가</p>
      </div>

      {/* 1. 서비스 개요 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Target size={20} className="text-blue-600" />1. 서비스 개요
      </h2>
      <div className="rounded-lg border-2 border-blue-500 p-4 mb-4 bg-card">
        <p className="font-semibold text-foreground">OpenAPI/Swagger 스펙을 AI 에이전트가 이해할 수 있는 구조화된 인터페이스로 변환하여, API 탐색 → 이해 → 프로토타이핑 시간을 10분에서 30초로 단축하는 MCP 서버</p>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-3">
        개발자가 새로운 API를 통합할 때마다 반복하는 작업이 있습니다: OpenAPI 스펙 문서 열기, endpoint 찾기, 파라미터 확인, 인증 방식 파악, 테스트 호출, 클라이언트 코드 작성. <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">mcp-openapi</code>는 이 전체 과정을 AI 에이전트에게 위임합니다.
      </p>

      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">왜 지금 이 MCP가 필요한가:</strong> AI 에이전트가 코드를 작성하는 시대에, API 문서를 &quot;읽는&quot; 것은 여전히 수동입니다. 10만 줄짜리 Kubernetes API 스펙을 AI 컨텍스트에 통째로 넣는 것은 비현실적이고, 구조화된 탐색 인터페이스가 필요합니다. MCP 프로토콜이 이 문제의 정확한 해결 수단입니다.
      </p>

      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-6">
        <li><strong className="text-foreground">핵심 가치:</strong> 대형 OpenAPI 스펙을 구조화하여 AI가 필요한 endpoint만 정확히 추출</li>
        <li><strong className="text-foreground">$ref 해소:</strong> 중첩된 참조를 자동으로 풀어 AI에게 clean한 스키마 전달</li>
        <li><strong className="text-foreground">인기 API 프리셋:</strong> Stripe, GitHub 등 주요 API를 한 줄 명령으로 즉시 탐색</li>
        <li><strong className="text-foreground">Realistic Mock:</strong> JSON Schema format 기반으로 현실적인 테스트 데이터 자동 생성</li>
      </ul>

      {/* 2. 타겟 개발자 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Users size={20} className="text-blue-600" />2. 타겟 개발자
      </h2>

      <div className="space-y-4 mb-6">
        <div className="rounded-lg border p-4 bg-card">
          <p className="font-semibold text-foreground mb-2">Primary: API 통합 개발자</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>프론트엔드/백엔드 가리지 않고 서드파티 API를 붙이는 업무가 주</li>
            <li>SaaS 연동, 결제 API, 소셜 로그인, 외부 데이터 소스 통합</li>
            <li>주간 사용 빈도: 3회 이상 (새 API endpoint 확인, 파라미터 체크, 테스트 데이터 생성)</li>
            <li>페인포인트: Swagger UI 열기 → 스크롤해서 찾기 → 파라미터 하나하나 확인 반복</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <p className="font-semibold text-foreground mb-2">Secondary: API 설계자 / 문서 관리자</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>자기 API의 OpenAPI 스펙을 관리하는 백엔드 개발자</li>
            <li>스펙 검증, 프론트엔드 팀에 목 데이터 제공, API 변경사항 추적</li>
            <li>MCP로 스펙을 로드하면 &quot;우리 API가 올바르게 정의되었는지&quot; AI로 검증 가능</li>
            <li>페인포인트: 스펙 파일 작성 후 validation 도구를 별도로 돌려야 함</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <p className="font-semibold text-foreground mb-2">Tertiary: AI 코딩 도구 얼리어답터</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>Claude Desktop, Cursor 등 AI 코딩 도구를 적극 활용하는 개발자</li>
            <li>MCP 생태계에 관심이 높고, 새로운 MCP 서버를 빠르게 설치해보는 얼리어답터층</li>
            <li>GitHub stars, Reddit 공유의 주요 동력. 바이럴 확산의 핵심 세그먼트</li>
          </ul>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-6">
        <strong className="text-foreground">타겟 규모 추정:</strong> OpenAPI 스펙을 사용하는 API 통합 개발자 약 200만 명+ (Swagger 에코시스템 기준), MCP 활성 사용자 약 5만 명+ (2026 초 기준). Primary 타겟 중 주간 활성 잠재 사용자 약 1만 명.
      </p>

      {/* 3. 기존 대안 분석 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Search size={20} className="text-blue-600" />3. 기존 대안 분석
      </h2>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">서버명</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">Stars</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">약점</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">mcp-openapi (janwilmake)</td>
              <td className="px-2 py-2 text-muted-foreground">~45</td>
              <td className="px-2 py-2 text-muted-foreground">테스트 호출 불가, 코드 생성 없음, 목 데이터 없음</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">openapi-mcp-server</td>
              <td className="px-2 py-2 text-muted-foreground">~30</td>
              <td className="px-2 py-2 text-muted-foreground">기본 탐색만, 유지보수 중단 의심</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">mcp-api-tester</td>
              <td className="px-2 py-2 text-muted-foreground">~15</td>
              <td className="px-2 py-2 text-muted-foreground">OpenAPI 특화 아님, 범용 HTTP 클라이언트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground leading-relaxed mt-3 mb-6">
        <strong className="text-foreground">포지셔닝:</strong> 기존 MCP 서버들은 &quot;스펙 읽기&quot;에만 집중하고 탐색/목 데이터/프리셋을 제공하지 않습니다. <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">mcp-openapi</code>는 &quot;스펙 파싱 + 구조화 탐색 + realistic mock + 인기 API 프리셋&quot;을 통합한 원스톱 API 탐색기로 포지셔닝합니다.
      </p>

      {/* 4. MCP 스펙 설계 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Code size={20} className="text-blue-600" />4. MCP 스펙 설계
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-3">
        4개의 tool과 1개의 resource로 구성됩니다.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">Tools</h3>

      <div className="space-y-3 mb-4">
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-1">load_spec</p>
          <p className="text-muted-foreground text-sm mb-2">OpenAPI/Swagger 스펙을 로드합니다. 파일 경로, URL, 또는 프리셋 이름을 지원합니다.</p>
          <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto"><code>{`{
  "name": "load_spec",
  "inputSchema": {
    "type": "object",
    "properties": {
      "source": {
        "type": "string",
        "description": "파일 경로, URL, 또는 프리셋 이름 (stripe, github, slack, twilio, openai)"
      }
    },
    "required": ["source"]
  }
}`}</code></pre>
        </div>

        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-1">list_endpoints</p>
          <p className="text-muted-foreground text-sm mb-2">로드된 스펙의 endpoint 목록을 반환합니다. 태그, HTTP 메서드, 키워드 필터 지원.</p>
          <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto"><code>{`{
  "name": "list_endpoints",
  "inputSchema": {
    "type": "object",
    "properties": {
      "tag": { "type": "string", "description": "OpenAPI 태그 필터" },
      "method": { "type": "string", "enum": ["GET","POST","PUT","DELETE","PATCH"] },
      "search": { "type": "string", "description": "경로/설명 키워드 검색" }
    }
  }
}`}</code></pre>
        </div>

        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-1">describe_endpoint</p>
          <p className="text-muted-foreground text-sm mb-2">특정 endpoint의 상세 정보를 반환합니다. 파라미터, 요청/응답 스키마, 목 데이터 포함.</p>
          <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto"><code>{`{
  "name": "describe_endpoint",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": { "type": "string", "description": "API 경로 (예: /v1/charges)" },
      "method": { "type": "string", "description": "HTTP 메서드" },
      "include_mock": { "type": "boolean", "default": true }
    },
    "required": ["path", "method"]
  }
}`}</code></pre>
        </div>

        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-1">summarize_spec</p>
          <p className="text-muted-foreground text-sm mb-2">로드된 스펙의 전체 요약 (endpoint 수, 인증 방식, 카테고리 등)을 반환합니다.</p>
          <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto"><code>{`{
  "name": "summarize_spec",
  "inputSchema": {
    "type": "object",
    "properties": {}
  }
}`}</code></pre>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">Resources</h3>
      <div className="rounded-lg border p-3 bg-card mb-6">
        <p className="font-semibold text-foreground text-sm mb-1">openapi://current/info</p>
        <p className="text-muted-foreground text-sm">현재 로드된 OpenAPI 스펙의 기본 정보 (이름, 버전, base URL). AI가 매번 tool 호출 없이 컨텍스트를 유지할 수 있게 합니다.</p>
      </div>

      {/* 5. 차별점 & 해자 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Shield size={20} className="text-blue-600" />5. 차별점 & 해자
      </h2>

      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
        <li><strong className="text-foreground">인기 API 프리셋 내장:</strong> Stripe, GitHub, Slack, Twilio, OpenAI — <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">load_spec(&quot;stripe&quot;)</code> 한 줄로 즉시 탐색. 기존 MCP 서버 어디에도 없는 기능.</li>
        <li><strong className="text-foreground">$ref 자동 해소:</strong> 중첩된 JSON Schema 참조를 lazy하게 풀어 clean한 스키마 제공. AI 정확도 향상.</li>
        <li><strong className="text-foreground">Realistic Mock 데이터:</strong> JSON Schema format(email, date-time, uri, uuid)을 인식해 현실적인 테스트 데이터 생성.</li>
        <li><strong className="text-foreground">키워드 검색:</strong> endpoint 경로뿐 아니라 설명까지 검색하여 &quot;결제&quot; 같은 자연어로 탐색 가능.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-3">해자 구축 로드맵</h3>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-6">
        <li><span className="font-bold text-foreground">Phase 1 (W1-2):</span> 기술 해자 — MCP 스펙 완전 준수 + $ref lazy dereference로 대형 스펙 안정 처리. 경쟁자 대비 기술 품질 우위 확보.</li>
        <li><span className="font-bold text-foreground">Phase 2 (M1-3):</span> 커뮤니티 해자 — GitHub Stars 200+ 달성 + 프리셋 PR 기여자 확보. npm 주간 다운로드 500+ 기반 de facto standard 포지셔닝.</li>
        <li><span className="font-bold text-foreground">Phase 3 (M3-6):</span> 생태계 해자 — API Diff, 다중 스펙 동시 로드, API 간 연결 그래프. 기능 축적으로 후발주자 진입 장벽 구축 + MCP 공식 추천 목록 등재.</li>
      </ul>

      {/* 6. 확산 전략 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Rocket size={20} className="text-blue-600" />6. 확산 전략
      </h2>

      <div className="space-y-3 mb-6">
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">1차 채널: Show HN + r/ClaudeAI</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>Show HN 제목: &quot;Show HN: mcp-openapi -- AI agents can now explore any API with one command&quot;</li>
            <li>r/ClaudeAI: MCP 사용자가 집중된 커뮤니티. 데모 GIF 첨부</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">2차 채널: r/webdev + r/ChatGPTCoding + X</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>r/webdev: API 통합 개발자 대상</li>
            <li>r/ChatGPTCoding: AI 코딩 도구 관심층</li>
            <li>X: #MCP #AI #OpenAPI 해시태그 + 30초 데모 GIF</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">데모 전략: 30초 GIF</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>(0-10초) &quot;Stripe API를 분석해줘&quot; → 312개 endpoint, 15개 카테고리 요약</li>
            <li>(10-20초) &quot;결제 관련 endpoint&quot; → 필터된 목록 + 상세 정보</li>
            <li>(20-30초) 목 데이터 생성 + AI가 코드 작성</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">README 구조</p>
          <p className="text-muted-foreground text-sm">Hero GIF → 30초 설치 (config 3줄) → Features 목록 → 프리셋 테이블 → 사용 예시 → Contributing</p>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-6">
        <strong className="text-foreground">성공 지표:</strong> 1주 GitHub 80+ stars / npm 200+ downloads → 1개월 200+ stars / 500+ weekly downloads → 3개월 MCP 공식 추천 목록 등재 시도
      </p>

      {/* 7. 리스크 매트릭스 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <AlertTriangle size={20} className="text-blue-600" />7. 리스크 매트릭스
      </h2>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">리스크</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">확률/영향</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">대책</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">스펙 품질 의존</td>
              <td className="px-2 py-2 text-muted-foreground">중간/중간</td>
              <td className="px-2 py-2 text-muted-foreground">Validation 에러 메시지로 구체적 문제점 알림</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">플랫폼 내재화</td>
              <td className="px-2 py-2 text-muted-foreground">낮음/높음</td>
              <td className="px-2 py-2 text-muted-foreground">속도 우위 + 프리셋/커스터마이징으로 차별화</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">프리셋 URL 변경</td>
              <td className="px-2 py-2 text-muted-foreground">낮음/낮음</td>
              <td className="px-2 py-2 text-muted-foreground">URL only 저장 + 커뮤니티 PR로 빠른 대응</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">대형 스펙 메모리</td>
              <td className="px-2 py-2 text-muted-foreground">중간/중간</td>
              <td className="px-2 py-2 text-muted-foreground">Lazy $ref 해소로 endpoint별 선택적 dereference</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 8. 기각된 대안 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <XCircle size={20} className="text-blue-600" />8. 기각된 대안
      </h2>

      <div className="space-y-3 mb-6">
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">MVP에 실제 HTTP 테스트 호출 포함</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: 보안 이슈 (write endpoint 의도치 않은 호출) + 인증 처리 복잡도. v1.1으로 이관.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">MVP에 클라이언트 코드 스니펫 생성</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: AI 에이전트가 스펙 정보만 있으면 이미 코드 생성을 잘 함. 중복 기능이라 불필요.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">MVP에 다중 스펙 동시 로드</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: 메모리 부담 + 스코프 과잉. 단일 스펙으로 핵심 가치 충분히 전달 가능. v1.1 후보.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">목 데이터 커스텀 필드명 매칭</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: 오버엔지니어링 위험. JSON Schema format 기반 기본 목 데이터로 충분. 필드명 기반 매칭은 예외 케이스가 많아 유지보수 비용 과다.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">GraphQL 스키마 동시 지원</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: OpenAPI와 GraphQL은 파싱 로직이 완전히 다르며, 스코프가 2배로 증가. &quot;OpenAPI 전문가&quot; 포지셔닝이 &quot;범용 API 도구&quot;보다 차별화에 유리. GraphQL 지원은 별도 MCP 서버로 분리하는 것이 적절.</p>
        </div>
      </div>

      {/* 9. Go/No-Go 판정 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <CheckCircle size={20} className="text-green-600" />9. Go/No-Go 판정
      </h2>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">지표</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">값</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">판정</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">기존 대안</td>
              <td className="px-2 py-2 text-muted-foreground">최대 45 stars (&lt; 100)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">개발자 필요성</td>
              <td className="px-2 py-2 text-muted-foreground">주 3회+ (&gt; 주 1회)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">MVP 개발</td>
              <td className="px-2 py-2 text-muted-foreground">5일 (&lt; 2주)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">차별점</td>
              <td className="px-2 py-2 text-muted-foreground">3개 (프리셋/구조화 탐색/mock)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">바이럴 잠재력</td>
              <td className="px-2 py-2 text-muted-foreground">Stripe 분석 데모 GIF</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">유지보수 부담</td>
              <td className="px-2 py-2 text-muted-foreground">외부 API 0개, deps 3개</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border-2 border-green-500 p-4 mt-4 mb-4 bg-card">
        <p className="font-semibold text-green-600 text-lg">최종 판정: Go</p>
        <p className="text-muted-foreground text-sm mt-1">6개 항목 전부 PASS. 4개 리스크 모두 관리 가능. 데모 GIF 필수 제작 조건.</p>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-2">
        <strong className="text-foreground">성공 조건:</strong> 출시 1주 내 GitHub 80+ stars, 30초 데모 GIF가 &quot;cool!&quot; 반응 유발
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        <strong className="text-foreground">실패 시 출구:</strong> 2주 내 20 stars 미만이면 &quot;mcp-api-testing&quot; (OpenAPI 기반 자동 API 테스트)으로 피벗 검토
      </p>

      {/* =========================================== */}
      {/* Part 2: PRD */}
      {/* =========================================== */}

      <div className="rounded-lg border-2 border-purple-500 p-4 mb-8 bg-card">
        <p className="font-semibold text-lg text-foreground">Part 2 — PRD (Product Requirements Document)</p>
        <p className="text-muted-foreground text-sm mt-1">MVP 스코프, 기술 설계, 개발 일정, 로드맵</p>
      </div>

      {/* PRD 1. MVP 스코프 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Package size={20} className="text-purple-600" />PRD 1. MVP 스코프
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-3">
        1주(5일) 내 1인 개발 가능한 범위. Tool 4개 + Resource 1개 + 프리셋 5개.
      </p>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">구분</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">항목</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">설명</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Tool</td>
              <td className="px-2 py-2 text-foreground font-medium">load_spec</td>
              <td className="px-2 py-2 text-muted-foreground">파일/URL/프리셋에서 스펙 로드 + validation</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Tool</td>
              <td className="px-2 py-2 text-foreground font-medium">list_endpoints</td>
              <td className="px-2 py-2 text-muted-foreground">태그/메서드/키워드 필터로 endpoint 목록 조회</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Tool</td>
              <td className="px-2 py-2 text-foreground font-medium">describe_endpoint</td>
              <td className="px-2 py-2 text-muted-foreground">endpoint 상세 + 파라미터 + mock 데이터</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Tool</td>
              <td className="px-2 py-2 text-foreground font-medium">summarize_spec</td>
              <td className="px-2 py-2 text-muted-foreground">스펙 전체 요약 (endpoint 수, 인증, 카테고리)</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Resource</td>
              <td className="px-2 py-2 text-foreground font-medium">openapi://current/info</td>
              <td className="px-2 py-2 text-muted-foreground">현재 로드된 스펙 기본 정보</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">프리셋</td>
              <td className="px-2 py-2 text-foreground font-medium">5개 내장</td>
              <td className="px-2 py-2 text-muted-foreground">Stripe, GitHub, Slack, Twilio, OpenAI</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PRD 2. MCP Tool/Resource 설계 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Layers size={20} className="text-purple-600" />PRD 2. MCP Tool/Resource 설계
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-3">
        각 tool의 입력/출력 스키마와 응답 예시입니다.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">load_spec 응답 예시</h3>
      <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-4"><code>{`{
  "content": [{
    "type": "text",
    "text": "스펙 로드 완료: Stripe API v2025-01\\n- 버전: 3.1.0\\n- Base URL: https://api.stripe.com\\n- Endpoint 수: 312\\n- 인증: Bearer Token + API Key\\n\\nsummarize_spec 또는 list_endpoints로 탐색을 시작하세요."
  }]
}`}</code></pre>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">describe_endpoint 응답 예시 (include_mock: true)</h3>
      <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-4"><code>{`{
  "content": [{
    "type": "text",
    "text": "POST /v1/charges\\n\\n설명: 새 결제를 생성합니다.\\n\\n필수 파라미터:\\n- amount (integer): 결제 금액 (센트 단위)\\n- currency (string): 통화 코드 (예: usd)\\n- source (string): 결제 소스 토큰\\n\\n목 요청 데이터:\\n{\\n  \\"amount\\": 2500,\\n  \\"currency\\": \\"usd\\",\\n  \\"source\\": \\"tok_visa\\"\\n}\\n\\n목 응답 데이터:\\n{\\n  \\"id\\": \\"ch_1N4xkQ2eZvKY..\\",\\n  \\"amount\\": 2500,\\n  \\"currency\\": \\"usd\\",\\n  \\"status\\": \\"succeeded\\"\\n}"
  }]
}`}</code></pre>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">에러 응답 예시</h3>
      <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-6"><code>{`{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "스펙 로드 실패: 유효하지 않은 OpenAPI 스펙입니다.\\n\\n오류 목록:\\n- /paths/users/get: 'responses' 필드가 필수입니다\\n- /components/schemas/User: 'type' 필드가 필수입니다\\n\\n총 2개 오류 발견."
  }]
}`}</code></pre>

      {/* PRD 3. 기술 스택 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <GitBranch size={20} className="text-purple-600" />PRD 3. 기술 스택
      </h2>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">카테고리</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">선택</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">이유</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">런타임</td>
              <td className="px-2 py-2 text-foreground font-medium">Node.js 20+</td>
              <td className="px-2 py-2 text-muted-foreground">MCP SDK 공식 지원</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">언어</td>
              <td className="px-2 py-2 text-foreground font-medium">TypeScript (strict)</td>
              <td className="px-2 py-2 text-muted-foreground">타입 안전성 + MCP 생태계 표준</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">MCP SDK</td>
              <td className="px-2 py-2 text-foreground font-medium">@modelcontextprotocol/sdk</td>
              <td className="px-2 py-2 text-muted-foreground">공식 SDK</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">전송</td>
              <td className="px-2 py-2 text-foreground font-medium">stdio</td>
              <td className="px-2 py-2 text-muted-foreground">Claude Desktop 표준</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">스펙 파싱</td>
              <td className="px-2 py-2 text-foreground font-medium">@apidevtools/swagger-parser</td>
              <td className="px-2 py-2 text-muted-foreground">OpenAPI 2.0/3.0/3.1 지원</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">목 데이터</td>
              <td className="px-2 py-2 text-foreground font-medium">json-schema-faker</td>
              <td className="px-2 py-2 text-muted-foreground">JSON Schema → realistic 샘플 데이터</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">빌드</td>
              <td className="px-2 py-2 text-foreground font-medium">tsup</td>
              <td className="px-2 py-2 text-muted-foreground">번들링 + ESM/CJS</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground leading-relaxed mt-3 mb-6">
        핵심 의존성 3개만 사용하여 유지보수 부담 최소화.
      </p>

      {/* PRD 4. 개발 일정 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Calendar size={20} className="text-purple-600" />PRD 4. 개발 일정
      </h2>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">일차</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">작업</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">산출물</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">1일차</td>
              <td className="px-2 py-2 text-muted-foreground">프로젝트 셋업 + load_spec + spec_store</td>
              <td className="px-2 py-2 text-muted-foreground">스펙 로드/파싱 동작</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">2일차</td>
              <td className="px-2 py-2 text-muted-foreground">list_endpoints + describe_endpoint</td>
              <td className="px-2 py-2 text-muted-foreground">핵심 탐색 기능 완성</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">3일차</td>
              <td className="px-2 py-2 text-muted-foreground">summarize_spec + mock_generator + resource</td>
              <td className="px-2 py-2 text-muted-foreground">전체 tool 완성</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">4일차</td>
              <td className="px-2 py-2 text-muted-foreground">프리셋 5개 + --spec 인자 + 에러 핸들링</td>
              <td className="px-2 py-2 text-muted-foreground">프리셋 동작 + 에러 처리</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">5일차</td>
              <td className="px-2 py-2 text-muted-foreground">테스트 + README + npm 배포 + 데모 GIF</td>
              <td className="px-2 py-2 text-muted-foreground">v1.0 출시</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PRD 5. Post-MVP 로드맵 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <TrendingUp size={20} className="text-purple-600" />PRD 5. Post-MVP 로드맵
      </h2>

      <div className="space-y-4 mb-8">
        <div className="rounded-lg border-l-4 border-l-blue-500 p-4 bg-card">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">v1.1 <ArrowRight size={14} className="text-muted-foreground" /> 출시 후 1-2주</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>API Diff: 두 버전의 스펙 비교 (변경/추가/삭제 endpoint)</li>
            <li>실제 HTTP 테스트 호출 (read-only endpoint만, 인증 토큰 설정 지원)</li>
            <li>프리셋 확대: 커뮤니티 PR 기반으로 10개+</li>
          </ul>
        </div>
        <div className="rounded-lg border-l-4 border-l-purple-500 p-4 bg-card">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">v2.0 <ArrowRight size={14} className="text-muted-foreground" /> 출시 후 1개월</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>다중 스펙 동시 로드: 마이크로서비스 환경 지원</li>
            <li>크로스-API 질문: &quot;사용자 서비스와 결제 서비스 연동 흐름&quot;</li>
            <li>목 데이터 커스텀 생성기 (필드명 기반 매칭)</li>
          </ul>
        </div>
        <div className="rounded-lg border-l-4 border-l-emerald-500 p-4 bg-card">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">v3.0 <ArrowRight size={14} className="text-muted-foreground" /> 출시 후 3개월</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>API 간 연결 그래프: 여러 API의 데이터 흐름 시각화</li>
            <li>MCP 공식 추천 목록 등재</li>
            <li>커뮤니티 피드백 기반 기능 추가</li>
          </ul>
        </div>
      </div>

    </PageShell>
  );
}
