export interface ModerationResult {
  flagged: boolean
  reason?: string
}

/** Baseline denylist used when the Gemini API key is not configured, or the API call fails. */
const NSFW_TERMS = [
  'porn', 'pornhub', 'xvideos', 'xxx', 'nude', 'nudes', 'naked',
  'onlyfans', 'hentai', 'rape', 'cp link', 'child porn', 'sex video',
  'escort', 'brothel',
]

const PROFANITY_TERMS_EN = [
  'fuck', 'fucking', 'fucker', 'motherfucker', 'fck', 'fuk',
  'shit', 'bullshit', 'bitch', 'asshole', 'bastard', 'cunt',
  'dick', 'dickhead', 'pussy', 'slut', 'whore', 'twat', 'prick',
  'douchebag', 'wtf', 'stfu', 'gtfo', 'omfg', 'ffs',
]

const PROFANITY_TERMS_VI = [
  'đụ', 'địt', 'đĩt', 'đéo', 'đĩ', 'lồn', 'buồi', 'cặc',
  'óc chó', 'thằng chó', 'con chó', 'đồ chó', 'súc vật', 'đồ khốn',
  'đm', 'đcm', 'dcm', 'vl', 'vcl', 'vkl', 'clgt', 'cmnr', 'cmm',
]

const DENYLIST = [...NSFW_TERMS, ...PROFANITY_TERMS_EN, ...PROFANITY_TERMS_VI]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Matches a denylisted term as a whole word/phrase (not as part of a larger word),
// so short abbreviations like "vl" don't match inside unrelated words.
const DENYLIST_PATTERNS = DENYLIST.map((term) => ({
  term,
  pattern: new RegExp(`(?<!\\p{L})${escapeRegExp(term)}(?!\\p{L})`, 'iu'),
}))

function keywordCheck(text: string): ModerationResult {
  for (const { term, pattern } of DENYLIST_PATTERNS) {
    if (pattern.test(text)) {
      return { flagged: true, reason: `Content contains a blocked term ("${term}").` }
    }
  }
  return { flagged: false }
}

async function geminiCheck(text: string, apiKey: string): Promise<ModerationResult> {
  const prompt = `You are a content moderation classifier for a QR code generator used in a school environment. Decide whether the following user-submitted text contains 18+, sexual, NSFW, hateful, violent, profane/vulgar language, or otherwise inappropriate content that should be blocked from being encoded into a QR code. The text may be in Vietnamese, English, or a mix of both, and may use abbreviations or teencode for swear words (e.g. "vl", "vcl", "đm", "wtf", "stfu"). Treat these the same as the full words.

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
 * Screens free-text QR content for 18+/NSFW material and Vietnamese/English
 * profanity (including common abbreviations like "vl" or "wtf").
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
