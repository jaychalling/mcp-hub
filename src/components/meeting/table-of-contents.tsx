'use client'

import { type Round } from '@/lib/meeting-types'

interface TableOfContentsProps {
  rounds: Round[]
  activeRound: number | null
  onRoundClick: (roundNumber: number) => void
}

const STAGE_COLORS: Record<string, string> = {
  '1': 'bg-blue-500',
  '2': 'bg-emerald-500',
  '3': 'bg-amber-500',
  '4': 'bg-purple-500',
  '5': 'bg-rose-500',
}

export function TableOfContents({ rounds, activeRound, onRoundClick }: TableOfContentsProps) {
  return (
    <div className="bg-card/50 border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">목차</h3>
      <nav className="space-y-1">
        {rounds.map((round) => {
          const stageColor = STAGE_COLORS[round.stage] || 'bg-gray-500'
          const isActive = activeRound === round.number

          return (
            <button
              key={round.number}
              onClick={() => onRoundClick(round.number)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${stageColor}`} />
              <span className="font-medium">R{round.number}</span>
              <span className="truncate flex-1 text-xs opacity-75">
                {round.title.replace(/\(심화\)/, '').trim()}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
