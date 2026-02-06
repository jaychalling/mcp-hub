/**
 * MD → JSX 변환 유틸리티
 * - mdToLightJsx: shadcn/ui + Tailwind CSS 출력
 * - extractSections: ## 제목에서 sections 배열 자동 추출
 */

// 역할별 테두리 색상 매핑 (회의록 발언 카드용)
const ROLE_COLOR_MAP: Record<string, string> = {
  '사회자': 'blue',
  'MCP생태계분석가': 'indigo',
  '기발한놈': 'yellow',
  '빌더': 'orange',
  '개발자대변인': 'purple',
  '채찍맨': 'red',
  '비관론자': 'rose',
  '바이럴전략가': 'green',
};

// Badge 색상 Tailwind 클래스
const ROLE_BADGE_CLASS: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  red: 'bg-red-100 text-red-700',
  red600: 'bg-red-100 text-red-700',
  red700: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet: 'bg-violet-100 text-violet-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  orange: 'bg-orange-100 text-orange-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  lime: 'bg-lime-100 text-lime-700',
  teal: 'bg-teal-100 text-teal-700',
  pink: 'bg-pink-100 text-pink-700',
  purple: 'bg-purple-100 text-purple-700',
  rose: 'bg-rose-100 text-rose-700',
  gray: 'bg-gray-100 text-gray-700',
};

// Border-left Tailwind 클래스
const ROLE_BORDER_CLASS: Record<string, string> = {
  blue: 'border-l-blue-500',
  red: 'border-l-red-500',
  red600: 'border-l-red-600',
  red700: 'border-l-red-700',
  green: 'border-l-green-500',
  emerald: 'border-l-emerald-500',
  violet: 'border-l-violet-500',
  cyan: 'border-l-cyan-500',
  yellow: 'border-l-yellow-500',
  orange: 'border-l-orange-500',
  indigo: 'border-l-indigo-500',
  lime: 'border-l-lime-500',
  teal: 'border-l-teal-500',
  pink: 'border-l-pink-500',
  purple: 'border-l-purple-500',
  rose: 'border-l-rose-500',
  gray: 'border-l-gray-500',
};

// 발언 시작 패턴:
// 1) 이모지 **[역할명]** "내용"  (bracket style)
// 2) **이모지 역할명:** 내용     (colon style)
// 3) **이모지 역할명**           (bold, no colon, no brackets)
// 4) ### 이모지 역할명           (h3 heading as role)
const ROLE_LINE_REGEX = /^(.+?)\s*\*\*\[(.+?)\]\*\*(.*)$/;
const ROLE_LINE_COLON_REGEX = /^\*\*(.+?)\s+(.+?):\*\*\s*(.*)$/;
const ROLE_LINE_BOLD_REGEX = /^\*\*(.+?)\s+\[?(.+?)\]?\*\*\s*$/;
const ROLE_HEADING_REGEX = /^###\s+(.+?)\s+\[?(.+?)\]?\s*$/;

// 섹션 헤더 키워드 → Lucide 아이콘 매핑
const SECTION_ICON_MAP: Record<string, string> = {
  '수익': 'TrendingUp', '매출': 'TrendingUp', '비즈니스': 'TrendingUp', 'revenue': 'TrendingUp', 'business': 'TrendingUp',
  '비용': 'DollarSign', '가격': 'DollarSign', '요금': 'DollarSign', 'cost': 'DollarSign', 'pricing': 'DollarSign',
  '시장': 'BarChart3', 'market': 'BarChart3', 'TAM': 'BarChart3', '경쟁': 'BarChart3',
  '리스크': 'ShieldAlert', '위험': 'ShieldAlert', 'risk': 'ShieldAlert',
  '보안': 'Shield', 'security': 'Shield', '법률': 'Shield', '법적': 'Shield',
  '기능': 'Zap', 'feature': 'Zap', '핵심': 'Zap',
  '타겟': 'Target', '사용자': 'Target', 'target': 'Target', 'user': 'Target', '고객': 'Target',
  '개요': 'BookOpen', 'overview': 'BookOpen', '소개': 'BookOpen', '요약': 'BookOpen', 'summary': 'BookOpen',
  '로드맵': 'Rocket', 'roadmap': 'Rocket', '마일스톤': 'Rocket', '런칭': 'Rocket', 'launch': 'Rocket',
  '기술': 'Layers', 'tech': 'Layers', '스택': 'Layers', 'stack': 'Layers', '아키텍처': 'Layers', 'architecture': 'Layers',
  'API': 'Code', 'DB': 'Database', '데이터': 'Database', 'database': 'Database',
  'MVP': 'Wrench', '구현': 'Wrench', 'implementation': 'Wrench',
  'SEO': 'Search', '마케팅': 'Megaphone', 'marketing': 'Megaphone', '그로스': 'Megaphone', 'GTM': 'Megaphone',
  '라운드': 'MessageCircle', 'round': 'MessageCircle',
  '발산': 'Sparkles', '수렴': 'CheckCircle', '결정': 'CheckCircle',
  '액션': 'ListChecks', 'action': 'ListChecks',
  '진단': 'Stethoscope', '분석': 'BarChart3', 'analysis': 'BarChart3',
  '결론': 'Flag', '최종': 'Flag', 'conclusion': 'Flag', 'final': 'Flag',
  '성과': 'Trophy', '완료': 'CheckCircle', 'complete': 'CheckCircle',
};

