export default function NavBar({ activeTab, hasGame, darkMode, onGameTab, onHistoryTab, onStatsTab, onToggleTheme }) {
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
      <button
        className={`nav-tab${activeTab === 'stats' ? ' nav-tab-active' : ''}`}
        onClick={onStatsTab}
        aria-label="Player Stats"
      >
        <span className="nav-tab-label">Stats</span>
      </button>
      <button
        className="nav-theme-btn"
        onClick={onToggleTheme}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '\u25cb' : '\u25cf'}
      </button>
    </nav>
  )
}
