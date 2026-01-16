import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Architecture, ArchitectureInput } from '../types/architecture'
import {
  getLocalArchitectures,
  saveLocalArchitectures,
  generateLocalId,
} from '../lib/storage'
import { COLLECTION_NAMES, USE_LOCAL_STORAGE } from '../lib/constants'

function isArchitecture(data: unknown): data is Omit<Architecture, 'id'> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'title' in data &&
    'contentEn' in data &&
    'contentJa' in data
  )
}

export function useArchitectures() {
  const [architectures, setArchitectures] = useState<Architecture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchArchitectures = async () => {
    try {
      setLoading(true)

      if (USE_LOCAL_STORAGE) {
        const data = getLocalArchitectures()
        setArchitectures(data)
      } else {
        const q = query(
          collection(db, COLLECTION_NAMES.ARCHITECTURES),
          orderBy('title', 'desc')
        )
        const snapshot = await getDocs(q)
        const data: Architecture[] = []
        snapshot.docs.forEach((docSnapshot) => {
          const docData = docSnapshot.data()
          if (isArchitecture(docData)) {
            data.push({
              id: docSnapshot.id,
              title: docData.title,
              contentEn: docData.contentEn,
              contentJa: docData.contentJa,
            })
          }
        })
        setArchitectures(data)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch architectures'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchitectures()
  }, [])

  const createArchitecture = async (input: ArchitectureInput): Promise<string> => {
    if (USE_LOCAL_STORAGE) {
      const id = generateLocalId()
      const newArchitecture: Architecture = {
        id,
        ...input,
      }
      const current = getLocalArchitectures()
      saveLocalArchitectures([newArchitecture, ...current])
      await fetchArchitectures()
      return id
    } else {
      const docRef = await addDoc(collection(db, COLLECTION_NAMES.ARCHITECTURES), {
        ...input,
      })
      await fetchArchitectures()
      return docRef.id
    }
  }

  return {
    architectures,
    loading,
    error,
    createArchitecture,
    refresh: fetchArchitectures,
  }
}

export function useArchitecture(id: string | undefined) {
  const [architecture, setArchitecture] = useState<Architecture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchArchitecture = async () => {
      try {
        setLoading(true)

        if (USE_LOCAL_STORAGE) {
          const all = getLocalArchitectures()
          const found = all.find((a) => a.id === id)
          if (found) {
            setArchitecture(found)
          } else {
            setError(new Error('Architecture not found'))
          }
        } else {
          const docRef = doc(db, COLLECTION_NAMES.ARCHITECTURES, id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const docData = docSnap.data()
            if (isArchitecture(docData)) {
              setArchitecture({
                id: docSnap.id,
                title: docData.title,
                contentEn: docData.contentEn,
                contentJa: docData.contentJa,
              })
            } else {
              setError(new Error('Invalid architecture data'))
            }
          } else {
            setError(new Error('Architecture not found'))
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch architecture'))
      } finally {
        setLoading(false)
      }
    }

    fetchArchitecture()
  }, [id])

  return { architecture, loading, error }
}
