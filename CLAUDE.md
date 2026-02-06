# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

MCP(Model Context Protocol) 서버 아이디어를 8인 전문가 패널로 검증하는 브레인스토밍 허브.
개발자 커뮤니티에서 명성을 쌓기 위한 오픈소스 MCP 서버 컬렉션 기획 시스템.

## 환경

- **Platform:** Windows (Git Bash shell)
- **Location:** `E:\mcp hub`
- **Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **Node:** npm 기반

## 주요 커맨드

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run generate     # 페이지 자동 생성 (generate-all.mts)
npx tsx scripts/post-brainstorm.mts <folder> --id <id> --title <title> --subtitle <subtitle>
```

## 아키텍처

### 디렉토리 구조

```
E:\mcp hub/
├── agents/
│   ├── brainstorm/AGENT.md    # 8인 전문가 브레인스토밍 에이전트
│   ├── reviewer/AGENT.md      # 산출물 검증 에이전트
│   └── deployer/AGENT.md      # 빌드 + Git + 배포 에이전트
├── memory/                     # 브레인스토밍 결과 저장
│   └── {project}/
│       ├── minutes.md          # 회의록 원본
│       ├── config.json         # 프로젝트 메타데이터
│       └── brainstorm-meta.json
├── scripts/
│   ├── generate-all.mts       # MD → TSX 페이지 생성
│   ├── post-brainstorm.mts    # config.json 생성 유틸
│   └── lib/
│       ├── md-to-jsx.mts      # 마크다운 → JSX 변환
│       └── types.mts          # 타입 정의
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx           # 홈페이지 (프로젝트 목록)
│   │   └── {project-id}/      # 자동 생성 프로젝트 페이지
│   ├── components/
│   │   ├── meeting/           # 회의록 뷰어 (6개 컴포넌트)
│   │   ├── page-shell.tsx     # 공통 페이지 셸
│   │   ├── ui/                # shadcn/ui 컴포넌트
│   │   └── QuickStartBanner.tsx
│   └── lib/
│       ├── meeting-parser.ts  # 회의록 마크다운 파서
│       └── meeting-types.ts   # Speaker 타입 + SPEAKERS 맵
└── STYLE_GUIDE.md             # 디자인 시스템 가이드
```

### 에이전트 체인

1. **brainstorm** → 8인 전문가 패널이 MCP 서버 아이디어를 8라운드 검증
   - 산출물: `memory/{project}/minutes.md` + `plan.md` + `PRD.md`
2. **reviewer** → 산출물 품질 검증 (9섹션 기획서 + 5섹션 PRD + 회의록 체크)
3. **deployer** → `generate-all.mts` 실행 → Git commit → Vercel 배포

### 8인 전문가 패널

| # | 역할 | 핵심 기능 |
|---|------|---------|
| 1 | 🎙️ 사회자 | 토론 주관 + 서기 |
| 2 | 🔍 MCP생태계분석가 | 기존 MCP 서버 분석 |
| 3 | 💡 기발한놈 | 창의적 관점 |
| 4 | 🛠️ 빌더 | MCP SDK + 프로토콜 설계 |
| 5 | 👤 개발자대변인 | DX 검증 + 거부권 |
| 6 | 🔨 채찍맨 | 일정 단축 |
| 7 | 😈 비관론자 | No-Go 판정 |
| 8 | 📢 바이럴전략가 | 커뮤니티 확산 |

## 컨벤션

- 각 MCP 서버 아이디어는 `memory/` 하위 폴더로 관리
- 페이지는 `scripts/generate-all.mts`로 자동 생성 (수동 작성 금지)
- 디자인은 `STYLE_GUIDE.md` 준수 (시맨틱 토큰, Lucide 아이콘)
- 회의록은 MeetingViewer 컴포넌트 사용
- 기획서/docs는 PageShell 컴포넌트 사용
