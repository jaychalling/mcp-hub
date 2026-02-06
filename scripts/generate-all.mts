/**
 * generate-all.mts — memory/ config.json 기반 통합 페이지 생성 스크립트
 *
 * 사용법: npx tsx scripts/generate-all.mts
 *
 * memory/{project}/config.json을 읽어서:
 * 1. src/app/{id}/docs/page.tsx    (통합 문서: 기획서+PRD+기술문서+완료보고)
 * 2. src/app/{id}/minutes/page.tsx (회의록)
 * 3. src/app/{id}/page.tsx         (→ /docs 리다이렉트)
 * 4. src/app/page.tsx의 brainstorms 배열 자동 업데이트
 */

import fs from 'fs';
import path from 'path';
import { mdToLightJsx, escapeJsx, resetUsedIcons, getUsedIcons } from './lib/md-to-jsx.mts';
import type { ProjectConfig, ValueDeliveryConfig } from './lib/types.mts';

const ROOT = path.resolve(import.meta.dirname, '..');
const MEMORY_DIR = path.join(ROOT, 'memory');
const APP_DIR = path.join(ROOT, 'src', 'app');

// ─── config.json 수집 ──────────────────────────────────────────────
function loadConfigs(): ProjectConfig[] {
  const configs: ProjectConfig[] = [];
  const dirs = fs.readdirSync(MEMORY_DIR);

  for (const dir of dirs) {
    const configPath = path.join(MEMORY_DIR, dir, 'config.json');
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const config: ProjectConfig = JSON.parse(raw);
      configs.push(config);
    }
  }

  // stars 내림차순 정렬
  configs.sort((a, b) => b.stars - a.stars);
  return configs;
}

function getMemoryDir(config: ProjectConfig): string {
  return path.join(MEMORY_DIR, config.memoryDir || config.id);
}

function readSource(memDir: string, filename: string): string | null {
  const p = path.join(memDir, filename);
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8');
  return null;
}

// ─── 색상 유틸 (Tailwind 클래스) ─────────────────────────────────────
const COLOR_BG: Record<string, string> = {
  red: 'bg-red-500 text-white', orange: 'bg-orange-500 text-white', yellow: 'bg-yellow-500 text-white',
  lime: 'bg-lime-500 text-white', green: 'bg-green-500 text-white', teal: 'bg-teal-500 text-white',
  cyan: 'bg-cyan-500 text-white', blue: 'bg-blue-500 text-white', indigo: 'bg-indigo-500 text-white',
  violet: 'bg-violet-500 text-white', pink: 'bg-pink-500 text-white', gray: 'bg-gray-500 text-white',
};
const COLOR_LIGHT: Record<string, string> = {
  red: 'bg-red-500/20 text-red-600', orange: 'bg-orange-500/20 text-orange-600', yellow: 'bg-yellow-500/20 text-yellow-600',
  lime: 'bg-lime-500/20 text-lime-600', green: 'bg-green-500/20 text-green-600', teal: 'bg-teal-500/20 text-teal-600',
  cyan: 'bg-cyan-500/20 text-cyan-600', blue: 'bg-blue-500/20 text-blue-600', indigo: 'bg-indigo-500/20 text-indigo-600',
  violet: 'bg-violet-500/20 text-violet-600', pink: 'bg-pink-500/20 text-pink-600', gray: 'bg-gray-500/20 text-gray-600',
};
const COLOR_OUTLINE: Record<string, string> = {
  red: 'border-red-500/50 text-red-600', orange: 'border-orange-500/50 text-orange-600', yellow: 'border-yellow-500/50 text-yellow-600',
  lime: 'border-lime-500/50 text-lime-600', green: 'border-green-500/50 text-green-600', teal: 'border-teal-500/50 text-teal-600',
  cyan: 'border-cyan-500/50 text-cyan-600', blue: 'border-blue-500/50 text-blue-600', indigo: 'border-indigo-500/50 text-indigo-600',
  violet: 'border-violet-500/50 text-violet-600', pink: 'border-pink-500/50 text-pink-600', gray: 'border-gray-500/50 text-gray-600',
};
const COLOR_TEXT: Record<string, string> = {
  red: 'text-red-600', orange: 'text-orange-600', yellow: 'text-yellow-600',
  lime: 'text-lime-600', green: 'text-green-600', teal: 'text-teal-600',
  cyan: 'text-cyan-600', blue: 'text-blue-600', indigo: 'text-indigo-600',
  violet: 'text-violet-600', pink: 'text-pink-600', gray: 'text-gray-600',
};

// Icon import helper — skips import if no icons needed
function iconImport(icons: string[], exclude: string[] = []): string {
  const filtered = icons.filter(i => !exclude.includes(i));
  return filtered.length > 0 ? `import { ${filtered.join(', ')} } from 'lucide-react';\n` : '';
}

// ─── Redirect page (main → docs) ────────────────────────────────────
function generateRedirectPage(config: ProjectConfig): void {
  const tsx = `import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/${config.id}/docs')
}
`;
  writeFile(path.join(APP_DIR, config.id, 'page.tsx'), tsx);
}

