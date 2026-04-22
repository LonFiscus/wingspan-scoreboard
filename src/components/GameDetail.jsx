import { useState } from 'react'
import {
  FINAL_CATEGORIES,
  BHL_IMAGES,
  PLAYER_COLORS,
  getRoundsTotal,
  getTotal,
} from '../constants'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function GameDetail({ game, onBack, onDeleteGame }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!game) return null

  const totals = game.players.map(p => ({ ...p, total: getTotal(game.scores[p.id]) }))
  const maxTotal = Math.max(...totals.map(p => p.total))
  const isWinner = id => totals.find(p => p.id === id)?.total === maxTotal

  const winnerNames = game.players.filter(p => isWinner(p.id)).map(p => p.name)
  const winnerText = winnerNames.length === 1
    ? `${winnerNames[0]} wins!`
    : `Tie \u2014 ${winnerNames.join(' & ')}`

  const hero = BHL_IMAGES[1]

  return (
    <div className="screen">
      <div className="hero" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="hero-overlay">
          <h1 className="app-title">Papa&rsquo;s Plantin&rsquo; a Bird!</h1>
          <p className="app-subtitle">{formatDate(game.date)}</p>
        </div>
      </div>

      <div className="screen-body">
        <div className="detail-toolbar">
          <button className="secondary-btn small-btn" onClick={onBack}>
            &larr; History
          </button>
          {showDeleteConfirm ? (
            <div className="confirm-bar">
              <span>Delete this game?</span>
              <button className="danger-btn" onClick={() => onDeleteGame(game.id)}>
                Delete
              </button>
              <button className="secondary-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="danger-btn small-btn" onClick={() => setShowDeleteConfirm(true)}>
              Delete Game
            </button>
          )}
        </div>

        <p className="detail-winner">{winnerText}</p>

        <div className="table-wrap">
          <div className="table-scroll">
            <table className="score-table results-table">
              <thead>
                <tr>
                  <th className="cat-col">Category</th>
                  {game.players.map((p, i) => (
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
                {[0, 1, 2, 3].map(i => (
                  <tr key={`round-${i}`}>
                    <td className="cat-cell">
                      <span className="cat-label">Round {i + 1} Goal</span>
                    </td>
                    {game.players.map(p => (
                      <td
                        key={p.id}
                        className={`score-cell${isWinner(p.id) ? ' winner-cell' : ''}`}
                      >
                        {game.scores[p.id]?.rounds[i]?.endOfRound ?? 0}
                      </td>
                    ))}
                  </tr>
                ))}

                <tr className="subtotal-row">
                  <td className="cat-cell">
                    <span className="cat-label">Round Goals Total</span>
                  </td>
                  {game.players.map(p => (
                    <td
                      key={p.id}
                      className={`score-cell subtotal-value${isWinner(p.id) ? ' winner-cell' : ''}`}
                    >
                      {getRoundsTotal(game.scores[p.id])}
                    </td>
                  ))}
                </tr>

                {FINAL_CATEGORIES.map(cat => (
                  <tr key={cat.key}>
                    <td className="cat-cell">
                      <span className="cat-label">{cat.label}</span>
                    </td>
                    {game.players.map(p => (
                      <td
                        key={p.id}
                        className={`score-cell${isWinner(p.id) ? ' winner-cell' : ''}`}
                      >
                        {game.scores[p.id]?.[cat.key] ?? 0}
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

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
