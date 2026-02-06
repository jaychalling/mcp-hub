import fs from 'fs';
import path from 'path';

const configs = [
  {
    id: 'launchcompare-v2',
    title: 'LaunchCompare v4 — 서비스 기획서 + PRD',
    subtitle: 'AI 이미지 생성 모델 동시 비교 SaaS',
    planFile: 'E:\\idea-hub\\memory\\launchcompare-v4\\plan.md',
    prdFile: 'E:\\idea-hub\\memory\\launchcompare-v4\\PRD.md',
  },
  {
    id: 'vibecoder',
    title: 'VibeCoder v2 — 서비스 기획서 + PRD',
    subtitle: '"대화 3번이면 봇 완성" — 1인 인디해커 에디션',
    planFile: 'E:\\idea-hub\\memory\\vibecoder-v2\\plan.md',
    prdFile: 'E:\\idea-hub\\memory\\vibecoder-v2\\PRD.md',
  },
  {
    id: 'directory-curation',
    title: 'SoloStack — 서비스 기획서 + PRD',
    subtitle: '솔로프레너 도구 디렉토리 + 비용 계산기',
    planFile: 'E:\\idea-hub\\memory\\directory-curation\\plan.md',
    prdFile: 'E:\\idea-hub\\memory\\directory-curation\\PRD.md',
  },
  {
    id: 'solostack',
    title: 'SoloStack — 서비스 기획서 + PRD',
    subtitle: '솔로프레너 도구 디렉토리 + 비용 계산기',
    planFile: 'E:\\idea-hub\\memory\\directory-curation\\plan.md',
    prdFile: 'E:\\idea-hub\\memory\\directory-curation\\PRD.md',
  },
  {
    id: 'tradeguild',
    title: 'TradeGuild — 서비스 기획서 + PRD',
    subtitle: '엑셀 수주장을 졸업시키는 AI 제조업 관리 도구',
    planFile: 'E:\\idea-hub\\memory\\tradeguild\\기획서.md',
    prdFile: 'E:\\idea-hub\\memory\\tradeguild\\PRD.md',
  },
];

function escapeJsx(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function mdToJsx(md) {
  const lines = md.split('\n');
  const jsxParts = [];
  let inCodeBlock = false;
  let codeContent = [];
  let inTable = false;
  let tableRows = [];
  let tableHeaders = [];

  function flushTable() {
    if (!inTable) return;
    inTable = false;
    let jsx = '<Table mb="md" striped highlightOnHover>\n';
    if (tableHeaders.length > 0) {
      jsx += '  <Table.Thead><Table.Tr>\n';
      for (const h of tableHeaders) {
        jsx += `    <Table.Th>${escapeJsx(h.trim())}</Table.Th>\n`;
      }
      jsx += '  </Table.Tr></Table.Thead>\n';
    }
    jsx += '  <Table.Tbody>\n';
    for (const row of tableRows) {
      jsx += '    <Table.Tr>\n';
      for (const cell of row) {
        jsx += `      <Table.Td>${escapeJsx(cell.trim())}</Table.Td>\n`;
      }
      jsx += '    </Table.Tr>\n';
    }
    jsx += '  </Table.Tbody>\n</Table>';
    jsxParts.push(jsx);
    tableHeaders = [];
    tableRows = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushTable();
        jsxParts.push(`<Paper p="md" mb="md" withBorder bg="var(--mantine-color-dark-7)"><pre style={{margin:0, whiteSpace:'pre-wrap', fontSize:'0.85rem', color:'#c9d1d9'}}>${escapeJsx(codeContent.join('\n'))}</pre></Paper>`);
        codeContent = [];
        inCodeBlock = false;
      } else {
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeContent.push(line); continue; }
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cells.every(c => /^[\s\-:]+$/.test(c))) continue;
      if (!inTable) { flushTable(); inTable = true; tableHeaders = cells; } else { tableRows.push(cells); }
      continue;
    } else if (inTable) { flushTable(); }
    if (line.trim() === '') continue;
    if (line.startsWith('# ')) { jsxParts.push(`<Title order={1} mt="xl" mb="md">${escapeJsx(line.slice(2))}</Title>`); }
    else if (line.startsWith('## ')) { jsxParts.push(`<Title order={2} mt="xl" mb="md">${escapeJsx(line.slice(3))}</Title>`); }
    else if (line.startsWith('### ')) { jsxParts.push(`<Title order={3} mt="lg" mb="sm">${escapeJsx(line.slice(4))}</Title>`); }
    else if (line.startsWith('#### ')) { jsxParts.push(`<Title order={4} mt="md" mb="xs">${escapeJsx(line.slice(5))}</Title>`); }
    else if (line.startsWith('> ')) { jsxParts.push(`<Paper p="md" mb="md" withBorder bg="var(--mantine-color-blue-light)"><Text fs="italic">${escapeJsx(line.slice(2))}</Text></Paper>`); }
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [line.slice(2)];
      while (i + 1 < lines.length && (lines[i + 1].startsWith('- ') || lines[i + 1].startsWith('* '))) { i++; items.push(lines[i].slice(2)); }
      let listJsx = '<List spacing="xs" size="sm" mb="md">\n';
      for (const item of items) { listJsx += `  <List.Item>${escapeJsx(item)}</List.Item>\n`; }
      listJsx += '</List>';
      jsxParts.push(listJsx);
    } else if (/^\d+\. /.test(line)) {
      const items = [line.replace(/^\d+\. /, '')];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) { i++; items.push(lines[i].replace(/^\d+\. /, '')); }
      let listJsx = '<List type="ordered" spacing="xs" size="sm" mb="md">\n';
      for (const item of items) { listJsx += `  <List.Item>${escapeJsx(item)}</List.Item>\n`; }
      listJsx += '</List>';
      jsxParts.push(listJsx);
    } else if (line.startsWith('---')) { jsxParts.push('<Divider my="lg" />'); }
    else { jsxParts.push(`<Text mb="sm">${escapeJsx(line)}</Text>`); }
  }
  flushTable();
  return jsxParts.join('\n      ');
}

