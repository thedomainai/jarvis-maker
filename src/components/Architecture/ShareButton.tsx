import { useI18n } from '../../lib/i18n'

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const { t } = useI18n()

  const handleShare = () => {
    const text = `${title}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleShare}
      className="neon-button rounded border border-[--color-border] bg-transparent px-3 py-1.5 text-[12px] text-[--color-text-secondary] transition-all hover:border-[--color-border-hover] hover:text-[--color-text-primary]"
      title={t.shareOnX}
    >
      {t.share}
    </button>
  )
}
