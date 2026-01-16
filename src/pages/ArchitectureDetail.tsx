import { useParams, Link } from 'react-router-dom'
import { useArchitecture } from '../hooks/useArchitectures'
import { ArchitectureView } from '../components/Architecture/ArchitectureView'
import { useI18n } from '../lib/i18n'

export function ArchitectureDetail() {
  const { id } = useParams<{ id: string }>()
  const { architecture, loading, error } = useArchitecture(id)
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-[--color-text-muted]">{t.loading}</span>
      </div>
    )
  }

  if (error || !architecture) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <span className="text-[--color-text-muted]">{t.notFound}</span>
        <Link
          to="/"
          className="text-[12px] text-[--color-text-secondary] hover:text-[--color-accent]"
        >
          {t.back}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="mx-auto max-w-4xl px-6 pt-4">
        <Link
          to="/"
          className="neon-button inline-block rounded border border-[--color-border] px-3 py-1.5 text-[12px] text-[--color-text-secondary] hover:text-[--color-accent]"
        >
          {t.back}
        </Link>
      </div>
      <ArchitectureView architecture={architecture} />
    </div>
  )
}
