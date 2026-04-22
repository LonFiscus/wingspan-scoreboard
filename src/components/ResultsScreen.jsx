import { useState } from 'react'
import { FINAL_CATEGORIES, BHL_IMAGES, PLAYER_COLORS, getRoundsTotal, getTotal } from '../constants'

export default function ResultsScreen({ players, scores, onPlayAgain, onNewGame }) {
  const [copied, setCopied] = useState(false)
  const totals = players.map(p => ({ ...p, total: getTotal(scores[p.id]) }))
  const maxTotal = Math.max(...totals.map(p => p.total))
  const isWinner = id => totals.find(p => p.id === id)?.total === maxTotal

  const hero = BHL_IMAGES[3]

  const winners = totals.filter(p => p.total === maxTotal)
  const winnerText = winners.length === 1
    ? `${winners[0].name} wins!`
    : `Tie \u2014 ${winners.map(w => w.name).join(' & ')}`

  function buildCopyText() {
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const lines = [`Papa's Plantin' a Bird! \u2014 ${date}`, '', winnerText, '']
    totals.slice().sort((a, b) => b.total - a.total).forEach(p => {
      const s = scores[p.id]
      lines.push(`${p.name} \u2014 ${p.total} pts`)
      lines.push(`  Round Goals: ${getRoundsTotal(s)}`)
      FINAL_CATEGORIES.forEach(cat => {
        lines.push(`  ${cat.label}: ${s?.[cat.key] ?? 0}`)
      })
      lines.push('')
    })
    return lines.join('\n').trim()
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText())
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  return (
    <div className="screen">
      <div className="hero hero-tall" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="hero-overlay">
          <h1 className="app-title">Papa&rsquo;s Plantin&rsquo; a Bird!</h1>
          <p className="winner-announce">{winnerText}</p>
        </div>
      </div>

      <div className="screen-body">
        <h2 className="screen-heading">Final Scores</h2>

        <div className="table-wrap">
          <div className="table-scroll">
            <table className="score-table results-table">
              <thead>
                <tr>
                  <th className="cat-col">Category</th>
                  {players.map((p, i) => (
                    <th
                      key={p.id}
                      className={`player-col${isWinner(p.id) ? ' winner-col' : ''}`}
                      style={{ '--player-color': PLAYER_COLORS[i] }}
                    >
                      {p.name}
                      {isWinner(p.id) && <span className="winner-star"> &#9733;</span>}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Per-round goal rows */}
                {[0, 1, 2, 3].map(i => (
                  <tr key={`round-${i}`}>
                    <td className="cat-cell">
                      <span className="cat-label">Round {i + 1} Goal</span>
                    </td>
                    {players.map(p => (
                      <td
                        key={p.id}
                        className={`score-cell${isWinner(p.id) ? ' winner-cell' : ''}`}
                      >
                        {scores[p.id]?.rounds[i]?.endOfRound ?? 0}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Round goals subtotal */}
                <tr className="subtotal-row">
                  <td className="cat-cell">
                    <span className="cat-label">Round Goals Total</span>
                  </td>
                  {players.map(p => (
                    <td
                      key={p.id}
                      className={`score-cell subtotal-value${isWinner(p.id) ? ' winner-cell' : ''}`}
                    >
                      {getRoundsTotal(scores[p.id])}
                    </td>
                  ))}
                </tr>

                {/* Final scoring categories */}
                {FINAL_CATEGORIES.map(cat => (
                  <tr key={cat.key}>
                    <td className="cat-cell">
                      <span className="cat-label">{cat.label}</span>
                    </td>
                    {players.map(p => (
                      <td
                        key={p.id}
                        className={`score-cell${isWinner(p.id) ? ' winner-cell' : ''}`}
                      >
                        {scores[p.id]?.[cat.key] ?? 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="total-row">
                  <td className="cat-cell">
                    <span className="cat-label total-label">Grand Total</span>
                  </td>
                  {totals.map(p => (
                    <td
                      key={p.id}
                      className={`score-cell total-value${isWinner(p.id) ? ' winner-cell winner-total' : ''}`}
                    >
                      {p.total}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="results-actions">
          <button className="primary-btn" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="secondary-btn" onClick={onNewGame}>
            New Game
          </button>
          <button
            className={`secondary-btn${copied ? ' copy-btn-success' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
          <button className="secondary-btn print-hide" onClick={() => window.print()}>
            Print / PDF
          </button>
        </div>

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
