import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { CopyButton } from '../Architecture/CopyButton'
import { I18nProvider } from '../../lib/i18n'

// Mock clipboard API
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWriteText.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders copy icon initially', () => {
    renderWithI18n(<CopyButton content="test content" />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('copies content to clipboard when clicked', async () => {
    renderWithI18n(<CopyButton content="test content" />)
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(mockWriteText).toHaveBeenCalledWith('test content')
  })

  it('shows check icon after successful copy', async () => {
    renderWithI18n(<CopyButton content="test content" />)
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      const svg = button.querySelector('svg')
      expect(svg).toHaveClass('text-[--color-success]')
    })
  })

  it('handles clipboard error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockWriteText.mockRejectedValue(new Error('Clipboard error'))

    renderWithI18n(<CopyButton content="test content" />)
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })
})