for (const config of configs) {
  const planMd = fs.readFileSync(config.planFile, 'utf-8');
  const prdMd = fs.readFileSync(config.prdFile, 'utf-8');
  const planContent = mdToJsx(planMd);
  const prdContent = mdToJsx(prdMd);

  const tsx = `'use client';

import Link from 'next/link';
import { Container, Title, Text, Anchor, Divider, Table, List, Paper, Group } from '@mantine/core';

export default function DetailPage() {
  return (
    <Container size="md" py="xl">
      <Group mb="md">
        <Anchor component={Link} href="/" size="sm" c="dimmed">← Idea Hub</Anchor>
        <Text size="sm" c="dimmed">|</Text>
        <Anchor component={Link} href={'/brainstorm/${config.id}/minutes'} size="sm" c="dimmed">📋 회의록</Anchor>
        <Text size="sm" c="dimmed">|</Text>
        <Anchor component={Link} href={'/brainstorm/${config.id}/docs'} size="sm" c="dimmed">📄 Docs</Anchor>
      </Group>

      <Title order={1} mb="xs">${escapeJsx(config.title)}</Title>
      <Text c="dimmed" mb="xl">${escapeJsx(config.subtitle)}</Text>

      <Title order={2} mt="xl" mb="md" c="blue">📋 Part 1: 서비스 기획서</Title>
      <Divider mb="lg" />
      ${planContent}

      <Divider my="xl" size="md" />

      <Title order={2} mt="xl" mb="md" c="violet">📄 Part 2: PRD (Product Requirements Document)</Title>
      <Divider mb="lg" />
      ${prdContent}
    </Container>
  );
}
`;

  const outPath = path.join('E:\\idea-hub\\src\\app\\brainstorm', config.id, 'page.tsx');
  fs.writeFileSync(outPath, tsx, 'utf-8');
  console.log(`Written: ${outPath} (${(tsx.length / 1024).toFixed(1)}KB)`);

  // Verify headings
  const planHeadings = planMd.split('\n').filter(l => l.startsWith('## ')).length;
  const prdHeadings = prdMd.split('\n').filter(l => l.startsWith('## ')).length;
  const pageH2 = (tsx.match(/order=\{2\}/g) || []).length;
  console.log(`  Plan H2: ${planHeadings}, PRD H2: ${prdHeadings}, Page H2 (incl labels): ${pageH2}`);
}

console.log('\\nDone!');
