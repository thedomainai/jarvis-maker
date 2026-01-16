import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3VX1e2EubpoFybLVL6CByRDOkmVX9eKM",
  authDomain: "jarvis-maker.firebaseapp.com",
  projectId: "jarvis-maker",
  storageBucket: "jarvis-maker.appspot.com",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Gemini setup
const GEMINI_API_KEY = 'AIzaSyA3VX1e2EubpoFybLVL6CByRDOkmVX9eKM'
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

const THEMES = [
  '映画制作',
  '宇宙ロケット開発',
  '新惑星探査',
  'レストランチェーン展開',
  '病院建設',
  '音楽アルバム収録',
  'モバイルゲームリリース',
  'ファッションブランド立ち上げ',
  '古代遺跡発掘',
  'テックスタートアップ創業',
  '24時間ニュースチャンネル運営',
  '海外ウェディングプランニング',
  '殺人事件捜査',
  '新薬開発',
  'テーマパーク建設',
  '暗号通貨トークン発行',
  '地震災害救援活動',
  '大統領選挙キャンペーン',
  '小説出版',
  'オリンピックスタジアム建設',
  'スマートシティ基盤構築',
  '美術館建築',
  'グローバル物流網構築',
  'アニメシリーズ制作',
  '自動運転車開発',
  'SNSプラットフォーム立ち上げ',
  'ECマーケットプレイス運営',
  '集団訴訟管理',
  '私立学校設立',
  '太陽光発電所建設',
]

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

Now translate this architecture:`

async function generateArchitecture(theme) {
  // Step 1: Generate English version
  const resultEn = await model.generateContent([
    { text: SYSTEM_PROMPT_EN },
    { text: `Goal: ${theme}` },
  ])
  const contentEn = resultEn.response.text()

  // Step 2: Translate comments to Japanese
  const resultJa = await model.generateContent([
    { text: TRANSLATE_PROMPT },
    { text: contentEn },
  ])
  const contentJa = resultJa.response.text()

  return { contentEn, contentJa }
}

async function saveToFirestore(title, contentEn, contentJa) {
  const docRef = await addDoc(collection(db, 'architectures'), {
    title,
    contentEn,
    contentJa,
  })
  return docRef.id
}

async function main() {
  console.log(`Starting generation of ${THEMES.length} architectures...\n`)

  for (let i = 0; i < THEMES.length; i++) {
    const theme = THEMES[i]
    console.log(`[${i + 1}/${THEMES.length}] Generating: ${theme}`)

    try {
      const { contentEn, contentJa } = await generateArchitecture(theme)
      const id = await saveToFirestore(theme, contentEn, contentJa)
      console.log(`  ✓ Saved with ID: ${id}`)

      // Rate limiting - wait 2 seconds between requests
      if (i < THEMES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`)
    }
  }

  console.log('\nDone!')
  process.exit(0)
}

main()