// ─── Minutes page ───────────────────────────────────────────────────
function generateMinutesPage(config: ProjectConfig): void {
  const pageConfig = config.pages.minutes;
  if (!pageConfig) return;

  const memDir = getMemoryDir(config);
  const sources = pageConfig.sources.map(f => readSource(memDir, f)).filter(Boolean) as string[];
  if (sources.length === 0) { console.warn(`  [skip] minutes: no sources for ${config.id}`); return; }

  // Embed raw markdown + use MeetingViewer component
  const rawMarkdown = sources.join('\n\n---\n\n');
  // Escape backticks and ${} for template literal embedding
  const escapedMarkdown = rawMarkdown
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  const tsx = `'use client'

import { MeetingViewer } from '@/components/meeting/meeting-viewer'
import { parseMeetingMarkdown } from '@/lib/meeting-parser'

const MEETING_MARKDOWN = \`${escapedMarkdown}\`

export default function MinutesPage() {
  const data = parseMeetingMarkdown(MEETING_MARKDOWN)
  return <MeetingViewer {...data} projectId="${config.id}" projectTitle="${escapeJsx(config.title)}" />
}
`;

  writeFile(path.join(APP_DIR, config.id, 'minutes', 'page.tsx'), tsx);
}

// ─── Docs page (통합: plan+PRD+dev+report) ──────────────────────────
function generateDocsPage(config: ProjectConfig): void {
  const pageConfig = config.pages.docs;
  if (!pageConfig) return;

  const memDir = getMemoryDir(config);

  // 통합 소스: plan.md, PRD.md, dev.md, report.md (존재하는 것만)
  const allSourceFiles = ['plan.md', 'PRD.md', 'dev.md', 'report.md'];
  const partLabels = ['Part 1: 서비스 기획서', 'Part 2: PRD (Product Requirements Document)', 'Part 3: 기술 문서', 'Part 4: 완료 보고'];
  const partIcons = ['FileText', 'ClipboardList', 'Code', 'CheckCircle'];
  const partTextColors = ['text-blue-600', 'text-violet-600', 'text-teal-600', 'text-green-600'];

  // config.pages.docs.sources에 지정된 파일들 사용 (기존 호환성)
  // 또는 기본 allSourceFiles 순서로 시도
  const sourcesToTry = pageConfig.sources.length > 0 ? pageConfig.sources : allSourceFiles;
  const loadedSources: { filename: string; content: string }[] = [];

  for (const filename of sourcesToTry) {
    const content = readSource(memDir, filename);
    if (content) {
      loadedSources.push({ filename, content });
    }
  }

  if (loadedSources.length === 0) {
    console.warn(`  [skip] docs: no sources for ${config.id}`);
    return;
  }

  const hasVD = !!pageConfig.valueDelivery;
  const vdImport = hasVD ? `\nimport ValueDelivery from '../../../components/ValueDelivery';` : '';
  const vdJsx = hasVD ? generateValueDeliveryJsx(pageConfig.valueDelivery!, config.color) : '';

  resetUsedIcons();
  let contentJsx = '';

  loadedSources.forEach((src, idx) => {
    const jsx = mdToLightJsx(src.content);

    // 파일명에 따른 파트 라벨 결정
    let partIdx = allSourceFiles.indexOf(src.filename);
    if (partIdx === -1) partIdx = idx; // 알 수 없는 파일이면 순서대로

    if (loadedSources.length > 1) {
      if (idx > 0) contentJsx += '\n      <hr className="my-8" />\n';
      contentJsx += `\n      <div className="flex items-center gap-2 mt-8 mb-4"><${partIcons[partIdx] || 'FileText'} size={22} className="${partTextColors[partIdx] || 'text-gray-600'}" /><h2 className="text-xl font-bold ${partTextColors[partIdx] || 'text-gray-600'}">${escapeJsx(partLabels[partIdx] || `Part ${idx + 1}`)}</h2></div>\n      <hr className="mb-6" />\n      `;
    }
    contentJsx += jsx;
  });

  const navIcons = ['ArrowLeft', 'ClipboardList', 'Code', 'FileText', 'CheckCircle'];
  const allIcons = [...new Set([...navIcons, ...partIcons, ...getUsedIcons()])].sort();

  const badgeColor = config.adopted ? 'lime' : config.color;
  const badgeLabel = config.adopted ? '개발 중' : '아이디어';

  const badgesJson = JSON.stringify([
    { label: badgeLabel, className: COLOR_BG[badgeColor] || COLOR_BG.gray },
    { label: `${config.experts}인 전문가`, className: 'border border-blue-500/50 text-blue-600' },
    { label: `${config.rounds}라운드`, className: 'border border-violet-500/50 text-violet-600' },
    ...config.tags.map(t => ({ label: t, className: COLOR_LIGHT[config.color] || COLOR_LIGHT.gray })),
  ]);

  const docsIconImport = iconImport(allIcons, ['ArrowLeft']);

  const tsx = `'use client';

${docsIconImport}import { PageShell } from '@/components/page-shell';${vdImport}

const badges = ${badgesJson};

export default function DocsPage() {
  return (
    <PageShell
      projectId="${config.id}"
      projectTitle="${escapeJsx(config.title)}"
      subtitle="${escapeJsx(config.subtitle)}"
      activeTab="docs"
      date="${config.date}"
      badges={badges}
    >
${vdJsx}      ${contentJsx}
    </PageShell>
  );
}
`;

  writeFile(path.join(APP_DIR, config.id, 'docs', 'page.tsx'), tsx);
}

