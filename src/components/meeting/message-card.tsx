'use client'

import { type Message } from '@/lib/meeting-types'
import { parseMarkdownContent } from '@/lib/meeting-parser'

interface MessageCardProps {
  message: Message
  index: number
}

export function MessageCard({ message, index }: MessageCardProps) {
  const { speaker, content } = message

  return (
    <div
      className="group relative"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${speaker.color}`}>
            {speaker.emoji}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${speaker.color}`}>
              {speaker.name}
            </span>
          </div>

          <div
            className="prose prose-sm max-w-none text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_code]:text-primary [&_code]:bg-secondary"
            dangerouslySetInnerHTML={{ __html: parseMarkdownContent(content) }}
          />
        </div>
      </div>

      <div className="absolute left-5 top-12 bottom-0 w-px bg-border/50 group-last:hidden" />
    </div>
  )
}
