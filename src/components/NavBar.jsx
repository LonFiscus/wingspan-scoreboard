export default function NavBar({ activeTab, hasGame, onGameTab, onHistoryTab }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button
        className={`nav-tab${activeTab === 'game' ? ' nav-tab-active' : ''}`}
        onClick={onGameTab}
        disabled={!hasGame}
        aria-label="Current Game"
      >
        <span className="nav-tab-label">Current Game</span>
      </button>
      <button
        className={`nav-tab${activeTab === 'history' ? ' nav-tab-active' : ''}`}
        onClick={onHistoryTab}
        aria-label="Game History"
      >
        <span className="nav-tab-label">History</span>
      </button>
    </nav>
  )
}
