/**
 * post-brainstorm.mts — 브레인스토밍 완료 후 config.json + 페이지 자동 생성
 *
 * 사용법:
 *   npx tsx scripts/post-brainstorm.mts <memory-folder-name> [options]
 *
 * 예시:
 *   npx tsx scripts/post-brainstorm.mts vibecoder-v4 --id vibecoder --title "VibeCoder v4" --subtitle "대화 3번이면 봇 완성"
 *
 * 필수 옵션:
 *   --id          라우트 슬러그 (src/app/{id}/)
 *   --title       프로젝트 제목
 *   --subtitle    부제목
 *
 * 선택 옵션:
 *   --date        날짜 (기본: 오늘)
 *   --experts     전문가 수 (기본: 14)
 *   --rounds      라운드 수 (기본: 10)
 *   --status      상태 (기본: "아이디어 설계")
 *   --tags        태그 (쉼표 구분, 예: "AI,봇,텔레그램")
 *   --color       Mantine 색상 (기본: "blue")
 *   --stars       별점 (기본: 1)
 *   --adopted     채택 여부 (기본: false)
 *   --no-generate config.json만 생성하고 페이지 생성 스킵
 *
 * 동작:
 *   1. memory/{folder}에 있는 MD 파일 자동 감지
 *   2. config.json 생성
 *   3. generate-all.mts 실행하여 페이지 생성
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const MEMORY_DIR = path.join(ROOT, 'memory');

// ─── 인자 파싱 ──────────────────────────────────────────────────────
const args = process.argv.slice(2);
const memoryFolder = args[0];

if (!memoryFolder || memoryFolder.startsWith('--')) {
  console.error('Usage: npx tsx scripts/post-brainstorm.mts <memory-folder> --id <id> --title <title> --subtitle <subtitle>');
  process.exit(1);
}

function getArg(name: string, defaultValue?: string): string {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) {
    if (defaultValue !== undefined) return defaultValue;
    console.error(`Missing required argument: --${name}`);
    process.exit(1);
  }
  return args[idx + 1];
}

function hasFlag(name: string): boolean {
  return args.includes(`--${name}`);
}

const today = new Date().toISOString().slice(0, 10);

const id = getArg('id', memoryFolder);
const title = getArg('title');
const subtitle = getArg('subtitle');
const date = getArg('date', today);
const experts = parseInt(getArg('experts', '8'));
const rounds = parseInt(getArg('rounds', '8'));
const status = getArg('status', '아이디어 설계');
const tagsStr = getArg('tags', '');
const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
const color = getArg('color', 'blue');
const stars = parseInt(getArg('stars', '1'));
const adopted = hasFlag('adopted');
const noGenerate = hasFlag('no-generate');

// ─── MD 파일 자동 감지 ──────────────────────────────────────────────
const memDir = path.join(MEMORY_DIR, memoryFolder);
if (!fs.existsSync(memDir)) {
  console.error(`Memory directory not found: ${memDir}`);
  process.exit(1);
}

const files = fs.readdirSync(memDir);
const has = (name: string) => files.includes(name);

// plan source detection: plan.md
const planSource = has('plan.md') ? 'plan.md' : null;
const hasPRD = has('PRD.md');
const hasMinutes = has('minutes.md');
const hasDev = has('dev.md');
const hasReport = has('report.md');

// main 소스 구성
const mainSources: string[] = [];
if (planSource) mainSources.push(planSource);
if (hasPRD) mainSources.push('PRD.md');

console.log(`\n📁 Memory: ${memDir}`);
console.log(`   Files: ${files.join(', ')}`);
console.log(`   Main sources: ${mainSources.length > 0 ? mainSources.join(' + ') : '(없음)'}`);
console.log(`   Minutes: ${hasMinutes ? '✅' : '❌'}`);
console.log(`   Docs (dev.md): ${hasDev ? '✅' : '❌'}`);
console.log(`   Report: ${hasReport ? '✅' : '❌'}`);

// ─── config.json 생성 ───────────────────────────────────────────────
interface ConfigPages {
  main: object | null;
  minutes: object | null;
  docs: object | null;
  report: object | null;
}

const pages: ConfigPages = {
  main: mainSources.length > 0 ? { sources: mainSources } : null,
  minutes: hasMinutes ? { sources: ['minutes.md'] } : null,
  docs: hasDev ? {
    sources: ['dev.md'],
    badges: [
      { text: '개발문서', color: 'yellow' },
      { text: date, color: 'blue' },
    ],
  } : null,
  report: hasReport ? {
    sources: ['report.md'],
    badges: [
      { text: '완료보고', color: 'green' },
      { text: date, color: 'blue' },
    ],
  } : null,
};

const config: Record<string, unknown> = {
  id,
  ...(memoryFolder !== id ? { memoryDir: memoryFolder } : {}),
  title,
  subtitle,
  date,
  createdAt: new Date().toISOString(),
  experts,
  rounds,
  status,
  tags,
  color,
  stars,
  adopted,
  pages,
};

const configPath = path.join(memDir, 'config.json');
if (fs.existsSync(configPath) && !hasFlag('force')) {
  console.log(`\n⚠️  config.json 이미 존재: ${configPath}`);
  console.log('   덮어쓰려면 --force 플래그 추가');
  console.log('   기존 config.json으로 페이지 생성을 진행합니다.');
} else {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`\n✅ config.json 생성: ${configPath}`);
}

// ─── 페이지 생성 (레거시 — 기본은 --no-generate) ─────────────────────
if (!noGenerate) {
  console.log('\n🔄 페이지 생성 중 (generate-all.mts)...');
  try {
    const result = execSync('npx tsx scripts/generate-all.mts', {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    const lines = result.split('\n').filter(l =>
      l.includes(id) || l.includes('Found') || l.includes('Done')
    );
    console.log(lines.join('\n'));
  } catch (e: unknown) {
    const err = e as { stderr?: string };
    console.error('페이지 생성 실패:', err.stderr || e);
    process.exit(1);
  }
  console.log('\n✅ 완료! 다음 단계:');
  console.log(`   1. npm run dev → localhost:3000/${id} 확인`);
} else {
  console.log('\n✅ config.json 생성 완료 (--no-generate)');
  console.log('   브레인스토밍 에이전트가 페이지를 직접 생성했으므로 generate-all 불필요.');
  console.log('   레거시 재생성 필요 시: npx tsx scripts/generate-all.mts');
}
