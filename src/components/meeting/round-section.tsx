'use client'

import { useState } from 'react'
import { type Round } from '@/lib/meeting-types'
import { MessageCard } from './message-card'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface RoundSectionProps {
  round: Round
  isExpanded?: boolean
}

const STAGE_COLORS: Record<string, string> = {
  '1': 'from-blue-500 to-cyan-500',
  '2': 'from-emerald-500 to-teal-500',
  '3': 'from-amber-500 to-orange-500',
  '4': 'from-purple-500 to-pink-500',
  '5': 'from-rose-500 to-red-500',
}

const STAGE_NAMES: Record<string, string> = {
  '1': '아이디어 발산',
  '2': '수렴 및 정제',
  '3': '비즈니스 모델 설계',
  '4': '기술 아키텍처 & MVP 정의',
  '5': '최종 검증 & 액션플랜',
}

export function RoundSection({ round, isExpanded = false }: RoundSectionProps) {
  const [expanded, setExpanded] = useState(isExpanded)

  const stageColor = STAGE_COLORS[round.stage] || 'from-gray-500 to-gray-600'
  const stageName = STAGE_NAMES[round.stage] || round.title

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full group cursor-pointer"
      >
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${stageColor} flex items-center justify-center shadow-lg`}>
            <span className="text-lg font-bold text-white">{round.number}</span>
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${stageColor} text-white`}>
                {round.stage}단계
              </span>
              <span className="text-xs text-muted-foreground">
                {stageName}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
              라운드 {round.number}: {round.title}
            </h3>
          </div>

          <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>

          <div className="flex-shrink-0">
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {round.messages.length} 발언
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-border space-y-6">
          {round.messages.map((message, index) => (
            <MessageCard key={index} message={message} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
