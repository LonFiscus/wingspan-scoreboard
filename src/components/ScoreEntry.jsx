import { useState } from 'react'
import { CATEGORIES, BHL_IMAGES, PLAYER_COLORS, getTotal } from '../constants'

export default function ScoreEntry({ players, scores, onScoreChange, onEndGame, onNewGame }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const hero = BHL_IMAGES[1]

  function handleInput(playerId, catKey, value) {
    const num = value === '' ? 0 : Math.max(0, Math.floor(parseFloat(value)) || 0)
    onScoreChange(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [catKey]: num,
      },
    }))
  }

  function handleDiscard() {
    setShowConfirm(false)
    onNewGame()
  }

  return (
    <div className="screen">
      <div className="score-header" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="score-header-overlay">
          <h1 className="app-title">Wingspan</h1>
          <p className="app-subtitle">Enter final scores</p>
        </div>
      </div>

      <div className="screen-body">
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="score-table">
              <thead>
                <tr>
                  <th className="cat-col">Category</th>
                  {players.map((p, i) => (
                    <th
                      key={p.id}
                      className="player-col"
                      style={{ '--player-color': PLAYER_COLORS[i] }}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map(cat => (
                  <tr key={cat.key}>
                    <td className="cat-cell">
                      <span className="cat-label">{cat.label}</span>
                      <span className="cat-desc">{cat.description}</span>
                    </td>
                    {players.map(p => (
                      <td key={p.id} className="score-cell">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          className="score-input"
                          value={scores[p.id]?.[cat.key] ?? 0}
                          onChange={e => handleInput(p.id, cat.key, e.target.value)}
                          onFocus={e => e.target.select()}
                        />
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
                  {players.map(p => (
                    <td key={p.id} className="score-cell total-value">
                      {getTotal(scores[p.id])}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="scroll-hint">Scroll right to see all players</p>
        </div>

        <div className="action-stack">
          <button className="primary-btn" onClick={onEndGame}>
            End Game &amp; See Results
          </button>

          {showConfirm ? (
            <div className="confirm-bar">
              <span>Discard this game?</span>
              <button className="danger-btn" onClick={handleDiscard}>
                Yes, discard
              </button>
              <button className="secondary-btn" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="secondary-btn" onClick={() => setShowConfirm(true)}>
              New Game
            </button>
          )}
        </div>

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
