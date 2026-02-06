# STYLE_GUIDE.md — MCP Hub 디자인 가이드

> **에이전트가 페이지를 생성/수정할 때 반드시 이 파일을 읽고 준수할 것!**

---

## 디자인 시스템 개요

- **테마**: 라이트 (v0_light 기반)
- **CSS 변수**: `src/app/globals.css` (:root)에 oklch 색상 정의
- **토큰 방식**: Tailwind 시맨틱 토큰 (`bg-card`, `text-foreground` 등) — 하드코딩 hex/색상 금지

---

## 🎨 배경색 규칙

### 시맨틱 토큰 사용 (필수)

| 용도 | 클래스 | 실제 색상 |
|------|--------|----------|
| 페이지 배경 | `bg-background` | oklch(0.98) — 거의 흰색 |
| 카드/컨테이너 | `bg-card` | oklch(1) — 순백 |
| 반투명 카드 | `bg-card/50` | 50% 투명 |
| 보조 영역 | `bg-secondary` | oklch(0.95) — 연회색 |
| 코드블록/인풋 | `bg-secondary/50` | |
| 컬러 강조 배경 | `bg-{color}-500/10` | 10% 투명도 |
| 뱃지/태그 배경 | `bg-{color}-500/20` | 20% 투명도 |

### ❌ 금지

```
bg-white           ❌ → bg-card 사용
bg-[#f8f9fa]       ❌ → bg-secondary 사용
bg-gray-50         ❌ → bg-secondary 사용
bg-gray-100        ❌ → bg-secondary 사용
bg-{color}-50      ❌ → bg-{color}-500/10 사용
bg-{color}-100     ❌ → bg-{color}-500/20 사용
bg-gray-900        ❌ 다크 테마 전용
```

---

## 🔤 텍스트 색상 규칙

### 시맨틱 토큰 우선

| 용도 | 클래스 | 실제 색상 |
|------|--------|----------|
| 본문 | `text-foreground` | oklch(0.15) — 거의 검정 |
| 보조 텍스트 | `text-muted-foreground` | oklch(0.45) — 중간 회색 |
| 컬러 강조 (본문) | `text-{color}-600` | 라이트 배경에서 높은 대비 |
| 컬러 강조 (배지) | `text-{color}-600` | 배지 텍스트 |
| 프라이머리 | `text-primary` | oklch(0.5) — 보라 |

### ❌ 금지

```
text-gray-900      ❌ → text-foreground
text-gray-700      ❌ → text-foreground 또는 text-muted-foreground
text-gray-600      ❌ → text-muted-foreground
text-gray-500      ❌ → text-muted-foreground
text-gray-400      ❌ → text-muted-foreground
text-{color}-400   ❌ → text-{color}-600 (라이트 배경에서 -400은 대비 부족)
text-{color}-300   ❌ 다크 테마 전용
text-[#1a1a1a]     ❌ 하드코딩 금지
text-white         ❌ (bg-{color}-500 위에서만 허용)
```

---

## 🔲 테두리 규칙

- 기본: `border-border` (시맨틱 토큰)
- 컬러: `border-{color}-500/50` 또는 `border-{color}-500/30`
- 구분선: `border-border`

### ❌ 금지

```
border-gray-200    ❌ → border-border
border-gray-300    ❌ → border-border
border-{color}-300 ❌ → border-{color}-500/50
border-white/10    ❌ 다크 테마 전용
```

---

## 📐 레이아웃 규칙

### 기획서/docs/report 페이지 구조 (PageShell)

`generate-all.mts`가 생성하는 모든 기획서/docs/report 페이지는 **PageShell 컴포넌트**를 사용한다:

```tsx
import { PageShell } from '@/components/page-shell';

export default function DetailPage() {
  return (
    <PageShell
      projectId="project-id"
      projectTitle="프로젝트명"
      subtitle="설명"
      activeTab="main"  // 'main' | 'minutes' | 'docs' | 'report'
      date="2026-02-01"
      badges={[{ label: '태그', className: 'bg-blue-500/20 text-blue-600' }]}
      hasReport={false}
    >
      {/* 콘텐츠 */}
    </PageShell>
  );
}
```

**PageShell 구성:**
- 그라데이션 헤더 카드 (`bg-gradient-to-br from-card via-card to-primary/5`) + 배경 블롭 장식
- sticky 상단 네비게이션 바 (프로젝트명 + 탭: 기획서/회의록/Docs/완료보고)
- `max-w-7xl` 외부 레이아웃, `max-w-4xl` 콘텐츠 영역

### 회의록 페이지 구조

회의록은 **MeetingViewer 컴포넌트**를 사용한다 (별도 섹션 참조).

### 테이블

- 반드시 `<div className="table-wrap">` 으로 감싸기
- 헤더: `text-muted-foreground`
- 호버: `hover:bg-secondary/30`
- 3열 이하 권장

---

## 🗒️ 회의록 디자인 시스템

### MeetingViewer 컴포넌트 (필수)

회의록 페이지는 정적 JSX가 아니라 **MeetingViewer 컴포넌트**를 사용한다:

