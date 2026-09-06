import { categories, questions, type CategoryId, type QuizQuestion } from '@/data/questions'

export type MainAreaId = 'peyiv' | 'tip' | 'hejmar' | 'matematik' | 'emoji'
export type MathOperation = 'komkirin' | 'kemkirin' | 'zedekirin' | 'parvekirin'
export type TaskKind = 'choice' | 'spelling'

export type LearningTask = {
  id: string
  kind: TaskKind
  area: MainAreaId
  title: string
  prompt: string
  display: string
  answer: string
  options: string[]
  emoji?: string
  sourceQuestion?: QuizQuestion
}

export const mainAreas = [
  { id: 'peyiv' as const, name: 'Peyv', description: 'Peyvên nû nas bike', emoji: '🧩', color: 'coral' },
  { id: 'tip' as const, name: 'Tîp', description: 'Alfabeya kurdî hîn bibe', emoji: '🔤', color: 'sun' },
  { id: 'hejmar' as const, name: 'Hejmar', description: 'Ji sifir heta neh', emoji: '🔢', color: 'sky' },
  { id: 'matematik' as const, name: 'Matematîk', description: 'Bi hejmaran bilîze', emoji: '➕', color: 'mint' },
  { id: 'emoji' as const, name: 'Emojî', description: 'Peyvê ji tîpan çêbike', emoji: '😀', color: 'violet' },
]

export const wordCategoryIds: CategoryId[] = ['xwarin', 'ajalan', 'wesayit', 'tist', 'xweza', 'werzis', 'pise', 'welat', 'cih', 'dem']

export const wordCategories = wordCategoryIds.map((id) => {
  const category = categories.find((item) => item.id === id)!
  return { ...category, name: id === 'dem' ? 'Demjimêr' : category.name }
})

export const kurdishAlphabet = ['A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'I', 'Î', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T', 'U', 'Û', 'V', 'W', 'X', 'Y', 'Z'] as const

export const letterExamples: Record<(typeof kurdishAlphabet)[number], string[]> = {
  A: ['Av', 'Agir', 'Aso'],
  B: ['Bav', 'Baran', 'Berf'],
  C: ['Cih', 'Ceger', 'Civat'],
  Ç: ['Çav', 'Çiya', 'Çem'],
  D: ['Dar', 'Derya', 'Dest'],
  E: ['Ev', 'Ewr', 'Ezman'],
  Ê: ['Êvar', 'Êş', 'Êzing'],
  F: ['Fîl', 'Firîn', 'Fêkî'],
  G: ['Gul', 'Guh', 'Giran'],
  H: ['Hêvî', 'Hesp', 'Heval'],
  I: ['Jin', 'Dil', 'Birinc'],
  Î: ['Îro', 'Îşev', 'Îlon'],
  J: ['Jin', 'Jiyan', 'Ji'],
  K: ['Kitêb', 'Kûçik', 'Kurd'],
  L: ['Lîstik', 'Lawik', 'Ling'],
  M: ['Mal', 'Mezin', 'Mirîşk'],
  N: ['Nan', 'Nav', 'Nû'],
  O: ['Otomobîl', 'Ordek', 'Ode'],
  P: ['Pisîk', 'Pênc', 'Pirtûk'],
  Q: ['Qelem', 'Qapî', 'Qehwe'],
  R: ['Roj', 'Rê', 'Reş'],
  S: ['Sêv', 'Spî', 'Stêrk'],
  Ş: ['Şev', 'Şêr', 'Şeş'],
  T: ['Tav', 'Tişt', 'Tu'],
  U: ['Gul', 'Kurd', 'Dur'],
  Û: ['Kûçik', 'Mûz', 'Rû'],
  V: ['Av', 'Heval', 'Nav'],
  W: ['Welat', 'Wêne', 'Werzîş'],
  X: ['Xwarin', 'Xewn', 'Xwe'],
  Y: ['Yek', 'Yar', 'Yazdeh'],
  Z: ['Ziman', 'Zer', 'Zozan'],
}

export const numberWords = ['sifir', 'yek', 'du', 'sê', 'çar', 'pênc', 'şeş', 'heft', 'heyşt', 'neh'] as const

