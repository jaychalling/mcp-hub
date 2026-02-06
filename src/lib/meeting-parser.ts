import { type Round, type Message, type MeetingMeta, type Speaker, SPEAKERS } from './meeting-types'

export function parseMeetingMarkdown(markdown: string): { meta: MeetingMeta; rounds: Round[] } {
  // Parse meta information
  const meta: MeetingMeta = {
    title: '',
    date: '',
    participants: '',
    rounds: '',
    idea: '',
  }

  const titleMatch = markdown.match(/^# (.+)$/m)
  if (titleMatch) meta.title = titleMatch[1]

  // Support both **일시**: and **날짜:**
  const dateMatch = markdown.match(/\*\*(?:일시|날짜)\*\*:?\s*(.+)$/m)
  if (dateMatch) meta.date = dateMatch[1].trim()

  const participantsMatch = markdown.match(/\*\*(?:참여자?|참석자?|참여자|참석자)\*\*:?\s*(.+)$/m)
  if (participantsMatch) meta.participants = participantsMatch[1].trim()

  const roundsMatch = markdown.match(/\*\*라운드\*\*:?\s*(.+)$/m)
  if (roundsMatch) meta.rounds = roundsMatch[1].trim()

  const ideaMatch = markdown.match(/\*\*(?:아이디어|주제)\*\*:?\s*(.+)$/m)
  if (ideaMatch) meta.idea = ideaMatch[1].trim()

  // Parse rounds — support multiple formats
  const rounds: Round[] = []
  const roundPositions: { number: number; stage: string; title: string; start: number }[] = []

  // Format 1: ## 라운드 N — N단계: Title  /  ## 라운드 N: Title
  const fmt1 = /^## (?:🔄\s*)?라운드\s*(\d+)\s*(?:—\s*(\d)단계:\s*(.+)|:\s*(.+))$/gm
  let roundMatch: RegExpExecArray | null
  while ((roundMatch = fmt1.exec(markdown)) !== null) {
    const num = parseInt(roundMatch[1])
    const stage = roundMatch[2] || String(Math.ceil(num / 2))
    const title = (roundMatch[3] || roundMatch[4] || '').trim()
    roundPositions.push({ number: num, stage, title, start: roundMatch.index })
  }

  // Format 2: ## === 라운드 N: Title ===  (group header — may contain sub-rounds)
  if (roundPositions.length === 0) {
    const fmt2 = /^## ===\s*라운드\s*([\d~-]+)\s*:\s*(.+?)\s*===$/gm
    const groupPositions: { label: string; title: string; start: number }[] = []
    while ((roundMatch = fmt2.exec(markdown)) !== null) {
      groupPositions.push({ label: roundMatch[1], title: roundMatch[2].trim(), start: roundMatch.index })
    }

    // Check for ### [라운드 N - STEP N: Title] or ### [STEP N: Title] sub-headers
    const subRoundRegex = /^### \[(?:라운드\s*(\d+)\s*-\s*)?STEP\s*(\d+)\s*:\s*(.+?)\]$/gm
    const subPositions: { roundNum: number | null; step: number; title: string; start: number }[] = []
    while ((roundMatch = subRoundRegex.exec(markdown)) !== null) {
      subPositions.push({
        roundNum: roundMatch[1] ? parseInt(roundMatch[1]) : null,
        step: parseInt(roundMatch[2]),
        title: roundMatch[3].trim(),
        start: roundMatch.index,
      })
    }

    if (subPositions.length > 0 && subPositions.some(s => s.roundNum !== null)) {
      // Sub-rounds have explicit round numbers (debate-arena style)
      for (const sub of subPositions) {
        const num = sub.roundNum || (roundPositions.length + 1)
        roundPositions.push({ number: num, stage: String(Math.ceil(num / 2)), title: sub.title, start: sub.start })
      }
    } else if (subPositions.length > 0) {
      // STEPs without round numbers — assign sequential round numbers
      let roundNum = 0
      for (const sub of subPositions) {
        roundNum++
        roundPositions.push({ number: roundNum, stage: String(Math.ceil(roundNum / 2)), title: sub.title, start: sub.start })
      }
    } else if (groupPositions.length > 0) {
      // No sub-rounds, use group headers as rounds
      let roundNum = 0
      for (const g of groupPositions) {
        roundNum++
        roundPositions.push({ number: roundNum, stage: String(Math.ceil(roundNum / 2)), title: g.title, start: g.start })
      }
    }
  }

  // Format 3: ### STEP N: Title (no round wrapper, no brackets — e.g. character-chat, web-qa-auto)
  if (roundPositions.length === 0) {
    const fmt3 = /^### STEP\s*(\d+)\s*:\s*(.+)$/gm
    let stepNum = 0
    while ((roundMatch = fmt3.exec(markdown)) !== null) {
      stepNum++
      roundPositions.push({ number: stepNum, stage: String(Math.ceil(stepNum / 2)), title: roundMatch[2].trim(), start: roundMatch.index })
    }
  }

  // Format 4: ### emoji [roleName] as round separators (storyflow, wcol-improvement)
  // These have ## === 라운드 N headers but speakers are ### headings — already handled by group fallback above
  // If still no rounds, try using ## === headers directly with speaker content below
  if (roundPositions.length === 0) {
    const fmt4 = /^## ===\s*(.+?)\s*===$/gm
    let roundNum = 0
    while ((roundMatch = fmt4.exec(markdown)) !== null) {
      roundNum++
      roundPositions.push({ number: roundNum, stage: String(Math.ceil(roundNum / 2)), title: roundMatch[1].trim(), start: roundMatch.index })
    }
  }

  for (let i = 0; i < roundPositions.length; i++) {
    const pos = roundPositions[i]
    const endPos = i < roundPositions.length - 1 ? roundPositions[i + 1].start : markdown.length
    const roundContent = markdown.slice(pos.start, endPos)
    const messages = parseMessages(roundContent)

    rounds.push({
      number: pos.number,
      stage: pos.stage,
      title: pos.title,
      messages,
    })
  }

  return { meta, rounds }
}

function parseSpeaker(emoji: string, name: string): Speaker {
  return SPEAKERS[name] || {
    emoji,
    name,
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

const KNOWN_ROLES = new Set(Object.keys(SPEAKERS))

function parseMessages(content: string): Message[] {
  const messages: Message[] = []
  const lines = content.split('\n')
  let currentSpeaker: Speaker | null = null
  let currentContent: string[] = []

  function flush() {
    if (currentSpeaker && currentContent.length > 0) {
      messages.push({ speaker: currentSpeaker, content: currentContent.join('\n').trim() })
    }
    currentContent = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip round/group headings
    if (line.startsWith('## ')) continue

    // Format 1: ### emoji roleName (h3 heading)
    const h3Match = line.match(/^###\s+(\S+)\s+(.+)$/)
    if (h3Match) {
      const name = h3Match[2].replace(/^\[|\]$/g, '').trim()
      if (KNOWN_ROLES.has(name)) {
        flush()
        currentSpeaker = parseSpeaker(h3Match[1], name)
        continue
      }
    }

    // Format 2: ### STEP / ### [STEP / ### [라운드 (subheading — skip, already parsed as round boundary)
    if (line.match(/^###\s+\[?(?:STEP|라운드)\s+\d+/i)) {
      continue
    }

    // Format 3: emoji **[roleName]** speech
    const bracketMatch = line.match(/^(\S+)\s+\*\*\[(.+?)\]\*\*\s*(.*)$/)
    if (bracketMatch) {
      const name = bracketMatch[2].trim()
      if (KNOWN_ROLES.has(name)) {
        flush()
        currentSpeaker = parseSpeaker(bracketMatch[1], name)
        if (bracketMatch[3]) {
          // Remove surrounding quotes
          const speech = bracketMatch[3].replace(/^"(.*)"$/, '$1').trim()
          if (speech) currentContent.push(speech)
        }
        continue
      }
    }

    // Format 4: **emoji roleName:** speech (colon style)
    const colonMatch = line.match(/^\*\*(\S+)\s+(.+?):\*\*\s*(.*)$/)
    if (colonMatch) {
      const name = colonMatch[2].trim()
      if (KNOWN_ROLES.has(name)) {
        flush()
        currentSpeaker = parseSpeaker(colonMatch[1], name)
        if (colonMatch[3]) currentContent.push(colonMatch[3].trim())
        continue
      }
    }

    // Format 5: **emoji roleName** (bold, no colon)
    const boldMatch = line.match(/^\*\*(\S+)\s+\[?(.+?)\]?\*\*\s*$/)
    if (boldMatch) {
      const name = boldMatch[2].trim()
      if (KNOWN_ROLES.has(name)) {
        flush()
        currentSpeaker = parseSpeaker(boldMatch[1], name)
        continue
      }
    }

    // Regular content line
    if (currentSpeaker) {
      currentContent.push(line)
    }
  }

  flush()
  return messages
}

export function parseMarkdownContent(content: string): string {
  let html = content.trim()
  html = html.replace(/\n{3,}/g, '\n\n')

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
    return `<pre class="bg-secondary/50 rounded-lg p-4 overflow-x-auto text-sm font-mono my-4"><code class="text-muted-foreground">${escapeHtml(code.trim())}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary">$1</code>')

  // Tables
  html = html.replace(/\|(.+)\|\n\|[-|\s]+\|\n((?:\|.+\|\n?)+)/g, (_match, header: string, body: string) => {
    const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) =>
      `<th class="px-4 py-2 text-left font-medium text-foreground border-b border-border">${h.trim()}</th>`
    ).join('')

    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => {
        const cellContent = c.trim()
        return `<td class="px-4 py-2 text-muted-foreground border-b border-border/50">${cellContent}</td>`
      }).join('')
      return `<tr class="hover:bg-secondary/30 transition-colors">${cells}</tr>`
    }).join('')

    return `<div class="table-wrap my-4"><table class="w-full border-collapse text-sm"><thead><tr class="bg-secondary/30">${headers}</tr></thead><tbody>${rows}</tbody></table></div>`
  })

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 text-muted-foreground list-disc list-inside">$1</li>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-muted-foreground list-decimal list-inside">$1</li>')

  // Wrap consecutive list items
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => {
    return `<ul class="space-y-1 my-2">${match}</ul>`
  })

  // Line breaks — but skip newlines adjacent to block elements
  html = html.replace(/\n\n/g, '</p><p class="my-3">')
  html = html.replace(/\n/g, '<br/>')

  // Clean up: remove all <br/> tags inside <ul>/<ol> blocks
  html = html.replace(/<ul class="space-y-1 my-2">([\s\S]*?)<\/ul>/g, (_, inner) => {
    return `<ul class="space-y-1 my-2">${inner.replace(/<br\/>/g, '')}</ul>`
  })

  // Clean up empty paragraphs and br/p tags around block elements
  html = html.replace(/<p class="my-3">(\s|<br\/>)*<\/p>/g, '')
  html = html.replace(/<br\/>(\s*<(?:ul|ol|div|pre|table))/g, '$1')
  html = html.replace(/(<\/(?:ul|ol|div|pre|table)>)\s*<br\/>/g, '$1')
  html = html.replace(/<p class="my-3">(\s*<(?:ul|ol|div|pre|table))/g, '$1')
  html = html.replace(/(<\/(?:ul|ol|div|pre|table)>)\s*<\/p>/g, '$1')

  // Fix: text after </ul> needs its own <p> wrapper
  html = html.replace(/(<\/ul>)([^<])/g, '$1<p class="my-3">$2')

  return `<p class="my-3">${html}</p>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
