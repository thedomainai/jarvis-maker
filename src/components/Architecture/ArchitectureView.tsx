import type { Architecture } from '../../types/architecture'
import { ShareButton } from './ShareButton'
import { CopyButton } from './CopyButton'
import { useI18n } from '../../lib/i18n'

interface ArchitectureViewProps {
  architecture: Architecture
}

export function ArchitectureView({ architecture }: ArchitectureViewProps) {
  const { lang } = useI18n()
  const currentUrl = window.location.href
  const content = lang === 'ja' ? architecture.contentJa : architecture.contentEn

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="overflow-hidden rounded-lg border border-[--color-border] bg-[--color-bg-secondary]/88 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[--color-border] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[--color-error]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#e0af68]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[--color-success]/60" />
            </div>
            <span className="text-[12px] text-[--color-text-secondary]">
              {architecture.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton title={architecture.title} url={currentUrl} />
            <CopyButton content={content} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <pre className="whitespace-pre-wrap break-words font-['JetBrains_Mono'] text-[12px] leading-[1.7] text-[--color-text-primary]">
            {content}
          </pre>
        </div>
      </div>
    </div>
  )
}
