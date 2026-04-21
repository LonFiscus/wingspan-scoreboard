// All 6 categories appear on every round's scorecard.
// Birds, Bonus Cards, Eggs, Food, and Tucked are cumulative running totals
// (updated each round as the game progresses). End-of-Round Goal is a fresh
// score each round and all four values are summed at game end.
export const ROUND_CATEGORIES = [
  { key: 'birds',      label: 'Birds Played',      cumulative: true,  description: 'Running total of points on played bird cards' },
  { key: 'bonusCards', label: 'Bonus Cards',        cumulative: true,  description: 'Running total of bonus card points' },
  { key: 'endOfRound', label: 'End-of-Round Goal',  cumulative: false, description: 'Points scored on this round\'s goal tile only' },
  { key: 'eggs',       label: 'Eggs',               cumulative: true,  description: 'Running total — 1 pt per egg on cards' },
  { key: 'food',       label: 'Food on Cards',      cumulative: true,  description: 'Running total — 1 pt per food token cached' },
  { key: 'tucked',     label: 'Tucked Cards',       cumulative: true,  description: 'Running total — 1 pt per card tucked under a bird' },
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

function num(v) { return parseInt(v) || 0 }

// Running total after a given round index (0–3).
// Cumulative categories use that round's value; end-of-round goals are summed.
export function getRunningTotal(score, roundIndex) {
  if (!score?.rounds) return 0
  const r = score.rounds[roundIndex]
  if (!r) return 0
  const goalSum = score.rounds
    .slice(0, roundIndex + 1)
    .reduce((s, rnd) => s + num(rnd.endOfRound), 0)
  return num(r.birds) + num(r.bonusCards) + goalSum + num(r.eggs) + num(r.food) + num(r.tucked)
}

// Final score = running total after round 4 (index 3)
export function getTotal(score) {
  return getRunningTotal(score, 3)
}

export function makeEmptyScore() {
  const emptyRound = { birds: 0, bonusCards: 0, endOfRound: 0, eggs: 0, food: 0, tucked: 0 }
  return {
    rounds: [
      { ...emptyRound },
      { ...emptyRound },
      { ...emptyRound },
      { ...emptyRound },
    ],
  }
}
