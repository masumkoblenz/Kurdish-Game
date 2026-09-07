import { categories, questions, type CategoryId, type QuizQuestion } from '@/data/questions'

export type MainAreaId = 'peyiv' | 'hevok' | 'tip' | 'hejmar' | 'rojen-hefteye' | 'meh' | 'matematik' | 'emoji'
export type MathOperation = 'komkirin' | 'kemkirin' | 'zedekirin' | 'parvekirin'
export type TaskKind = 'choice' | 'spelling' | 'sentence'

type CalendarEntry = {
  id: string
  name: string
  emoji: string
  price: number
}

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
  { id: 'peyiv' as const, name: 'Peyv', description: 'Peyvên nû nas bike', emoji: '🧩', color: 'coral', price: 50 },
  { id: 'hevok' as const, name: 'Hevok', description: 'Peyvan bi rêza rast rêz bike', emoji: '💬', color: 'plum', price: 100 },
  { id: 'tip' as const, name: 'Tîp', description: 'Bi 15+ cureyên pirsan hîn bibe', emoji: '🔤', color: 'sun', price: 0 },
  { id: 'hejmar' as const, name: 'Hejmar', description: 'Bi 15+ cureyên pirsan bilîze', emoji: '🔢', color: 'sky', price: 150 },
  { id: 'rojen-hefteye' as const, name: 'Rojên hefteyê', description: 'Nav û rêza heft rojan hîn bibe', emoji: '📅', color: 'rose', price: 200 },
  { id: 'meh' as const, name: 'Meh', description: 'Nav û rêza diwanzdeh mehan hîn bibe', emoji: '🗓️', color: 'indigo', price: 250 },
  { id: 'matematik' as const, name: 'Matematîk', description: 'Bi hejmaran bilîze', emoji: '➕', color: 'mint', price: 300 },
  { id: 'emoji' as const, name: 'Emojî', description: 'Peyvê ji tîpan çêbike', emoji: '😀', color: 'violet', price: 350 },
]

export const wordCategoryIds: CategoryId[] = ['xwarin', 'ajalan', 'wesayit', 'tist', 'xweza', 'reng', 'werzis', 'pise', 'welat', 'cih', 'dem']

export const wordCategories = wordCategoryIds.map((id) => {
  const category = categories.find((item) => item.id === id)!
  return { ...category, name: id === 'dem' ? 'Demjimêr' : category.name }
})

export const kurdishAlphabet = ['A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'I', 'Î', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T', 'U', 'Û', 'V', 'W', 'X', 'Y', 'Z'] as const

export const getLetterPrice = (letter: (typeof kurdishAlphabet)[number]) => {
  const index = kurdishAlphabet.indexOf(letter)
  return index === 0 ? 0 : 15 + index * 5
}

