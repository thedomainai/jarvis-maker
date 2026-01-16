import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateArchitecture } from '../../lib/gemini'
import { useI18n } from '../../lib/i18n'
import type { ArchitectureInput } from '../../types/architecture'

interface CreateInputProps {
  onSubmit: (input: ArchitectureInput) => Promise<string>
}

export function CreateInput({ onSubmit }: CreateInputProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { t } = useI18n()

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setError(null)

    try {
      const { contentEn, contentJa } = await generateArchitecture(prompt.trim())
      const title = prompt.trim().slice(0, 100)
      const id = await onSubmit({ title, contentEn, contentJa })
      setPrompt('')
      navigate(`/architecture/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.generationFailed)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-6 pt-4 shadow-[0_-1px_3px_rgba(0,0,0,0.2)]" style={{ backgroundColor: '#0f1117' }}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            rows={1}
            className="neon-input w-full resize-none rounded-2xl border border-[--color-border] bg-[--color-bg-secondary] px-4 py-3 text-[14px] text-[--color-text-primary] placeholder-[--color-text-muted] outline-none transition-colors focus:border-[--color-border-hover]"
            style={{ minHeight: '48px', maxHeight: '200px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = '48px'
              target.style.height = Math.min(target.scrollHeight, 200) + 'px'
            }}
            disabled={isGenerating}
          />
          {isGenerating && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 animate-spin text-[--color-text-muted]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 text-center text-[12px] text-[--color-error]">{error}</div>
        )}
      </div>
    </div>
  )
}
