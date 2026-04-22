import { useState } from 'react'
import { BHL_IMAGES, getTotal } from '../constants'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function HistoryScreen({ history, onSelectGame, onDeleteGame, onClearAll }) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const hero = BHL_IMAGES[4]

  return (
    <div className="screen">
      <div className="hero" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="hero-overlay">
          <h1 className="app-title">Papa&rsquo;s Plantin&rsquo; a Bird!</h1>
          <p className="app-subtitle">Game History</p>
        </div>
      </div>

      <div className="screen-body">
        <div className="history-toolbar">
          <h2 className="screen-heading history-heading">Past Games</h2>
          {history.length > 0 && !showClearConfirm && (
            <button className="secondary-btn small-btn" onClick={() => setShowClearConfirm(true)}>
              Clear All
            </button>
          )}
        </div>

        {showClearConfirm && (
          <div className="confirm-bar">
            <span>Clear all game history?</span>
            <button
              className="danger-btn"
              onClick={() => { onClearAll(); setShowClearConfirm(false) }}
            >
              Yes, clear all
            </button>
            <button className="secondary-btn" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </button>
          </div>
        )}

        {history.length === 0 ? (
          <p className="empty-state">No games recorded yet. Finish a game to see it here!</p>
        ) : (
          <div className="history-list">
            {history.map(game => {
              const winnerNames = game.players
                .filter(p => game.winners?.includes(p.id))
                .map(p => p.name)
              const winnerScore = Math.max(
                ...game.players.map(p => getTotal(game.scores[p.id]))
              )

              return (
                <div
                  key={game.id}
                  className="history-row"
                  onClick={() => deleteConfirmId !== game.id && onSelectGame(game.id)}
                >
                  <div className="history-row-main">
                    <span className="history-date">{formatDate(game.date)}</span>
                    <span className="history-players">
                      {game.players.map(p => p.name).join(', ')}
                    </span>
                    <span className="history-winner">
                      {winnerNames.length === 1
                        ? `${winnerNames[0]} won`
                        : winnerNames.length > 1
                          ? `Tie: ${winnerNames.join(' & ')}`
                          : 'Game complete'}
                      <span className="history-score"> &mdash; {winnerScore} pts</span>
                    </span>
                  </div>

                  {deleteConfirmId === game.id ? (
                    <div className="row-confirm" onClick={e => e.stopPropagation()}>
                      <span>Delete?</span>
                      <button
                        className="danger-btn"
                        onClick={() => { onDeleteGame(game.id); setDeleteConfirmId(null) }}
                      >
                        Yes
                      </button>
                      <button
                        className="secondary-btn"
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      className="icon-btn danger"
                      onClick={e => { e.stopPropagation(); setDeleteConfirmId(game.id) }}
                      aria-label="Delete game"
                      title="Delete this game"
                    >
                      &#10005;
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
