import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import ScoreEntry from './components/ScoreEntry'
import ResultsScreen from './components/ResultsScreen'
import NavBar from './components/NavBar'
import HistoryScreen from './components/HistoryScreen'
import GameDetail from './components/GameDetail'
import { makeEmptyScore, getTotal, GAMES_KEY, MID_GAME_KEY } from './constants'

let _saved = null
try {
  const raw = localStorage.getItem(MID_GAME_KEY)
  if (raw) {
    const parsed = JSON.parse(raw)
    if (parsed?.players?.length) _saved = parsed
  }
} catch {}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(GAMES_KEY) || '[]') } catch { return [] }
}

export default function App() {
  const [screen, setScreen] = useState(_saved ? 'scoring' : 'setup')
  const [players, setPlayers] = useState(_saved?.players ?? [])
  const [scores, setScores] = useState(_saved?.scores ?? {})
  const [scoringStep, setScoringStep] = useState(_saved?.scoringStep ?? 0)
  const [gameComplete, setGameComplete] = useState(false)
  const [history, setHistory] = useState(loadHistory)
  const [selectedGameId, setSelectedGameId] = useState(null)

  useEffect(() => {
    if (screen === 'scoring') {
      try {
        localStorage.setItem(MID_GAME_KEY, JSON.stringify({ players, scores, scoringStep }))
      } catch {}
    }
  }, [players, scores, scoringStep, screen])

  function handleStartGame(validPlayers) {
    const initial = {}
    validPlayers.forEach(p => { initial[p.id] = makeEmptyScore() })
    setPlayers(validPlayers)
    setScores(initial)
    setScoringStep(0)
    setGameComplete(false)
    setScreen('scoring')
  }

  function handleEndGame() {
    const totals = players.map(p => ({ ...p, total: getTotal(scores[p.id]) }))
    const maxTotal = Math.max(...totals.map(p => p.total))
    const winners = totals.filter(p => p.total === maxTotal).map(p => p.id)
    const game = {
      id: Date.now(),
      date: new Date().toISOString(),
      players: players.map(p => ({ id: p.id, name: p.name })),
      scores: { ...scores },
      winners,
    }
    const updated = [game, ...history]
    try { localStorage.setItem(GAMES_KEY, JSON.stringify(updated)) } catch {}
    setHistory(updated)
    try { localStorage.removeItem(MID_GAME_KEY) } catch {}
    setGameComplete(true)
    setScreen('results')
  }

  function handlePlayAgain() {
    try { localStorage.removeItem(MID_GAME_KEY) } catch {}
    setScoringStep(0)
    setGameComplete(false)
    setScreen('setup')
  }

  function handleNewGame() {
    try { localStorage.removeItem(MID_GAME_KEY) } catch {}
    setPlayers([])
    setScores({})
    setScoringStep(0)
    setGameComplete(false)
    setScreen('setup')
  }

  function handleDeleteGame(id) {
    const updated = history.filter(g => g.id !== id)
    try { localStorage.setItem(GAMES_KEY, JSON.stringify(updated)) } catch {}
    setHistory(updated)
  }

  function handleClearHistory() {
    try { localStorage.removeItem(GAMES_KEY) } catch {}
    setHistory([])
  }

  const showNav = screen !== 'setup'
  const navActive = (screen === 'history' || screen === 'detail') ? 'history' : 'game'
  const hasGame = players.length > 0

  function handleNavGame() {
    if (!hasGame) return
    setScreen(gameComplete ? 'results' : 'scoring')
  }

  return (
    <div className={`app${showNav ? ' has-nav' : ''}`}>
      <div className="app-content">
        {screen === 'setup' && (
          <SetupScreen initialPlayers={players} onStart={handleStartGame} />
        )}
        {screen === 'scoring' && (
          <ScoreEntry
            players={players}
            scores={scores}
            step={scoringStep}
            onStepChange={setScoringStep}
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
        {screen === 'history' && (
          <HistoryScreen
            history={history}
            onSelectGame={id => { setSelectedGameId(id); setScreen('detail') }}
            onDeleteGame={handleDeleteGame}
            onClearAll={handleClearHistory}
          />
        )}
        {screen === 'detail' && (
          <GameDetail
            game={history.find(g => g.id === selectedGameId)}
            onBack={() => setScreen('history')}
            onDeleteGame={id => { handleDeleteGame(id); setScreen('history') }}
          />
        )}
      </div>
      {showNav && (
        <NavBar
          activeTab={navActive}
          hasGame={hasGame}
          onGameTab={handleNavGame}
          onHistoryTab={() => setScreen('history')}
        />
      )}
    </div>
  )
}
