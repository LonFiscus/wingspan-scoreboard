import { useState } from 'react'
import { BHL_IMAGES } from '../constants'

let counter = 1
function nextId() {
  return counter++
}

export default function SetupScreen({ initialPlayers, onStart }) {
  const [players, setPlayers] = useState(() => {
    if (initialPlayers && initialPlayers.length > 0) return initialPlayers
    return [{ id: nextId(), name: '' }]
  })

  function addPlayer() {
    if (players.length < 5) {
      setPlayers(prev => [...prev, { id: nextId(), name: '' }])
    }
  }

  function removePlayer(id) {
    if (players.length > 1) {
      setPlayers(prev => prev.filter(p => p.id !== id))
    }
  }

  function updateName(id, name) {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p))
  }

  function moveUp(idx) {
    if (idx === 0) return
    setPlayers(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next
    })
  }

  function moveDown(idx) {
    setPlayers(prev => {
      if (idx === prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next
    })
  }

  const validPlayers = players.filter(p => p.name.trim())
  const hero = BHL_IMAGES[0]

  function handleStart() {
    onStart(validPlayers)
  }

  return (
    <div className="screen">
      <div className="hero" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="hero-overlay">
          <h1 className="app-title">Papa&rsquo;s Plantin&rsquo; a Bird!</h1>
          <p className="app-subtitle">Scoreboard</p>
        </div>
      </div>

      <div className="screen-body">
        <h2 className="screen-heading">Who&rsquo;s playing?</h2>

        <div className="player-list">
          {players.map((player, idx) => (
            <div key={player.id} className="player-row">
              <span className="player-num">{idx + 1}</span>
              <input
                type="text"
                className="player-name-input"
                value={player.name}
                onChange={e => updateName(player.id, e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && idx === players.length - 1 && players.length < 5) {
                    addPlayer()
                  }
                }}
                placeholder={`Player ${idx + 1}`}
                maxLength={20}
                autoFocus={idx === players.length - 1 && player.name === ''}
              />
              <div className="player-actions">
                <button
                  className="icon-btn"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  aria-label="Move player up"
                  title="Move up"
                >
                  &#9650;
                </button>
                <button
                  className="icon-btn"
                  onClick={() => moveDown(idx)}
                  disabled={idx === players.length - 1}
                  aria-label="Move player down"
                  title="Move down"
                >
                  &#9660;
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => removePlayer(player.id)}
                  disabled={players.length === 1}
                  aria-label="Remove player"
                  title="Remove player"
                >
                  &#10005;
                </button>
              </div>
            </div>
          ))}
        </div>

        {players.length < 5 && (
          <button className="add-player-btn" onClick={addPlayer}>
            + Add Player
          </button>
        )}

        <button
          className="primary-btn"
          disabled={validPlayers.length === 0}
          onClick={handleStart}
        >
          Start Game
        </button>

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
