'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Rocket,
  CheckCircle,
  Lightbulb,
  FileText,
  Code,
  ClipboardList,
  Star,
  Users,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  ChevronDown,
  ChevronUp,
  Ban,
  Wrench,
  Zap,
  User,
  Skull,
  Megaphone,
} from 'lucide-react';

const brainstorms: {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  createdAt: string;
  experts: number;
  rounds: number;
  status: string;
  tags: string[];
  color: string;
  stars: number;
  adopted: boolean;
  report: boolean;
}[] = [];

const experts = [
  { icon: Megaphone, name: '사회자', role: '토론 주관 + 서기' },
  { icon: Search, name: 'MCP생태계분석가', role: '기존 MCP 서버 분석' },
  { icon: Sparkles, name: '기발한놈', role: '창의적 관점' },
  { icon: Wrench, name: '빌더', role: 'MCP SDK + 프로토콜 설계' },
  { icon: User, name: '개발자대변인', role: 'DX 검증 + 거부권' },
  { icon: Zap, name: '채찍맨', role: '개발 일정 단축' },
  { icon: Skull, name: '비관론자', role: 'No-Go 판정 + 비판' },
  { icon: Megaphone, name: '바이럴전략가', role: 'GitHub/Reddit/HN 확산' },
];

const colorBorderTop: Record<string, string> = {
  red: 'border-t-red-500', orange: 'border-t-orange-500', yellow: 'border-t-yellow-500',
  lime: 'border-t-lime-500', green: 'border-t-green-500', teal: 'border-t-teal-500',
  cyan: 'border-t-cyan-500', blue: 'border-t-blue-500', indigo: 'border-t-indigo-500',
  violet: 'border-t-violet-500', purple: 'border-t-purple-500', pink: 'border-t-pink-500', gray: 'border-t-gray-500',
};
const colorLight: Record<string, string> = {
  red: 'bg-red-500/20 text-red-600', orange: 'bg-orange-500/20 text-orange-600', yellow: 'bg-yellow-500/20 text-yellow-600',
  lime: 'bg-lime-500/20 text-lime-600', green: 'bg-green-500/20 text-green-600', teal: 'bg-teal-500/20 text-teal-600',
  cyan: 'bg-cyan-500/20 text-cyan-600', blue: 'bg-blue-500/20 text-blue-600', indigo: 'bg-indigo-500/20 text-indigo-600',
  violet: 'bg-violet-500/20 text-violet-600', purple: 'bg-purple-500/20 text-purple-600', pink: 'bg-pink-500/20 text-pink-600', gray: 'bg-gray-500/20 text-gray-600',
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <Star key={i} size={12} fill="#f59e0b" stroke="#f59e0b" />
      ))}
      {count > 5 && <span className="text-[10px] text-amber-500 font-bold ml-0.5">+{count - 5}</span>}
    </div>
  );
}

function ProjectCard({ item }: { item: (typeof brainstorms)[0] }) {
  const mainLink = item.report ? `/${item.id}/report` : `/${item.id}`;
  const borderColor = item.report
    ? 'border-t-green-600'
    : item.adopted
      ? 'border-t-lime-600'
      : (colorBorderTop[item.color] || 'border-t-violet-500');

  return (
    <div className={`rounded-lg border shadow-sm bg-card border-t-[3px] ${borderColor} flex flex-col p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
      <Link href={mainLink} className="block flex-1 no-underline text-inherit">
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-base font-bold">{item.title}</span>
            {item.report && (
              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-green-500 text-white gap-0.5 shrink-0">
                <CheckCircle size={10} />완료
              </span>
            )}
            {item.adopted && !item.report && (
              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-lime-500 text-white gap-0.5 shrink-0">
                <Rocket size={10} />개발중
              </span>
            )}
            {item.status === '개발중단' && (
              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-gray-400 text-white gap-0.5 shrink-0">
                <Ban size={10} />중단
              </span>
            )}
          </div>
          {item.stars > 0 && <StarRating count={item.stars} />}
        </div>
        <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{item.subtitle}</p>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><Users size={12} />{item.experts}인</span>
          <span className="flex items-center gap-1"><RefreshCw size={12} />{item.rounds}R</span>
          <span>{item.date}</span>
        </div>
        <div className="mb-1.5">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${colorLight[item.color] || 'bg-secondary text-foreground'}`}>{item.status}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">#{tag}</span>
          ))}
        </div>
      </Link>
      <hr className="my-2 border-border" />
      <div className="flex items-center gap-3 flex-wrap">
        {item.report && (
          <Link href={`/${item.id}/report`} className="text-xs font-bold text-green-600 flex items-center gap-1 hover:underline">
            <CheckCircle size={12} />완료보고
          </Link>
        )}
        <Link href={`/${item.id}`} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <FileText size={12} />기획서
        </Link>
        <Link href={`/${item.id}/minutes`} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ClipboardList size={12} />회의록
        </Link>
        <Link href={`/${item.id}/docs`} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <Code size={12} />Docs
        </Link>
      </div>
    </div>
  );
}

