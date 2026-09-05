export type CategoryId =
  | 'xwarin'
  | 'ajalan'
  | 'wesayit'
  | 'tist'
  | 'xweza'
  | 'werzis'
  | 'pise'
  | 'welat'
  | 'cih'
  | 'hemu'

export type QuizCategory = {
  id: CategoryId
  name: string
  eyebrow: string
  emoji: string
  price: number
  color: string
}

export type QuizQuestion = {
  id: string
  word: string
  meaningDe: string
  category: Exclude<CategoryId, 'hemu'>
  emoji: string
  image?: string
  correctAnswer: string
}

export const categories: QuizCategory[] = [
  { id: 'xwarin', name: 'Xwarin', eyebrow: 'Tam û xweşî', emoji: '🍎', price: 0, color: 'coral' },
  { id: 'ajalan', name: 'Ajalan', eyebrow: 'Hevalên me', emoji: '🐕', price: 0, color: 'mint' },
  { id: 'wesayit', name: 'Wesayît', eyebrow: 'Li ser rê', emoji: '🚗', price: 100, color: 'blue' },
  { id: 'tist', name: 'Tişt', eyebrow: 'Dora me', emoji: '📦', price: 150, color: 'amber' },
  { id: 'xweza', name: 'Xweza', eyebrow: 'Cîhana kesk', emoji: '🌳', price: 200, color: 'green' },
  { id: 'werzis', name: 'Werzîş', eyebrow: 'Bizivîne!', emoji: '⚽', price: 250, color: 'lime' },
  { id: 'pise', name: 'Pîşe', eyebrow: 'Kar û huner', emoji: '🩺', price: 300, color: 'rose' },
  { id: 'welat', name: 'Welat', eyebrow: 'Li ser dinyayê', emoji: '🌍', price: 400, color: 'sky' },
  { id: 'cih', name: 'Cih', eyebrow: 'Em li ku ne?', emoji: '📍', price: 500, color: 'orange' },
  { id: 'hemu', name: 'Hemû', eyebrow: 'Tevlihev', emoji: '🎲', price: 600, color: 'violet' },
]

