export interface ModerationResult {
  flagged: boolean
  reason?: string
}

/** Baseline denylist used when the Gemini API key is not configured, or the API call fails. */
const NSFW_TERMS = [
  'porn', 'pornhub', 'xvideos', 'xxx', 'nude', 'nudes', 'naked',
  'onlyfans', 'hentai', 'rape', 'cp link', 'child porn', 'sex video',
  'escort', 'brothel', 'sex slave',
]

const PROFANITY_TERMS_EN = [
  'fuck', 'fucking', 'fucker', 'motherfucker', 'fck', 'fuk',
  'shit', 'bullshit', 'bitch', 'asshole', 'bastard', 'cunt',
  'dick', 'dickhead', 'pussy', 'slut', 'whore', 'twat', 'prick',
  'douchebag', 'wtf', 'stfu', 'gtfo', 'omfg', 'ffs',
  'yo mama', 'your mama', 'son of a bitch',
  'ass', 'tit', 'tits', 'boobs',
]

const PROFANITY_TERMS_VI = [
  'đụ', 'địt', 'đĩt', 'đéo', 'đĩ', 'lồn', 'buồi', 'cặc',
  'óc chó', 'thằng chó', 'con chó', 'đồ chó', 'súc vật', 'đồ khốn',
  'đm', 'đcm', 'dcm', 'vl', 'vcl', 'vkl', 'clgt', 'cmnr', 'cmm',
]

const INSULT_TERMS_VI = [
  'tổ sư', 'tổ cha', 'chó điên', 'đồ ngu', 'thằng ngu', 'con ngu',
  'đồ ngốc', 'thằng ngốc', 'con ngốc', 'đồ đần', 'đần độn', 'óc lợn',
  'não tôm', 'đồ khốn nạn', 'khốn nạn', 'thằng khốn', 'con khốn',
  'mất dạy', 'vô học', 'đồ rác rưởi', 'rác rưởi', 'súc sinh',
  'đồ súc sinh', 'thằng điên', 'con điên', 'đồ điên', 'bố khỉ',
  'mẹ kiếp', 'trời đánh', 'đồ khỉ', 'thằng dở', 'đồ dở hơi',
  'ngu', 'điên', 'khùng', 'ngốc', 'đần', 'dở hơi', 'vô dụng',
]

// Vietnamese slang curses that insult the target's family members.
const FAMILY_INSULT_TERMS_VI = [
  'mẹ mày', 'cha mày', 'bố mày', 'thằng bố mày', 'con mẹ mày',
  'bà mày', 'ông mày', 'tao là bố mày', 'tao là mẹ mày', 'nhà mày',
]

const INSULT_TERMS_EN = [
  'stupid', 'idiot', 'moron', 'dumb', 'dumbass', 'loser', 'lame',
  'imbecile', 'retard', 'lunatic',
]

const PROFANITY_TERMS_ES = [
  'puta', 'puto', 'mierda', 'pendejo', 'cabrón', 'gilipollas',
  'joder', 'maricón', 'coño', 'verga', 'estúpido', 'idiota', 'tonto',
  'tu madre', 'hijo de puta',
]

const PROFANITY_TERMS_PT = [
  'porra', 'caralho', 'foder', 'cacete', 'arrombado', 'merda',
  'estúpido', 'idiota', 'burro', 'sua mãe', 'filho da puta',
]

const PROFANITY_TERMS_FR = [
  'merde', 'putain', 'connard', 'salope', 'enculé', 'pute', 'bordel',
  'stupide', 'idiot', 'crétin', 'ta mère', 'fils de pute',
]

const PROFANITY_TERMS_IT = [
  'cazzo', 'puttana', 'stronzo', 'vaffanculo', 'troia',
  'stupido', 'idiota', 'scemo', 'tua madre', 'figlio di puttana',
]

const PROFANITY_TERMS_DE = [
  'scheiße', 'scheisse', 'arschloch', 'hure', 'wichser', 'ficken',
  'idiot', 'blöd', 'deine mutter', 'hurensohn',
]

const PROFANITY_TERMS_RU = [
  'блять', 'сука', 'хуй', 'пизда', 'ебать', 'мудак',
  'дурак', 'идиот', 'тупой', 'твою мать', 'сукин сын',
]

const PROFANITY_TERMS_ZH = [
  '妈的', '傻逼', '婊子', '操你妈', '王八蛋', '滚你妈',
  '笨蛋', '蠢', '白痴', '你妈', '你妈的',
]

const PROFANITY_TERMS_JA = [
  'くそったれ', 'ちくしょう', 'ばかやろう', 'くそ野郎',
  'バカ', 'ばか',
]

const PROFANITY_TERMS_KO = [
  '씨발', '개새끼', '병신', '미친놈',
  '바보', '멍청이',
]

const DENYLIST = [
  ...NSFW_TERMS,
  ...PROFANITY_TERMS_EN,
  ...INSULT_TERMS_EN,
  ...PROFANITY_TERMS_VI,
  ...INSULT_TERMS_VI,
  ...FAMILY_INSULT_TERMS_VI,
  ...PROFANITY_TERMS_ES,
  ...PROFANITY_TERMS_PT,
  ...PROFANITY_TERMS_FR,
  ...PROFANITY_TERMS_IT,
  ...PROFANITY_TERMS_DE,
  ...PROFANITY_TERMS_RU,
  ...PROFANITY_TERMS_ZH,
  ...PROFANITY_TERMS_JA,
  ...PROFANITY_TERMS_KO,
]

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
  const prompt = `You are a content moderation classifier for a QR code generator used in a school environment. Decide whether the following user-submitted text contains 18+, sexual, NSFW, hateful, violent, profane/vulgar language, insults, or name-calling (e.g. "đồ ngu", "chó điên", "tổ sư", "thằng ngốc", "stupid", "idiot") that should be blocked from being encoded into a QR code. The text may be written in ANY language (Vietnamese, English, Spanish, Portuguese, French, Italian, German, Russian, Chinese, Japanese, Korean, or any other language), and may use abbreviations, teencode, or leetspeak for swear words (e.g. "vl", "vcl", "đm", "wtf", "stfu"). Treat these the same as the full words, regardless of language.

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
