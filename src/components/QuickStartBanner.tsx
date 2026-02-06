'use client';

import { useState, RefObject } from 'react';
import { Copy, Check, Sparkles, Link2, ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface QuickStartBannerProps {
  contentRef: RefObject<HTMLDivElement | null>;
  projectName: string;
}

function htmlToMarkdown(element: HTMLElement): string {
  const lines: string[] = [];
  
  function processNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) lines.push(text);
      return;
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    
    if (el.dataset.quickstart === 'true') return;
    
    switch (tag) {
      case 'h1':
        lines.push(`\n# ${el.textContent?.trim()}\n`);
        return;
      case 'h2':
        lines.push(`\n## ${el.textContent?.trim()}\n`);
        return;
      case 'h3':
        lines.push(`\n### ${el.textContent?.trim()}\n`);
        return;
      case 'h4':
        lines.push(`\n#### ${el.textContent?.trim()}\n`);
        return;
      case 'table': {
        const rows = el.querySelectorAll('tr');
        rows.forEach((row, i) => {
          const cells = row.querySelectorAll('th, td');
          const cellTexts = Array.from(cells).map(c => c.textContent?.trim() || '');
          lines.push(`| ${cellTexts.join(' | ')} |`);
          if (i === 0) {
            lines.push(`| ${cellTexts.map(() => '---').join(' | ')} |`);
          }
        });
        lines.push('');
        return;
      }
      case 'li': {
        const text = el.textContent?.trim();
        if (text) lines.push(`- ${text}`);
        return;
      }
      case 'pre':
      case 'code': {
        if (tag === 'pre') {
          const code = el.textContent?.trim();
          if (code) lines.push(`\n\`\`\`\n${code}\n\`\`\`\n`);
          return;
        }
        break;
      }
      case 'p': {
        const text = el.textContent?.trim();
        if (text) lines.push(`\n${text}\n`);
        return;
      }
      case 'blockquote': {
        const text = el.textContent?.trim();
        if (text) lines.push(`\n> ${text}\n`);
        return;
      }
    }
    
    el.childNodes.forEach(child => processNode(child));
  }
  
  element.childNodes.forEach(child => processNode(child));
  
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const PROMPT_PREFIX = `아래 문서를 읽고 이 서비스를 처음부터 만들어줘.
기술 스택, 구조, 컴포넌트 설계를 그대로 따라가되, 빠진 부분은 최선의 판단으로 채워줘.`;

export default function QuickStartBanner({ contentRef, projectName }: QuickStartBannerProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const pathname = usePathname();

  const docsUrl = `https://mcp-hub.vercel.app${pathname}`;

  const copyWithFeedback = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleCopyUrl = () => {
    const text = `${PROMPT_PREFIX}\n\n문서: ${docsUrl}`;
    copyWithFeedback(text, setCopiedUrl);
  };

  const handleCopyFull = () => {
    if (!contentRef.current) return;
    const md = htmlToMarkdown(contentRef.current);
    const text = `${PROMPT_PREFIX}\n\n---\n\n# ${projectName} — 기술 문서\n\n${md}`;
    copyWithFeedback(text, setCopiedFull);
  };

  const handleToggle = () => {
    if (!expanded && contentRef.current && !markdown) {
      setMarkdown(htmlToMarkdown(contentRef.current));
    }
    setExpanded(!expanded);
  };

  return (
    <div data-quickstart="true" className="relative overflow-hidden rounded-2xl mb-8 p-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-yellow-300" />
          <h3 className="text-lg font-bold">🚀 시작하는 법</h3>
        </div>
        <div className="w-16 h-0.5 bg-white/40 rounded mb-4" />

        {/* 방법 1: URL 전달 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Link2 size={16} className="text-blue-200" />
            <span className="text-sm font-semibold">방법 1: URL 전달</span>
            <span className="text-xs text-white/60">(Claude Code, Cursor 등)</span>
          </div>
          <p className="text-xs text-white/70 mb-2.5 ml-6">
            AI가 URL을 직접 읽어 문서를 분석합니다. 가장 간편한 방법!
          </p>
          <button
            onClick={handleCopyUrl}
            className={`ml-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              copiedUrl
                ? 'bg-green-500 text-white shadow-green-500/30 shadow-lg'
                : 'bg-white text-purple-700 hover:bg-white/90 shadow-white/20 shadow-lg hover:shadow-xl'
            }`}
          >
            {copiedUrl ? <><Check size={16} /> ✅ 복사됨!</> : <><Copy size={16} /> 🔗 프롬프트 + URL 복사</>}
          </button>
        </div>

        {/* 방법 2: 전체 복사 */}
        <div>
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 mb-2 ml-0 bg-transparent border-none text-white cursor-pointer p-0"
          >
            <Copy size={16} className="text-purple-200" />
            <span className="text-sm font-semibold">방법 2: 전체 복사</span>
            <span className="text-xs text-white/60">(Lovable, Bolt, v0 등 URL 읽기 불가)</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="ml-6 mt-2">
              <div className="bg-black/30 rounded-xl p-4 mb-3 max-h-64 overflow-y-auto text-xs text-white/80 font-mono whitespace-pre-wrap border border-white/10">
                {markdown || '로딩 중...'}
              </div>
              <button
                onClick={handleCopyFull}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  copiedFull
                    ? 'bg-green-500 text-white shadow-green-500/30 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                {copiedFull ? <><Check size={16} /> ✅ 복사됨!</> : <><Copy size={16} /> 📋 프롬프트 + 전체 문서 복사</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
