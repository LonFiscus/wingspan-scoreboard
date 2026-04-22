import { useState } from 'react'
import { BHL_IMAGES, getTotal } from '../constants'

const FINAL_CATS = [
  { key: 'birds',      label: 'Birds' },
  { key: 'bonusCards', label: 'Bonus' },
  { key: 'eggs',       label: 'Eggs' },
  { key: 'food',       label: 'Food' },
  { key: 'tucked',     label: 'Tucked' },
]

function computeStats(history) {
  const map = {}
  for (const game of history) {
    for (const player of game.players) {
      const name = player.name
      if (!map[name]) map[name] = { name, games: 0, wins: 0, totalScore: 0, best: 0 }
      const score = getTotal(game.scores[player.id])
      map[name].games++
      map[name].totalScore += score
      map[name].best = Math.max(map[name].best, score)
      if (game.winners?.includes(player.id)) map[name].wins++
    }
  }
  return Object.values(map).map(s => ({
    ...s,
    winRate: s.games > 0 ? Math.round((s.wins / s.games) * 100) : 0,
    avgScore: s.games > 0 ? Math.round(s.totalScore / s.games) : 0,
  }))
}

const RANK_LABELS = ['1st', '2nd', '3rd']

export default function StatsScreen({ history }) {
  const [sortKey, setSortKey] = useState('wins')
  const [sortDir, setSortDir] = useState('desc')

  const hero = BHL_IMAGES[2]
  const stats = computeStats(history)

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...stats].sort((a, b) => {
    const mul = sortDir === 'desc' ? -1 : 1
    return typeof a[sortKey] === 'string'
      ? mul * a[sortKey].localeCompare(b[sortKey])
      : mul * (a[sortKey] - b[sortKey])
  })

  const leaderboard = [...stats]
    .sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
    .slice(0, 3)

  function ColHead({ colKey, label }) {
    const active = sortKey === colKey
    const arrow = active ? (sortDir === 'desc' ? ' \u25be' : ' \u25b4') : ''
    return (
      <th
        className={`stat-col${active ? ' sort-active' : ''}`}
        onClick={() => handleSort(colKey)}
      >
        {label}{arrow}
      </th>
    )
  }

  return (
    <div className="screen">
      <div className="hero" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="hero-overlay">
          <h1 className="app-title">Papa&rsquo;s Plantin&rsquo; a Bird!</h1>
          <p className="app-subtitle">Player Stats</p>
        </div>
      </div>

      <div className="screen-body">
        {stats.length === 0 ? (
          <p className="empty-state">No games recorded yet. Finish a game to see stats here!</p>
        ) : (
          <>
            <h2 className="screen-heading">Leaderboard</h2>
            <div className="leaderboard">
              {leaderboard.map((p, i) => (
                <div key={p.name} className={`leader-card leader-rank-${i + 1}`}>
                  <span className="leader-pos">{RANK_LABELS[i]}</span>
                  <span className="leader-name">{p.name}</span>
                  <span className="leader-wins">
                    {p.wins} {p.wins === 1 ? 'win' : 'wins'}
                    {p.winRate > 0 && <span className="leader-rate"> &middot; {p.winRate}%</span>}
                  </span>
                </div>
              ))}
            </div>

            <h2 className="screen-heading">All Players</h2>
            <p className="stats-hint">Tap a column header to sort.</p>
            <div className="table-wrap">
              <div className="table-scroll">
                <table className="score-table stats-table">
                  <thead>
                    <tr>
                      <ColHead colKey="name" label="Player" />
                      <ColHead colKey="games" label="Games" />
                      <ColHead colKey="wins" label="Wins" />
                      <ColHead colKey="winRate" label="Win %" />
                      <ColHead colKey="avgScore" label="Avg" />
                      <ColHead colKey="best" label="Best" />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(p => (
                      <tr key={p.name}>
                        <td className="cat-cell">
                          <span className="cat-label">{p.name}</span>
                        </td>
                        <td className="score-cell">{p.games}</td>
                        <td className="score-cell">{p.wins}</td>
                        <td className="score-cell">{p.winRate}%</td>
                        <td className="score-cell">{p.avgScore}</td>
                        <td className="score-cell">{p.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
