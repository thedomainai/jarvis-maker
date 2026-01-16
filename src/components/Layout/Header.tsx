import { Link } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'

export function Header() {
  const { lang, setLang, t } = useI18n()

  return (
    <header className="border-b border-[--color-border] bg-[--color-bg-primary]">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-[--color-text-primary] no-underline hover:text-[--color-accent] transition-colors">
          {t.appName}
        </Link>
        <button
          onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
          className="neon-button rounded border border-[--color-border] px-2 py-1 text-[12px] text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
        >
          {lang === 'en' ? 'JA' : 'EN'}
        </button>
      </div>
    </header>
  )
}
