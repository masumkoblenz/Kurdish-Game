import type { CategoryId } from '@/data/questions'

export const PLAYER_STORAGE_KEY = 'kurdish-quiz-player-v1'

export type PlayerData = {
  id: string
  coins: number
  xp: number
  bestScore: number
  gamesPlayed: number
  correctAnswers: number
  wrongAnswers: number
  bestCombo: number
  unlockedCategories: CategoryId[]
  unlockedAreas: string[]
  unlockedLessons: string[]
  achievements: string[]
  savedWords: Record<string, { learned: boolean }>
}

export type Achievement = {
  id: string
  icon: string
  title: string
  description: string
  reward: number
  isUnlocked: (player: PlayerData, game?: GameSummary) => boolean
}

export type GameSummary = {
  score: number
  correct: number
  wrong: number
  bestCombo: number
  maxTimeAnswer: number
}

export const achievements: Achievement[] = [
  { id: 'first-game', icon: '🎯', title: 'Gera yekem', description: 'Lîstika xwe ya yekem biqedîne.', reward: 15, isUnlocked: (player) => player.gamesPlayed >= 1 },
  { id: 'combo-5', icon: '🔥', title: 'Rêza 5', description: 'Pênc bersivên rast li pey hev bide.', reward: 20, isUnlocked: (player, game) => Math.max(player.bestCombo, game?.bestCombo ?? 0) >= 5 },
  { id: 'score-100', icon: '💯', title: '100 xal', description: 'Di lîstikekê de 100 xal bistîne.', reward: 25, isUnlocked: (_player, game) => (game?.score ?? 0) >= 100 },
  { id: 'quiz-master', icon: '🏆', title: 'Mamosteyê Lîstikê', description: '10 lîstikan biqedîne.', reward: 50, isUnlocked: (player) => player.gamesPlayed >= 10 },
  { id: 'coin-collector', icon: '🪙', title: 'Berhevkarê zêr', description: '500 zêr berhev bike.', reward: 40, isUnlocked: (player) => player.coins >= 500 },
  { id: 'explorer', icon: '🧭', title: 'Gerok', description: '5 kategoriyan veke.', reward: 35, isUnlocked: (player) => player.unlockedCategories.length >= 5 },
  { id: 'perfect-game', icon: '✨', title: 'Bê şaşî', description: '10 bersivên rast bide.', reward: 45, isUnlocked: (_player, game) => (game?.correct ?? 0) === 10 },
  { id: 'fast-answer', icon: '⚡', title: 'Wek birûskê', description: 'Di 3 saniyeyan de bersiv bide.', reward: 15, isUnlocked: (_player, game) => (game?.maxTimeAnswer ?? 0) >= 12 },
  { id: 'veteran', icon: '🛡️', title: 'Lîstikvanê kevn', description: '25 lîstikan biqedîne.', reward: 75, isUnlocked: (player) => player.gamesPlayed >= 25 },
  { id: 'all-open', icon: '👑', title: 'Hemû vekirî', description: 'Hemû kategoriyan veke.', reward: 100, isUnlocked: (player) => player.unlockedCategories.length >= 11 },
]

function makePlayerId() {
  const bytes = new Uint8Array(5)
  crypto.getRandomValues(bytes)
  const token = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()
  return `KQ-${token}`
}

export function createPlayer(): PlayerData {
  return {
    id: makePlayerId(),
    coins: 40,
    xp: 0,
    bestScore: 0,
    gamesPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    bestCombo: 0,
    unlockedCategories: [],
    unlockedAreas: ['tip'],
    unlockedLessons: ['tip:A'],
    achievements: [],
    savedWords: {},
  }
}

export function loadPlayer(): PlayerData {
  const saved = localStorage.getItem(PLAYER_STORAGE_KEY)
  if (!saved) return createPlayer()
  try {
    const parsed = JSON.parse(saved) as Partial<PlayerData>
    const unlockedAreas = Array.from(new Set(['tip', ...(parsed.unlockedAreas ?? [])]))
    const unlockedLessons = Array.from(new Set(['tip:A', ...(parsed.unlockedLessons ?? [])]))
    return {
      ...createPlayer(),
      ...parsed,
      unlockedAreas,
      unlockedLessons,
      savedWords: parsed.savedWords ?? {},
    }
  } catch {
    return createPlayer()
  }
}

export function savePlayer(player: PlayerData) {
  localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player))
}

export function getLevel(xp: number) {
  return Math.floor(xp / 100) + 1
}

export function getNextLevelXp(xp: number) {
  return getLevel(xp) * 100
}

export function unlockAchievements(player: PlayerData, game?: GameSummary) {
  const newlyUnlocked = achievements.filter(
    (achievement) => !player.achievements.includes(achievement.id) && achievement.isUnlocked(player, game),
  )
  if (newlyUnlocked.length === 0) return { player, newlyUnlocked }
  const reward = newlyUnlocked.reduce((total, achievement) => total + achievement.reward, 0)
  return {
    player: {
      ...player,
      coins: player.coins + reward,
      achievements: [...player.achievements, ...newlyUnlocked.map((achievement) => achievement.id)],
    },
    newlyUnlocked,
  }
}
