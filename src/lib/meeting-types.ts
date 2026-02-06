export interface Speaker {
  emoji: string
  name: string
  color: string
}

export interface Message {
  speaker: Speaker
  content: string
}

export interface Round {
  number: number
  stage: string
  title: string
  messages: Message[]
}

export interface MeetingMeta {
  title: string
  date: string
  participants: string
  rounds: string
  idea: string
}

export const SPEAKERS: Record<string, Speaker> = {
  '사회자': { emoji: '🎙️', name: '사회자', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'MCP생태계분석가': { emoji: '🔍', name: 'MCP생태계분석가', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  '기발한놈': { emoji: '💡', name: '기발한놈', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  '빌더': { emoji: '🛠️', name: '빌더', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  '개발자대변인': { emoji: '👤', name: '개발자대변인', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  '채찍맨': { emoji: '🔨', name: '채찍맨', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  '비관론자': { emoji: '😈', name: '비관론자', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  '바이럴전략가': { emoji: '📢', name: '바이럴전략가', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
}
