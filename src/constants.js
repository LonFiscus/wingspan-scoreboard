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
// Audubon's "The Birds of America" (1840–1844), via flickr.com/photos/biodivlibrary
export const BHL_IMAGES = [
  {
    url: 'https://live.staticflickr.com/8230/8589018703_4a7d46f8cd_b.jpg',
    credit: 'The Birds of America, Audubon (1840–1844) — Biodiversity Heritage Library',
    alt: 'Audubon bird illustration from The Birds of America, 1840–1844',
  },
  {
    url: 'https://live.staticflickr.com/8383/8595323676_c41b32d587_b.jpg',
    credit: 'The Birds of America, Audubon (1840–1844) — Biodiversity Heritage Library',
    alt: 'Audubon bird illustration from The Birds of America, 1840–1844',
  },
  {
    url: 'https://live.staticflickr.com/8380/8592728880_25b487f900_b.jpg',
    credit: 'The Birds of America, Audubon (1840–1844) — Biodiversity Heritage Library',
    alt: 'Audubon bird illustration from The Birds of America, 1840–1844',
  },
  {
    url: 'https://live.staticflickr.com/8100/8567751041_92163ac71b_b.jpg',
    credit: 'The Birds of America, Audubon (1840–1844) — Biodiversity Heritage Library',
    alt: 'Audubon bird illustration from The Birds of America, 1840–1844',
  },
  {
    url: 'https://live.staticflickr.com/8236/8590182472_f8d4c7a0ec_b.jpg',
    credit: 'The Birds of America, Audubon (1840–1844) — Biodiversity Heritage Library',
    alt: 'Audubon bird illustration from The Birds of America, 1840–1844',
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
