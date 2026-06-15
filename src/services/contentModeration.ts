export interface ModerationResult {
  flagged: boolean
  reason?: string
}

/** Baseline denylist used when the Gemini API key is not configured, or the API call fails. */
const DENYLIST = [
  'porn', 'pornhub', 'xvideos', 'xxx', 'nude', 'nudes', 'naked',
  'onlyfans', 'hentai', 'fuck', 'fucking', 'rape', 'cp link',
  'child porn', 'sex video', 'escort', 'brothel',
]

function keywordCheck(text: string): ModerationResult {
  const lower = text.toLowerCase()
  for (const word of DENYLIST) {
    if (lower.includes(word)) {
      return { flagged: true, reason: `Content contains a blocked term ("${word}").` }
    }
  }
  return { flagged: false }
}

async function geminiCheck(text: string, apiKey: string): Promise<ModerationResult> {
  const prompt = `You are a content moderation classifier for a QR code generator used in a school environment. Decide whether the following user-submitted text contains 18+, sexual, NSFW, hateful, violent, or otherwise inappropriate content that should be blocked from being encoded into a QR code.

Respond with ONLY a JSON object, no markdown, in this exact format:
{"flagged": true or false, "reason": "short explanation"}

Text to classify:
"""${text}"""`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0, responseMimeType: 'application/json' },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!raw) throw new Error('Gemini API returned no content')

  const parsed = JSON.parse(raw) as { flagged?: boolean; reason?: string }
  return { flagged: Boolean(parsed.flagged), reason: parsed.reason }
}

/**
 * Screens free-text QR content for 18+/NSFW material.
 * Uses Gemini (VITE_GEMINI) when configured, falling back to a local
 * keyword denylist if the key is missing or the API call fails.
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  const trimmed = text.trim()
  if (!trimmed) return { flagged: false }

  const apiKey = import.meta.env.VITE_GEMINI as string | undefined
  if (!apiKey) {
    return keywordCheck(trimmed)
  }

  try {
    return await geminiCheck(trimmed, apiKey)
  } catch {
    return keywordCheck(trimmed)
  }
}