export const letterExamples: Record<(typeof kurdishAlphabet)[number], string[]> = {
  A: ['Av', 'Agir', 'Aso', 'Ajal', 'Armanc', 'Amed'],
  B: ['Bav', 'Baran', 'Berf', 'Bihar', 'Bizin', 'Birayê'],
  C: ['Cih', 'Ceger', 'Civat', 'Can', 'Cîran', 'Cûre'],
  Ç: ['Çav', 'Çiya', 'Çem', 'Çar', 'Çilek', 'Çivîk'],
  D: ['Dar', 'Derya', 'Dest', 'Dil', 'Derman', 'Dîwar'],
  E: ['Ev', 'Ewr', 'Ezman', 'Em', 'Enî', 'Erzan'],
  Ê: ['Êvar', 'Êş', 'Êzing', 'Êriş', 'Êzdî', 'Êl'],
  F: ['Fîl', 'Firîn', 'Fêkî', 'Firax', 'Ferman', 'Fistan'],
  G: ['Gul', 'Guh', 'Giran', 'Germ', 'Gund', 'Guhdar'],
  H: ['Hêvî', 'Hesp', 'Heval', 'Hinar', 'Hêlîn', 'Hewa'],
  I: ['Iraq', 'Isot', 'Ingîlîzî', 'Jin', 'Dil', 'Birinc'],
  Î: ['Îro', 'Îşev', 'Îlon', 'Îcar', 'Îsal', 'Îstasyon'],
  J: ['Jin', 'Jiyan', 'Ji', 'Jor', 'Jêr', 'Jîr'],
  K: ['Kitêb', 'Kûçik', 'Kurd', 'Keç', 'Kulîlk', 'Kanî'],
  L: ['Lîstik', 'Lawik', 'Ling', 'Lêv', 'Limon', 'Lorî'],
  M: ['Mal', 'Mezin', 'Mirîşk', 'Mêş', 'Mûz', 'Mamoste'],
  N: ['Nan', 'Nav', 'Nû', 'Nîvro', 'Nexweş', 'Nîşan'],
  O: ['Otomobîl', 'Ordek', 'Ode', 'Oqyanûs', 'Otel', 'Oxir'],
  P: ['Pisîk', 'Pênc', 'Pirtûk', 'Pel', 'Pencere', 'Piling'],
  Q: ['Qelem', 'Qapî', 'Qehwe', 'Qeşmer', 'Quling', 'Qutî'],
  R: ['Roj', 'Rê', 'Reş', 'Ronahî', 'Rûbar', 'Ristem'],
  S: ['Sêv', 'Spî', 'Stêrk', 'Ser', 'Sînor', 'Sond'],
  Ş: ['Şev', 'Şêr', 'Şeş', 'Şîr', 'Şemal', 'Şûşe'],
  T: ['Tav', 'Tişt', 'Tu', 'Tîr', 'Tov', 'Tendurist'],
  U: ['Ukrayna', 'Urfa', 'Umman', 'Usta', 'Universîte', 'Gul'],
  Û: ['Û', 'Kûçik', 'Mûz', 'Rû', 'Dûr', 'Bûk'],
  V: ['Vîn', 'Vala', 'Vejîn', 'Veger', 'Vêcar', 'Vir'],
  W: ['Welat', 'Wêne', 'Werzîş', 'War', 'Winda', 'Wek'],
  X: ['Xwarin', 'Xewn', 'Xwe', 'Xanî', 'Xwişk', 'Xezal'],
  Y: ['Yek', 'Yar', 'Yazdeh', 'Yarmetî', 'Yekşem', 'Yanzdeh'],
  Z: ['Ziman', 'Zer', 'Zozan', 'Zivistan', 'Zarok', 'Zevî'],
}

export const numberWords = ['sifir', 'yek', 'du', 'sê', 'çar', 'pênc', 'şeş', 'heft', 'heyşt', 'neh'] as const

export const getNumberPrice = (number: number) => 20 + number * 10

export const weekDays: CalendarEntry[] = [
  { id: 'yeksem', name: 'Yekşem', emoji: '☀️', price: 30 },
  { id: 'dusem', name: 'Duşem', emoji: '🌙', price: 45 },
  { id: 'sesem', name: 'Sêşem', emoji: '🔥', price: 60 },
  { id: 'carsem', name: 'Çarşem', emoji: '💧', price: 75 },
  { id: 'pencsem', name: 'Pêncşem', emoji: '🌿', price: 90 },
  { id: 'in', name: 'În', emoji: '⭐', price: 105 },
  { id: 'semi', name: 'Şemî', emoji: '🌈', price: 120 },
]

export const months: CalendarEntry[] = [
  { id: 'rebendan', name: 'Rêbendan', emoji: '❄️', price: 30 },
  { id: 'sibat', name: 'Sibat', emoji: '🌧️', price: 40 },
  { id: 'adar', name: 'Adar', emoji: '🌱', price: 50 },
  { id: 'nisan', name: 'Nîsan', emoji: '🌷', price: 60 },
  { id: 'gulan', name: 'Gulan', emoji: '🌼', price: 70 },
  { id: 'heziran', name: 'Hezîran', emoji: '☀️', price: 80 },
  { id: 'tirmeh', name: 'Tîrmeh', emoji: '🍉', price: 90 },
  { id: 'tebax', name: 'Tebax', emoji: '🌾', price: 100 },
  { id: 'ilon', name: 'Îlon', emoji: '🍇', price: 110 },
  { id: 'cotmeh', name: 'Cotmeh', emoji: '🍂', price: 120 },
  { id: 'mijdar', name: 'Mijdar', emoji: '🌰', price: 130 },
  { id: 'berfanbar', name: 'Berfanbar', emoji: '⛄', price: 140 },
]

