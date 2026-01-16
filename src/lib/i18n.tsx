import { createContext, useContext, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from './constants'

export type Language = 'en' | 'ja'

// UI is always in English - language selection only affects comment display
const uiText = {
  appName: 'jarvis maker',
  loading: 'loading...',
  noArchitectures: 'no architectures yet',
  placeholder: 'Describe your system...',
  notFound: 'not found',
  back: '← back',
  untitled: 'untitled',
  share: 'share',
  copy: 'copy',
  copied: 'copied',
  shareOnX: 'Share on X',
  copyToClipboard: 'Copy to clipboard',
  generationFailed: 'Generation failed',
  apiKeyNotConfigured: 'Gemini API key not configured',
} as const

type UIText = typeof uiText

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: UIText
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
    return (saved === 'ja' || saved === 'en') ? saved : 'en'
  })

  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang)
  }

  // UI text is always English, lang is only for comment display switching
  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t: uiText }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
