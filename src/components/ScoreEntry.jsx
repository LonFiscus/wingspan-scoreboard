import { useState } from 'react'
import {
  ROUND_CATEGORY,
  FINAL_CATEGORIES,
  BHL_IMAGES,
  PLAYER_COLORS,
  getRoundsTotal,
  getTotal,
} from '../constants'

const NUM_ROUNDS = 4

export default function ScoreEntry({ players, scores, onScoreChange, onEndGame, onNewGame }) {
  // steps 0–3 = round 1–4, step 4 = final scores
  const [step, setStep] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  const isRoundStep = step < NUM_ROUNDS
  const roundIndex = step
  const hero = BHL_IMAGES[Math.min(step, BHL_IMAGES.length - 1)]

  const stepLabel = isRoundStep
    ? `Round ${step + 1} of ${NUM_ROUNDS}`
    : 'Final Scores'

  function handleRoundInput(playerId, value) {
    const num = Math.max(0, parseInt(value) || 0)
    onScoreChange(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        rounds: prev[playerId].rounds.map((r, i) =>
          i === roundIndex ? { endOfRound: num } : r
        ),
      },
    }))
  }

  function handleFinalInput(playerId, catKey, value) {
    const num = Math.max(0, parseInt(value) || 0)
    onScoreChange(prev => ({
      ...prev,
      [playerId]: { ...prev[playerId], [catKey]: num },
    }))
  }

  // Running total shown in the table footer
  function runningTotal(playerId) {
    const score = scores[playerId]
    if (!score) return 0
    if (isRoundStep) {
      // Sum rounds 1 through current
      return score.rounds
        .slice(0, roundIndex + 1)
        .reduce((s, r) => s + (parseInt(r.endOfRound) || 0), 0)
    }
    return getTotal(score)
  }

  function handleDiscard() {
    setShowConfirm(false)
    onNewGame()
  }

  return (
    <div className="screen">
      <div className="score-header" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="score-header-overlay">
          <h1 className="app-title">Papa&rsquo;s Plantin&rsquo; a Bird!</h1>
          <p className="app-subtitle">{stepLabel}</p>
        </div>
      </div>

      <div className="screen-body">

        {/* Step progress dots */}
        <div className="step-indicator">
          {[0, 1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`step-dot${s === step ? ' active' : ''}${s < step ? ' done' : ''}`}
              title={s < NUM_ROUNDS ? `Round ${s + 1}` : 'Final Scores'}
            />
          ))}
          <span className="step-label">{stepLabel}</span>
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
                {isRoundStep ? (
                  // Round step: one row for the end-of-round goal
                  <tr>
                    <td className="cat-cell">
                      <span className="cat-label">{ROUND_CATEGORY.label}</span>
                      <span className="cat-desc">{ROUND_CATEGORY.description}</span>
                    </td>
                    {players.map(p => (
                      <td key={p.id} className="score-cell">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          className="score-input"
                          value={scores[p.id]?.rounds[roundIndex]?.endOfRound ?? 0}
                          onChange={e => handleRoundInput(p.id, e.target.value)}
                          onFocus={e => e.target.select()}
                        />
                      </td>
                    ))}
                  </tr>
                ) : (
                  <>
                    {/* Final step: show round subtotal (read-only) then final categories */}
                    <tr className="subtotal-row">
                      <td className="cat-cell">
                        <span className="cat-label">Round Goals (all 4)</span>
                        <span className="cat-desc">Sum of end-of-round goal scores</span>
                      </td>
                      {players.map(p => (
                        <td key={p.id} className="score-cell subtotal-value">
                          {getRoundsTotal(scores[p.id])}
                        </td>
                      ))}
                    </tr>
                    {FINAL_CATEGORIES.map(cat => (
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
                              onChange={e => handleFinalInput(p.id, cat.key, e.target.value)}
                              onFocus={e => e.target.select()}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>

              <tfoot>
                <tr className="total-row">
                  <td className="cat-cell">
                    <span className="cat-label total-label">
                      {isRoundStep ? 'Running Total' : 'Grand Total'}
                    </span>
                  </td>
                  {players.map(p => (
                    <td key={p.id} className="score-cell total-value">
                      {runningTotal(p.id)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="action-stack">
          {step === NUM_ROUNDS ? (
            <button className="primary-btn" onClick={onEndGame}>
              End Game &amp; See Results
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={() => setStep(s => s + 1)}
            >
              {step < NUM_ROUNDS - 1
                ? `Next \u2192 Round ${step + 2}`
                : 'Next \u2192 Final Scores'}
            </button>
          )}

          <div className="nav-row">
            {step > 0 && (
              <button className="secondary-btn" onClick={() => setStep(s => s - 1)}>
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
