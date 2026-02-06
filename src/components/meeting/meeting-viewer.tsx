'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { type MeetingMeta, type Round } from '@/lib/meeting-types'
import { MeetingHeader } from './meeting-header'
import { RoundSection } from './round-section'
import { SpeakerLegend } from './speaker-legend'
import { TableOfContents } from './table-of-contents'
import { ChevronUp, Expand, Shrink, ArrowLeft } from 'lucide-react'

interface MeetingViewerProps {
  meta: MeetingMeta
  rounds: Round[]
  projectId: string
  projectTitle?: string
}

export function MeetingViewer({ meta, rounds, projectId, projectTitle }: MeetingViewerProps) {
  const [activeRound, setActiveRound] = useState<number | null>(1)
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set([1]))
  const [showScrollTop, setShowScrollTop] = useState(false)
  const roundRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToRound = useCallback((roundNumber: number) => {
    const ref = roundRefs.current.get(roundNumber)
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setExpandedRounds(prev => new Set([...prev, roundNumber]))
      setActiveRound(roundNumber)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const expandAll = () => {
    setExpandedRounds(new Set(rounds.map(r => r.number)))
  }

  const collapseAll = () => {
    setExpandedRounds(new Set())
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${projectId}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{projectTitle || projectId}</span>
            </Link>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground text-sm">회의록</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <Expand className="w-4 h-4" />
              <span className="hidden sm:inline">모두 펼치기</span>
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <Shrink className="w-4 h-4" />
              <span className="hidden sm:inline">모두 접기</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <TableOfContents
              rounds={rounds}
              activeRound={activeRound}
              onRoundClick={scrollToRound}
            />
            <SpeakerLegend speakers={(() => {
              const seen = new Set<string>()
              const result: typeof rounds[0]['messages'][0]['speaker'][] = []
              for (const round of rounds) {
                for (const msg of round.messages) {
                  if (!seen.has(msg.speaker.name)) {
                    seen.add(msg.speaker.name)
                    result.push(msg.speaker)
                  }
                }
              }
              return result
            })()} />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            <MeetingHeader meta={meta} />

            <div className="space-y-4">
              {rounds.map((round) => (
                <div
                  key={round.number}
                  ref={(el) => {
                    if (el) roundRefs.current.set(round.number, el)
                  }}
                >
                  <RoundSection
                    round={round}
                    isExpanded={expandedRounds.has(round.number)}
                  />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
