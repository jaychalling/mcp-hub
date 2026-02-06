'use client'

import { type MeetingMeta } from '@/lib/meeting-types'
import { Calendar, Users, Layers, Lightbulb } from 'lucide-react'

interface MeetingHeaderProps {
  meta: MeetingMeta
}

export function MeetingHeader({ meta }: MeetingHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-border p-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          AI 브레인스토밍 회의록
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
          {meta.title}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetaItem icon={Calendar} label="일시" value={meta.date || '-'} />
          <MetaItem icon={Users} label="참여" value={meta.participants || '-'} />
          <MetaItem icon={Layers} label="라운드" value={meta.rounds || '-'} />
          <MetaItem
            icon={Lightbulb}
            label="아이디어"
            value={meta.idea ? meta.idea.split('—')[0].trim() : '-'}
            className="col-span-2 md:col-span-1"
          />
        </div>

        {meta.idea && meta.idea.includes('—') && (
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-3xl">
            {meta.idea.split('—').slice(1).join('—').trim()}
          </p>
        )}
      </div>
    </div>
  )
}

interface MetaItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  className?: string
}

function MetaItem({ icon: Icon, label, value, className = '' }: MetaItemProps) {
  return (
    <div className={`bg-secondary/50 rounded-xl p-3 ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <div className="text-foreground font-medium text-sm truncate">
        {value}
      </div>
    </div>
  )
}
