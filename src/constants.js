export const GAMES_KEY = 'wingspan_games_v1'
export const MID_GAME_KEY = 'wingspan_current_game_v1'

// Categories entered per round (end-of-round goal tile)
export const ROUND_CATEGORY = {
  key: 'endOfRound',
  label: 'End-of-Round Goal',
  description: 'Points scored on this round\'s goal tile',
}

// Categories entered once at game end
export const FINAL_CATEGORIES = [
  { key: 'birds',     label: 'Birds Played',  description: 'Sum of points on played bird cards' },
  { key: 'bonusCards',label: 'Bonus Cards',   description: 'Points from personal bonus card objectives' },
  { key: 'eggs',      label: 'Eggs',          description: '1 point per egg on cards at game end' },
  { key: 'food',      label: 'Food on Cards', description: '1 point per food token cached on cards' },
  { key: 'tucked',    label: 'Tucked Cards',  description: '1 point per card tucked under birds' },
]

// All images are public domain from the Biodiversity Heritage Library (BHL)
// Lilford's "Coloured Figures of the Birds of the British Islands" (1885–1897)
// via flickr.com/photos/biodivlibrary — single-bird watercolor portraits
export const BHL_IMAGES = [
  {
    url: 'https://live.staticflickr.com/8077/8290248423_30fd526bf9_b.jpg',
    credit: 'Coloured Figures of the Birds of the British Islands, Lilford (1885–1897) — Biodiversity Heritage Library',
    alt: 'Watercolor bird portrait from Lilford\'s Coloured Figures, 1885–1897',
  },
  {
    url: 'https://live.staticflickr.com/8353/8291308364_e270dd8c4b_b.jpg',
    credit: 'Coloured Figures of the Birds of the British Islands, Lilford (1885–1897) — Biodiversity Heritage Library',
    alt: 'Watercolor bird portrait from Lilford\'s Coloured Figures, 1885–1897',
  },
  {
    url: 'https://live.staticflickr.com/8081/8291317400_696a6e40e3_b.jpg',
    credit: 'Coloured Figures of the Birds of the British Islands, Lilford (1885–1897) — Biodiversity Heritage Library',
    alt: 'Watercolor bird portrait from Lilford\'s Coloured Figures, 1885–1897',
  },
  {
    url: 'https://live.staticflickr.com/8079/8290249459_33a092c2ac_b.jpg',
    credit: 'Coloured Figures of the Birds of the British Islands, Lilford (1885–1897) — Biodiversity Heritage Library',
    alt: 'Watercolor bird portrait from Lilford\'s Coloured Figures, 1885–1897',
  },
  {
    url: 'https://live.staticflickr.com/401/19678278933_b48f24888c_b.jpg',
    credit: 'Coloured Figures of the Birds of the British Islands, Lilford (1885–1897) — Biodiversity Heritage Library',
    alt: 'Watercolor bird portrait from Lilford\'s Coloured Figures, 1885–1897',
  },
]

export const PLAYER_COLORS = [
  '#f7e98e', // pastel yellow
  '#ffadbc', // pastel pink
  '#a8d8f0', // pastel blue
  '#ffc896', // pastel peach
  '#c8a8f0', // pastel lavender
]

export function getRoundsTotal(score) {
  if (!score?.rounds) return 0
  return score.rounds.reduce((sum, r) => sum + (parseInt(r.endOfRound) || 0), 0)
}

export function getFinalTotal(score) {
  if (!score) return 0
  return FINAL_CATEGORIES.reduce((sum, cat) => sum + (parseInt(score[cat.key]) || 0), 0)
}

export function getTotal(score) {
  return getRoundsTotal(score) + getFinalTotal(score)
}

export function makeEmptyScore() {
  return {
    rounds: [
      { endOfRound: 0 },
      { endOfRound: 0 },
      { endOfRound: 0 },
      { endOfRound: 0 },
    ],
    birds: 0,
    bonusCards: 0,
    eggs: 0,
    food: 0,
    tucked: 0,
  }
}
