import { useState } from 'react'
import { ROUND_CATEGORIES, BHL_IMAGES, PLAYER_COLORS, getRunningTotal } from '../constants'

const NUM_ROUNDS = 4

export default function ScoreEntry({ players, scores, onScoreChange, onEndGame, onNewGame }) {
  const [step, setStep] = useState(0) // 0–3 = rounds 1–4
  const [showConfirm, setShowConfirm] = useState(false)

  const hero = BHL_IMAGES[Math.min(step, BHL_IMAGES.length - 1)]
  const isFinalRound = step === NUM_ROUNDS - 1

  function handleInput(playerId, catKey, value) {
    const num = Math.max(0, parseInt(value) || 0)
    onScoreChange(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        rounds: prev[playerId].rounds.map((r, i) =>
          i === step ? { ...r, [catKey]: num } : r
        ),
      },
    }))
  }

  function handleNext() {
    // Pre-fill next round's cumulative fields from this round
    onScoreChange(prev => {
      const updated = { ...prev }
      players.forEach(p => {
        const curr = prev[p.id].rounds[step]
        updated[p.id] = {
          ...prev[p.id],
          rounds: prev[p.id].rounds.map((r, i) =>
            i === step + 1
              ? {
                  ...r,
                  birds:      curr.birds,
                  bonusCards: curr.bonusCards,
                  eggs:       curr.eggs,
                  food:       curr.food,
                  tucked:     curr.tucked,
                  // endOfRound stays at its current value (0 or whatever was entered)
                }
              : r
          ),
        }
      })
      return updated
    })
    setStep(s => s + 1)
  }

  function handleBack() {
    setStep(s => s - 1)
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
          <p className="app-subtitle">Round {step + 1} of {NUM_ROUNDS}</p>
        </div>
      </div>

      <div className="screen-body">

        {/* Progress dots */}
        <div className="step-indicator">
          {Array.from({ length: NUM_ROUNDS }, (_, i) => (
            <div
              key={i}
              className={`step-dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
              title={`Round ${i + 1}`}
            />
          ))}
          <span className="step-label">Round {step + 1} of {NUM_ROUNDS}</span>
        </div>

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
                {ROUND_CATEGORIES.map(cat => (
                  <tr key={cat.key} className={cat.key === 'endOfRound' ? 'highlight-row' : ''}>
                    <td className="cat-cell">
                      <span className="cat-label">
                        {cat.key === 'endOfRound'
                          ? `Round ${step + 1} Goal`
                          : cat.label}
                      </span>
                      <span className="cat-desc">{cat.description}</span>
                    </td>
                    {players.map(p => (
                      <td key={p.id} className="score-cell">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          className="score-input"
                          value={scores[p.id]?.rounds[step]?.[cat.key] ?? 0}
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
                    <span className="cat-label total-label">
                      Running Total
                    </span>
                  </td>
                  {players.map(p => (
                    <td key={p.id} className="score-cell total-value">
                      {getRunningTotal(scores[p.id], step)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="action-stack">
          {isFinalRound ? (
            <button className="primary-btn" onClick={onEndGame}>
              End Game &amp; See Results
            </button>
          ) : (
            <button className="primary-btn" onClick={handleNext}>
              Next &rarr; Round {step + 2}
            </button>
          )}

          <div className="nav-row">
            {step > 0 && (
              <button className="secondary-btn" onClick={handleBack}>
                &larr; Back
              </button>
            )}

            {showConfirm ? (
              <div className="confirm-bar">
                <span>Discard this game?</span>
                <button className="danger-btn" onClick={handleDiscard}>Yes, discard</button>
                <button className="secondary-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
              </div>
            ) : (
              <button className="secondary-btn" onClick={() => setShowConfirm(true)}>
                New Game
              </button>
            )}
          </div>
        </div>

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