export const questions: QuizQuestion[] = [
  { id: 'xw-01', word: 'Sêv', meaningDe: 'Apfel', category: 'xwarin', emoji: '🍎', image: '/quiz/apple.svg', correctAnswer: 'Sêv' },
  { id: 'xw-02', word: 'Nan', meaningDe: 'Brot', category: 'xwarin', emoji: '🍞', image: '/quiz/bread.svg', correctAnswer: 'Nan' },
  { id: 'xw-03', word: 'Şîr', meaningDe: 'Milch', category: 'xwarin', emoji: '🥛', correctAnswer: 'Şîr' },
  { id: 'xw-04', word: 'Goşt', meaningDe: 'Fleisch', category: 'xwarin', emoji: '🥩', correctAnswer: 'Goşt' },
  { id: 'xw-05', word: 'Pendir', meaningDe: 'Käse', category: 'xwarin', emoji: '🧀', correctAnswer: 'Pendir' },
  { id: 'xw-06', word: 'Hêk', meaningDe: 'Ei', category: 'xwarin', emoji: '🥚', correctAnswer: 'Hêk' },
  { id: 'aj-01', word: 'Kûçik', meaningDe: 'Hund', category: 'ajalan', emoji: '🐕', image: '/quiz/dog.svg', correctAnswer: 'Kûçik' },
  { id: 'aj-02', word: 'Pisîk', meaningDe: 'Katze', category: 'ajalan', emoji: '🐈', image: '/quiz/cat.svg', correctAnswer: 'Pisîk' },
  { id: 'aj-03', word: 'Hesp', meaningDe: 'Pferd', category: 'ajalan', emoji: '🐎', correctAnswer: 'Hesp' },
  { id: 'aj-04', word: 'Çivîk', meaningDe: 'Vogel', category: 'ajalan', emoji: '🐦', correctAnswer: 'Çivîk' },
  { id: 'aj-05', word: 'Masî', meaningDe: 'Fisch', category: 'ajalan', emoji: '🐟', correctAnswer: 'Masî' },
  { id: 'aj-06', word: 'Şêr', meaningDe: 'Löwe', category: 'ajalan', emoji: '🦁', correctAnswer: 'Şêr' },
  { id: 'we-01', word: 'Erebe', meaningDe: 'Auto', category: 'wesayit', emoji: '🚗', correctAnswer: 'Erebe' },
  { id: 'we-02', word: 'Bisîklet', meaningDe: 'Fahrrad', category: 'wesayit', emoji: '🚲', correctAnswer: 'Bisîklet' },
  { id: 'we-03', word: 'Otobês', meaningDe: 'Bus', category: 'wesayit', emoji: '🚌', correctAnswer: 'Otobês' },
  { id: 'we-04', word: 'Trên', meaningDe: 'Zug', category: 'wesayit', emoji: '🚆', correctAnswer: 'Trên' },
  { id: 'we-05', word: 'Balafir', meaningDe: 'Flugzeug', category: 'wesayit', emoji: '✈️', correctAnswer: 'Balafir' },
  { id: 'we-06', word: 'Keştî', meaningDe: 'Schiff', category: 'wesayit', emoji: '🚢', correctAnswer: 'Keştî' },
  { id: 'ti-01', word: 'Pirtûk', meaningDe: 'Buch', category: 'tist', emoji: '📕', image: '/quiz/book.svg', correctAnswer: 'Pirtûk' },
  { id: 'ti-02', word: 'Mase', meaningDe: 'Tisch', category: 'tist', emoji: '🪵', correctAnswer: 'Mase' },
  { id: 'ti-03', word: 'Kursî', meaningDe: 'Stuhl', category: 'tist', emoji: '🪑', correctAnswer: 'Kursî' },
  { id: 'ti-04', word: 'Mifte', meaningDe: 'Schlüssel', category: 'tist', emoji: '🔑', correctAnswer: 'Mifte' },
  { id: 'ti-05', word: 'Telefon', meaningDe: 'Telefon', category: 'tist', emoji: '📱', correctAnswer: 'Telefon' },
  { id: 'ti-06', word: 'Saet', meaningDe: 'Uhr', category: 'tist', emoji: '⌚', correctAnswer: 'Saet' },
  { id: 'xz-01', word: 'Dar', meaningDe: 'Baum', category: 'xweza', emoji: '🌳', correctAnswer: 'Dar' },
  { id: 'xz-02', word: 'Roj', meaningDe: 'Sonne', category: 'xweza', emoji: '☀️', image: '/quiz/sun.svg', correctAnswer: 'Roj' },
  { id: 'xz-03', word: 'Heyv', meaningDe: 'Mond', category: 'xweza', emoji: '🌙', image: '/quiz/moon.svg', correctAnswer: 'Heyv' },
  { id: 'xz-04', word: 'Çem', meaningDe: 'Fluss', category: 'xweza', emoji: '🏞️', correctAnswer: 'Çem' },
  { id: 'xz-05', word: 'Çiya', meaningDe: 'Berg', category: 'xweza', emoji: '⛰️', correctAnswer: 'Çiya' },
  { id: 'xz-06', word: 'Baran', meaningDe: 'Regen', category: 'xweza', emoji: '🌧️', correctAnswer: 'Baran' },
  { id: 'wr-01', word: 'Futbol', meaningDe: 'Fußball', category: 'werzis', emoji: '⚽', correctAnswer: 'Futbol' },
  { id: 'wr-02', word: 'Basketbol', meaningDe: 'Basketball', category: 'werzis', emoji: '🏀', correctAnswer: 'Basketbol' },
  { id: 'wr-03', word: 'Avjenî', meaningDe: 'Schwimmen', category: 'werzis', emoji: '🏊', correctAnswer: 'Avjenî' },
  { id: 'wr-04', word: 'Bazdan', meaningDe: 'Laufen', category: 'werzis', emoji: '🏃', correctAnswer: 'Bazdan' },
  { id: 'wr-05', word: 'Tenîs', meaningDe: 'Tennis', category: 'werzis', emoji: '🎾', correctAnswer: 'Tenîs' },
  { id: 'wr-06', word: 'Boks', meaningDe: 'Boxen', category: 'werzis', emoji: '🥊', correctAnswer: 'Boks' },
  { id: 'pi-01', word: 'Bijîşk', meaningDe: 'Arzt', category: 'pise', emoji: '🧑‍⚕️', correctAnswer: 'Bijîşk' },
  { id: 'pi-02', word: 'Mamoste', meaningDe: 'Lehrer', category: 'pise', emoji: '🧑‍🏫', correctAnswer: 'Mamoste' },
  { id: 'pi-03', word: 'Cotkar', meaningDe: 'Bauer', category: 'pise', emoji: '🧑‍🌾', correctAnswer: 'Cotkar' },
  { id: 'pi-04', word: 'Aşpêj', meaningDe: 'Koch', category: 'pise', emoji: '🧑‍🍳', correctAnswer: 'Aşpêj' },
  { id: 'pi-05', word: 'Polîs', meaningDe: 'Polizist', category: 'pise', emoji: '👮', correctAnswer: 'Polîs' },
  { id: 'pi-06', word: 'Avaker', meaningDe: 'Bauarbeiter', category: 'pise', emoji: '👷', correctAnswer: 'Avaker' },
  { id: 'wl-01', word: 'Kurdistan', meaningDe: 'Kurdistan', category: 'welat', emoji: '☀️', correctAnswer: 'Kurdistan' },
  { id: 'wl-02', word: 'Almanya', meaningDe: 'Deutschland', category: 'welat', emoji: '🇩🇪', correctAnswer: 'Almanya' },
  { id: 'wl-03', word: 'Fransa', meaningDe: 'Frankreich', category: 'welat', emoji: '🇫🇷', correctAnswer: 'Fransa' },
  { id: 'wl-04', word: 'Îtalya', meaningDe: 'Italien', category: 'welat', emoji: '🇮🇹', correctAnswer: 'Îtalya' },
  { id: 'wl-05', word: 'Swêd', meaningDe: 'Schweden', category: 'welat', emoji: '🇸🇪', correctAnswer: 'Swêd' },
  { id: 'wl-06', word: 'Kanada', meaningDe: 'Kanada', category: 'welat', emoji: '🇨🇦', correctAnswer: 'Kanada' },
  { id: 'ci-01', word: 'Mal', meaningDe: 'Haus', category: 'cih', emoji: '🏠', correctAnswer: 'Mal' },
  { id: 'ci-02', word: 'Dibistan', meaningDe: 'Schule', category: 'cih', emoji: '🏫', correctAnswer: 'Dibistan' },
  { id: 'ci-03', word: 'Nexweşxane', meaningDe: 'Krankenhaus', category: 'cih', emoji: '🏥', correctAnswer: 'Nexweşxane' },
  { id: 'ci-04', word: 'Bazar', meaningDe: 'Markt', category: 'cih', emoji: '🛍️', correctAnswer: 'Bazar' },
  { id: 'ci-05', word: 'Park', meaningDe: 'Park', category: 'cih', emoji: '🌲', correctAnswer: 'Park' },
  { id: 'ci-06', word: 'Pirtûkxane', meaningDe: 'Bibliothek', category: 'cih', emoji: '📚', correctAnswer: 'Pirtûkxane' },
]

export function getCategory(categoryId: CategoryId) {
  return categories.find((category) => category.id === categoryId) ?? categories[0]
}
