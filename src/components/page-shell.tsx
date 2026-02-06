'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, ClipboardList, Code, Calendar } from 'lucide-react'

interface PageShellProps {
  projectId: string
  projectTitle: string
  subtitle: string
  activeTab: 'docs' | 'minutes'
  date?: string
  badges?: { label: string; className: string }[]
  color?: string
  children: React.ReactNode
}

const tabConfig = {
  docs: { label: 'Docs', icon: Code },
  minutes: { label: '회의록', icon: ClipboardList },
} as const

export function PageShell({
  projectId,
  projectTitle,
  subtitle,
  activeTab,
  date,
  badges = [],
  children,
}: PageShellProps) {
  const tabs: (keyof typeof tabConfig)[] = ['docs', 'minutes']

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">MCP Hub</span>
            </Link>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground text-sm">{projectTitle}</span>
          </div>

          {/* Tab nav */}
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
              const cfg = tabConfig[tab]
              const Icon = cfg.icon
              const href = `/${projectId}/${tab}`
              const isActive = tab === activeTab
              return (
                <Link
                  key={tab}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors no-underline ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cfg.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-border p-8 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
              {projectTitle}
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-3xl">{subtitle}</p>

            <div className="flex flex-wrap items-center gap-3">
              {date && (
                <div className="bg-secondary/50 rounded-xl px-3 py-2 flex items-center gap-2 text-sm">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-foreground font-medium">{date}</span>
                </div>
              )}
              {badges.map((b, i) => (
                <span key={i} className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${b.className}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
