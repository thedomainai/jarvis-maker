import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getLocalArchitectures, saveLocalArchitectures, generateLocalId } from '../storage'
import type { Architecture } from '../../types/architecture'

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getLocalArchitectures', () => {
    it('returns empty array when localStorage is empty', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      expect(getLocalArchitectures()).toEqual([])
    })

    it('returns parsed architectures from localStorage', () => {
      const mockData: Architecture[] = [
        {
          id: 'test-1',
          title: 'Test',
          contentEn: 'Content EN',
          contentJa: 'Content JA',
        },
      ]
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockData))
      expect(getLocalArchitectures()).toEqual(mockData)
    })

    it('returns empty array on JSON parse error', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid json')
      expect(getLocalArchitectures()).toEqual([])
    })
  })

  describe('saveLocalArchitectures', () => {
    it('saves architectures to localStorage', () => {
      const mockData: Architecture[] = [
        {
          id: 'test-1',
          title: 'Test',
          contentEn: 'Content EN',
          contentJa: 'Content JA',
        },
      ]
      saveLocalArchitectures(mockData)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'jarvis-architectures',
        JSON.stringify(mockData)
      )
    })
  })

  describe('generateLocalId', () => {
    it('generates unique IDs', () => {
      const id1 = generateLocalId()
      const id2 = generateLocalId()
      expect(id1).not.toBe(id2)
    })

    it('starts with "local-" prefix', () => {
      const id = generateLocalId()
      expect(id).toMatch(/^local-/)
    })

    it('contains timestamp', () => {
      const before = Date.now()
      const id = generateLocalId()
      const after = Date.now()
      const parts = id.split('-')
      const timestamp = parseInt(parts[1], 10)
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })
  })
})