export const mathOperations = [
  { id: 'komkirin' as const, name: 'Komkirin', emoji: '➕', description: 'Hejmaran li hev zêde bike' },
  { id: 'kemkirin' as const, name: 'Kêmkirin', emoji: '➖', description: 'Ji hejmarê kêm bike' },
  { id: 'zedekirin' as const, name: 'Zêdekirin', emoji: '✖️', description: 'Hejmaran çend caran zêde bike' },
  { id: 'parvekirin' as const, name: 'Parvekirin', emoji: '➗', description: 'Hejmarê bi beşan parve bike' },
]

export const shuffle = <T,>(items: T[]) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

const unique = <T,>(items: T[]) => [...new Set(items)]

function fillRound<T>(pool: T[], count = 10) {
  if (pool.length === 0) return []
  const selected: T[] = []
  while (selected.length < count) selected.push(...shuffle(pool))
  return selected.slice(0, count)
}

function choiceOptions(answer: string, distractors: string[]) {
  return shuffle(unique([answer, ...shuffle(unique(distractors.filter((item) => item !== answer))).slice(0, 3)]))
}

export function buildWordRound(categoryId: CategoryId): LearningTask[] {
  const pool = questions.filter((question) => question.category === categoryId)
  return fillRound(pool).map((question, index) => ({
    id: `peyiv-${question.id}-${index}`,
    kind: 'choice',
    area: 'peyiv',
    title: 'Peyva rast hilbijêre',
    prompt: 'Ev wêne kîjan peyvê nîşan dide?',
    display: question.emoji,
    emoji: question.emoji,
    answer: question.correctAnswer.trim(),
    options: choiceOptions(question.correctAnswer.trim(), pool.map((item) => item.correctAnswer.trim())),
    sourceQuestion: question,
  }))
}

export function buildLetterRound(letter: (typeof kurdishAlphabet)[number]): LearningTask[] {
  const examples = letterExamples[letter]
  const otherLetters = kurdishAlphabet.filter((item) => item !== letter)
  const wordsWithoutLetter = Object.values(letterExamples).flat().filter((word) => !word.toUpperCase().includes(letter))
  const tasks: LearningTask[] = []

  examples.forEach((word, index) => {
    const upperWord = word.toUpperCase()
    const letterIndex = upperWord.indexOf(letter)
    const missingWord = letterIndex >= 0 ? `${word.slice(0, letterIndex)}_${word.slice(letterIndex + 1)}` : `_${word}`
    tasks.push(
      {
        id: `tip-${letter}-nas-${index}`,
        kind: 'choice',
        area: 'tip',
        title: 'Tîpê nas bike',
        prompt: 'Tîpa ku tu dibînî hilbijêre.',
        display: letter,
        answer: letter,
        options: choiceOptions(letter, otherLetters),
      },
      {
        id: `tip-${letter}-kêm-${index}`,
        kind: 'choice',
        area: 'tip',
        title: 'Tîpa kêm bibîne',
        prompt: `Kîjan tîp di peyva “${word}” de kêm e?`,
        display: missingWord,
        answer: letter,
        options: choiceOptions(letter, otherLetters),
      },
      {
        id: `tip-${letter}-peyiv-${index}`,
        kind: 'choice',
        area: 'tip',
        title: 'Peyvê bibîne',
        prompt: `Kîjan peyv tîpa “${letter}” dihewîne?`,
        display: letter,
        answer: word,
        options: choiceOptions(word, wordsWithoutLetter),
      },
    )
  })

  return fillRound(tasks)
}

