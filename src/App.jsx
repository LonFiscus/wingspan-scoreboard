import { useState } from 'react'
import SetupScreen from './components/SetupScreen'
import ScoreEntry from './components/ScoreEntry'
import ResultsScreen from './components/ResultsScreen'
import { makeEmptyScore } from './constants'

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [players, setPlayers] = useState([])
  const [scores, setScores] = useState({})

  function handleStartGame(validPlayers) {
    const initial = {}
    validPlayers.forEach(p => {
      initial[p.id] = makeEmptyScore()
    })
    setPlayers(validPlayers)
    setScores(initial)
    setScreen('scoring')
  }

  function handleEndGame() {
    const game = {
      id: Date.now(),
      date: new Date().toISOString(),
      players: players.map(p => ({ id: p.id, name: p.name })),
      scores: { ...scores },
    }
    try {
      const existing = JSON.parse(localStorage.getItem('wingspan_games_v1') || '[]')
      localStorage.setItem('wingspan_games_v1', JSON.stringify([game, ...existing]))
    } catch {
      // localStorage unavailable — continue without saving
    }
    setScreen('results')
  }

  function handlePlayAgain() {
    // Keep player names, reset scores
    const fresh = {}
    players.forEach(p => {
      fresh[p.id] = makeEmptyScore()
    })
    setScores(fresh)
    setScreen('setup')
  }

  function handleNewGame() {
    setPlayers([])
    setScores({})
    setScreen('setup')
  }

  return (
    <div className="app">
      {screen === 'setup' && (
        <SetupScreen
          initialPlayers={players}
          onStart={handleStartGame}
        />
      )}
      {screen === 'scoring' && (
        <ScoreEntry
          players={players}
          scores={scores}
          onScoreChange={setScores}
          onEndGame={handleEndGame}
          onNewGame={handleNewGame}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          players={players}
          scores={scores}
          onPlayAgain={handlePlayAgain}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  )
}
