export const CATEGORIES = [
  {
    key: 'birds',
    label: 'Birds Played',
    description: 'Sum of points on played bird cards',
  },
  {
    key: 'bonusCards',
    label: 'Bonus Cards',
    description: 'Points from personal bonus card objectives',
  },
  {
    key: 'endOfRound',
    label: 'End-of-Round Goals',
    description: 'Cumulative points from the 4 round-end goal tiles',
  },
  {
    key: 'eggs',
    label: 'Eggs',
    description: '1 point per egg on cards at game end',
  },
  {
    key: 'food',
    label: 'Food on Cards',
    description: '1 point per food token cached on cards',
  },
  {
    key: 'tucked',
    label: 'Tucked Cards',
    description: '1 point per card tucked under birds',
  },
]

// All images are public domain from the Biodiversity Heritage Library (BHL)
// via their Flickr account: flickr.com/photos/biodivlibrary
export const BHL_IMAGES = [
  {
    url: 'https://live.staticflickr.com/65535/51280846796_53a7f660b8_b.jpg',
    credit: 'Ornithologie (1760) — Biodiversity Heritage Library',
    alt: 'Historical bird illustration from Ornithologie by Brisson, 1760',
  },
  {
    url: 'https://live.staticflickr.com/65535/51281869040_3afd424223_b.jpg',
    credit: 'Ornithologie (1760) — Biodiversity Heritage Library',
    alt: 'Historical bird illustration from Ornithologie by Brisson, 1760',
  },
  {
    url: 'https://live.staticflickr.com/65535/51281576969_2a32026c1c_b.jpg',
    credit: 'Ornithologie (1760) — Biodiversity Heritage Library',
    alt: 'Historical bird illustration from Ornithologie by Brisson, 1760',
  },
  {
    url: 'https://live.staticflickr.com/5587/15290066602_bfca4b298c_b.jpg',
    credit: 'A Monograph of the Paradiseidae (1873) — Biodiversity Heritage Library',
    alt: 'Birds of paradise illustration from Elliot\'s Monograph, 1873',
  },
  {
    url: 'https://live.staticflickr.com/6049/6298081971_48dce45fc2_b.jpg',
    credit: 'Historical bird illustration — Biodiversity Heritage Library',
    alt: 'Historical bird illustration from the Biodiversity Heritage Library',
  },
]

export const PLAYER_COLORS = [
  '#f7e98e', // pastel yellow
  '#ffadbc', // pastel pink
  '#a8d8f0', // pastel blue
  '#ffc896', // pastel peach
  '#c8a8f0', // pastel lavender
]

export function getTotal(score) {
  if (!score) return 0
  return CATEGORIES.reduce((sum, cat) => sum + (parseInt(score[cat.key]) || 0), 0)
}

export function makeEmptyScore() {
  return CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.key]: 0 }), {})
}
