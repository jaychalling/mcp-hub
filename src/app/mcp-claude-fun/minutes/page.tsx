'use client'

import { MeetingViewer } from '@/components/meeting/meeting-viewer'
import { parseMeetingMarkdown } from '@/lib/meeting-parser'

const MEETING_MARKDOWN = `# mcp-claude-fun MCP 서버 브레인스토밍 회의록

**일시**: 2026-02-06
**참여**: 전문가 AI 패널 8명
**라운드**: 5단계 8라운드 (발산 2R + 수렴 2R + DX&스펙 2R + 기술 1R + 검증 1R)
**아이디어**: Claude Code에 재미있고 유용한 기능을 추가하는 MCP 서버 — 코딩 통계, 업적 시스템, 세션 분석 등 개발자가 "이거 재밌다!" 하고 바이럴될 만한 도구

---

## 라운드 1 — 1단계: 아이디어 발산

### 🎙️ 사회자
좋습니다, 오늘 브레인스토밍 주제는 "Claude Code에 재미있는 기능을 추가하는 MCP 서버"입니다. 핵심 키워드는 **재미**와 **바이럴**이에요. 실용성도 중요하지만, 개발자들이 "이거 봐봐!" 하고 공유하고 싶어지는 경험을 만드는 게 포인트입니다. 코딩 세션 통계, 업적 시스템, 타임라인 등 여러 방향이 제안되었는데, 자유롭게 확장하거나 완전히 다른 방향을 제시해도 됩니다. 1단계에서는 최대한 발산해봅시다.

### 🔍 MCP생태계분석가
Claude Code와 관련된 MCP 서버 생태계를 분석해봤습니다.

| 서버명 | GitHub Stars | 기능 | 비고 |
|--------|-------------|------|------|
| claude-code-metrics (없음) | - | - | 이 카테고리에 MCP 서버가 아직 없음 |
| mcp-memory | ~180 | 대화 기억 저장 | 기능 카테고리 다름 |
| mcp-github | ~250 | GitHub API 연동 | 개발자 도구이지만 "재미" 요소 없음 |
| wakatime (비MCP) | 8000+ | 코딩 시간 추적 | MCP가 아닌 독립 서비스, IDE 플러그인 |
| code-stats (비MCP) | ~500 | 코딩 통계 | 역시 MCP 아님, 설치 복잡 |

**핵심 발견**: Claude Code 사용 패턴을 분석하고 재미있게 보여주는 MCP 서버는 **아예 존재하지 않습니다**. 완전한 블루오션입니다. WakaTime이 IDE 코딩 시간을 추적하듯, AI 코딩 에이전트 사용 패턴을 추적하는 도구는 새로운 카테고리입니다.

다만 주의할 점은, Claude Code의 MCP 연동에서 접근 가능한 데이터가 무엇인지가 핵심입니다. MCP 서버가 Claude Code의 내부 상태(토큰 사용량 등)에 직접 접근할 수 있는지 확인이 필요합니다.

### 💡 기발한놈
잠깐, 다들 "통계"나 "업적"만 생각하고 있는데, 그건 WakaTime의 MCP 버전일 뿐이잖아? 그걸로는 바이럴 안 돼. 내가 제안하는 건 완전히 다른 방향이야.

**아이디어: "AI 코딩 배틀 카드" (mcp-code-cards)**

- Claude Code와 함께한 코딩 세션을 **트레이딩 카드 형태**로 생성
- 예: "오늘의 카드: 🔥 버그 슬레이어 — 38개 파일 수정, 5개 크리티컬 버그 수정, 4시간 연속 코딩"
- 카드에 희귀도가 있음: Common / Rare / Epic / Legendary
- "Legendary: 한 프롬프트로 1000줄 리팩토링 성공" 같은 것
- 이미지가 아니라 **터미널 아스키 아트**나 **Mermaid 다이어그램**으로 렌더링
- 개발자들이 자기 카드를 X에 스크린샷 찍어서 올리고 싶어짐

**왜 이게 바이럴인가**: 통계는 숫자일 뿐이지만, 카드는 **수집 욕구**와 **자랑 욕구**를 동시에 자극해. "나 오늘 Legendary 카드 뽑았다ㅋㅋ" — 이게 Reddit에서 upvote 폭탄 맞는 거야.

### 🛠️ 빌더
MCP SDK 기준으로 현실성을 분석해보겠습니다.

먼저 **Claude Code에서 MCP 서버가 접근할 수 있는 데이터**의 한계를 명확히 해야 합니다:
- MCP 서버는 Claude Code의 내부 상태(토큰 사용량 등)에 직접 접근 **불가**
- MCP 서버가 할 수 있는 것: tool 호출을 받고, 파일 시스템 읽기, 외부 API 호출
- 즉, Claude가 "내가 뭘 했는지"를 MCP tool에 **보고**하는 구조가 필요

실현 가능한 접근법:
\`\`\`typescript
// tool 정의 예시 — Claude가 자기 활동을 기록
server.tool("log_activity", "코딩 활동을 기록합니다", {
  action: z.enum(["file_edit", "bug_fix", "refactor", "new_feature", "debug"]),
  files_changed: z.number(),
  lines_added: z.number().optional(),
  lines_removed: z.number().optional(),
  description: z.string()
}, async ({ action, files_changed, lines_added, lines_removed, description }) => {
  // 로컬 JSON/SQLite에 기록
});
\`\`\`

문제는 이걸 **Claude Code가 자동으로 호출**하게 만들 수 있느냐인데, MCP server가 prompt를 제공하면 Claude가 매 작업 후 자동으로 log_activity를 호출하도록 유도할 수 있습니다. \`prompts\` 기능을 활용하면 됩니다.

### 👤 개발자대변인
솔직히 얘기하면, **수동으로 활동을 기록해야 한다면 아무도 안 씁니다**. 개발자가 매번 "이번 작업 기록해줘"라고 말해야 하면 3일 안에 버려요.

핵심 질문:
- 설치: \`npx -y mcp-claude-fun\` 한 줄이면 되나? — 이건 되겠죠
- 설정: claude_desktop_config.json에 3줄 추가하면 끝? — 이것도 OK
- **사용 빈도**: 매일 쓸까? — 이게 문제. "통계 보여줘"는 처음 한두 번 신기하고 끝
- **자동 수집 vs 수동 입력**: WakaTime이 성공한 건 **설치 후 잊어버려도 알아서 추적**하기 때문. 수동 기록은 실패 패턴

거부권은 아직 안 쓰겠지만, **자동 수집이 안 되면 이 프로젝트는 시작도 전에 죽습니다**. 빌더에게 묻겠는데, MCP prompt + system instruction으로 Claude가 매 작업마다 자동으로 tool을 호출하게 만들 수 있나요?

### 🔨 채찍맨
벌써부터 스코프가 폭발하고 있어. 정리하자.

현재 나온 아이디어들:
1. 코딩 통계/대시보드 — 데이터 수집 문제
2. 업적/도전과제 — 통계 기반이니 1에 의존
3. 세션 타임라인/리플레이 — 스코프 거대
4. 트레이딩 카드 — 기발하지만 역시 데이터가 필요
5. 프로젝트 건강도 — 이건 다른 MCP (CodeClimate 류)

1주일 안에 MVP를 만들려면 tool 3~5개가 한계다. 데이터 수집 방식을 먼저 확정하지 않으면 나머지 다 공중누각이야. **빌더가 데이터 수집 기술적 가능성을 1순위로 확인해줘야 해.**

### 😈 비관론자
솔직히 이 아이디어에 심각한 약점이 보인다.

1. **데이터 수집의 벽**: MCP 서버는 Claude Code의 내부 메트릭에 접근 불가. 토큰 사용량, 실제 코드 변경량을 자동으로 알 방법이 없음. "Claude야 방금 뭐 했는지 기록해"라고 매번 말해야 하면 UX 재앙.

2. **"재미"의 유통기한**: 통계, 업적, 카드 — 다 처음에 신기하고 1주일 뒤 버림. WakaTime도 설치만 하고 실제로 대시보드 보는 사람은 극소수.

3. **기존 대안 우회**: WakaTime은 8000+ stars에 IDE 레벨에서 완벽한 데이터 수집. MCP로 비슷한 걸 만들어봐야 WakaTime의 열화판.

No-Go 체크 (1차):
| 지표 | 값 | 기준 | 판정 |
|------|-----|------|------|
| 기존 대안 | WakaTime(8000+, 비MCP) / MCP 영역은 0 | < 100 stars MCP | ⚠️ 카테고리 다름 |
| 개발자 필요성 | 주 ?회 — 불확실 | > 주 1회 | ⚠️ 미확인 |
| MVP 개발 | 데이터 수집 방식에 따라 상이 | < 2주 | ⚠️ 미확인 |

아직 데이터가 부족해서 No-Go를 내리진 않겠지만, **데이터 수집 문제가 해결 안 되면 이 프로젝트는 No-Go**다.

### 📢 바이럴전략가
바이럴 관점에서 이 아이디어는 **엄청난 잠재력**이 있어요, 데이터 수집만 해결되면.

왜냐면:
- **타겟이 정확함**: Claude Code 사용자 = MCP 생태계 얼리어답터 = 공유하기 좋아하는 개발자
- **스크린샷 공유 문화**: 개발자들은 터미널 스크린샷을 X/Reddit에 공유하는 습관이 있음
- **카드 시스템은 특히 강력**: 기발한놈의 트레이딩 카드 아이디어가 바이럴에 최적화됨

패키지명 후보:
- \`mcp-code-pulse\` — 코딩 맥박/활력. 심장박동처럼 세션 상태를 느끼는 느낌
- \`mcp-dev-quest\` — 개발자 퀘스트. 게이미피케이션 느낌
- \`mcp-claude-stats\` — 직관적이지만 재미 없음
- \`mcp-code-cards\` — 트레이딩 카드 방향이면 이게 최적

데모 전략 (초안):
- 30초 GIF: Claude Code에서 코딩 → "오늘의 카드 보여줘" → 멋진 ASCII 카드 출력
- Reddit r/ClaudeAI, r/ChatGPTCoding에서 "Show off your AI coding battle card!" 밈화 가능
- X에서 #MyCodingCard 해시태그로 스크린샷 공유 유도

근데 비관론자 말처럼, **데이터 수집이 자동이어야** 이 전략이 먹혀요. 수동이면 공유할 데이터 자체가 없으니까.

## 라운드 2 — 1단계: 아이디어 발산 (심화)

### 🎙️ 사회자
1라운드에서 핵심 쟁점이 명확해졌습니다. **데이터 수집의 자동화 가능 여부**가 이 프로젝트의 생사를 결정합니다. 빌더가 이 부분을 먼저 해명해주시고, 그 위에서 아이디어를 구체화합시다. 기발한놈의 트레이딩 카드 방향에 대한 찬반도 들어봅시다.

### 🔍 MCP생태계분석가
1라운드 이후 MCP 프로토콜 스펙을 더 파봤습니다. 중요한 발견이 있어요.

MCP 서버가 Claude Code에서 활용할 수 있는 **간접적 데이터 소스**들:
1. **git 히스토리**: \`git log\`, \`git diff --stat\` 등으로 코드 변경량 추적 가능 — 이건 MCP tool이 subprocess로 실행 가능
2. **파일 시스템 변경**: 프로젝트 디렉토리의 파일 수정 시간, 크기 변화 추적 가능
3. **MCP tool 호출 자체**: 이 MCP 서버의 tool이 호출될 때마다 타임스탬프 기록 = 세션 활동 추적

이건 중요해요. **Claude Code의 내부 상태에 접근할 필요가 없어요**. git과 파일시스템이라는 **이미 존재하는 데이터 소스**를 활용하면 됩니다.

### 💡 기발한놈
이거야! MCP생태계분석가 말이 맞아. git이 답이잖아!

**수정된 아이디어: "Git 기반 AI 코딩 카드"**

- git commit 히스토리를 분석해서 카드를 생성
- \`git log --since="today"\` → 오늘의 커밋 수, 변경 파일 수, 삽입/삭제 라인 수
- 이걸 기반으로 **자동으로** 카드를 생성
- "오늘의 카드 보여줘"만 말하면 됨 — 완전 자동!

예시 카드:
\`\`\`
╔══════════════════════════════════╗
║  ⚔️ REFACTOR KING              ║
║  ─────────────────────────       ║
║  Commits: 12  Files: 24          ║
║  +342 lines / -891 lines         ║
║  삭제가 추가보다 많은 날!         ║
║  ─────────────────────────       ║
║  Rarity: ★★★ EPIC              ║
║  Date: 2026-02-06                ║
╚══════════════════════════════════╝
\`\`\`

그리고 여기서 더 나아가서, **주간 요약 카드**, **프로젝트 카드**(이 repo의 총 기여도), **연속 커밋 스트릭 카드** 같은 것도 가능해.

"1000줄 삭제한 날"에는 \`🧹 Code Janitor\` 카드, "새벽 3시 커밋"에는 \`🌙 Night Owl\` 카드... 이런 식으로 **조건 기반 자동 생성**!

### 🛠️ 빌더
좋아, git 기반이면 기술적으로 완전히 실현 가능합니다. 구체적인 MCP 아키텍처를 제안하겠습니다.

\`\`\`typescript
// 핵심 tool 정의
server.tool("get_coding_card", "오늘의 AI 코딩 카드를 생성합니다", {
  period: z.enum(["today", "week", "month", "all"]).default("today"),
  project_path: z.string().optional().describe("프로젝트 경로 (기본: cwd)")
}, async ({ period, project_path }) => {
  // 1. git log --since="{period}" --stat 실행
  // 2. 커밋 수, 변경 파일 수, 추가/삭제 라인 수 파싱
  // 3. 조건 기반으로 카드 타입 + 희귀도 결정
  // 4. ASCII 카드 렌더링 후 반환
});

server.tool("get_achievements", "획득한 업적 목록을 보여줍니다", {
  project_path: z.string().optional()
}, async ({ project_path }) => {
  // git 히스토리 전체 스캔 → 달성 조건 확인
});

server.tool("get_coding_stats", "코딩 통계 요약을 보여줍니다", {
  period: z.enum(["today", "week", "month", "all"]).default("week"),
  project_path: z.string().optional()
}, async ({ period, project_path }) => {
  // git log 기반 통계
});
\`\`\`

데이터 수집 방식:
- \`child_process.execSync("git log ...")\` — MCP 서버에서 git CLI 직접 호출
- 외부 API 의존성 **0개** — 완전 로컬
- Claude Code의 cwd를 기본 프로젝트 경로로 사용

개발자대변인의 우려에 대한 답: **수동 입력 전혀 불필요**. git에 이미 모든 데이터가 있습니다.

### 👤 개발자대변인
좋아요, git 기반이면 내 우려가 상당 부분 해소됩니다!

실제 사용 시나리오를 그려보면:
1. Claude Code에서 한참 코딩하고...
2. "오늘 어떻게 됐어?" 또는 "오늘의 카드 보여줘" 라고 말하면
3. Claude가 \`get_coding_card\` tool을 호출
4. 멋진 ASCII 카드가 출력

이건 **실제로 쓸 것 같아요**. 이유:
- 하루 끝에 "오늘 얼마나 했지?" 궁금한 건 모든 개발자의 본능
- \`git log --stat\`을 직접 보는 것보다 **카드화된 요약**이 훨씬 재미있고 직관적
- 스크린샷 찍어서 공유하고 싶은 욕구가 자연스럽게 생김

다만, 한 가지 걱정: **mono-repo나 git이 없는 프로젝트**에서는 어떡하죠? 에러 처리가 깔끔해야 합니다. "git 저장소가 아닙니다. \`git init\` 후 다시 시도하세요" 같은 친절한 메시지.

### 🔨 채찍맨
좋아, 방향이 잡혔으니 스코프를 자르자.

MVP에 넣을 것 (1주):
- ✅ \`get_coding_card\` — 핵심. 이것만 있어도 데모 가능
- ✅ \`get_achievements\` — 업적 리스트. 카드와 시너지
- ✅ \`get_coding_stats\` — 기본 통계. 카드의 원본 데이터

MVP에서 자를 것:
- ❌ 세션 타임라인/리플레이 — 스코프 거대, v2
- ❌ AI 사용 패턴 분석 — MCP로 접근 불가, 삭제
- ❌ 프로젝트 건강도 대시보드 — 다른 MCP 서버 영역
- ❌ 이미지 생성 (카드 이미지) — ASCII로 충분, 외부 API 의존 금지
- ❌ 리더보드/경쟁 시스템 — 서버 필요, 1인 개발에 부적합

Tool 3개면 1주일에 충분히 가능해. 깔끔하다.

### 😈 비관론자
git 기반 접근은 데이터 수집 문제를 상당히 해소했다. 인정한다. 하지만 새로운 문제점을 짚겠다.

1. **"재미"의 지속성 의문**: 카드를 처음 봤을 때는 "오 재밌다" 하겠지만, 5번째부터는? 카드 종류가 충분히 다양하지 않으면 금방 질린다. 카드 풀이 최소 30종은 되어야 1달 이상 흥미 유지 가능.

2. **git이 없는 케이스**: 개발자대변인이 이미 짚었는데, 이게 생각보다 많아. Claude Code로 빠른 프로토타이핑하는 사람 중 git init도 안 한 채로 작업하는 경우가 꽤 있음.

3. **Claude Code 전용 vs 범용**: 이 MCP는 Claude Code에서만 돌아가는 게 아니라 Claude Desktop, Cursor 등 모든 MCP 클라이언트에서 돌아감. "Claude Code 재미 기능"이라고 했는데, 실제로는 **git 분석 도구**잖아. 포지셔닝이 애매해질 수 있어.

No-Go 체크 (2차 업데이트):
| 지표 | 값 | 기준 | 판정 |
|------|-----|------|------|
| 기존 대안 | MCP 영역 0 stars | < 100 stars | ✅ PASS |
| 개발자 필요성 | 주 3회+ (하루 끝에 확인) | > 주 1회 | ✅ PASS |
| MVP 개발 | 5일 (tool 3개) | < 2주 | ✅ PASS |
| 차별점 | 카드 시스템 (고유) | > 0개 | ✅ PASS |
| 바이럴 잠재력 | ASCII 카드 스크린샷 | 임팩트 있음 | ✅ PASS |
| 유지보수 부담 | 외부 API 0개 | < 3개 | ✅ PASS |

아직 No-Go까지는 아니야. 하지만 "재미의 지속성"은 반드시 해결해야 할 과제다.

### 📢 바이럴전략가
git 기반 + 카드 시스템 = **바이럴 폭발 조합**이에요!

업데이트된 확산 전략:

**패키지명 최종 후보**:
1. \`mcp-code-pulse\` — "코딩 맥박". 감성적이고 기억에 남음
2. \`mcp-dev-cards\` — "개발자 카드". 직관적
3. \`mcp-git-card\` — "깃 카드". git 기반이 명확

**데모 전략 (핵심!)**:
- 30초 GIF: \`claude "오늘의 코딩 카드 보여줘"\` → ASCII 카드 출력
- 이 ASCII 카드 자체가 **공유 가능한 콘텐츠**
- 개발자가 터미널 스크린샷 찍는 건 이미 일상적 행동

**1차 채널**: r/ClaudeAI — Claude Code 사용자가 집중된 곳. "I built an MCP that turns your git commits into trading cards" 제목이면 즉각 반응
**2차 채널**: r/ChatGPTCoding — AI 코딩 전반 관심층. MCP가 뭔지 모르는 사람에게도 카드 GIF로 hook
**3차 채널**: X(Twitter) #ClaudeCode #MCP #DevCards — 카드 스크린샷이 자연 공유

**비관론자의 "지속성" 우려에 대한 대응**: 카드 종류를 **시즌제**로 운영하면 됨. Season 1: 기본 카드 20종 → v1.1에서 Season 2 추가. 수집 욕구를 자극하는 클래식 패턴.

## 라운드 3 — 2단계: 수렴 및 정제

### 🎙️ 사회자
1단계에서 방향이 확실히 잡혔습니다. **git 기반 코딩 카드/업적 시스템**이 핵심이고, 데이터 수집 문제는 git 히스토리로 해결. 이번 라운드에서는 핵심 가치 제안과 타겟 페르소나를 명확히 해봅시다. 패키지명도 확정하면 좋겠습니다.

### 🔍 MCP생태계분석가
npm에서 \`mcp-dev-cards\`, \`mcp-code-pulse\`, \`mcp-git-card\` 검색 결과: 전부 **사용 가능** (미등록). 좋은 소식입니다.

추가로 확인한 것: MCP 서버 중 **게이미피케이션** 요소가 있는 건 단 하나도 없습니다. mcp-memory, mcp-github, mcp-filesystem 등 전부 "실용 도구" 카테고리예요. 재미/게이미피케이션 MCP는 **완전히 새로운 카테고리**를 만드는 겁니다.

이건 큰 의미가 있어요. "MCP 서버는 무조건 실용적이어야 한다"는 암묵적 규칙을 깨는 거니까. 이 자체가 화제성을 만듭니다.

### 💡 기발한놈
좋아, 수렴 단계니까 내 아이디어를 좀 더 다듬을게.

**핵심 가치 제안 (1문장)**: "git 커밋을 트레이딩 카드로 만들어서, 코딩 성과를 수집하고 자랑하게 하는 MCP 서버"

카드 시스템 설계를 구체화하면:

**카드 구성 요소**:
- **타이틀**: 조건에 따른 카드 이름 (Bug Slayer, Refactor King, Night Owl 등)
- **아이콘**: 이모지 1개
- **통계 요약**: 커밋 수, 파일 수, +/- 라인
- **희귀도**: Common(일반) / Rare(주 1-2회) / Epic(월 1-2회) / Legendary(특수 조건)
- **한 줄 설명**: "삭제가 추가보다 2배 이상 많은 날!"

**희귀도 결정 조건 예시**:
- Common: 커밋 1-3개, 변경 파일 1-5개
- Rare: 커밋 5개+, 또는 10개+ 파일 변경
- Epic: 커밋 10개+, 500줄+ 변경, 특수 패턴 (새벽 코딩, 주말 코딩)
- Legendary: 1000줄+ 삭제 (대규모 리팩토링), 20파일+ 동시 수정, 30일 연속 커밋

이 정도면 **30종+** 카드 풀이 가능하고, 비관론자의 "지속성" 우려도 해결!

### 🛠️ 빌더
핵심 가치 제안에 동의합니다. 기술적으로 카드 타입 결정 로직을 설계하겠습니다.

\`\`\`typescript
// 카드 타입 결정 엔진
interface CardCondition {
  id: string;
  title: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  check: (stats: GitStats) => boolean;
  flavor: string;
}

const CARD_POOL: CardCondition[] = [
  {
    id: 'bug_slayer',
    title: 'Bug Slayer',
    emoji: '⚔️',
    rarity: 'rare',
    check: (s) => s.commits >= 5 && s.filesChanged >= 3 && s.commitMessages.some(m => /fix|bug|patch/i.test(m)),
    flavor: '버그를 사냥하는 전사. 오늘도 코드의 평화를 지켰다.'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    emoji: '🌙',
    rarity: 'epic',
    check: (s) => s.latestCommitHour >= 0 && s.latestCommitHour <= 4,
    flavor: '새벽의 코더. 세상이 잠든 시간에 코드는 깨어있다.'
  },
  {
    id: 'code_janitor',
    title: 'Code Janitor',
    emoji: '🧹',
    rarity: 'epic',
    check: (s) => s.linesRemoved > s.linesAdded * 2,
    flavor: '삭제의 미학. 코드는 적을수록 아름답다.'
  },
  // ... 20+ more cards
];
\`\`\`

이 구조라면 **카드 추가가 매우 쉬움** — JSON 배열에 객체 하나 push하면 됨. 커뮤니티 PR로 카드 추가도 가능한 구조.

### 👤 개발자대변인
타겟 페르소나를 정리하겠습니다.

**Primary: Claude Code 파워유저**
- Claude Code를 매일 사용하는 개발자
- MCP 생태계에 익숙하고, 새 MCP를 빠르게 설치해보는 얼리어답터
- 코딩 후 성과를 가시화하고 싶은 욕구
- 사용 빈도: 매일 1회+ ("오늘의 카드" 확인)

**Secondary: AI 코딩 도구 사용자 전반**
- Cursor, Windsurf, Claude Desktop 등 MCP 지원 도구 사용자
- git을 사용하는 모든 개발자가 대상
- "AI로 코딩하면서 재미있는 걸 해보고 싶다"

**사용 시나리오**:
1. 하루 코딩 끝 → "오늘의 카드 보여줘" → 카드 확인 → 스크린샷 공유
2. 주간 회고 → "이번 주 통계 보여줘" → 주간 요약 확인
3. 업적 확인 → "내 업적 목록 보여줘" → 미달성 업적 동기부여

패키지명은 \`mcp-code-pulse\`를 밀겠습니다. "코딩 맥박"이라는 컨셉이 통계+카드+업적을 다 아우르면서도 감성적이에요. \`mcp-dev-cards\`는 카드에만 한정되는 느낌이고, \`mcp-git-card\`는 너무 기술적이에요.

### 🔨 채찍맨
패키지명은 \`mcp-code-pulse\`로 가되, 스코프 재확인.

최종 MVP tool 목록:
1. \`get_coding_card\` — 기간별 코딩 카드 생성 (핵심!)
2. \`get_achievements\` — 업적 목록 + 달성 현황
3. \`get_coding_stats\` — 숫자 기반 통계 요약

이 3개면 돼. **카드 풀은 MVP에서 15종이면 충분**. 비관론자가 30종 필요하다고 했는데, 15종이면 2주 동안은 새 카드를 계속 볼 수 있어. 나머지는 v1.1에서 추가.

1주일 일정:
- Day 1-2: git 파싱 엔진 + get_coding_card
- Day 3: get_achievements + 업적 15개 정의
- Day 4: get_coding_stats + ASCII 렌더링 고도화
- Day 5: 테스트 + README + npm 배포

### 😈 비관론자
git 기반 접근과 3-tool MVP는 합리적이다. 인정한다.

하지만 몇 가지 더 짚겠다:

1. **git log 파싱의 함정**: git log 포맷이 OS마다 다를 수 있어. Windows의 Git Bash vs macOS의 git vs Linux. 특히 날짜 포맷, 인코딩 문제. \`--format\` 플래그로 고정해야 해.

2. **mono-repo 대형 히스토리**: 10만 커밋짜리 repo에서 \`git log --since="1 year ago"\` 하면 느릴 수 있어. 성능 경계선 설정 필요.

3. **카드 15종의 한계**: 채찍맨이 15종이면 된다 했는데, 매일 같은 "Common" 카드만 나오면 3일 안에 지루해져. **최소 5종의 Rare 이상 카드**가 있어야 "오 오늘 뭐가 나올까?" 기대감이 생겨.

그래도 전체적으로 **No-Go 요소는 없어**. 이건 Go로 가도 됨.

### 📢 바이럴전략가
패키지명 \`mcp-code-pulse\` 동의합니다. "코딩 맥박"이라는 감성이 좋아요.

수렴된 확산 전략:

**타겟 커뮤니티 (우선순위)**:
1. **r/ClaudeAI** (25k+ 구독자) — MCP 사용자 밀집. 제목: "I made an MCP that turns your git history into collectible coding cards 🃏"
2. **Show HN** — 제목: "Show HN: mcp-code-pulse – Git commits become trading cards in Claude Code"
3. **r/ChatGPTCoding** (180k+ 구독자) — AI 코딩 전반. MCP 미사용자도 관심 가질 컨텐츠
4. **X (Twitter)** — #ClaudeCode #MCP #CodingCards 해시태그 + ASCII 카드 스크린샷

**README 구조**:
1. Hero: ASCII 카드 스크린샷 (3종 — Common, Epic, Legendary)
2. 30초 설치: \`npx -y mcp-code-pulse\` + config 3줄
3. 카드 갤러리: 전체 카드 목록 + 희귀도 + 획득 조건
4. 업적 목록: 전체 업적 + 달성 방법
5. Contributing: "새 카드 추가하기" PR 가이드

**킬러 데모**:
- 시나리오: Claude Code에서 "오늘의 카드 보여줘" → Epic 카드 출력 → "와 이거 Epic이다!"
- 이 30초를 GIF로 만들면 Reddit 댓글에서 "How do I install this?" 연쇄 반응

성공 목표: 1주 100+ stars / 1달 300+ stars

## 라운드 4 — 2단계: 수렴 및 정제 (확정)

### 🎙️ 사회자
핵심 가치 제안, 타겟, 패키지명이 대부분 수렴되었습니다. 이번 라운드에서 최종 확정하고, 미결 쟁점을 정리합시다. 특히 카드 시스템의 구체적인 설계와 기존 대안 대비 차별점을 확정해야 합니다.

### 🔍 MCP생태계분석가
기존 대안 대비 차별점을 정리합니다.

| 비교 대상 | 우리의 차별점 |
|-----------|-------------|
| WakaTime (IDE 플러그인) | WakaTime은 시간 추적. 우리는 **게이미피케이션 + 카드 시스템**. 완전히 다른 카테고리 |
| git-stats (CLI 도구) | git-stats는 숫자 표. 우리는 **인격화된 카드 + 업적**. 감성적 경험 |
| GitHub Contribution Graph | 그래프는 패시브. 우리는 **능동적 카드 생성 + 수집 욕구** 자극 |
| 기존 MCP 서버들 | 전부 실용 도구. **게이미피케이션 MCP는 우리가 최초** |

포지셔닝: **"개발자를 위한 WakaTime의 재미있는 버전 + MCP 네이티브"**

### 💡 기발한놈
하나 더 추가하고 싶은 게 있어. **"히든 카드"** 개념.

일반 조건으로는 절대 알 수 없는 카드가 있으면 어때?
- \`🎄 Christmas Coder\` — 12월 25일에 커밋하면 획득
- \`🎃 Spooky Code\` — 10월 31일 커밋
- \`🥚 Easter Egg Hunter\` — README.md에 "easter egg" 문자열이 있는 커밋
- \`💯 Centurion\` — 정확히 100번째 커밋

이런 히든 카드가 있으면 개발자들이 "이거 다 찾아야 해!" 하면서 **커뮤니티에서 히든 카드 정보를 공유**하게 됨. 이게 바이럴의 2차 웨이브를 만들어.

### 🛠️ 빌더
기발한놈의 히든 카드 아이디어는 기술적으로 간단하면서 바이럴 효과가 큽니다. 구현에 동의합니다.

타겟 페르소나와 차별점이 확정되었으니, 최종 tool 스펙을 정리합니다:

**확정 Tool 목록 (3개)**:
1. \`get_coding_card\` — period, project_path 인자. ASCII 카드 반환
2. \`get_achievements\` — project_path 인자. 업적 목록 + 달성률 반환
3. \`get_coding_stats\` — period, project_path 인자. 통계 요약 반환

**확정 Resource (1개)**:
- \`codepulse://status\` — 현재 프로젝트의 기본 정보 (repo명, 총 커밋 수, 최근 활동). Claude가 컨텍스트 유지용

**확정 Prompt (1개)**:
- \`daily_wrap_up\` — "오늘의 코딩 요약을 해주세요"를 Claude에게 제안. 자동으로 get_coding_card + get_coding_stats를 연쇄 호출하도록 유도

### 👤 개발자대변인
설치/설정 플로우를 확정합니다.

\`\`\`json
// claude_desktop_config.json
{
  "mcpServers": {
    "code-pulse": {
      "command": "npx",
      "args": ["-y", "mcp-code-pulse"]
    }
  }
}
\`\`\`

이것만 추가하면 끝. **추가 설정 0줄**. project_path는 Claude Code의 cwd를 자동으로 사용하니까.

DX 체크리스트:
- ✅ 설치: config 3줄
- ✅ 첫 사용: "오늘의 카드 보여줘" 한마디
- ✅ 의존성: npm에서 자동 설치 (npx)
- ✅ git이 없으면: 친절한 에러 메시지
- ✅ 학습 곡선: 없음

이 정도 DX면 **거부권 행사 사유가 없습니다**. 통과.

### 🔨 채찍맨
히든 카드는 좋은데, **MVP에서는 3개면 충분**. 히든 카드를 10개씩 만들다가 시간 낭비하지 마.

최종 스코프 확정:
- 일반 카드: 15종
- 히든 카드: 3종 (MVP)
- 업적: 15개
- Tool: 3개
- Resource: 1개
- Prompt: 1개

**이 이상 추가 제안은 전부 v1.1으로 이관.** 더 이상의 스코프 확장은 절대 안 받아들인다.

### 😈 비관론자
이 라운드에서 확정된 내용들에 대해 마지막 우려를 표명한다.

1. **"오늘의 카드 보여줘"를 매일 말할까?** — 처음 3일은 재밌어서 말하겠지만, 습관화되려면 Claude가 **먼저 제안**하는 구조가 필요. prompt로 가능한가? 빌더가 확인 필요.

2. **ASCII 카드의 시각적 한계**: 터미널에서 ASCII 아트는 폰트/크기에 따라 깨질 수 있어. 유니코드 박스 드로잉 문자 호환성 확인 필요.

3. **과연 100 stars가 가능한가**: MCP 생태계 전체가 아직 작아. 가장 인기 있는 MCP 서버도 300-500 stars 수준. 100 stars가 "easy"라고 생각하면 안 돼.

그래도 전반적으로 **Go 유지**. 이건 될 수 있는 프로젝트야.

### 📢 바이럴전략가
비관론자의 100 stars 우려에 대해: r/ClaudeAI에서 잘 만든 MCP 서버 공유하면 50-100 upvote는 쉽게 나와요. 그 중 20-30%가 GitHub star를 누른다고 하면 1주일 내 30-50 stars는 현실적이고, Show HN까지 치면 100은 충분히 가능합니다.

그리고 이 MCP의 킬러 포인트: **공유하고 싶은 콘텐츠를 자동 생성**한다는 것. 대부분의 MCP 서버는 "유용하지만 공유할 거리가 없어요". mcp-code-pulse는 **카드 자체가 공유 가능한 콘텐츠**. 이게 근본적인 차이점이에요.

패키지명 최종: \`mcp-code-pulse\` 확정을 제안합니다. 이의 있으신 분?

## 라운드 5 — 3단계: DX & MCP 스펙 설계

### 🎙️ 사회자
패키지명 \`mcp-code-pulse\` 확정, 이의 없습니다. 이번 라운드부터는 MCP 프로토콜 설계를 구체화합니다. 빌더가 tool/resource JSON 스키마를 확정하고, 개발자대변인이 DX를 검증합니다.

### 🔍 MCP생태계분석가
다른 인기 MCP 서버들의 tool 설계 패턴을 참고로 공유합니다.

잘 되는 MCP 서버 공통점:
- tool 이름이 **동사_명사** 형태 (\`load_spec\`, \`search_files\`)
- 필수 파라미터 최소화 (0-1개)
- 선택 파라미터로 세부 제어
- 응답이 **text 타입**으로 Claude가 자연스럽게 대화에 통합 가능

mcp-code-pulse도 이 패턴을 따르면 좋겠습니다. \`get_coding_card\`, \`get_achievements\`, \`get_coding_stats\` — 전부 \`get_\` 접두사로 일관성 있고, 필수 파라미터 없이 기본값으로 동작.

### 💡 기발한놈
스펙 설계 단계니까 내 영역은 아닌데, 한 가지만. 카드 출력 포맷에 대해서.

**ASCII 카드 대신 마크다운 카드는 어때?** Claude Code가 마크다운을 예쁘게 렌더링하니까:

\`\`\`markdown
## 🃏 오늘의 카드: ⚔️ Bug Slayer

| 항목 | 값 |
|------|-----|
| 희귀도 | ★★★ RARE |
| 커밋 | 8개 |
| 변경 파일 | 12개 |
| +234 / -156 라인 | |

> *"버그를 사냥하는 전사. 오늘도 코드의 평화를 지켰다."*
\`\`\`

이러면 터미널 호환성 문제도 없고, 스크린샷이 더 깔끔해. 빌더에게 묻겠는데, MCP tool 응답에서 마크다운이 정상 렌더링되나?

### 🛠️ 빌더
기발한놈의 질문에 답: MCP tool 응답은 \`text\` 타입이고, Claude가 이걸 그대로 출력하면서 마크다운 렌더링을 합니다. 마크다운이 더 낫습니다. ASCII 박스보다 범용성 높고 예쁘게 나옵니다.

최종 MCP 스펙을 확정합니다.

**Tool 1: get_coding_card**
\`\`\`json
{
  "name": "get_coding_card",
  "description": "git 히스토리를 분석해서 코딩 카드를 생성합니다. 카드는 커밋 패턴에 따라 다른 종류와 희귀도를 가집니다.",
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
}
\`\`\`

**응답 예시**:
\`\`\`json
{
  "content": [{
    "type": "text",
    "text": "## 🃏 오늘의 코딩 카드\\n\\n### ⚔️ Bug Slayer\\n**희귀도**: ★★★ RARE\\n\\n| 항목 | 값 |\\n|------|-----|\\n| 커밋 | 8개 |\\n| 변경 파일 | 12개 |\\n| 추가 | +234줄 |\\n| 삭제 | -156줄 |\\n\\n> *\\"버그를 사냥하는 전사. 오늘도 코드의 평화를 지켰다.\\"*\\n\\n🏆 이 카드로 'Bug Slayer' 업적이 해금되었습니다!"
  }]
}
\`\`\`

**Tool 2: get_achievements**
\`\`\`json
{
  "name": "get_achievements",
  "description": "획득한 코딩 업적과 미달성 업적을 보여줍니다. git 히스토리를 기반으로 자동 판정합니다.",
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
}
\`\`\`

**Tool 3: get_coding_stats**
\`\`\`json
{
  "name": "get_coding_stats",
  "description": "기간별 코딩 통계를 요약합니다. 커밋 수, 변경 파일, 추가/삭제 라인, 활동 시간대 등을 분석합니다.",
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
}
\`\`\`

**Resource: codepulse://status**
\`\`\`json
{
  "uri": "codepulse://status",
  "name": "Code Pulse Status",
  "description": "현재 프로젝트의 기본 정보 — repo명, 총 커밋 수, 최근 활동 날짜, 획득 카드 수",
  "mimeType": "text/plain"
}
\`\`\`

**Prompt: daily_wrap_up**
\`\`\`json
{
  "name": "daily_wrap_up",
  "description": "오늘의 코딩 세션을 마무리하며 카드와 통계를 확인합니다",
  "arguments": []
}
\`\`\`

### 👤 개발자대변인
빌더의 스펙을 DX 관점에서 검증합니다.

**설치 플로우** (최종):
\`\`\`bash
# Claude Desktop / Claude Code config
{
  "mcpServers": {
    "code-pulse": {
      "command": "npx",
      "args": ["-y", "mcp-code-pulse"]
    }
  }
}
\`\`\`
- 설치 단계: config 파일에 3줄 추가 → 끝
- 추가 설정: 없음
- 첫 사용: "오늘의 카드 보여줘" 또는 "코딩 통계 보여줘"

**DX 검증 결과**:
- ✅ 필수 파라미터 0개 — 모든 tool이 기본값으로 동작
- ✅ 마크다운 출력 — 터미널 호환성 문제 해소
- ✅ 에러 케이스: git 없으면 명확한 에러 메시지
- ✅ 학습 곡선 제로 — "카드 보여줘"면 됨

**한 가지 제안**: 카드에 **"다음에 이걸 해보세요"** 같은 힌트가 있으면 좋겠어요. 예를 들어 "Legendary 카드를 얻으려면 하루에 1000줄 이상 삭제해보세요 😈" — 이런 식으로 다음 행동을 유도하면 재방문율이 높아집니다.

### 🔨 채찍맨
스펙은 깔끔하다. tool 3개 + resource 1개 + prompt 1개. 적절한 사이즈.

다만 개발자대변인의 "다음 행동 힌트" 제안은 v1.1으로 미뤄. MVP에서는 카드 출력만 제대로 하자. **기능을 더 추가하려는 유혹을 이겨내야 1주일 안에 끝남**.

### 😈 비관론자
스펙 자체는 깔끔하다. 기술적 리스크를 짚겠다.

1. **git log 파싱 신뢰성**: \`--format="%H|%an|%ae|%at|%s"\` 같은 고정 포맷을 써야 OS 간 차이 방지. 이거 빌더가 확인했나?

2. **커밋 메시지 분석의 한계**: \`fix\`, \`bug\` 같은 키워드로 카드 종류를 판단하는데, 한국어 커밋 메시지는? "버그 수정"이라고 쓰면 \`bug\` 키워드에 안 걸림. 다국어 지원 또는 키워드 확장 필요.

3. **prompt 기능의 불확실성**: MCP prompt가 실제로 Claude가 자동으로 도구를 호출하게 만드는지, 아니면 그냥 추천 프롬프트인지 확인 필요. 후자라면 "매일 자동으로" 효과가 제한적.

크리티컬한 건 아니지만, 빌더가 2번(다국어 커밋)을 어떻게 처리할지 다음 라운드에서 답 달아줘.

### 📢 바이럴전략가
스펙이 확정되었으니 데모 시나리오를 구체화합니다.

**킬러 데모 GIF (30초)**:
- (0-5초) Claude Code 화면. "오늘 하루 열심히 코딩했는데, 결과 보여줘"
- (5-15초) Claude가 \`get_coding_card\` 호출 → 마크다운 카드 출력. "🔥 **Code Warrior** — EPIC!"
- (15-25초) "업적도 보여줘" → 업적 리스트 출력. "🏆 새 업적 해금: First Epic Card!"
- (25-30초) "이번 주 통계는?" → 주간 통계 요약. 커밋 그래프 (텍스트 기반)

**README 카드 갤러리 섹션** — 모든 카드를 마크다운 표로 보여주면 README 자체가 볼거리:

\`\`\`markdown
## 🃏 카드 갤러리

| 카드 | 희귀도 | 조건 |
|------|--------|------|
| ⚔️ Bug Slayer | ★★★ RARE | fix/bug 키워드 커밋 5개+ |
| 🧹 Code Janitor | ★★★★ EPIC | 삭제 > 추가의 2배 |
| 🌙 Night Owl | ★★★★ EPIC | 새벽 0-4시 커밋 |
| 🎄 Christmas Coder | ★★★★★ LEGENDARY | 12/25 커밋 (히든) |
\`\`\`

이 갤러리가 README에 있으면 "이거 다 모으고 싶다!" 하고 설치하게 됨.

## 라운드 6 — 3단계: DX & MCP 스펙 설계 (확정)

### 🎙️ 사회자
빌더가 비관론자의 다국어 커밋 메시지 문제에 답해야 합니다. 그리고 이번 라운드에서 카드 풀과 업적 목록을 최종 확정합시다.

### 🔍 MCP생태계분석가
보충 리서치 결과: MCP 프로토콜에서 prompt는 **"추천 프롬프트"** 역할입니다. Claude가 자동으로 호출하는 게 아니라, 사용자가 \`/\` 메뉴에서 선택할 수 있는 템플릿이에요. 비관론자의 우려가 맞았습니다.

다만 이건 큰 문제가 아닙니다. prompt가 \`/daily_wrap_up\`으로 등록되면, 사용자가 하루 끝에 슬래시 하나 치고 선택하면 됩니다. 완전 자동은 아니지만 **한 번의 클릭으로 카드+통계가 한번에** 나오는 건 충분히 편한 UX입니다.

### 💡 기발한놈
비관론자가 짚은 다국어 커밋 메시지 문제, 내가 해결책을 제안하겠어.

키워드 기반 판별 대신, **git diff 통계 기반**으로 카드를 결정하면 돼:
- "Bug Slayer" → 커밋 메시지에 fix/bug 대신, **작은 파일 여러 개 수정** 패턴으로 판별
- "Refactor King" → **삭제 > 추가** 비율로 판별 (이건 이미 그럼)
- "Feature Builder" → **새 파일 추가 + 큰 추가 라인** 패턴

커밋 메시지는 **부가 정보**로만 사용하고, **핵심 판별은 숫자 기반**으로 하면 언어 문제 완전 해소! 메시지 키워드가 매칭되면 보너스 포인트 느낌으로.

### 🛠️ 빌더
기발한놈의 제안을 반영합니다. 카드 판별 로직을 수정합니다.

\`\`\`typescript
// 카드 판별: 숫자 기반 (primary) + 키워드 (secondary bonus)
interface GitStats {
  commits: number;
  filesChanged: number;
  filesAdded: number;       // 새로 생성된 파일
  linesAdded: number;
  linesRemoved: number;
  latestCommitHour: number; // 0-23
  commitMessages: string[];
  streakDays: number;       // 연속 커밋 일수
  isWeekend: boolean;
  dayOfYear: number;        // 히든 카드용 날짜
}

// git log 포맷 고정 (OS 간 차이 방지)
const GIT_LOG_FORMAT = '--format="%H|%an|%at|%s"';
const GIT_DIFF_STAT = '--stat --stat-width=999';

// 예시: Night Owl 카드 — 순수 시간 기반
{
  id: 'night_owl',
  title: 'Night Owl',
  emoji: '🌙',
  rarity: 'epic',
  check: (s) => s.latestCommitHour >= 0 && s.latestCommitHour <= 4 && s.commits >= 3,
  flavor: '새벽의 코더. 세상이 잠든 시간에 코드는 깨어있다.'
}

// 예시: Feature Builder — 숫자 기반 (메시지 무관)
{
  id: 'feature_builder',
  title: 'Feature Builder',
  emoji: '🏗️',
  rarity: 'rare',
  check: (s) => s.filesAdded >= 3 && s.linesAdded >= 200,
  flavor: '새 기능의 설계자. 오늘 코드베이스가 한 뼘 더 컸다.'
}
\`\`\`

비관론자의 git log 파싱 문제: \`--format\` 플래그로 고정 포맷 사용. \`|\` 구분자로 파싱. 이건 OS 독립적입니다.

### 👤 개발자대변인
숫자 기반 판별이 언어 독립적이라 글로벌 사용에 적합합니다. 좋은 결정이에요.

최종 DX 확인 사항:
- "오늘의 카드" → \`get_coding_card\` (1회 호출, 자동 판별)
- "업적 보여줘" → \`get_achievements\` (1회 호출)
- "이번 주 통계" → \`get_coding_stats\` (1회 호출)
- \`/daily_wrap_up\` → 카드 + 통계 일괄 출력

모든 사용 시나리오가 **한마디 또는 한 번의 선택**으로 완료됩니다. DX 최종 합격.

### 🔨 채찍맨
카드 풀 최종 확정. 이 리스트가 MVP의 전부야. 더 추가하지 마.

**MVP 카드 15종 + 히든 3종 = 총 18종**

일반 카드 (15종):
- Common (5종): Steady Coder, Quick Fix, Small Change, Daily Driver, Code Scribe
- Rare (5종): Bug Slayer, Feature Builder, Multi-Tasker, Speed Demon, Code Reviewer
- Epic (3종): Night Owl, Code Janitor, Marathon Coder
- Legendary (2종): Thousand Lines, Streak Master (30일 연속)

히든 카드 (3종):
- Christmas Coder, Halloween Hacker, Centurion (100번째 커밋)

업적 15개:
- First Card, First Rare, First Epic, First Legendary
- 5 Different Cards, 10 Different Cards
- Bug Slayer x3, Night Owl x3
- Week Streak (7일), Month Streak (30일)
- 1000 Lines Day, 50 Files Day
- All Common, All Rare, Easter Egg Found

끝. 이 이상 추가 없다.

### 😈 비관론자
기발한놈의 숫자 기반 판별 + 빌더의 고정 포맷 git log로 내 우려사항 2개가 해소됐다. 인정한다.

남은 리스크:
1. **카드 중복 문제**: 매일 "Steady Coder" (Common)만 나오면 지루해. 같은 카드가 연속으로 나왔을 때 처리 로직이 필요해. "어제도 Steady Coder였는데요" → "오늘은 다른 각도: 코밋 타이밍 기준으로 보면..." 같은 변주가 있어야 함. 하지만 이건 v1.1으로 미뤄도 됨.

2. **prompt의 한계**: 자동이 아니라 수동 트리거라는 걸 README에 솔직하게 써야 해. "매일 자동으로 카드가 나옵니다" 같은 오해 유발 문구 금지.

전반적으로 리스크가 관리 가능한 수준이다. 스펙 확정에 동의.

### 📢 바이럴전략가
스펙이 확정되었으니, README 구조를 최종화합니다.

\`\`\`markdown
# mcp-code-pulse 🃏

> Git commits → Collectible coding cards. Gamify your coding sessions!

[Hero GIF: 30초 데모]

## 🚀 Quick Start (30초)
\\\`\\\`\\\`json
// claude_desktop_config.json에 추가
{
  "mcpServers": {
    "code-pulse": {
      "command": "npx",
      "args": ["-y", "mcp-code-pulse"]
    }
  }
}
\\\`\\\`\\\`

## 🃏 Card Gallery
[전체 카드 테이블 — 이름, 희귀도, 조건, 이모지]

## 🏆 Achievements
[전체 업적 테이블]

## 📊 Stats
[통계 스크린샷]

## ❓ How It Works
Git history → Pattern analysis → Card generation

## 🤝 Contributing
- Add new cards: PR with card definition
- Add new achievements: PR with achievement definition
\`\`\`

이 README 구조면 **카드 갤러리 자체가 바이럴 콘텐츠**. "이 카드 다 모으고 싶다"가 설치 동기가 됨.

최종 성공 목표:
- 1주: 80+ stars, npm 150+ downloads
- 1달: 200+ stars, 커뮤니티 카드 PR 3개+
- 3달: 500+ stars, "가장 재미있는 MCP 서버" 포지션 확보

## 라운드 7 — 4단계: 기술 구현 & MVP

### 🎙️ 사회자
이번 라운드에서 기술 스택, 프로젝트 구조, 개발 일정을 최종 확정합니다. 빌더가 주도하고, 채찍맨이 스코프를 감시합니다.

### 🔍 MCP생태계분석가
MCP 서버 기술 스택 트렌드를 보면, TypeScript + \`@modelcontextprotocol/sdk\`가 압도적 다수입니다. Python SDK도 있지만, npm 배포 (\`npx\`) 원스텝 설치를 위해서는 TypeScript가 필수입니다. 이건 논쟁의 여지가 없어요.

빌드 도구는 \`tsup\`이 MCP 서버 표준으로 자리잡고 있고, \`esbuild\` 기반이라 빌드가 빠릅니다.

### 💡 기발한놈
기술 얘기는 빌더 영역이니 짧게만. 하나 아이디어 추가: **카드 데이터를 로컬 JSON 파일에 저장**하면, "내가 지금까지 모은 카드 컬렉션"을 볼 수 있어. \`.code-pulse/cards.json\` 같은 파일로.

이러면 업적 판별도 쉬워지고, "지금까지 획득한 카드 보여줘" 같은 기능도 가능해. 저장 없이 매번 git log만 파싱하면 히스토리 카드를 볼 수 없잖아.

### 🛠️ 빌더
기발한놈의 제안 채택. 로컬 저장소가 필요합니다.

**기술 스택 (최종)**:

| 카테고리 | 선택 | 이유 |
|----------|------|------|
| 런타임 | Node.js 18+ | MCP SDK 최소 요구사항 |
| 언어 | TypeScript (strict) | MCP 생태계 표준, 타입 안전성 |
| MCP SDK | @modelcontextprotocol/sdk | 공식 SDK, tool/resource/prompt 지원 |
| 전송 | stdio | Claude Desktop/Code 표준 전송 방식 |
| 스키마 검증 | zod | MCP SDK 내장 의존성, 추가 설치 불필요 |
| 빌드 | tsup | 빠른 ESM/CJS 번들링 |
| 패키지 매니저 | npm | npx 설치 호환 |
| 로컬 저장소 | JSON 파일 | SQLite 불필요 — 카드/업적 데이터량이 적음 |
| 외부 API | 0개 | 완전 로컬 — git CLI만 사용 |

**프로젝트 구조**:
\`\`\`
mcp-code-pulse/
├── src/
│   ├── index.ts          # MCP 서버 엔트리포인트
│   ├── tools/
│   │   ├── get-coding-card.ts
│   │   ├── get-achievements.ts
│   │   └── get-coding-stats.ts
│   ├── core/
│   │   ├── git-parser.ts     # git log 파싱 엔진
│   │   ├── card-engine.ts    # 카드 판별 + 렌더링
│   │   ├── achievement-engine.ts
│   │   └── stats-engine.ts
│   ├── data/
│   │   ├── cards.ts          # 카드 풀 정의 (18종)
│   │   └── achievements.ts   # 업적 정의 (15개)
│   └── storage/
│       └── local-store.ts    # .code-pulse/ JSON 저장소
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
\`\`\`

**git-parser.ts 핵심 로직**:
\`\`\`typescript
import { execSync } from 'child_process';

interface GitStats {
  commits: number;
  filesChanged: number;
  filesAdded: number;
  linesAdded: number;
  linesRemoved: number;
  latestCommitHour: number;
  commitMessages: string[];
  streakDays: number;
  isWeekend: boolean;
  dayOfYear: number;
}

export function getGitStats(period: string, projectPath: string): GitStats {
  const since = periodToSince(period);
  const log = execSync(
    \`git log \${since} --format="%H|%an|%at|%s" --numstat\`,
    { cwd: projectPath, encoding: 'utf-8' }
  );
  return parseGitLog(log);
}
\`\`\`

의존성은 **MCP SDK + zod + tsup** 뿐. 외부 API 0개, 추가 런타임 의존성 0개.

### 👤 개발자대변인
\`.code-pulse/\` 디렉토리가 프로젝트 루트에 생기는 건 \`.gitignore\`에 추가하라는 안내가 필요합니다.

설치 후 첫 사용 시:
1. git 저장소 확인 → 없으면 에러 메시지
2. \`.code-pulse/\` 디렉토리 자동 생성
3. 카드 생성 + 저장
4. 마크다운 출력

이 플로우면 첫 경험이 매끄럽습니다. 다만, \`.code-pulse/\`를 \`.gitignore\`에 자동으로 추가할지, 사용자에게 안내만 할지는 결정 필요. 저는 **안내만** 하는 걸 추천합니다. 사용자 프로젝트 파일을 자동 수정하는 건 UX 위반.

### 🔨 채찍맨
기술 스택 OK. 프로젝트 구조 OK. 스코프 내에 있다.

**1주 개발 일정 (최종)**:

| 일차 | 작업 | 산출물 |
|------|------|--------|
| Day 1 | 프로젝트 셋업 + git-parser.ts | git log 파싱 동작 확인 |
| Day 2 | card-engine.ts + 카드 18종 정의 | 카드 생성 + 마크다운 렌더링 |
| Day 3 | get-coding-card tool + get-coding-stats tool | 2개 tool MCP 연동 |
| Day 4 | achievement-engine + get-achievements tool + local-store | 업적 시스템 + 저장소 |
| Day 5 | resource + prompt + README + npm 배포 + 데모 GIF | v1.0 출시! |

이 일정에서 **Day 2가 가장 무거움** — 카드 18종의 판별 조건과 마크다운 렌더링 함수를 다 만들어야 해. 하지만 카드 정의가 JSON-like 구조라서 1일이면 충분.

### 😈 비관론자
기술 스택과 일정은 합리적이다. 한 가지만.

**execSync의 위험**: \`child_process.execSync\`로 git 명령어를 실행하는데, 이건 프로세스를 블로킹해. MCP 서버가 다른 요청을 받는 동안 git log가 느리면 전체가 멈춤. \`execFile\`(비동기) + 타임아웃 설정이 더 안전해.

대형 repo에서 \`git log --since="1 year ago"\`가 10초 걸리면? 타임아웃 5초 설정하고, 초과하면 "기간을 줄여보세요"라는 친절한 에러 반환.

이거 하나만 빌더가 반영하면 기술 리스크는 충분히 관리된다.

### 📢 바이럴전략가
기술 구현 단계에서 바이럴 관련 한 가지만 추가.

**npm 패키지 설명**: \`"Gamify your coding sessions! Git commits become collectible trading cards."\`
이 한 줄이 npm 검색에서 클릭을 만들어요.

**npm keywords**: \`["mcp", "claude", "coding-cards", "gamification", "git", "developer-tools", "ai", "coding-stats"]\`

npm에서 "mcp" 검색하면 이 패키지가 "gamification"이라는 독특한 키워드로 눈에 띌 겁니다. 다른 MCP 서버는 전부 "utility", "tool", "api" 같은 뻔한 키워드니까요.

## 라운드 8 — 5단계: 최종 검증 & 확산 전략

### 🎙️ 사회자
최종 라운드입니다. 비관론자의 Go/No-Go 판정, 리스크 매트릭스 확정, 런칭 계획을 마무리합니다. 간결하게 갑시다.

### 🔍 MCP생태계분석가
최종 포지셔닝 확인: mcp-code-pulse는 **MCP 생태계 최초의 게이미피케이션 서버**입니다. 경쟁자 0, 카테고리 창시. 이 포지셔닝은 확산에 매우 유리합니다. "세계 최초의 X"는 언론과 커뮤니티에서 항상 관심을 끕니다.

MCP 생태계는 2026년 초 현재 빠르게 성장 중이고, "실용성"만 있던 생태계에 "재미" 요소를 도입하는 건 타이밍이 좋습니다.

### 💡 기발한놈
마지막으로 하나만. 이 프로젝트가 성공하면 **시리즈 확장**이 가능해:
- \`mcp-code-pulse\` → 코딩 카드/업적 (v1)
- \`mcp-code-battle\` → 팀/유저 간 카드 대전 (v3+)
- \`mcp-code-quest\` → 일일 퀘스트/미션 시스템 (v2)

지금은 MVP만 하지만, "code-pulse 유니버스"로 확장 가능한 기반을 만든 거야. 이건 장기적으로 커뮤니티 명성에 큰 기여를 할 수 있어.

### 🛠️ 빌더
비관론자의 execSync 지적을 반영합니다. 최종 기술 결정:

\`\`\`typescript
// execFile (비동기) + 타임아웃 사용
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

async function runGitCommand(args: string[], cwd: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync('git', args, {
      cwd,
      timeout: 5000, // 5초 타임아웃
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });
    return stdout;
  } catch (error) {
    if (error.killed) {
      throw new Error('git 명령어가 시간 초과되었습니다. 더 짧은 기간을 지정해보세요.');
    }
    throw error;
  }
}
\`\`\`

비동기 + 타임아웃 + maxBuffer 설정으로 대형 repo에서도 안전합니다.

최종 기술 체크리스트:
- ✅ TypeScript strict mode
- ✅ MCP SDK 공식 사용
- ✅ 비동기 git 명령어 + 타임아웃
- ✅ 고정 포맷 git log (OS 독립)
- ✅ 숫자 기반 카드 판별 (언어 독립)
- ✅ 로컬 JSON 저장소 (외부 의존성 0)
- ✅ 의존성 최소화 (MCP SDK + zod + tsup)

### 👤 개발자대변인
최종 DX 확인. 개발자 입장에서의 전체 경험 요약:

1. **발견**: npm/GitHub에서 "mcp code" 검색 → 카드 갤러리가 눈에 띔
2. **설치**: config 3줄 추가 → 30초
3. **첫 사용**: "오늘의 카드 보여줘" → 마크다운 카드 출력 → "오 재밌다!"
4. **습관화**: 매일 하루 끝에 카드 확인 → 희귀 카드 수집 → 업적 해금
5. **공유**: 스크린샷 → X/Reddit → "이거 뭐야?" → 바이럴

이 5단계 플로우가 **자연스럽게 이어집니다**. 거부권 행사 사유 없음. 이 프로젝트를 지지합니다.

### 🔨 채찍맨
최종 확인. 스코프 내에 있고, 1주 일정이 현실적이다. 더 이상 추가 기능 제안은 전부 기각. 기발한놈의 시리즈 확장은 좋은 비전이지만, 지금은 MVP에만 집중.

MVP 출시 조건:
- Tool 3개 정상 동작
- 카드 18종 판별 정상
- 업적 15개 판별 정상
- npm 배포 성공
- README + 데모 GIF 완성

이 5가지 만족하면 v1.0 출시. 나머지는 전부 v1.1+.

### 😈 비관론자
**최종 No-Go 판정**을 내리겠습니다.

| 지표 | 값 | 기준 | 판정 |
|------|-----|------|------|
| 기존 대안 | MCP 영역 0 stars. WakaTime은 카테고리 다름 | < 100 stars MCP | ✅ PASS |
| 개발자 필요성 | 주 5회+ (매일 카드 확인) | > 주 1회 | ✅ PASS |
| MVP 개발 | 5일 (tool 3개, 카드 18종) | < 2주 | ✅ PASS |
| 차별점 | 3개 (카드 시스템, 게이미피케이션, 마크다운 렌더링) | > 0개 | ✅ PASS |
| 바이럴 잠재력 | 카드 스크린샷 = 공유 가능 콘텐츠 | 임팩트 있음 | ✅ PASS |
| 유지보수 부담 | 외부 API 0개, 핵심 deps 3개 | < 3개 외부 API | ✅ PASS |

**6개 항목 전부 PASS.**

내 최종 판정: **Go**.

남은 리스크 (관리 가능):
1. 카드 지루해짐 위험 → v1.1에서 시즌제 카드 추가로 대응
2. 대형 repo 성능 → 타임아웃 + 기간 제한으로 대응
3. .code-pulse 디렉토리 관리 → README에 .gitignore 안내
4. prompt 자동 호출 한계 → 수동 트리거 UX 최적화

리스크 4개 전부 치명적이지 않고, 대응 방안이 있다. **Go with confidence.**

### 📢 바이럴전략가
비관론자의 Go 판정이 나왔으니, **런칭 플랜을 확정**합니다.

**D-Day 런칭 순서**:
1. npm 배포: \`npm publish\` → \`mcp-code-pulse\` npm에 등록
2. GitHub public repo 생성 → README 완성 → 데모 GIF 첨부
3. r/ClaudeAI 포스트: "I built an MCP that turns your git commits into collectible coding cards 🃏"
   - 본문에 데모 GIF + 설치 가이드 + 카드 갤러리 미리보기
4. Show HN: "Show HN: mcp-code-pulse – Git commits become trading cards in your AI coding assistant"
5. X(Twitter): 카드 스크린샷 + "What's your rarest card?" 질문형 트윗
   - 해시태그: #ClaudeCode #MCP #CodingCards #DevLife

**D+1~7 팔로업**:
- Reddit 댓글에 적극 대응 (설치 도움, 카드 추가 요청 수렴)
- GitHub Issues에 "Card Request" 템플릿 추가 → 커뮤니티 참여 유도
- 첫 외부 PR 머지 시 X에 감사 트윗

**성공 지표 (최종)**:
- 1주: GitHub 80+ stars, npm 150+ weekly downloads
- 1달: 200+ stars, 외부 카드 PR 3개+
- 3달: 500+ stars, "MCP 생태계 가장 재미있는 서버" 포지션

**실패 시 출구**: 2주 내 20 stars 미만이면, 카드 방향을 접고 \`mcp-git-insight\`(git 분석 실용 도구)로 피벗 검토.

**최종 한줄 요약**: mcp-code-pulse는 MCP 생태계에 **재미**라는 새로운 카테고리를 만드는 프로젝트이며, git 기반 자동 데이터 수집 + 카드 게이미피케이션 + 마크다운 렌더링의 조합으로 바이럴 잠재력이 높습니다. **Go!**
`

export default function MinutesPage() {
  const data = parseMeetingMarkdown(MEETING_MARKDOWN)
  return <MeetingViewer {...data} projectId="mcp-claude-fun" projectTitle="mcp-code-pulse" />
}
