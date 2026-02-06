'use client'

import { Download } from 'lucide-react'

interface MdDownloadButtonProps {
  filename: string
  content: string
}

export function MdDownloadButton({ filename, content }: MdDownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 border border-border transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>Download MD</span>
    </button>
  )
}
