import fs from 'fs';
import path from 'path';

const configs = [
  {
    id: 'launchcompare-v2',
    title: 'LaunchCompare v4 브레인스토밍 회의록',
    subtitle: '"기존 프로젝트 발전" — 65% 완성 → 런칭까지',
    mdFile: 'E:\\idea-hub\\memory\\launchcompare-v4\\회의록.md',
  },
  {
    id: 'vibecoder',
    title: 'VibeCoder v2 브레인스토밍 회의록',
    subtitle: '"대화 3번이면 봇 완성" — 1인 인디해커 에디션',
    mdFile: 'E:\\idea-hub\\memory\\vibecoder-v2\\회의록.md',
  },
  {
    id: 'directory-curation',
    title: '디렉토리/큐레이션 브레인스토밍 회의록',
    subtitle: '"유용한 게 모여있으면 어떻게든 오더라고" — SoloStack',
    mdFile: 'E:\\idea-hub\\memory\\directory-curation\\회의록.md',
  },
  {
    id: 'solostack',
    title: 'SoloStack 브레인스토밍 회의록',
    subtitle: '솔로프레너 도구 디렉토리 + 비용 계산기',
    mdFile: 'E:\\idea-hub\\memory\\directory-curation\\회의록.md',
  },
  {
    id: 'tradeguild',
    title: 'TradeGuild 브레인스토밍 회의록',
    subtitle: '중소 제조업체 AI 운영 자동화 플랫폼 — 1인 인디해커 버전',
    mdFile: 'E:\\idea-hub\\memory\\tradeguild\\회의록.md',
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

    // Code blocks
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
    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      // Check if separator row
      if (cells.every(c => /^[\s\-:]+$/.test(c))) {
        continue; // skip separator
      }
      if (!inTable) {
        flushTable();
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Empty line
    if (line.trim() === '') {
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      jsxParts.push(`<Title order={1} mt="xl" mb="md">${escapeJsx(line.slice(2))}</Title>`);
    } else if (line.startsWith('## ')) {
      jsxParts.push(`<Title order={2} mt="xl" mb="md">${escapeJsx(line.slice(3))}</Title>`);
    } else if (line.startsWith('### ')) {
      jsxParts.push(`<Title order={3} mt="lg" mb="sm">${escapeJsx(line.slice(4))}</Title>`);
    } else if (line.startsWith('#### ')) {
      jsxParts.push(`<Title order={4} mt="md" mb="xs">${escapeJsx(line.slice(5))}</Title>`);
    } else if (line.startsWith('> ')) {
      jsxParts.push(`<Paper p="md" mb="md" withBorder bg="var(--mantine-color-blue-light)"><Text fs="italic">${escapeJsx(line.slice(2))}</Text></Paper>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Collect list items
      const items = [line.slice(2)];
      while (i + 1 < lines.length && (lines[i + 1].startsWith('- ') || lines[i + 1].startsWith('* '))) {
        i++;
        items.push(lines[i].slice(2));
      }
      let listJsx = '<List spacing="xs" size="sm" mb="md">\n';
      for (const item of items) {
        listJsx += `  <List.Item>${escapeJsx(item)}</List.Item>\n`;
      }
      listJsx += '</List>';
      jsxParts.push(listJsx);
    } else if (/^\d+\. /.test(line)) {
      const items = [line.replace(/^\d+\. /, '')];
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i + 1])) {
        i++;
        items.push(lines[i].replace(/^\d+\. /, ''));
      }
      let listJsx = '<List type="ordered" spacing="xs" size="sm" mb="md">\n';
      for (const item of items) {
        listJsx += `  <List.Item>${escapeJsx(item)}</List.Item>\n`;
      }
      listJsx += '</List>';
      jsxParts.push(listJsx);
    } else if (line.startsWith('---')) {
      jsxParts.push('<Divider my="lg" />');
    } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      jsxParts.push(`<Text size="sm" c="dimmed" fs="italic" mb="sm">${escapeJsx(line.replace(/^\*|\*$/g, ''))}</Text>`);
    } else {
      jsxParts.push(`<Text mb="sm">${escapeJsx(line)}</Text>`);
    }
  }
  flushTable();
  return jsxParts.join('\n      ');
}

for (const config of configs) {
  const md = fs.readFileSync(config.mdFile, 'utf-8');
  const content = mdToJsx(md);

  const tsx = `'use client';

import Link from 'next/link';
import { Container, Title, Text, Anchor, Divider, Table, List, Paper, Group } from '@mantine/core';

export default function MinutesPage() {
  return (
    <Container size="md" py="xl">
      <Group mb="md">
        <Anchor component={Link} href="/" size="sm" c="dimmed">← Idea Hub</Anchor>
        <Text size="sm" c="dimmed">|</Text>
        <Anchor component={Link} href={'/brainstorm/${config.id}'} size="sm" c="dimmed">📋 상세</Anchor>
        <Text size="sm" c="dimmed">|</Text>
        <Anchor component={Link} href={'/brainstorm/${config.id}/docs'} size="sm" c="dimmed">📄 Docs</Anchor>
      </Group>

      <Title order={1} mb="xs">${escapeJsx(config.title)}</Title>
      <Text c="dimmed" mb="xl">${escapeJsx(config.subtitle)}</Text>

      ${content}
    </Container>
  );
}
`;

  const outPath = path.join('E:\\idea-hub\\src\\app\\brainstorm', config.id, 'minutes', 'page.tsx');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, tsx, 'utf-8');
  console.log(`Written: ${outPath}`);

  // Count headings from MD for verification
  const headings = md.split('\n').filter(l => l.startsWith('## ')).map(l => l.trim());
  console.log(`  Headings in MD (${headings.length}):`);
  headings.forEach(h => console.log(`    ${h}`));

  const pageHeadings = content.match(/order=\{2\}[^>]*>([^<]+)/g) || [];
  console.log(`  H2 in page: ${pageHeadings.length}`);
}

console.log('\\nDone!');
