'use client';

import { PageShell } from '@/components/page-shell';
import { Star, Target, Users, Shield, Zap, Package, GitBranch, AlertTriangle, XCircle, CheckCircle, Code, Layers, Calendar, Rocket, TrendingUp, ArrowRight, Gamepad2, Trophy, CreditCard } from 'lucide-react';

export default function DocsPage() {
  return (
    <PageShell
      projectId="mcp-claude-fun"
      projectTitle="mcp-code-pulse"
      subtitle="Git 커밋을 트레이딩 카드로 만들어 코딩 성과를 수집하고 자랑하게 하는 MCP 서버"
      activeTab="docs"
      date="2026-02-06"
      badges={[
        { label: 'MCP', className: 'bg-blue-500/20 text-blue-600' },
        { label: 'Gamification', className: 'bg-purple-500/20 text-purple-600' },
        { label: 'Git', className: 'bg-orange-500/20 text-orange-600' },
        { label: 'DX', className: 'bg-emerald-500/20 text-emerald-600' },
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

      <div className="rounded-lg border-2 border-purple-500 p-4 mb-8 bg-card">
        <p className="font-semibold text-lg text-foreground">Part 1 — MCP 서버 기획서</p>
        <p className="text-muted-foreground text-sm mt-1">아이디어 검증, 생태계 분석, 차별화 전략, 리스크 평가</p>
      </div>

      {/* 1. 서비스 개요 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Target size={20} className="text-purple-600" />1. 서비스 개요
      </h2>
      <div className="rounded-lg border-2 border-purple-500 p-4 mb-4 bg-card">
        <p className="font-semibold text-foreground">Git 커밋 히스토리를 분석해 트레이딩 카드와 업적을 자동 생성하여, 코딩 성과를 게이미피케이션으로 재미있게 시각화하는 MCP 서버</p>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-3">
        개발자가 하루 끝에 &quot;오늘 뭘 했지?&quot; 궁금할 때, <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">mcp-code-pulse</code>는 git 히스토리를 분석해서 트레이딩 카드를 생성합니다. 커밋 패턴에 따라 다른 종류와 희귀도의 카드가 나오고, 업적 시스템으로 수집 욕구를 자극합니다.
      </p>

      <p className="text-muted-foreground leading-relaxed mb-4">
        <strong className="text-foreground">왜 지금 이 MCP가 필요한가:</strong> MCP 생태계는 2026년 초 현재 &quot;실용 도구&quot; 일색입니다. mcp-memory, mcp-github, mcp-filesystem 등 모두 유틸리티 카테고리입니다. <strong className="text-foreground">게이미피케이션 MCP는 존재하지 않습니다.</strong> 이 프로젝트는 MCP 생태계에 &quot;재미&quot;라는 새로운 카테고리를 만드는 최초의 시도입니다.
      </p>

      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
        <li><strong className="text-foreground">핵심 가치:</strong> 숫자(git log --stat)를 감성적 경험(트레이딩 카드)으로 변환</li>
        <li><strong className="text-foreground">자동 수집:</strong> git 히스토리 기반 — 별도 설정이나 수동 입력 없이 완전 자동</li>
        <li><strong className="text-foreground">바이럴 내장:</strong> 카드 자체가 공유 가능한 콘텐츠 — 스크린샷 문화와 자연 결합</li>
        <li><strong className="text-foreground">완전 로컬:</strong> 외부 API 의존 0개, git CLI만 사용</li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-3">유저 이득: Before / After</h3>
      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">Before (지금)</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">After (mcp-code-pulse 설치 후)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-muted-foreground">하루 끝에 <code className="bg-secondary px-1 py-0.5 rounded text-xs">git log --stat</code> → 숫자 나열. 재미 0, 공유 불가</td>
              <td className="px-2 py-2 text-muted-foreground">&quot;오늘의 카드 보여줘&quot; 한마디 → 희귀도 있는 트레이딩 카드 + 업적 해금. 스크린샷 찍어 자랑 가능</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-muted-foreground">코딩 성과 = 커밋 수. 동기부여 약함</td>
              <td className="px-2 py-2 text-muted-foreground">코딩 성과 = 카드 수집 + 업적 + 히든 카드 발견. &quot;Legendary 카드 뽑고 싶다&quot;는 재미 동기</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-muted-foreground">WakaTime 등 별도 도구 설치 필요. MCP와 분리된 경험</td>
              <td className="px-2 py-2 text-muted-foreground">Claude Code 안에서 config 3줄 추가만으로 완료. AI 코딩 흐름 안에서 끊김 없이 확인</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. 타겟 개발자 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Users size={20} className="text-purple-600" />2. 타겟 개발자
      </h2>

      <div className="space-y-4 mb-6">
        <div className="rounded-lg border p-4 bg-card">
          <p className="font-semibold text-foreground mb-2">Primary: Claude Code 파워유저</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>Claude Code를 매일 사용하는 개발자</li>
            <li>MCP 생태계에 익숙하고, 새 MCP를 빠르게 설치해보는 얼리어답터</li>
            <li>코딩 후 성과를 가시화하고 싶은 욕구</li>
            <li>사용 빈도: 매일 1회+ (&quot;오늘의 카드&quot; 확인)</li>
            <li>페인포인트: git log --stat는 숫자일 뿐 — 재미없고 공유 불가</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <p className="font-semibold text-foreground mb-2">Secondary: AI 코딩 도구 사용자 전반</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>Cursor, Windsurf, Claude Desktop 등 MCP 지원 도구 사용자</li>
            <li>git을 사용하는 모든 개발자가 대상</li>
            <li>&quot;AI로 코딩하면서 재미있는 걸 해보고 싶다&quot;는 호기심</li>
            <li>카드 스크린샷을 X/Reddit에 공유하는 행동 패턴과 자연 결합</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <p className="font-semibold text-foreground mb-2">Tertiary: MCP 생태계 기여자 / 오픈소스 개발자</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>새로운 카드나 업적을 직접 만들어 PR하고 싶은 기여 욕구</li>
            <li>MCP 서버 개발을 배우고 싶은 개발자 — 코드가 간결해서 참고 프로젝트로 적합</li>
            <li>규모: GitHub MCP 관련 repo 기여자 약 3,000명+</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg border-l-4 border-l-purple-500 p-4 bg-card mb-4">
        <p className="font-semibold text-foreground mb-2">이걸 쓰면 뭐가 좋아지는가?</p>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
          <li><strong className="text-foreground">매일 코딩이 끝나면 &quot;선물&quot;이 생긴다.</strong> git log 숫자 대신 트레이딩 카드를 받으면, 하루 작업에 대한 보상감이 생겨서 다음 날도 코딩하고 싶어집니다.</li>
          <li><strong className="text-foreground">공유할 거리가 생긴다.</strong> &quot;오늘 Epic 카드 뽑았다!&quot; 한마디에 동료 개발자가 &quot;그게 뭐야?&quot; 하고 관심을 보이는 자연스러운 대화 소재.</li>
          <li><strong className="text-foreground">설정 0, 학습 0.</strong> config 3줄 추가하고 &quot;카드 보여줘&quot; 한마디면 끝. 복잡한 대시보드도, 웹 로그인도 필요 없습니다.</li>
        </ul>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-6">
        <strong className="text-foreground">타겟 규모 추정:</strong> MCP 활성 사용자 약 5만 명+ (2026 초 기준). Claude Code 일일 사용자 중 MCP를 설치해본 비율 약 30% 추정. Primary 타겟 약 1.5만 명.
      </p>

      {/* 3. 기존 대안 분석 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Gamepad2 size={20} className="text-purple-600" />3. 기존 대안 분석
      </h2>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">대안</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">Stars</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">우리와의 차이</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">WakaTime (IDE 플러그인)</td>
              <td className="px-2 py-2 text-muted-foreground">8000+</td>
              <td className="px-2 py-2 text-muted-foreground">시간 추적 전용. MCP 아님. 카드/업적 없음</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">git-stats (CLI)</td>
              <td className="px-2 py-2 text-muted-foreground">~500</td>
              <td className="px-2 py-2 text-muted-foreground">숫자 표만 출력. 재미 요소 0. MCP 아님</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">게이미피케이션 MCP</td>
              <td className="px-2 py-2 text-muted-foreground">0</td>
              <td className="px-2 py-2 text-muted-foreground">존재하지 않음 — 완전한 블루오션</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground leading-relaxed mt-3 mb-6">
        <strong className="text-foreground">포지셔닝:</strong> MCP 생태계 최초의 게이미피케이션 서버. &quot;개발자를 위한 WakaTime의 재미있는 버전 + MCP 네이티브&quot;. 기존 MCP 서버들이 전부 실용 도구인 상황에서, &quot;재미&quot;라는 새 카테고리를 창시.
      </p>

      {/* 4. MCP 스펙 설계 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Code size={20} className="text-purple-600" />4. MCP 스펙 설계
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-3">
        3개의 tool, 1개의 resource, 1개의 prompt로 구성됩니다. 모든 tool은 필수 파라미터 0개로 기본값 동작합니다.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">Tools</h3>

      <div className="space-y-3 mb-4">
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-1">get_coding_card</p>
          <p className="text-muted-foreground text-sm mb-2">git 히스토리를 분석해서 코딩 카드를 생성합니다. 카드는 커밋 패턴에 따라 다른 종류와 희귀도를 가집니다.</p>
          <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto"><code>{`{
  "name": "get_coding_card",
  "inputSchema": {
    "type": "object",
    "properties": {
      "period": {
        "type": "string",
        "enum": ["today", "yesterday", "week", "month"],
        "default": "today",
        "description": "분석 기간"
      },
      "project_path": {
        "type": "string",
        "description": "git 저장소 경로 (기본: 현재 디렉토리)"
      }
    }
  }
}`}</code></pre>
        </div>

        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-1">get_achievements</p>
          <p className="text-muted-foreground text-sm mb-2">획득한 코딩 업적과 미달성 업적을 보여줍니다. git 히스토리를 기반으로 자동 판정합니다.</p>
          <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto"><code>{`{
  "name": "get_achievements",
  "inputSchema": {
    "type": "object",
    "properties": {
      "show_locked": {
        "type": "boolean",
        "default": true,
        "description": "미달성 업적도 보여줄지 여부"
      },
      "project_path": {
        "type": "string",
        "description": "git 저장소 경로 (기본: 현재 디렉토리)"
      }
    }
  }
}`}</code></pre>
        </div>

        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-1">get_coding_stats</p>
          <p className="text-muted-foreground text-sm mb-2">기간별 코딩 통계를 요약합니다. 커밋 수, 변경 파일, 추가/삭제 라인, 활동 시간대 등을 분석합니다.</p>
          <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto"><code>{`{
  "name": "get_coding_stats",
  "inputSchema": {
    "type": "object",
    "properties": {
      "period": {
        "type": "string",
        "enum": ["today", "week", "month", "year", "all"],
        "default": "week",
        "description": "분석 기간"
      },
      "project_path": {
        "type": "string",
        "description": "git 저장소 경로 (기본: 현재 디렉토리)"
      }
    }
  }
}`}</code></pre>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">Resources</h3>
      <div className="rounded-lg border p-3 bg-card mb-4">
        <p className="font-semibold text-foreground text-sm mb-1">codepulse://status</p>
        <p className="text-muted-foreground text-sm">현재 프로젝트의 기본 정보 — repo명, 총 커밋 수, 최근 활동 날짜, 획득 카드 수. Claude가 매번 tool 호출 없이 컨텍스트를 유지할 수 있게 합니다.</p>
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">Prompts</h3>
      <div className="rounded-lg border p-3 bg-card mb-6">
        <p className="font-semibold text-foreground text-sm mb-1">daily_wrap_up</p>
        <p className="text-muted-foreground text-sm">오늘의 코딩 세션을 마무리하며 카드와 통계를 한번에 확인하는 추천 프롬프트. 사용자가 /daily_wrap_up을 선택하면 get_coding_card + get_coding_stats를 연쇄 호출합니다.</p>
      </div>

      {/* 5. 차별점 & 해자 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Shield size={20} className="text-purple-600" />5. 차별점 & 해자
      </h2>

      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
        <li><strong className="text-foreground">트레이딩 카드 시스템:</strong> 숫자를 감성적 경험으로 변환. 수집 욕구와 자랑 욕구를 동시에 자극. MCP 생태계 최초.</li>
        <li><strong className="text-foreground">히든 카드:</strong> 특정 날짜(크리스마스, 할로윈), 특정 조건(100번째 커밋)에만 나오는 비밀 카드. 커뮤니티 공유와 2차 바이럴을 유도.</li>
        <li><strong className="text-foreground">숫자 기반 판별:</strong> 커밋 메시지 언어와 무관하게 git diff 통계만으로 카드 결정. 글로벌 사용 가능.</li>
        <li><strong className="text-foreground">완전 로컬:</strong> 외부 API 0개, 데이터가 로컬에만 저장. 프라이버시 걱정 없음.</li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-3">해자 구축 로드맵</h3>
      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-6">
        <li><span className="font-bold text-foreground">Phase 1 (W1-2):</span> 카드 18종 + 업적 15개로 핵심 경험 완성. 커뮤니티 카드 PR 구조 확립.</li>
        <li><span className="font-bold text-foreground">Phase 2 (M1-3):</span> 시즌제 카드 도입 (Season 2). 커뮤니티 기여 카드 10종+. GitHub 200+ stars 달성.</li>
        <li><span className="font-bold text-foreground">Phase 3 (M3-6):</span> mcp-code-quest (일일 퀘스트 시스템)으로 시리즈 확장. &quot;code-pulse 유니버스&quot; 구축.</li>
      </ul>

      {/* 6. 확산 전략 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Rocket size={20} className="text-purple-600" />6. 확산 전략
      </h2>

      <div className="space-y-3 mb-6">
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">1차 채널: r/ClaudeAI</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>MCP 사용자가 밀집된 커뮤니티 (25k+ 구독자)</li>
            <li>제목: &quot;I built an MCP that turns your git commits into collectible coding cards&quot;</li>
            <li>본문: 데모 GIF + 설치 가이드 + 카드 갤러리 미리보기</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">2차 채널: Show HN + r/ChatGPTCoding</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>Show HN: &quot;Show HN: mcp-code-pulse -- Git commits become trading cards in your AI coding assistant&quot;</li>
            <li>r/ChatGPTCoding (180k+): AI 코딩 전반 관심층. MCP 미사용자에게도 카드 GIF로 hook</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">3차 채널: X (Twitter)</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>카드 스크린샷 + &quot;What&#39;s your rarest card?&quot; 질문형 트윗</li>
            <li>해시태그: #ClaudeCode #MCP #CodingCards #DevLife</li>
            <li>개발자 스크린샷 공유 문화와 자연 결합</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">킬러 데모 GIF (30초)</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>(0-5초) Claude Code에서 &quot;오늘의 카드 보여줘&quot;</li>
            <li>(5-15초) 마크다운 카드 출력 — &quot;Code Warrior / EPIC!&quot;</li>
            <li>(15-25초) &quot;업적도 보여줘&quot; → 업적 리스트 + 새 업적 해금</li>
            <li>(25-30초) &quot;이번 주 통계는?&quot; → 주간 요약</li>
          </ul>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm mb-2">README 구조</p>
          <p className="text-muted-foreground text-sm">Hero GIF → 30초 설치 (config 3줄) → Card Gallery (전체 카드 테이블) → Achievements → Stats → How It Works → Contributing (새 카드 추가 PR 가이드)</p>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-6">
        <strong className="text-foreground">성공 지표:</strong> 1주 80+ stars / npm 150+ downloads → 1달 200+ stars / 외부 카드 PR 3개+ → 3달 500+ stars / &quot;가장 재미있는 MCP 서버&quot; 포지션
      </p>

      {/* 7. 리스크 매트릭스 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <AlertTriangle size={20} className="text-purple-600" />7. 리스크 매트릭스
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
              <td className="px-2 py-2 text-foreground">카드 지루해짐</td>
              <td className="px-2 py-2 text-muted-foreground">중간/중간</td>
              <td className="px-2 py-2 text-muted-foreground">시즌제 카드 추가 (v1.1), 커뮤니티 PR로 카드 풀 확장</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">대형 repo 성능</td>
              <td className="px-2 py-2 text-muted-foreground">낮음/중간</td>
              <td className="px-2 py-2 text-muted-foreground">비동기 git 명령어 + 5초 타임아웃 + maxBuffer 10MB</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">.code-pulse 디렉토리 관리</td>
              <td className="px-2 py-2 text-muted-foreground">낮음/낮음</td>
              <td className="px-2 py-2 text-muted-foreground">README에 .gitignore 추가 안내. 자동 수정은 하지 않음</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">prompt 자동 호출 한계</td>
              <td className="px-2 py-2 text-muted-foreground">중간/낮음</td>
              <td className="px-2 py-2 text-muted-foreground">수동 트리거 UX 최적화. /daily_wrap_up 한 번 선택으로 일괄 출력</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 8. 기각된 대안 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <XCircle size={20} className="text-purple-600" />8. 기각된 대안
      </h2>

      <div className="space-y-3 mb-6">
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">세션 타임라인/리플레이</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: 스코프가 거대하고, MCP 서버로 Claude Code 내부 세션 데이터에 접근할 수 없음. 근본적 기술 제약.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">AI 사용 패턴 분석 (토큰 사용량 등)</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: MCP 서버는 Claude Code의 내부 메트릭에 접근 불가. 데이터 수집 자체가 불가능.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">이미지 기반 카드 생성</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: 외부 이미지 생성 API 의존이 필요하고, MCP tool 응답은 text 타입만 지원. 마크다운 카드가 더 범용적이고 예쁘게 렌더링됨.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">리더보드/경쟁 시스템</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: 서버 인프라 필요. 1인 인디해커에게 서버 운영 비용 부담. 완전 로컬 원칙 위반.</p>
        </div>
        <div className="rounded-lg border p-3 bg-card">
          <p className="font-semibold text-foreground text-sm">프로젝트 건강도 대시보드</p>
          <p className="text-muted-foreground text-sm mt-1">기각 사유: CodeClimate, SonarQube 등 기존 도구 영역과 중복. &quot;재미&quot;가 아닌 &quot;실용&quot; 방향이라 본 프로젝트의 핵심 가치와 불일치.</p>
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
              <td className="px-2 py-2 text-muted-foreground">MCP 영역 0 stars (블루오션)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">개발자 필요성</td>
              <td className="px-2 py-2 text-muted-foreground">주 5회+ (매일 카드 확인)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">MVP 개발</td>
              <td className="px-2 py-2 text-muted-foreground">5일 (tool 3개, 카드 18종)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">차별점</td>
              <td className="px-2 py-2 text-muted-foreground">3개 (카드 시스템, 게이미피케이션, 히든 카드)</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">바이럴 잠재력</td>
              <td className="px-2 py-2 text-muted-foreground">카드 스크린샷 = 공유 가능 콘텐츠</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">유지보수 부담</td>
              <td className="px-2 py-2 text-muted-foreground">외부 API 0개, 핵심 deps 3개</td>
              <td className="px-2 py-2"><span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600">PASS</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border-2 border-green-500 p-4 mt-4 mb-4 bg-card">
        <p className="font-semibold text-green-600 text-lg">최종 판정: Go</p>
        <p className="text-muted-foreground text-sm mt-1">6개 항목 전부 PASS. 4개 리스크 모두 관리 가능. MCP 생태계 최초 게이미피케이션 카테고리 창시.</p>
      </div>

      <p className="text-muted-foreground leading-relaxed mb-2">
        <strong className="text-foreground">성공 조건:</strong> 출시 1주 내 GitHub 80+ stars. 카드 스크린샷이 Reddit/X에서 자연 공유되는 현상 관측.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        <strong className="text-foreground">실패 시 출구:</strong> 2주 내 20 stars 미만이면, 카드 방향을 접고 <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">mcp-git-insight</code>(git 분석 실용 도구)로 피벗 검토.
      </p>

      {/* =========================================== */}
      {/* Part 2: PRD */}
      {/* =========================================== */}

      <div className="rounded-lg border-2 border-orange-500 p-4 mb-8 bg-card">
        <p className="font-semibold text-lg text-foreground">Part 2 — PRD (Product Requirements Document)</p>
        <p className="text-muted-foreground text-sm mt-1">MVP 스코프, 기술 설계, 개발 일정, 로드맵</p>
      </div>

      {/* PRD 1. MVP 스코프 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Package size={20} className="text-orange-600" />PRD 1. MVP 스코프
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-3">
        1주(5일) 내 1인 개발 가능한 범위. Tool 3개 + Resource 1개 + Prompt 1개 + 카드 18종 + 업적 15개.
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
              <td className="px-2 py-2 text-foreground font-medium">get_coding_card</td>
              <td className="px-2 py-2 text-muted-foreground">기간별 코딩 카드 생성 (마크다운 렌더링)</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Tool</td>
              <td className="px-2 py-2 text-foreground font-medium">get_achievements</td>
              <td className="px-2 py-2 text-muted-foreground">업적 목록 + 달성 현황 (잠금/해금)</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Tool</td>
              <td className="px-2 py-2 text-foreground font-medium">get_coding_stats</td>
              <td className="px-2 py-2 text-muted-foreground">기간별 코딩 통계 요약</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Resource</td>
              <td className="px-2 py-2 text-foreground font-medium">codepulse://status</td>
              <td className="px-2 py-2 text-muted-foreground">프로젝트 기본 정보 (컨텍스트 유지용)</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Prompt</td>
              <td className="px-2 py-2 text-foreground font-medium">daily_wrap_up</td>
              <td className="px-2 py-2 text-muted-foreground">일일 마무리 (카드+통계 일괄 출력)</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">카드</td>
              <td className="px-2 py-2 text-foreground font-medium">18종</td>
              <td className="px-2 py-2 text-muted-foreground">Common 5 / Rare 5 / Epic 3 / Legendary 2 / Hidden 3</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">업적</td>
              <td className="px-2 py-2 text-foreground font-medium">15개</td>
              <td className="px-2 py-2 text-muted-foreground">카드 수집, 스트릭, 특수 조건 기반</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-3">카드 풀 (18종)</h3>

      <div className="table-wrap">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">카드명</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">희귀도</th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">판별 조건 (숫자 기반)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Steady Coder</td>
              <td className="px-2 py-2 text-muted-foreground">Common</td>
              <td className="px-2 py-2 text-muted-foreground">커밋 1-3, 파일 1-5</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Quick Fix</td>
              <td className="px-2 py-2 text-muted-foreground">Common</td>
              <td className="px-2 py-2 text-muted-foreground">커밋 1-2, 변경 10줄 이내</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Small Change</td>
              <td className="px-2 py-2 text-muted-foreground">Common</td>
              <td className="px-2 py-2 text-muted-foreground">파일 1개만 변경</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Daily Driver</td>
              <td className="px-2 py-2 text-muted-foreground">Common</td>
              <td className="px-2 py-2 text-muted-foreground">커밋 3+, 기본 활동</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Code Scribe</td>
              <td className="px-2 py-2 text-muted-foreground">Common</td>
              <td className="px-2 py-2 text-muted-foreground">추가만 있고 삭제 0</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Bug Slayer</td>
              <td className="px-2 py-2 text-muted-foreground">Rare</td>
              <td className="px-2 py-2 text-muted-foreground">커밋 5+, 파일 3+, 작은 수정 다수</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Feature Builder</td>
              <td className="px-2 py-2 text-muted-foreground">Rare</td>
              <td className="px-2 py-2 text-muted-foreground">새 파일 3+, 추가 200줄+</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Multi-Tasker</td>
              <td className="px-2 py-2 text-muted-foreground">Rare</td>
              <td className="px-2 py-2 text-muted-foreground">파일 10+개 동시 변경</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Speed Demon</td>
              <td className="px-2 py-2 text-muted-foreground">Rare</td>
              <td className="px-2 py-2 text-muted-foreground">커밋 간격 10분 이내 연속 5+</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Code Reviewer</td>
              <td className="px-2 py-2 text-muted-foreground">Rare</td>
              <td className="px-2 py-2 text-muted-foreground">추가/삭제 비율 균형 (0.8-1.2)</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Night Owl</td>
              <td className="px-2 py-2 text-muted-foreground">Epic</td>
              <td className="px-2 py-2 text-muted-foreground">새벽 0-4시 커밋 3+</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Code Janitor</td>
              <td className="px-2 py-2 text-muted-foreground">Epic</td>
              <td className="px-2 py-2 text-muted-foreground">삭제 &gt; 추가 x 2</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Marathon Coder</td>
              <td className="px-2 py-2 text-muted-foreground">Epic</td>
              <td className="px-2 py-2 text-muted-foreground">커밋 10+, 500줄+ 변경</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Thousand Lines</td>
              <td className="px-2 py-2 text-muted-foreground">Legendary</td>
              <td className="px-2 py-2 text-muted-foreground">하루 1000줄+ 삭제 (대규모 리팩토링)</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Streak Master</td>
              <td className="px-2 py-2 text-muted-foreground">Legendary</td>
              <td className="px-2 py-2 text-muted-foreground">30일 연속 커밋</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Christmas Coder</td>
              <td className="px-2 py-2 text-muted-foreground">Hidden</td>
              <td className="px-2 py-2 text-muted-foreground">12월 25일 커밋</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Halloween Hacker</td>
              <td className="px-2 py-2 text-muted-foreground">Hidden</td>
              <td className="px-2 py-2 text-muted-foreground">10월 31일 커밋</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">Centurion</td>
              <td className="px-2 py-2 text-muted-foreground">Hidden</td>
              <td className="px-2 py-2 text-muted-foreground">정확히 100번째 커밋</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PRD 2. MCP Tool/Resource 설계 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Layers size={20} className="text-orange-600" />PRD 2. MCP Tool/Resource 설계
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-3">
        각 tool의 응답 예시입니다. 모든 응답은 마크다운 형식으로, Claude가 자연스럽게 렌더링합니다.
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">get_coding_card 응답 예시</h3>
      <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-4"><code>{`{
  "content": [{
    "type": "text",
    "text": "## 🃏 오늘의 코딩 카드\\n\\n### ⚔️ Bug Slayer\\n**희귀도**: ★★★ RARE\\n\\n| 항목 | 값 |\\n|------|-----|\\n| 커밋 | 8개 |\\n| 변경 파일 | 12개 |\\n| 추가 | +234줄 |\\n| 삭제 | -156줄 |\\n\\n> *\\"버그를 사냥하는 전사. 오늘도 코드의 평화를 지켰다.\\"*\\n\\n🏆 이 카드로 'Bug Slayer' 업적이 해금되었습니다!"
  }]
}`}</code></pre>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">get_achievements 응답 예시</h3>
      <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-4"><code>{`{
  "content": [{
    "type": "text",
    "text": "## 🏆 코딩 업적 (7/15 달성)\\n\\n| 상태 | 업적 | 조건 |\\n|------|------|------|\\n| ✅ | First Card | 첫 카드 획득 |\\n| ✅ | First Rare | 첫 Rare 카드 |\\n| ✅ | Bug Slayer x3 | Bug Slayer 3회 획득 |\\n| 🔒 | First Legendary | 첫 Legendary 카드 |\\n| 🔒 | Month Streak | 30일 연속 커밋 |\\n..."
  }]
}`}</code></pre>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">get_coding_stats 응답 예시</h3>
      <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-4"><code>{`{
  "content": [{
    "type": "text",
    "text": "## 📊 이번 주 코딩 통계\\n\\n| 항목 | 값 |\\n|------|-----|\\n| 총 커밋 | 23개 |\\n| 변경 파일 | 45개 |\\n| 추가 | +1,234줄 |\\n| 삭제 | -567줄 |\\n| 가장 활발한 시간 | 오후 2-4시 |\\n| 연속 커밋 | 5일째 🔥 |\\n\\n**획득 카드**: Bug Slayer x2, Night Owl x1, Steady Coder x4"
  }]
}`}</code></pre>

      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">에러 응답 예시</h3>
      <pre className="bg-secondary border rounded-md p-3 text-sm overflow-x-auto mb-6"><code>{`{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "❌ git 저장소를 찾을 수 없습니다.\\n\\n현재 디렉토리가 git 저장소가 아닙니다.\\ngit init으로 저장소를 초기화하거나, project_path 파라미터로 다른 경로를 지정해주세요."
  }]
}`}</code></pre>

      {/* PRD 3. 기술 스택 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <GitBranch size={20} className="text-orange-600" />PRD 3. 기술 스택
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
              <td className="px-2 py-2 text-foreground font-medium">Node.js 18+</td>
              <td className="px-2 py-2 text-muted-foreground">MCP SDK 최소 요구사항</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">언어</td>
              <td className="px-2 py-2 text-foreground font-medium">TypeScript (strict)</td>
              <td className="px-2 py-2 text-muted-foreground">MCP 생태계 표준, 타입 안전성</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">MCP SDK</td>
              <td className="px-2 py-2 text-foreground font-medium">@modelcontextprotocol/sdk</td>
              <td className="px-2 py-2 text-muted-foreground">공식 SDK, tool/resource/prompt 지원</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">전송</td>
              <td className="px-2 py-2 text-foreground font-medium">stdio</td>
              <td className="px-2 py-2 text-muted-foreground">Claude Desktop/Code 표준</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">스키마 검증</td>
              <td className="px-2 py-2 text-foreground font-medium">zod</td>
              <td className="px-2 py-2 text-muted-foreground">MCP SDK 내장, 추가 설치 불필요</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">빌드</td>
              <td className="px-2 py-2 text-foreground font-medium">tsup</td>
              <td className="px-2 py-2 text-muted-foreground">빠른 ESM/CJS 번들링</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">git 실행</td>
              <td className="px-2 py-2 text-foreground font-medium">child_process.execFile (비동기)</td>
              <td className="px-2 py-2 text-muted-foreground">non-blocking + 5초 타임아웃</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">로컬 저장소</td>
              <td className="px-2 py-2 text-foreground font-medium">JSON 파일 (.code-pulse/)</td>
              <td className="px-2 py-2 text-muted-foreground">카드/업적 데이터량이 적어 SQLite 불필요</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground">외부 API</td>
              <td className="px-2 py-2 text-foreground font-medium">0개</td>
              <td className="px-2 py-2 text-muted-foreground">완전 로컬 — git CLI만 사용</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground leading-relaxed mt-3 mb-6">
        핵심 의존성: MCP SDK + zod + tsup. 외부 API 0개로 유지보수 부담 최소화. 완전 로컬 실행.
      </p>

      {/* PRD 4. 개발 일정 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <Calendar size={20} className="text-orange-600" />PRD 4. 개발 일정
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
              <td className="px-2 py-2 text-foreground font-medium">Day 1</td>
              <td className="px-2 py-2 text-muted-foreground">프로젝트 셋업 + git-parser.ts</td>
              <td className="px-2 py-2 text-muted-foreground">git log 파싱 동작 확인</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">Day 2</td>
              <td className="px-2 py-2 text-muted-foreground">card-engine.ts + 카드 18종 정의</td>
              <td className="px-2 py-2 text-muted-foreground">카드 생성 + 마크다운 렌더링</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">Day 3</td>
              <td className="px-2 py-2 text-muted-foreground">get_coding_card + get_coding_stats tool</td>
              <td className="px-2 py-2 text-muted-foreground">2개 tool MCP 연동</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">Day 4</td>
              <td className="px-2 py-2 text-muted-foreground">achievement-engine + get_achievements + local-store</td>
              <td className="px-2 py-2 text-muted-foreground">업적 시스템 + 저장소</td>
            </tr>
            <tr className="border-b border-border hover:bg-secondary/30">
              <td className="px-2 py-2 text-foreground font-medium">Day 5</td>
              <td className="px-2 py-2 text-muted-foreground">resource + prompt + README + npm 배포 + 데모 GIF</td>
              <td className="px-2 py-2 text-muted-foreground">v1.0 출시!</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PRD 5. Post-MVP 로드맵 */}
      <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2">
        <TrendingUp size={20} className="text-orange-600" />PRD 5. Post-MVP 로드맵
      </h2>

      <div className="space-y-4 mb-8">
        <div className="rounded-lg border-l-4 border-l-purple-500 p-4 bg-card">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">v1.1 <ArrowRight size={14} className="text-muted-foreground" /> 출시 후 1-2주</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>시즌 2 카드 팩 추가 (10종+)</li>
            <li>카드에 &quot;다음 행동 힌트&quot; 추가 (&quot;Legendary를 얻으려면...&quot;)</li>
            <li>카드 중복 시 변주 로직 (같은 카드가 연속으로 나오면 다른 관점 제시)</li>
            <li>커뮤니티 카드 PR 머지</li>
          </ul>
        </div>
        <div className="rounded-lg border-l-4 border-l-orange-500 p-4 bg-card">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">v2.0 <ArrowRight size={14} className="text-muted-foreground" /> 출시 후 1개월</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>mcp-code-quest: 일일 퀘스트/미션 시스템 (code-pulse 유니버스 확장)</li>
            <li>주간/월간 요약 리포트</li>
            <li>팀 기능 실험 (같은 repo의 다른 기여자 카드)</li>
          </ul>
        </div>
        <div className="rounded-lg border-l-4 border-l-emerald-500 p-4 bg-card">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-2">v3.0 <ArrowRight size={14} className="text-muted-foreground" /> 출시 후 3개월</p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
            <li>mcp-code-battle: 카드 대전 시스템 (커뮤니티 이벤트)</li>
            <li>카드 커스터마이징 (사용자 정의 카드 조건)</li>
            <li>MCP 공식 추천 목록 등재 시도</li>
          </ul>
        </div>
      </div>

    </PageShell>
  );
}
