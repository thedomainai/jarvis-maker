import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'

export interface BilingualContent {
  contentEn: string
  contentJa: string
}

const generateArchitectureFunction = httpsCallable<
  { prompt: string },
  BilingualContent
>(functions, 'generateArchitecture')

export async function generateArchitecture(prompt: string): Promise<BilingualContent> {
  const result = await generateArchitectureFunction({ prompt })
  return result.data
}
