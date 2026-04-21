import { CATEGORIES, BHL_IMAGES, PLAYER_COLORS, getTotal } from '../constants'

export default function ResultsScreen({ players, scores, onPlayAgain, onNewGame }) {
  const totals = players.map(p => ({ ...p, total: getTotal(scores[p.id]) }))
  const maxTotal = Math.max(...totals.map(p => p.total))
  const winners = totals.filter(p => p.total === maxTotal)
  const isWinner = id => winners.some(w => w.id === id)

  const hero = BHL_IMAGES[3]

  const winnerText = winners.length === 1
    ? `${winners[0].name} wins!`
    : `Tie \u2014 ${winners.map(w => w.name).join(' & ')}`

  return (
    <div className="screen">
      <div className="hero hero-tall" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="hero-overlay">
          <h1 className="app-title">Wingspan</h1>
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
                {CATEGORIES.map(cat => (
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
                    <span className="cat-label total-label">Total</span>
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
        </div>

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