export const mathOperations = [
  { id: 'komkirin' as const, name: 'Komkirin', emoji: '➕', description: 'Hejmaran li hev zêde bike', price: 75 },
  { id: 'kemkirin' as const, name: 'Kêmkirin', emoji: '➖', description: 'Ji hejmarê kêm bike', price: 100 },
  { id: 'zedekirin' as const, name: 'Zêdekirin', emoji: '✖️', description: 'Hejmaran çend caran zêde bike', price: 125 },
  { id: 'parvekirin' as const, name: 'Parvekirin', emoji: '➗', description: 'Hejmarê bi beşan parve bike', price: 150 },
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

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function countLetter(word: string, letter: string) {
  return [...word.toUpperCase()].filter((character) => character === letter).length
}

function hideLetter(word: string, letter: string) {
  const characters = [...word]
  const index = characters.findIndex((character) => character.toUpperCase() === letter)
  if (index >= 0) characters[index] = '_'
  return characters.join('')
}

const sentenceBank = [
  { clue: 'Sibeh', sentence: 'Ez her sibeh av vedixwim.' },
  { clue: 'Îro', sentence: 'Tu îro li malê dimînî.' },
  { clue: 'Dibistan', sentence: 'Ew li dibistanê Kurmancî hîn dibe.' },
  { clue: 'Hevaltî', sentence: 'Em êvaran bi hev re diaxivin.' },
  { clue: 'Xwendin', sentence: 'Hûn her roj pirtûkan dixwînin.' },
  { clue: 'Lîstik', sentence: 'Zarok di baxçe de dilîzin.' },
  { clue: 'Xwarin', sentence: 'Dayika min nanê germ dipêje.' },
  { clue: 'Kar', sentence: 'Bavê min li bajêr dixebite.' },
  { clue: 'Stran', sentence: 'Xwişka min stranek xweş dibêje.' },
  { clue: 'Top', sentence: 'Birayê min bi topê dilîze.' },
  { clue: 'Park', sentence: 'Zarok bi kêfxweşî li parkê direvin.' },
  { clue: 'Mamoste', sentence: 'Mamoste pirsek nû ji me dipirse.' },
  { clue: 'Xwendekar', sentence: 'Xwendekar bersivê li ser kaxezê dinivîse.' },
  { clue: 'Pisîk', sentence: 'Pisîk li ser kursiyê rûniştiye.' },
  { clue: 'Kûçik', sentence: 'Kûçik li ber derî radizê.' },
  { clue: 'Roj', sentence: 'Roj sibehê ji rojhilatê derdikeve.' },
  { clue: 'Baran', sentence: 'Baran ji ewrên reş dibare.' },
  { clue: 'Zivistan', sentence: 'Di zivistanê de berf pir dibare.' },
  { clue: 'Bihar', sentence: 'Di biharê de gul vedibin.' },
  { clue: 'Sûk', sentence: 'Em roja înê diçin sûkê.' },
  { clue: 'Mêvan', sentence: 'Mêvan îşev tên mala me.' },
  { clue: 'Çay', sentence: 'Kalê min çaya germ vedixwe.' },
  { clue: 'Çîrok', sentence: 'Pîrika min çîrokek dirêj dibêje.' },
  { clue: 'Muzîk', sentence: 'Ez bi kêf muzîka kurdî guhdarî dikim.' },
  { clue: 'Rêwîtî', sentence: 'Em sibê bi otobêsê diçin Amedê.' },
  { clue: 'Dikan', sentence: 'Tu ji dikanê sêvan dikirî.' },
  { clue: 'Av', sentence: 'Ew avê ji kanîyê tîne.' },
  { clue: 'Mal', sentence: 'Mala me li nêzî dibistanê ye.' },
  { clue: 'Ode', sentence: 'Di odeyê de pencereyek mezin heye.' },
  { clue: 'Pirtûk', sentence: 'Pirtûka sor li ser maseyê ye.' },
  { clue: 'Heval', sentence: 'Hevalê min îro pir kêfxweş e.' },
  { clue: 'Malbat', sentence: 'Malbata me şevê bi hev re dixwe.' },
  { clue: 'Ziman', sentence: 'Ez dixwazim Kurmancî baş biaxivim.' },
  { clue: 'Alîkarî', sentence: 'Em ji hevalên xwe re alîkarî dikin.' },
  { clue: 'Pirs', sentence: 'Tu dikarî vê pirsê bersiv bidî.' },
  { clue: 'Derî', sentence: 'Ji kerema xwe derî bigire.' },
  { clue: 'Ronahî', sentence: 'Ji kerema xwe ronahiyê veke.' },
  { clue: 'Dem', sentence: 'Saet niha heft û nîv e.' },
  { clue: 'Hefte', sentence: 'Îro roja sêşemê ye.' },
  { clue: 'Hewa', sentence: 'Îro hewa germ û zelal e.' },
  { clue: 'Çiya', sentence: 'Çiyayên Kurdistanê bilind û bedew in.' },
  { clue: 'Çem', sentence: 'Çem di nav gund re derbas dibe.' },
  { clue: 'Dar', sentence: 'Çivîk li ser dara kesk e.' },
  { clue: 'Baxçe', sentence: 'Di baxçeyê me de gelek gul hene.' },
  { clue: 'Reng', sentence: 'Rengê ez herî zêde hez dikim kesk e.' },
  { clue: 'Werzîş', sentence: 'Ew her sibeh werzîş dike.' },
  { clue: 'Futbol', sentence: 'Tîma me roja şemiyê futbol dilîze.' },
  { clue: 'Bazdan', sentence: 'Ez dikarim pir bilez bibezim.' },
  { clue: 'Xewn', sentence: 'Zarok dixwaze bibe mamoste.' },
  { clue: 'Şevbaş', sentence: 'Em berî razanê dibêjin şev baş.' },
]

export function buildSentenceRound(): LearningTask[] {
  return shuffle(sentenceBank).slice(0, 10).map((entry, index) => {
    const words = entry.sentence.split(' ')
    const shuffledWords = shuffle(words)
    if (shuffledWords.every((word, wordIndex) => word === words[wordIndex])) {
      shuffledWords.push(shuffledWords.shift()!)
    }
    return {
      id: `hevok-${Date.now()}-${index}`,
      kind: 'sentence',
      area: 'hevok',
      title: 'Hevokê ava bike',
      prompt: 'Peyvan bitikîne û bi rêza rast rêz bike.',
      display: entry.clue,
      answer: entry.sentence,
      options: shuffledWords,
    }
  })
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

export function buildLetterTaskPool(letter: (typeof kurdishAlphabet)[number]): LearningTask[] {
  const examples = letterExamples[letter]
  const otherLetters = kurdishAlphabet.filter((item) => item !== letter)
  const lowercase = letter.toLowerCase()
  const otherLowercase = otherLetters.map((item) => item.toLowerCase())
  const allWords = unique(Object.values(letterExamples).flat())
  const wordsWithoutLetter = allWords.filter((word) => !word.toUpperCase().includes(letter))
  const startingWords = examples.filter((word) => word.toUpperCase().startsWith(letter))
  const word = randomItem(examples)
  const secondWord = randomItem(examples.filter((item) => item !== word))
  const startingWord = randomItem(startingWords.length > 0 ? startingWords : examples)
  const spellingWord = randomItem(examples.filter((item) => item.length > 2))
  const absentWord = randomItem(wordsWithoutLetter)
  const wordPair = `${word} · ${secondWord}`
  const repeatedWord = `${word} · ${word}`
  const repeatedCount = String(countLetter(word, letter) * 2)
  const alphabetIndex = kurdishAlphabet.indexOf(letter)
  const sequence = alphabetIndex === 0
    ? `_ · ${kurdishAlphabet[1]} · ${kurdishAlphabet[2]}`
    : alphabetIndex === kurdishAlphabet.length - 1
      ? `${kurdishAlphabet[alphabetIndex - 2]} · ${kurdishAlphabet[alphabetIndex - 1]} · _`
      : `${kurdishAlphabet[alphabetIndex - 1]} · _ · ${kurdishAlphabet[alphabetIndex + 1]}`
  const vowel = randomItem(['a', 'e', 'ê', 'i', 'î', 'o', 'u', 'û'])
  const syllable = `${letter}${vowel}`
  const pair = `${letter} ${lowercase}`
  const pairDistractors = otherLetters.map((item) => `${item} ${item.toLowerCase()}`)
  const wrongPairs = wordsWithoutLetter.slice(0, 8).map((item, index) => `${item} · ${wordsWithoutLetter[index + 8] ?? absentWord}`)
  const tasks: LearningTask[] = [
    {
      id: `tip-${letter}-uppercase`, kind: 'choice', area: 'tip', title: 'Tîpa mezin nas bike',
      prompt: 'Tîpa mezin a rast hilbijêre.', display: letter, answer: letter, options: choiceOptions(letter, otherLetters),
    },
    {
      id: `tip-${letter}-lowercase`, kind: 'choice', area: 'tip', title: 'Tîpa biçûk nas bike',
      prompt: 'Tîpa biçûk a rast hilbijêre.', display: lowercase, answer: lowercase, options: choiceOptions(lowercase, otherLowercase),
    },
    {
      id: `tip-${letter}-upper-match`, kind: 'choice', area: 'tip', title: 'Hevalê mezin bibîne',
      prompt: `Kîjan tîpa mezin bi “${lowercase}” re hev e?`, display: lowercase, answer: letter, options: choiceOptions(letter, otherLetters),
    },
    {
      id: `tip-${letter}-lower-match`, kind: 'choice', area: 'tip', title: 'Hevalê biçûk bibîne',
      prompt: `Kîjan tîpa biçûk bi “${letter}” re hev e?`, display: letter, answer: lowercase, options: choiceOptions(lowercase, otherLowercase),
    },
    {
      id: `tip-${letter}-pair`, kind: 'choice', area: 'tip', title: 'Cotê tîpan hilbijêre',
      prompt: `Kîjan cot tîpa “${letter}” a mezin û biçûk nîşan dide?`, display: pair, answer: pair, options: choiceOptions(pair, pairDistractors),
    },
    {
      id: `tip-${letter}-first`, kind: 'choice', area: 'tip', title: 'Tîpa destpêkê bibîne',
      prompt: `Peyva “${startingWord}” bi kîjan tîpê dest pê dike?`, display: startingWord, answer: letter, options: choiceOptions(letter, otherLetters),
    },
    {
      id: `tip-${letter}-missing-first`, kind: 'choice', area: 'tip', title: 'Destpêkê temam bike',
      prompt: 'Tîpa kêm li destpêka peyvê hilbijêre.', display: `_${[...startingWord].slice(1).join('')}`, answer: letter, options: choiceOptions(letter, otherLetters),
    },
    {
      id: `tip-${letter}-missing-word`, kind: 'choice', area: 'tip', title: 'Peyvê temam bike',
      prompt: `Di peyva “${word}” de kîjan tîp kêm e?`, display: hideLetter(word, letter), answer: letter, options: choiceOptions(letter, otherLetters),
    },
    {
      id: `tip-${letter}-contains`, kind: 'choice', area: 'tip', title: 'Tîpê di peyvê de bibîne',
      prompt: `Kîjan peyv tîpa “${letter}” dihewîne?`, display: letter, answer: word, options: choiceOptions(word, wordsWithoutLetter),
    },
    {
      id: `tip-${letter}-absent`, kind: 'choice', area: 'tip', title: 'Peyva cuda bibîne',
      prompt: `Kîjan peyv tîpa “${letter}” nagire?`, display: letter, answer: absentWord, options: choiceOptions(absentWord, examples),
    },
    {
      id: `tip-${letter}-count`, kind: 'choice', area: 'tip', title: 'Tîpan bijmêre',
      prompt: `Di van peyvan de çend tîpên “${letter}” hene?`, display: repeatedWord, answer: repeatedCount, options: choiceOptions(repeatedCount, ['0', '1', '2', '3', '4', '5', '6']),
    },
    {
      id: `tip-${letter}-position`, kind: 'choice', area: 'tip', title: 'Cihê tîpê bibîne',
      prompt: `Tîpa “${letter}” li ku derê ye?`, display: startingWord, answer: 'Destpêk', options: shuffle(['Destpêk', 'Nav', 'Dawî']),
    },
    {
      id: `tip-${letter}-spell`, kind: 'spelling', area: 'tip', title: 'Peyvê ji tîpan çêbike',
      prompt: `Peyva “${spellingWord}” ji nû ve çêbike.`, display: spellingWord, answer: spellingWord, options: shuffle([...spellingWord]),
    },
    {
      id: `tip-${letter}-alphabet`, kind: 'choice', area: 'tip', title: 'Rêza alfabeyê temam bike',
      prompt: 'Tîpa kêm di rêza alfabeyê de hilbijêre.', display: sequence, answer: letter, options: choiceOptions(letter, otherLetters),
    },
    {
      id: `tip-${letter}-syllable`, kind: 'choice', area: 'tip', title: 'Kîteya rast bibîne',
      prompt: `Kîjan kîte bi tîpa “${letter}” dest pê dike?`, display: letter, answer: syllable, options: choiceOptions(syllable, otherLetters.map((item) => `${item}${vowel}`)),
    },
    {
      id: `tip-${letter}-pair-words`, kind: 'choice', area: 'tip', title: 'Du peyvan berhev bike',
      prompt: `Di kîjan cotê de her du peyv tîpa “${letter}” digirin?`, display: wordPair, answer: wordPair, options: choiceOptions(wordPair, wrongPairs),
    },
    {
      id: `tip-${letter}-word-letter`, kind: 'choice', area: 'tip', title: 'Tîpa nav peyvê hilbijêre',
      prompt: `Kîjan tîp di peyva “${word}” de heye?`, display: word, answer: letter, options: choiceOptions(letter, otherLetters.filter((item) => !word.toUpperCase().includes(item))),
    },
    {
      id: `tip-${letter}-same-start`, kind: 'choice', area: 'tip', title: 'Peyvên heman destpêkê',
      prompt: `Kîjan peyv bi tîpa “${letter}” dest pê dike?`, display: letter, answer: startingWord, options: choiceOptions(startingWord, wordsWithoutLetter),
    },
  ]

  return tasks
}

export function buildLetterRound(letter: (typeof kurdishAlphabet)[number]): LearningTask[] {
  return fillRound(buildLetterTaskPool(letter))
}

export function buildNumberTaskPool(number: number): LearningTask[] {
  const word = numberWords[number]
  const otherNumbers = numberWords.map((_, index) => String(index)).filter((item) => item !== String(number))
  const otherWords = numberWords.filter((item) => item !== word)
  const sequence = number === 0 ? `_ · 1 · 2` : number === 9 ? `7 · 8 · _` : `${number - 1} · _ · ${number + 1}`
  const reverseSequence = number === 0 ? `2 · 1 · _` : number === 9 ? `_ · 8 · 7` : `${number + 1} · _ · ${number - 1}`
  const previousPromptNumber = number + 1
  const nextPromptNumber = number === 0 ? 0 : number - 1
  const nextAnswer = number === 0 ? '1' : String(number)
  const dots = number === 0 ? '—' : Array.from({ length: number }, () => '●').join(' ')
  const parity = number % 2 === 0 ? 'Cot' : 'Take'
  const wordLength = String([...word].length)
  const addLeft = Math.floor(Math.random() * (number + 1))
  const addRight = number - addLeft
  const subtractRight = 1 + Math.floor(Math.random() * 5)
  const complement = String(10 - number)
  const matchingPair = `${number} — ${word}`
  const pairDistractors = numberWords.map((_, index) => `${index} — ${numberWords[(index + 1) % numberWords.length]}`)
  const comparisonNumber = Number(randomItem(otherNumbers))
  const ascendingPair = [number, comparisonNumber].sort((left, right) => left - right).join(' < ')
  const descendingPair = [number, comparisonNumber].sort((left, right) => right - left).join(' > ')
  const comparisonDistractors = unique([
    `${number} > ${comparisonNumber}`,
    `${number} < ${comparisonNumber}`,
    `${comparisonNumber} > ${number}`,
    `${comparisonNumber} < ${number}`,
    `${number} = ${comparisonNumber}`,
    `${comparisonNumber} = ${number}`,
  ])
  const mixedSequence = number === 0
    ? `_ · 2 · 4`
    : number === 9
      ? `7 · 8 · _`
      : `${number - 1} · _ · ${number + 1}`
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
    {
      id: `hejmar-${number}-reverse`, kind: 'choice', area: 'hejmar', title: 'Paşde bijmêre',
      prompt: 'Rêza paşde temam bike.', display: reverseSequence, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
    {
      id: `hejmar-${number}-before`, kind: 'choice', area: 'hejmar', title: 'Hejmarê berî wê bibîne',
      prompt: `Kîjan hejmar berî ${previousPromptNumber} tê?`, display: `… · _ · ${previousPromptNumber}`, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
    {
      id: `hejmar-${number}-after`, kind: 'choice', area: 'hejmar', title: 'Hejmarê piştî wê bibîne',
      prompt: `Kîjan hejmar piştî ${nextPromptNumber} tê?`, display: `${nextPromptNumber} · _ · …`, answer: nextAnswer, options: choiceOptions(nextAnswer, numberWords.map((_, index) => String(index))),
    },
    {
      id: `hejmar-${number}-count`, kind: 'choice', area: 'hejmar', title: 'Nîşanan bijmêre',
      prompt: 'Li vir çend xalên tijî hene?', display: dots, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
    {
      id: `hejmar-${number}-pair`, kind: 'choice', area: 'hejmar', title: 'Hejmar û navê wê',
      prompt: 'Kîjan cot rast e?', display: matchingPair, answer: matchingPair, options: choiceOptions(matchingPair, pairDistractors),
    },
    {
      id: `hejmar-${number}-parity`, kind: 'choice', area: 'hejmar', title: 'Cot an take?',
      prompt: `Hejmar ${number} cot e an take?`, display: String(number), answer: parity, options: shuffle(['Cot', 'Take']),
    },
    {
      id: `hejmar-${number}-letters`, kind: 'choice', area: 'hejmar', title: 'Tîpên navê hejmarê',
      prompt: `Di peyva “${word}” de çend tîp hene?`, display: word, answer: wordLength, options: choiceOptions(wordLength, ['1', '2', '3', '4', '5', '6', '7']),
    },
    {
      id: `hejmar-${number}-spell`, kind: 'spelling', area: 'hejmar', title: 'Navê hejmarê çêbike',
      prompt: `Navê hejmar ${number} ji tîpan çêbike.`, display: String(number), answer: word, options: shuffle([...word]),
    },
    {
      id: `hejmar-${number}-addition`, kind: 'choice', area: 'hejmar', title: 'Komkirina biçûk',
      prompt: 'Encama vê komkirinê çi ye?', display: `${addLeft} + ${addRight}`, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
    {
      id: `hejmar-${number}-subtraction`, kind: 'choice', area: 'hejmar', title: 'Kêmkirina biçûk',
      prompt: 'Encama vê kêmkirinê çi ye?', display: `${number + subtractRight} − ${subtractRight}`, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
    {
      id: `hejmar-${number}-complement`, kind: 'choice', area: 'hejmar', title: 'Bigihîje dehê',
      prompt: `Ji ${number} heta 10 çend kêm e?`, display: `${number} + _ = 10`, answer: complement, options: choiceOptions(complement, numberWords.map((_, index) => String(index))),
    },
    {
      id: `hejmar-${number}-ascending`, kind: 'choice', area: 'hejmar', title: 'Ji biçûk ber bi mezin',
      prompt: 'Kîjan rêz ji biçûk ber bi mezin rast e?', display: `${number} · ${comparisonNumber}`, answer: ascendingPair, options: choiceOptions(ascendingPair, comparisonDistractors),
    },
    {
      id: `hejmar-${number}-descending`, kind: 'choice', area: 'hejmar', title: 'Ji mezin ber bi biçûk',
      prompt: 'Kîjan rêz ji mezin ber bi biçûk rast e?', display: `${number} · ${comparisonNumber}`, answer: descendingPair, options: choiceOptions(descendingPair, comparisonDistractors),
    },
    {
      id: `hejmar-${number}-word-choice`, kind: 'choice', area: 'hejmar', title: 'Peyva rast ji navê derxe',
      prompt: `Kîjan peyv navê hejmar ${number} e?`, display: `${word} · ${randomItem(otherWords)} · ${randomItem(otherWords)}`, answer: word, options: choiceOptions(word, [...otherWords]),
    },
    {
      id: `hejmar-${number}-mixed-sequence`, kind: 'choice', area: 'hejmar', title: 'Cihê vala dagire',
      prompt: 'Hejmarê rast ji bo cihê vala hilbijêre.', display: mixedSequence, answer: String(number), options: choiceOptions(String(number), otherNumbers),
    },
  ]
  return tasks
}

function calendarNumberOptions(answer: number, maximum: number) {
  const candidates = Array.from({ length: Math.max(maximum, answer + 3) }, (_, index) => String(index + 1))
  return choiceOptions(String(answer), candidates)
}

function buildCalendarTaskPool(
  entries: CalendarEntry[],
  entryId: string,
  area: 'rojen-hefteye' | 'meh',
  singular: string,
  plural: string,
  outsideWords: string[],
): LearningTask[] {
  const index = entries.findIndex((entry) => entry.id === entryId)
  if (index < 0) return []

  const entry = entries[index]
  const previous = entries[(index - 1 + entries.length) % entries.length]
  const next = entries[(index + 1) % entries.length]
  const position = index + 1
  const positionFromEnd = entries.length - index
  const names = entries.map((item) => item.name)
  const firstLetter = [...entry.name][0]
  const otherFirstLetters = unique(entries.map((item) => [...item.name][0]).filter((letter) => letter !== firstLetter))
  const letterCount = [...entry.name].length
  const vowelCount = [...entry.name.toLowerCase()].filter((letter) => 'aeêiîouû'.includes(letter)).length
  const pair = `${position} — ${entry.name}`
  const pairDistractors = entries.map((_, itemIndex) => `${itemIndex + 1} — ${entries[(itemIndex + 1) % entries.length].name}`)

  return [
    {
      id: `${area}-${entry.id}-nav`, kind: 'choice', area, title: `Navê ${singular}`,
      prompt: `Navê ${singular} rast hilbijêre.`, display: `${entry.emoji} ${singular} ${position}`, answer: entry.name, options: choiceOptions(entry.name, names),
    },
    {
      id: `${area}-${entry.id}-cih`, kind: 'choice', area, title: `Cihê ${singular}`,
      prompt: `${entry.name} ${singular} çendemîn e?`, display: entry.name, answer: String(position), options: calendarNumberOptions(position, entries.length),
    },
    {
      id: `${area}-${entry.id}-beri`, kind: 'choice', area, title: `${singular} berî wê`,
      prompt: `Kîjan ${singular} berî ${entry.name} tê?`, display: entry.name, answer: previous.name, options: choiceOptions(previous.name, names),
    },
    {
      id: `${area}-${entry.id}-pisti`, kind: 'choice', area, title: `${singular} piştî wê`,
      prompt: `Kîjan ${singular} piştî ${entry.name} tê?`, display: entry.name, answer: next.name, options: choiceOptions(next.name, names),
    },
    {
      id: `${area}-${entry.id}-navbera`, kind: 'choice', area, title: 'Navbera du navan',
      prompt: `Kîjan ${singular} di navbera ${previous.name} û ${next.name} de ye?`, display: `${previous.name} · ? · ${next.name}`, answer: entry.name, options: choiceOptions(entry.name, names),
    },
    {
      id: `${area}-${entry.id}-reza`, kind: 'choice', area, title: 'Rêzê temam bike',
      prompt: `Navê kêm di rêza ${plural} de hilbijêre.`, display: `${previous.name} · _ · ${next.name}`, answer: entry.name, options: choiceOptions(entry.name, names),
    },
    {
      id: `${area}-${entry.id}-cot`, kind: 'choice', area, title: 'Cotê rast bibîne',
      prompt: `Kîjan cot cih û navê ${singular} rast nîşan dide?`, display: entry.emoji, answer: pair, options: choiceOptions(pair, pairDistractors),
    },
    {
      id: `${area}-${entry.id}-destpek`, kind: 'choice', area, title: 'Tîpa destpêkê',
      prompt: `${entry.name} bi kîjan tîpê dest pê dike?`, display: entry.name, answer: firstLetter, options: choiceOptions(firstLetter, otherFirstLetters),
    },
    {
      id: `${area}-${entry.id}-tip`, kind: 'choice', area, title: 'Tîpan bijmêre',
      prompt: `Di navê ${entry.name} de çend tîp hene?`, display: entry.name, answer: String(letterCount), options: calendarNumberOptions(letterCount, 12),
    },
    {
      id: `${area}-${entry.id}-nivisandin`, kind: 'spelling', area, title: 'Navê ji tîpan çêbike',
      prompt: `Navê ${entry.name} ji nû ve çêbike.`, display: entry.emoji, answer: entry.name, options: shuffle([...entry.name]),
    },
    {
      id: `${area}-${entry.id}-beri-pisti`, kind: 'choice', area, title: 'Berî navê din',
      prompt: `Kîjan ${singular} berî ${next.name} tê?`, display: next.name, answer: entry.name, options: choiceOptions(entry.name, names),
    },
    {
      id: `${area}-${entry.id}-pisti-beri`, kind: 'choice', area, title: 'Piştî navê din',
      prompt: `Kîjan ${singular} piştî ${previous.name} tê?`, display: previous.name, answer: entry.name, options: choiceOptions(entry.name, names),
    },
    {
      id: `${area}-${entry.id}-dawi`, kind: 'choice', area, title: 'Ji dawiyê bijmêre',
      prompt: `${entry.name} ji dawiya rêzê ${singular} çendemîn e?`, display: entry.name, answer: String(positionFromEnd), options: calendarNumberOptions(positionFromEnd, entries.length),
    },
    {
      id: `${area}-${entry.id}-kom`, kind: 'choice', area, title: 'Navê rast ji komê',
      prompt: `Kîjan nav yek ji ${plural} ye?`, display: entry.emoji, answer: entry.name, options: choiceOptions(entry.name, outsideWords),
    },
    {
      id: `${area}-${entry.id}-dengdêr`, kind: 'choice', area, title: 'Dengdêran bijmêre',
      prompt: `Di navê ${entry.name} de çend dengdêr hene?`, display: entry.name, answer: String(vowelCount), options: calendarNumberOptions(vowelCount, 8),
    },
  ]
}

export function buildWeekDayTaskPool(dayId: string): LearningTask[] {
  return buildCalendarTaskPool(weekDays, dayId, 'rojen-hefteye', 'roj', 'rojên hefteyê', months.map((month) => month.name))
}

export function buildWeekDayRound(dayId: string): LearningTask[] {
  return fillRound(buildWeekDayTaskPool(dayId))
}

export function buildMonthTaskPool(monthId: string): LearningTask[] {
  return buildCalendarTaskPool(months, monthId, 'meh', 'meh', 'mehan', weekDays.map((day) => day.name))
}

export function buildMonthRound(monthId: string): LearningTask[] {
  return fillRound(buildMonthTaskPool(monthId))
}

export function buildNumberRound(number: number): LearningTask[] {
  return fillRound(buildNumberTaskPool(number))
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