```tsx
'use client'

import { MeetingViewer } from '@/components/meeting/meeting-viewer'
import { parseMeetingMarkdown } from '@/lib/meeting-parser'

const MEETING_MARKDOWN = `원본 마크다운 전체`

export default function MinutesPage() {
  const data = parseMeetingMarkdown(MEETING_MARKDOWN)
  return <MeetingViewer {...data} projectId="project-id" projectTitle="프로젝트명" />
}
```

### 구성 컴포넌트

| 컴포넌트 | 파일 | 역할 |
|----------|------|------|
| MeetingViewer | `src/components/meeting/meeting-viewer.tsx` | 메인 뷰어 (사이드바+본문) |
| MeetingHeader | `src/components/meeting/meeting-header.tsx` | 헤더 카드 (메타 정보) |
| RoundSection | `src/components/meeting/round-section.tsx` | 접기/펼치기 라운드 |
| MessageCard | `src/components/meeting/message-card.tsx` | 발언 카드 (아바타+커넥터) |
| SpeakerLegend | `src/components/meeting/speaker-legend.tsx` | 전문가 범례 |
| TableOfContents | `src/components/meeting/table-of-contents.tsx` | 사이드바 TOC |

### Speaker 색상 (meeting-types.ts)

배지 전용이므로 `-400` 유지 (작은 텍스트 + 배경색 조합):
```
bg-{color}-500/20 text-{color}-400 border-{color}-500/30
```

### 마크다운 형식

파서가 처리하는 형식:
- `## 라운드 N — M단계: 제목` (라운드+단계)
- `## 라운드 N: 제목` (라운드만)
- `### 🎙️ 사회자` (h3 역할)
- `🎙️ **[사회자]**` (브래킷 역할)
- `**🎙️ 사회자:** 내용` (콜론 역할)

---

## 🎨 색상 맵 (코드 생성 시)

페이지 생성 스크립트에서 사용하는 12색 맵:

| 용도 | 형식 |
|------|------|
| 텍스트 강조 | `text-{color}-600` |
| 뱃지 (light) | `bg-{color}-500/20 text-{color}-600` |
| 뱃지 (outline) | `border-{color}-500/50 text-{color}-600` |
| 뱃지 (filled) | `bg-{color}-500 text-white` |
| 배경 강조 | `bg-{color}-500/10` |
| 왼쪽 테두리 | `border-l-{color}-500` |
| 위쪽 테두리 | `border-t-{color}-500` |
| 섹션 강조 박스 | `border-2 border-{color}-500 bg-card` |

---

## 📱 반응형 규칙

### 테이블 반응형 (필수!)

```tsx
<div className="table-wrap">
  <table className="w-full text-sm border-collapse">
    <thead><tr className="border-b border-border">
      <th className="text-left px-2 py-2 font-semibold text-muted-foreground">헤더</th>
    </tr></thead>
    <tbody><tr className="border-b border-border hover:bg-secondary/30">
      <td className="px-2 py-2 text-muted-foreground">데이터</td>
    </tr></tbody>
  </table>
</div>
```

- ScrollArea 사용 금지 (overflow-hidden 이슈)

---

## 🔷 Lucide 아이콘 규칙

### 이모지 대신 Lucide (회의록 역할 이모지는 예외)

```tsx
import { FileText, Code, ClipboardList, ArrowLeft } from 'lucide-react';

// ✅ Lucide
<span className="inline-flex items-center gap-1"><ClipboardList size={14} />회의록</span>
```

### 크기 규칙

- 네비게이션 링크: `size={14}`
- 섹션 헤더: `size={20}` ~ `size={24}`
- 페이지 타이틀 옆: `size={32}`

---

## 🚫 안티패턴

1. **하드코딩 색상** — `bg-white`, `text-gray-900`, `#f8f9fa` 등 ❌ → 시맨틱 토큰
2. **다크 테마 색상** — `text-{color}-300`, `text-{color}-400`, `bg-gray-900` 등 ❌
3. **인라인 스타일 남발** — Tailwind 클래스 우선
4. **배경색으로 섹션 구분** — 테두리+간격으로 구분 ✅
5. **테이블을 `table-wrap` div 없이 사용** ❌
6. **ScrollArea 사용** ❌ (overflow-hidden 이슈)
7. **정적 JSX 회의록** — MeetingViewer 컴포넌트 사용 ✅
8. **기획서/docs에서 수동 nav/header** — PageShell 컴포넌트 사용 ✅

---

## ✅ 체크리스트 (페이지 생성 시)

- [ ] 시맨틱 토큰 사용 (`bg-card`, `text-foreground`, `border-border`)
- [ ] 컬러 강조 텍스트는 `-600` 사용 (`-400`/`-300` 금지)
- [ ] 테이블이 `table-wrap`으로 감싸져 있는가?
- [ ] 회의록은 MeetingViewer 컴포넌트를 사용하는가?
- [ ] 기획서/docs/report는 PageShell 컴포넌트를 사용하는가?
- [ ] 모바일에서 가독성 확보 (WCAG AA: 본문 4.5:1, 대형 텍스트 3:1)
- [ ] 테이블 3열 이하인가?