export function buildNumberRound(number: number): LearningTask[] {
  const word = numberWords[number]
  const otherNumbers = numberWords.map((_, index) => String(index)).filter((item) => item !== String(number))
  const otherWords = numberWords.filter((item) => item !== word)
  const sequence = number === 0 ? `_ · 1 · 2` : number === 9 ? `7 · 8 · _` : `${number - 1} · _ · ${number + 1}`
  const tasks: LearningTask[] = [
    {
      id: `hejmar-${number}-nas`, kind: 'choice', area: 'hejmar', title: 'Hejmarê nas bike',
      prompt: 'Kîjan hejmar li vir e?', display: String(number), answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
    {
      id: `hejmar-${number}-peyiv`, kind: 'choice', area: 'hejmar', title: 'Navê hejmarê bibîne',
      prompt: `Navê hejmar ${number} kîjan e?`, display: String(number), answer: word, options: choiceOptions(word, [...otherWords]),
    },
    {
      id: `hejmar-${number}-veger`, kind: 'choice', area: 'hejmar', title: 'Hejmarê hilbijêre',
      prompt: `Kîjan hejmar “${word}” e?`, display: word, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
    {
      id: `hejmar-${number}-dor`, kind: 'choice', area: 'hejmar', title: 'Rêzê temam bike',
      prompt: 'Hejmarê kêm hilbijêre.', display: sequence, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
  ]
  return fillRound(tasks)
}

function mathValues(operation: MathOperation, level: number) {
  const range = Math.min(5 + level * 2, 30)
  if (operation === 'komkirin') {
    const left = 1 + Math.floor(Math.random() * range)
    const right = 1 + Math.floor(Math.random() * range)
    return { left, right, answer: left + right, symbol: '+' }
  }
  if (operation === 'kemkirin') {
    const right = 1 + Math.floor(Math.random() * range)
    const answer = Math.floor(Math.random() * range)
    return { left: right + answer, right, answer, symbol: '−' }
  }
  if (operation === 'zedekirin') {
    const left = 1 + Math.floor(Math.random() * Math.min(4 + level, 12))
    const right = 1 + Math.floor(Math.random() * Math.min(4 + level, 12))
    return { left, right, answer: left * right, symbol: '×' }
  }
  const right = 1 + Math.floor(Math.random() * Math.min(4 + level, 12))
  const answer = 1 + Math.floor(Math.random() * Math.min(4 + level, 12))
  return { left: right * answer, right, answer, symbol: '÷' }
}

export function buildMathRound(operation: MathOperation, level: number): LearningTask[] {
  return Array.from({ length: 10 }, (_, index) => {
    const values = mathValues(operation, level)
    const distractors = [values.answer - 2, values.answer - 1, values.answer + 1, values.answer + 2, values.answer + values.right]
      .filter((item) => item >= 0)
      .map(String)
    return {
      id: `mat-${operation}-${Date.now()}-${index}`,
      kind: 'choice' as const,
      area: 'matematik' as const,
      title: mathOperations.find((item) => item.id === operation)?.name ?? 'Matematîk',
      prompt: 'Bersiva rast hilbijêre.',
      display: `${values.left} ${values.symbol} ${values.right} = ?`,
      answer: String(values.answer),
      options: choiceOptions(String(values.answer), distractors),
    }
  })
}

const preferredEmojiWords = ['Pisîk', 'Kûçik', 'Sêv', 'Dar', 'Otomobîl', 'Nan', 'Pirtûk', 'Roj', 'Heyv', 'Fîl', 'Hesp', 'Gul']

function normalizeWord(word: string) {
  return word.trim().replace(/[^A-Za-zÇçÊêÎîŞşÛû]/g, '').toUpperCase()
}

export function buildEmojiRound(): LearningTask[] {
  const preferred = preferredEmojiWords
    .map((word) => questions.find((question) => question.word.trim().toLowerCase() === word.toLowerCase()))
    .filter((question): question is QuizQuestion => Boolean(question))
  const fallback = questions.filter((question) => {
    const normalized = normalizeWord(question.word)
    return normalized.length >= 2 && normalized.length <= 10 && question.emoji.length > 0
  })
  return fillRound(unique([...preferred, ...shuffle(fallback)]), 10).map((question, index) => {
    const answer = normalizeWord(question.word)
    return {
      id: `emoji-${question.id}-${index}`,
      kind: 'spelling',
      area: 'emoji',
      title: 'Peyvê çêbike',
      prompt: 'Tîpan bi rêza rast hilbijêre.',
      display: question.emoji,
      emoji: question.emoji,
      answer,
      options: shuffle(answer.split('')),
      sourceQuestion: question,
    }
  })
}