function matchSectionIcon(heading: string): string | null {
  const lower = heading.toLowerCase();
  for (const [keyword, icon] of Object.entries(SECTION_ICON_MAP)) {
    if (lower.includes(keyword.toLowerCase())) return icon;
  }
  return null;
}

// 사용된 Lucide 아이콘을 추적
let _usedIcons: Set<string> = new Set();
export function resetUsedIcons(): void { _usedIcons = new Set(); }
export function getUsedIcons(): string[] { return [..._usedIcons]; }

export function escapeJsx(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function slugify(text: string): string {
  return text
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
}

interface FlushTableState {
  inTable: boolean;
  tableHeaders: string[];
  tableRows: string[][];
}

function flushTable(state: FlushTableState): string | null {
  if (!state.inTable) return null;
  state.inTable = false;
  const colCount = state.tableHeaders.length;
  const needScroll = colCount >= 4;

  let jsx = '';
  jsx += `<div className="table-wrap">\n<table className="w-full text-sm border-collapse">\n`;
  if (state.tableHeaders.length > 0) {
    jsx += '  <thead><tr className="border-b">\n';
    for (const h of state.tableHeaders) {
      jsx += `    <th className="px-2 py-2 text-left font-medium text-muted-foreground">${formatInline(h.trim())}</th>\n`;
    }
    jsx += '  </tr></thead>\n';
  }
  jsx += '  <tbody>\n';
  for (const row of state.tableRows) {
    jsx += '    <tr className="border-b hover:bg-secondary/30">\n';
    for (const cell of row) {
      jsx += `      <td className="px-2 py-2">${formatInline(cell.trim())}</td>\n`;
    }
    jsx += '    </tr>\n';
  }
  jsx += '  </tbody>\n</table>\n</div>';
  state.tableHeaders = [];
  state.tableRows = [];
  return jsx;
}

/** 인라인 마크다운 처리: **bold**, `code`, ~~strike~~ */
function formatInline(text: string): string {
  // 1) 인라인 코드를 먼저 추출하여 placeholder로 치환
  const codeBlocks: string[] = [];
  let tmp = text.replace(/`(.+?)`/g, (_m, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<code className="bg-secondary/50 px-1.5 py-0.5 rounded text-[0.85em] text-primary">${escapeJsx(code)}</code>`);
    return `__CODE_${idx}__`;
  });
  // 2) bold 추출
  const boldBlocks: string[] = [];
  tmp = tmp.replace(/\*\*(.+?)\*\*/g, (_m, bold) => {
    const idx = boldBlocks.length;
    boldBlocks.push(`<span className="font-bold">${escapeJsx(bold)}</span>`);
    return `__BOLD_${idx}__`;
  });
  // 3) 나머지 텍스트 이스케이프
  let result = escapeJsx(tmp);
  // 4) placeholder 복원
  result = result.replace(/__CODE_(\d+)__/g, (_m, idx) => codeBlocks[Number(idx)]);
  result = result.replace(/__BOLD_(\d+)__/g, (_m, idx) => boldBlocks[Number(idx)]);
  return result;
}

/**
 * Light 테마 페이지용 MD → JSX
 * shadcn/ui + Tailwind CSS 출력
 * 코드블록: #f8f9fa 배경 + #1a1a1a 텍스트
 */
export function mdToLightJsx(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const jsxParts: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let inRoleCard = false;
  const tableState: FlushTableState = { inTable: false, tableHeaders: [], tableRows: [] };

  function closeRoleCard() {
    if (inRoleCard) {
      jsxParts.push('</div>');
      inRoleCard = false;
    }
  }

  function tryRoleLine(line: string): boolean {
    let emoji: string, role: string, rest: string;
    const m = line.match(ROLE_LINE_REGEX);
    if (m) {
      emoji = m[1].trim();
      role = m[2].trim();
      rest = m[3].trim();
    } else {
      // Try colon pattern: **emoji role:** speech
      const m2 = line.match(ROLE_LINE_COLON_REGEX);
      if (m2 && ROLE_COLOR_MAP[m2[2].trim()]) {
        emoji = m2[1].trim();
        role = m2[2].trim();
        rest = m2[3].trim();
      } else {
        // Try bold pattern: **emoji role**
        const m3 = line.match(ROLE_LINE_BOLD_REGEX);
        if (m3 && ROLE_COLOR_MAP[m3[2].trim()]) {
          emoji = m3[1].trim();
          role = m3[2].trim();
          rest = '';
        } else {
          // Try heading pattern: ### emoji role
          const m4 = line.match(ROLE_HEADING_REGEX);
          if (m4 && ROLE_COLOR_MAP[m4[2].trim()]) {
            emoji = m4[1].trim();
            role = m4[2].trim();
            rest = '';
          } else {
            return false;
          }
        }
      }
    }
    const color = ROLE_COLOR_MAP[role] || 'gray';
    const borderClass = ROLE_BORDER_CLASS[color] || 'border-l-gray-500';
    const badgeClass = ROLE_BADGE_CLASS[color] || 'bg-gray-100 text-gray-700';

    closeRoleCard();
    const flushed = flushTable(tableState);
    if (flushed) jsxParts.push(flushed);

    jsxParts.push(`<div className="p-4 mb-3 rounded-lg border border-border border-l-4 shadow-sm bg-card/50 ${borderClass}">
<div className="flex items-center gap-2 mb-1"><span className="text-lg">${escapeJsx(emoji)}</span><span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${badgeClass}">${escapeJsx(role)}</span></div>`);
    inRoleCard = true;

    if (rest) {
      jsxParts.push(`<p className="text-sm mb-1">${formatInline(rest)}</p>`);
    }
    return true;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        const flushed = flushTable(tableState);
        if (flushed) jsxParts.push(flushed);
        jsxParts.push(`<div className="rounded-lg border border-border bg-secondary/50 p-4 mb-4"><pre className="whitespace-pre-wrap text-[0.85rem] text-muted-foreground m-0">${escapeJsx(codeContent.join('\n'))}</pre></div>`);
        codeContent = [];
        inCodeBlock = false;
      } else {
        const flushed = flushTable(tableState);
        if (flushed) jsxParts.push(flushed);
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeContent.push(line); continue; }

    // Table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').filter((_: string, idx: number, arr: string[]) => idx > 0 && idx < arr.length - 1);
      if (cells.every((c: string) => /^[\s\-:]+$/.test(c))) continue;
      if (!tableState.inTable) {
        const flushed = flushTable(tableState);
        if (flushed) jsxParts.push(flushed);
        tableState.inTable = true;
        tableState.tableHeaders = cells;
      } else {
        tableState.tableRows.push(cells);
      }
      continue;
    } else if (tableState.inTable) {
      const flushed = flushTable(tableState);
      if (flushed) jsxParts.push(flushed);
    }

    if (line.trim() === '') continue;

    // 헤딩은 역할 카드를 닫음
    if (line.startsWith('#')) {
      closeRoleCard();
    }

    // 역할 발언 감지 (이모지 **[역할]** 패턴)
    if (tryRoleLine(line)) continue;

    if (line.startsWith('# ')) {
      const icon = matchSectionIcon(line.slice(2));
      if (icon) { _usedIcons.add(icon); jsxParts.push(`<div className="flex items-center gap-2 mt-8 mb-4"><${icon} size={28} /><h1 className="text-2xl font-bold">${escapeJsx(line.slice(2))}</h1></div>`); }
      else jsxParts.push(`<h1 className="text-2xl font-bold mt-8 mb-4">${escapeJsx(line.slice(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      const headingText = line.slice(3);
      const roundMatch = headingText.match(/라운드\s*(\d+)/i) || headingText.match(/round\s*(\d+)/i);
      if (roundMatch) {
        const roundNum = parseInt(roundMatch[1], 10);
        const roundColor = roundNum <= 2 ? 'blue' : roundNum <= 4 ? 'purple' : roundNum <= 6 ? 'amber' : roundNum <= 8 ? 'orange' : 'green';
        const icon = matchSectionIcon(headingText);
        if (icon) { _usedIcons.add(icon); jsxParts.push(`<div className="rounded-lg border-l-4 border-l-${roundColor}-500 bg-${roundColor}-500/10 px-4 py-3 mb-6 mt-10 flex items-center gap-2"><${icon} size={22} className="text-${roundColor}-400" /><h2 className="text-xl font-bold text-${roundColor}-300">${escapeJsx(headingText)}</h2></div>`); }
        else jsxParts.push(`<div className="rounded-lg border-l-4 border-l-${roundColor}-500 bg-${roundColor}-500/10 px-4 py-3 mb-6 mt-10"><h2 className="text-xl font-bold text-${roundColor}-300">${escapeJsx(headingText)}</h2></div>`);
      } else {
        const icon = matchSectionIcon(headingText);
        if (icon) { _usedIcons.add(icon); jsxParts.push(`<div className="flex items-center gap-2 mt-8 mb-4"><${icon} size={22} /><h2 className="text-xl font-bold">${escapeJsx(headingText)}</h2></div>`); }
        else jsxParts.push(`<h2 className="text-xl font-bold mt-8 mb-4">${escapeJsx(headingText)}</h2>`);
      }
    } else if (line.startsWith('### ')) {
      const icon = matchSectionIcon(line.slice(4));
      if (icon) { _usedIcons.add(icon); jsxParts.push(`<div className="flex items-center gap-2 mt-6 mb-3"><${icon} size={18} /><h3 className="text-lg font-semibold">${escapeJsx(line.slice(4))}</h3></div>`); }
      else jsxParts.push(`<h3 className="text-lg font-semibold mt-6 mb-3">${escapeJsx(line.slice(4))}</h3>`);
    } else if (line.startsWith('#### ')) {
      jsxParts.push(`<h4 className="text-base font-semibold mt-4 mb-2">${escapeJsx(line.slice(5))}</h4>`);
    } else if (line.startsWith('> ')) {
      jsxParts.push(`<div className="rounded-lg border-l-4 border-l-blue-500/50 bg-blue-500/10 p-4 mb-4"><p className="italic text-sm">${formatInline(line.slice(2))}</p></div>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [line.slice(2)];
      while (i + 1 < lines.length && (lines[i + 1].startsWith('- ') || lines[i + 1].startsWith('* '))) {
        i++; items.push(lines[i].slice(2));
      }
      let listJsx = '<ul className="list-disc pl-6 space-y-1 text-sm mb-4">\n';
      for (const item of items) { listJsx += `  <li>${formatInline(item)}</li>\n`; }
      listJsx += '</ul>';
      jsxParts.push(listJsx);
    } else if (/^\d+\. /.test(line)) {
      const items = [line.replace(/^\d+\. /, '')];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) {
        i++; items.push(lines[i].replace(/^\d+\. /, ''));
      }
      let listJsx = '<ol className="list-decimal pl-6 space-y-1 text-sm mb-4">\n';
      for (const item of items) { listJsx += `  <li>${formatInline(item)}</li>\n`; }
      listJsx += '</ol>';
      jsxParts.push(listJsx);
    } else if (line.startsWith('---')) {
      closeRoleCard();
      jsxParts.push('<hr className="my-8 border-border" />');
    } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      jsxParts.push(`<p className="text-sm text-muted-foreground italic mb-2">${formatInline(line.replace(/^\*|\*$/g, ''))}</p>`);
    } else {
      jsxParts.push(`<p className="text-sm mb-1">${formatInline(line)}</p>`);
    }
  }
  closeRoleCard();
  const flushed = flushTable(tableState);
  if (flushed) jsxParts.push(flushed);
  return jsxParts.join('\n      ');
}

/**
 * MD에서 ## 제목 추출하여 sections 배열 생성
 */
export interface SectionDef {
  id: string;
  label: string;
  part: number;
}

export function extractSections(md: string, partNumber: number): SectionDef[] {
  const sections: SectionDef[] = [];
  for (const line of md.split('\n')) {
    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim();
      sections.push({
        id: slugify(heading),
        label: heading,
        part: partNumber,
      });
    }
  }
  return sections;
}
