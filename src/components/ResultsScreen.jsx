import { BHL_IMAGES, PLAYER_COLORS, getTotal } from '../constants'

function num(v) { return parseInt(v) || 0 }

export default function ResultsScreen({ players, scores, onPlayAgain, onNewGame }) {
  const totals = players.map(p => ({ ...p, total: getTotal(scores[p.id]) }))
  const maxTotal = Math.max(...totals.map(p => p.total))
  const isWinner = id => totals.find(p => p.id === id)?.total === maxTotal

  const winners = totals.filter(p => p.total === maxTotal)
  const winnerText = winners.length === 1
    ? `${winners[0].name} wins!`
    : `Tie \u2014 ${winners.map(w => w.name).join(' & ')}`

  const hero = BHL_IMAGES[3]

  // Final round (index 3) holds the definitive cumulative values
  const finalRound = id => scores[id]?.rounds[3] ?? {}

  const rows = [
    { label: 'Birds Played',    getValue: id => num(finalRound(id).birds) },
    { label: 'Bonus Cards',     getValue: id => num(finalRound(id).bonusCards) },
    { label: 'Round 1 Goal',    getValue: id => num(scores[id]?.rounds[0]?.endOfRound) },
    { label: 'Round 2 Goal',    getValue: id => num(scores[id]?.rounds[1]?.endOfRound) },
    { label: 'Round 3 Goal',    getValue: id => num(scores[id]?.rounds[2]?.endOfRound) },
    { label: 'Round 4 Goal',    getValue: id => num(scores[id]?.rounds[3]?.endOfRound), highlight: true },
    { label: 'Eggs',            getValue: id => num(finalRound(id).eggs) },
    { label: 'Food on Cards',   getValue: id => num(finalRound(id).food) },
    { label: 'Tucked Cards',    getValue: id => num(finalRound(id).tucked) },
  ]

  return (
    <div className="screen">
      <div className="hero hero-tall" style={{ backgroundImage: `url(${hero.url})` }}>
        <div className="hero-overlay">
          <h1 className="app-title">Wingspan</h1>
          <p className="winner-announce">{winnerText}</p>
        </div>
      </div>

      <div className="screen-body">
        <h2 className="screen-heading">Final Scores</h2>

        <div className="table-wrap">
          <div className="table-scroll">
            <table className="score-table results-table">
              <thead>
                <tr>
                  <th className="cat-col">Category</th>
                  {players.map((p, i) => (
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
                {rows.map(row => (
                  <tr key={row.label} className={row.highlight ? 'highlight-row' : ''}>
                    <td className="cat-cell">
                      <span className="cat-label">{row.label}</span>
                    </td>
                    {players.map(p => (
                      <td
                        key={p.id}
                        className={`score-cell${isWinner(p.id) ? ' winner-cell' : ''}`}
                      >
                        {row.getValue(p.id)}
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

        <div className="results-actions">
          <button className="primary-btn" onClick={onPlayAgain}>Play Again</button>
          <button className="secondary-btn" onClick={onNewGame}>New Game</button>
        </div>

        <p className="image-credit">{hero.credit}</p>
      </div>
    </div>
  )
}
