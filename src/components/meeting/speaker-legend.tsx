'use client'

import { Speaker } from '@/lib/meeting-types'

interface SpeakerLegendProps {
  speakers: Speaker[]
}

export function SpeakerLegend({ speakers }: SpeakerLegendProps) {
  const seen = new Set<string>()
  const unique = speakers.filter(s => {
    if (seen.has(s.name)) return false
    seen.add(s.name)
    return true
  })

  return (
    <div className="bg-card/50 border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">참여 전문가</h3>
      <div className="flex flex-wrap gap-2">
        {unique.map((speaker) => (
          <div
            key={speaker.name}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${speaker.color}`}
          >
            <span>{speaker.emoji}</span>
            <span>{speaker.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
