import { PlainWord } from './types'

export interface PlainRewriteResult {
  simplifiedTitle: string
  bigPicture: string
  whatHappened: string[]
  whyItMatters: string
  plainWords: PlainWord[]
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function rewriteArticleToPlainEnglish(
  articleText: string,
  headline?: string
): Promise<PlainRewriteResult> {
  // If no API key or empty text, return smart deterministic simplification
  if (!OPENROUTER_API_KEY || !articleText.trim()) {
    return fallbackSimplification(articleText, headline)
  }

  const prompt = `You are an expert news editor and educator specializing in writing for adults aged 40+ at an 8th-grade school reading level.
Your goal is to make the news clear, calm, and easy to understand without confusing jargon, hyperbolic panic, or partisan spin.

ARTICLE HEADLINE: "${headline || 'News Report'}"
ARTICLE TEXT:
"""
${articleText.slice(0, 3000)}
"""

Please rewrite this news story into simple, plain English at an 8th-grade reading level.
Return ONLY valid JSON matching this exact structure:
{
  "simplifiedTitle": "Short, clear title in plain English (under 65 characters)",
  "bigPicture": "One clear sentence explaining the main point simply.",
  "whatHappened": [
    "First simple fact about what happened in everyday words.",
    "Second key detail or background point.",
    "Third outcome or what happens next."
  ],
  "whyItMatters": "Two sentences explaining the practical impact on everyday life, money, health, safety, or family for adults aged 40+.",
  "plainWords": [
    {"word": "Jargon Term 1", "meaning": "Simple everyday definition"},
    {"word": "Jargon Term 2", "meaning": "Simple everyday definition"}
  ]
}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://plainnews.vercel.app',
        'X-Title': 'PlainNews Reader',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return fallbackSimplification(articleText, headline)
    }

    const data = await res.json()
    const rawContent = data.choices?.[0]?.message?.content || ''

    // Clean JSON markdown if wrapped in ```json ... ```
    const cleanedJson = rawContent
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()

    const parsed = JSON.parse(cleanedJson)

    return {
      simplifiedTitle: parsed.simplifiedTitle || headline || 'News in Plain English',
      bigPicture: parsed.bigPicture || 'Here is the key takeaway in plain English.',
      whatHappened: Array.isArray(parsed.whatHappened) && parsed.whatHappened.length > 0
        ? parsed.whatHappened
        : ['The main events were reviewed by reporters.', 'Key details are being followed up.', 'Further updates will follow.'],
      whyItMatters: parsed.whyItMatters || 'Staying informed helps you make practical decisions for your home and finances.',
      plainWords: Array.isArray(parsed.plainWords) ? parsed.plainWords : [],
    }
  } catch {
    return fallbackSimplification(articleText, headline)
  }
}

function fallbackSimplification(text: string, headline?: string): PlainRewriteResult {
  const cleanHead = (headline || 'Breaking News Update')
    .replace(/<[^>]*>?/gm, '')
    .trim()

  const cleanBody = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
  const sentences = cleanBody
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)

  return {
    simplifiedTitle: cleanHead.length > 60 ? cleanHead.slice(0, 57) + '...' : cleanHead,
    bigPicture:
      sentences[0] || 'Here is the key news story summarized clearly for easy reading.',
    whatHappened: [
      sentences[1] || 'Officials and community members shared the latest facts regarding the situation.',
      sentences[2] || 'The impact touches everyday services, pricing, and practical routines.',
      sentences[3] || 'More verified details are expected as developments continue.',
    ],
    whyItMatters:
      'Keeping up with reliable facts helps you protect your family, save money, and avoid unnecessary worry or confusion.',
    plainWords: [
      { word: 'Plain English', meaning: 'Clear, straightforward words without confusing technical jargon.' },
      { word: 'Summary', meaning: 'The main facts gathered in short, readable sentences.' },
    ],
  }
}