type SortBy = 'newest' | 'oldest' | 'stars';

export default function Home() {
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showAdopted, setShowAdopted] = useState(true);
  const [showIdeas, setShowIdeas] = useState(true);
  const [showStopped, setShowStopped] = useState(false);

  const adopted = brainstorms.filter(b => b.adopted);
  const stopped = brainstorms.filter(b => b.status === '개발중단');
  const ideas = brainstorms.filter(b => !b.adopted && b.status !== '개발중단').sort((a, b) => {
    if (sortBy === 'newest') return (b.createdAt || b.date).localeCompare(a.createdAt || a.date);
    if (sortBy === 'oldest') return (a.createdAt || a.date).localeCompare(b.createdAt || b.date);
    return b.stars - a.stars;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-violet-500/5 border border-border p-6 sm:p-8 mb-6 sm:mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Brain size={24} className="text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">MCP Hub</h1>
              <p className="text-muted-foreground text-sm">
                8인 전문가 패널 · 8라운드 · {brainstorms.length}개 프로젝트
              </p>
            </div>
          </div>

          {/* 범례 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-green-500 text-white gap-1"><CheckCircle size={10} />완료</span>
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-lime-500 text-white gap-1"><Rocket size={10} />개발중</span>
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-600 gap-1"><Lightbulb size={10} />아이디어</span>
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-gray-400 text-white gap-1"><Ban size={10} />개발중단</span>
          </div>
        </div>
      </div>

      {/* 채택 프로젝트 */}
      {adopted.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <button onClick={() => setShowAdopted(!showAdopted)} className="flex items-center gap-1.5 mb-3 group cursor-pointer">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Rocket size={14} /> 채택 / 개발중 ({adopted.length})
            </h2>
            {showAdopted ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </button>
          {showAdopted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {adopted.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 아이디어 풀 */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setShowIdeas(!showIdeas)} className="flex items-center gap-1.5 group cursor-pointer">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Lightbulb size={14} /> 아이디어 풀 ({ideas.length})
            </h2>
            {showIdeas ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </button>
          {showIdeas && (
            <div className="flex items-center gap-1">
              {([['newest', '최신순'], ['oldest', '오래된순'], ['stars', '별점순']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${sortBy === key ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {showIdeas && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {ideas.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* 개발중단 */}
      {stopped.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <button onClick={() => setShowStopped(!showStopped)} className="flex items-center gap-1.5 mb-3 group cursor-pointer">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Ban size={14} /> 개발중단 ({stopped.length})
            </h2>
            {showStopped ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </button>
          {showStopped && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {stopped.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 브레인스토밍 방식 */}
      <div className="rounded-lg border shadow-sm bg-card border-t-[3px] border-t-violet-400 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-blue-600" />
          <h3 className="text-base sm:text-lg font-semibold">브레인스토밍 방식</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-sm mb-2">8인 전문가 패널</h4>
            <ul className="space-y-1">
              {experts.map((e, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                  <e.icon size={14} className="shrink-0 text-muted-foreground" />
                  <span className="font-medium">{e.name}</span>
                  <span className="text-muted-foreground">— {e.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">8라운드 x 5단계</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2"><Sparkles size={14} className="shrink-0 text-muted-foreground" /><span><span className="font-medium">1단계:</span> 발산 (2R) — 자유 평가</span></li>
              <li className="flex items-center gap-2"><Target size={14} className="shrink-0 text-muted-foreground" /><span><span className="font-medium">2단계:</span> 수렴 (2R) — 핵심 가치 제안</span></li>
              <li className="flex items-center gap-2"><Code size={14} className="shrink-0 text-muted-foreground" /><span><span className="font-medium">3단계:</span> DX & MCP 스펙 설계 (2R)</span></li>
              <li className="flex items-center gap-2"><Wrench size={14} className="shrink-0 text-muted-foreground" /><span><span className="font-medium">4단계:</span> 기술 구현 & MVP (1R)</span></li>
              <li className="flex items-center gap-2"><Rocket size={14} className="shrink-0 text-muted-foreground" /><span><span className="font-medium">5단계:</span> 최종 검증 & 확산 전략 (1R)</span></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              비관론자가 &quot;더 이상 비판할 게 없다&quot;고 할 때까지 반복.
              개발자대변인이 거부권 보유.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-xs mt-6">Powered by Teabagbot</p>
    </div>
  );
}