// ─── ValueDelivery 헬퍼 ─────────────────────────────────────────────
function generateValueDeliveryJsx(vd: ValueDeliveryConfig, defaultColor: string): string {
  return `      <ValueDelivery
        color="${vd.color || defaultColor}"
        headline=${JSON.stringify(vd.headline)}
        deliverables={${JSON.stringify(vd.deliverables)}}
        journey={${JSON.stringify(vd.journey)}}
        screens={${JSON.stringify(vd.screens)}}
        whyMoney=${JSON.stringify(vd.whyMoney)}
      />\n\n`;
}

// ─── 홈페이지 brainstorms 배열 업데이트 ──────────────────────────────
function updateHomepage(configs: ProjectConfig[]): void {
  const homePath = path.join(APP_DIR, 'page.tsx');
  const content = fs.readFileSync(homePath, 'utf-8');

  // createdAt 기준 최신순 정렬 (최신이 맨 위)
  const sortedConfigs = [...configs].sort((a, b) => {
    const dateA = new Date(a.createdAt || `${a.date}T00:00:00Z`).getTime();
    const dateB = new Date(b.createdAt || `${b.date}T00:00:00Z`).getTime();
    return dateB - dateA; // 내림차순 (최신이 먼저)
  });

  // 중복 제거 (ID 기준으로 최신 데이터만 유지)
  const uniqueConfigs = sortedConfigs.reduce((acc: ProjectConfig[], curr) => {
    const existing = acc.findIndex(item => item.id === curr.id);
    if (existing === -1) {
      acc.push(curr);
    } else {
      // 기존 항목을 최신 데이터로 업데이트
      acc[existing] = curr;
      console.log(`  [duplicate] ID "${curr.id}" 중복 감지, 최신 데이터로 업데이트`);
    }
    return acc;
  }, []);

  const brainstormEntries = uniqueConfigs.map(c => {
    const createdAt = c.createdAt || `${c.date}T00:00:00Z`;
    const hasReport = !!(c.pages as { report?: unknown })?.report;
    return `  {
    id: '${c.id}',
    title: '${c.title.replace(/'/g, "\\'")}',
    subtitle: '${c.subtitle.replace(/'/g, "\\'")}',
    date: '${c.date}',
    createdAt: '${createdAt}',
    experts: ${c.experts},
    rounds: ${c.rounds},
    status: '${c.status.replace(/'/g, "\\'")}',
    tags: [${c.tags.map(t => `'${t.replace(/'/g, "\\'")}'`).join(', ')}],
    color: '${c.color}',
    stars: ${c.stars},
    adopted: ${c.adopted},
    report: ${hasReport},
  }`;
  });

  const newArray = `const brainstorms = [\n${brainstormEntries.join(',\n')},\n];`;

  const startMarker = 'const brainstorms = [';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    console.error('  [error] homepage: brainstorms 배열을 찾을 수 없습니다');
    return;
  }

  let depth = 0;
  let endIdx = -1;
  for (let i = content.indexOf('[', startIdx); i < content.length; i++) {
    if (content[i] === '[') depth++;
    if (content[i] === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i + 2;
        break;
      }
    }
  }

  if (endIdx === -1) {
    console.error('  [error] homepage: brainstorms 배열 끝을 찾을 수 없습니다');
    return;
  }

  const updated = content.slice(0, startIdx) + newArray + content.slice(endIdx);
  fs.writeFileSync(homePath, updated, 'utf-8');
  console.log(`  [updated] ${homePath} (${uniqueConfigs.length} projects, 날짜순 정렬)`);
}

// ─── 유틸리티 ───────────────────────────────────────────────────────
function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  [written] ${filePath} (${(content.length / 1024).toFixed(1)}KB)`);
}

// ─── Main ───────────────────────────────────────────────────────────
function main(): void {
  console.log('=== generate-all.mts ===\n');

  const configs = loadConfigs();
  console.log(`Found ${configs.length} projects with config.json\n`);

  for (const config of configs) {
    console.log(`\n--- ${config.id} (${config.title}) ---`);

    // 통합 docs 페이지 생성
    if (config.pages.docs !== null) generateDocsPage(config);
    // 회의록 페이지 생성
    if (config.pages.minutes !== null) generateMinutesPage(config);
    // main → docs 리다이렉트 페이지 생성
    generateRedirectPage(config);
  }

  if (process.argv.includes('--update-home')) {
    console.log('\n--- Homepage ---');
    updateHomepage(configs);
  } else {
    console.log('\n[skip] Homepage update (use --update-home flag)');
  }

  console.log('\n=== Done! ===');
}

main();
