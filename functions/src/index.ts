import * as functions from 'firebase-functions/v1'
import { defineString } from 'firebase-functions/params'
import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiApiKey = defineString('GEMINI_API_KEY')

const SYSTEM_PROMPT_EN = `You are "Agent Gene Studio" - an architecture design engine that transforms user goals into executable autonomous agent organization structures.

## Your Task
Convert the user's abstract goal into a "Directory Structure" of autonomous agents using the "Timeline-Reviewer Protocol".

## Logic Structure (3 Layers)

1. **Layer 1: The Lifecycle**
   - Decompose the domain into 3-5 phases (directories)
   - Example: Pre-production → Production → Post-production

2. **Layer 2: The Craft**
   - Place "Makers" who create deliverables in each phase
   - Role: Draft creation, code writing, execution

3. **Layer 3: The Critics**
   - Place "Reviewers" who audit/reject Maker outputs from specific perspectives
   - Role: Security check, cost monitoring, legal review

4. **The "Whimsy" Injection**
   - Add ONE "Joker" role that breaks domain conventions
   - Purpose: Spark innovation, prevent rigidity

## Output Format

Generate a directory structure with PERFECTLY ALIGNED tree lines like this example:

.agents/
├── 01_survey/
│   ├── drone-mapper.md        (Predict burial sites from terrain)
│   ├── permission-negotiator.md (Negotiate excavation permits with local government)
│   └── cultural-respecter.md  (Research local legends and taboos - Reviewer)
├── 02_excavation/
│   ├── layer-digger.md        (Dig without destroying strata)
│   ├── artifact-handler.md    (Extract artifacts without damage)
│   └── contamination-preventer.md (Monitor for modern material contamination - Reviewer)
└── 03_analysis/
    ├── carbon-dater.md        (Perform carbon dating)
    ├── theory-builder.md      (Infer historical background)
    └── skepticism-advocate.md (Keep questioning "Isn't that just a rock?" - Reviewer)

## CRITICAL Rules for tree structure
- Use "├── " for items with siblings below
- Use "└── " for the last item in a directory
- Use "│   " to continue vertical lines (4 chars: │ + 3 spaces)
- Use "    " (4 spaces) after └── for indentation (no vertical line)
- NO blank lines between directories
- Role names should be kebab-case in ENGLISH (e.g., "budget-guillotine")
- Descriptions in parentheses should be concise in ENGLISH
- Output ONLY the directory structure, no other text`

const TRANSLATE_PROMPT = `Translate ONLY the text inside parentheses from English to Japanese.

CRITICAL RULES:
- Keep the EXACT same directory structure, file names, and tree characters
- ONLY translate the text inside parentheses (...)
- Do NOT change anything outside parentheses
- Do NOT add or remove lines
- Do NOT change spacing or alignment
- Output the complete structure with translated comments

Example input:
├── drone-mapper.md        (Predict burial sites from terrain)

Example output:
├── drone-mapper.md        (地形から埋蔵場所を予測する)

Now translate this architecture:`

export const generateArchitecture = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    const prompt = data?.prompt
    if (!prompt || typeof prompt !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'Prompt is required')
    }

    const apiKey = geminiApiKey.value()
    if (!apiKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Gemini API key not configured')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

    try {
      // Step 1: Generate English version
      const resultEn = await model.generateContent([
        { text: SYSTEM_PROMPT_EN },
        { text: `Goal: ${prompt}` },
      ])
      const contentEn = resultEn.response.text()

      // Step 2: Translate comments to Japanese
      const resultJa = await model.generateContent([
        { text: TRANSLATE_PROMPT },
        { text: contentEn },
      ])

      return {
        contentEn,
        contentJa: resultJa.response.text(),
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new functions.https.HttpsError('internal', 'Failed to generate architecture')
    }
  })
