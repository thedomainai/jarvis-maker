import type { Architecture } from '../../types/architecture'
import { ArchitectureCard } from './ArchitectureCard'
import { useI18n } from '../../lib/i18n'

interface ArchitectureGridProps {
  architectures: Architecture[]
  loading: boolean
}

export function ArchitectureGrid({ architectures, loading }: ArchitectureGridProps) {
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-[--color-text-muted]">{t.loading}</span>
      </div>
    )
  }

  if (architectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-[--color-text-muted]">{t.noArchitectures}</span>
      </div>
    )
  }

  return (
    <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
      {architectures.map((architecture) => (
        <div key={architecture.id} className="mb-8 break-inside-avoid">
          <ArchitectureCard architecture={architecture} />
        </div>
      ))}
    </div>
  )
}
