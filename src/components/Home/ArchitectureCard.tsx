import { Link } from 'react-router-dom'
import type { Architecture } from '../../types/architecture'
import { useI18n } from '../../lib/i18n'

interface ArchitectureCardProps {
  architecture: Architecture
}

// Remove comments (text in parentheses) from architecture preview
function stripComments(content: string): string {
  return content
    .split('\n')
    .map(line => line.replace(/\s*\([^)]*\)\s*$/, ''))
    .join('\n')
}

export function ArchitectureCard({ architecture }: ArchitectureCardProps) {
  const { lang, t } = useI18n()
  const content = lang === 'ja' ? architecture.contentJa : architecture.contentEn
  const strippedContent = stripComments(content)
  const previewLines = strippedContent.split('\n').slice(0, 8).join('\n')
  const hasMore = strippedContent.split('\n').length > 8

  return (
    <Link
      to={`/architecture/${architecture.id}`}
      className="neon-interactive group block rounded-lg border border-[--color-border] bg-[--color-bg-secondary]/88 p-5 no-underline transition-all hover:border-[--color-border-hover] hover:bg-[--color-bg-hover]/88"
    >
      <div className="mb-3">
        <span className="truncate text-[12px] text-[--color-accent]">
          {architecture.title || t.untitled}
        </span>
      </div>
      <pre className="overflow-hidden whitespace-pre-wrap break-words font-['JetBrains_Mono'] text-[11px] leading-[1.6] text-[--color-text-secondary]">
        {previewLines}
        {hasMore && <span className="text-[--color-text-muted]">...</span>}
      </pre>
    </Link>
  )
}
