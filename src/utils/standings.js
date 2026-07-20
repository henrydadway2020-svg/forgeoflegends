const POINTS_PER_WIN = 3

function parseScoreDiff(score, winner, teamA, teamB) {
  // score viene como "3-1". Se interpreta como marcador del ganador vs perdedor.
  if (!score || !score.includes('-')) return 0
  const [a, b] = score.split('-').map((n) => parseInt(n, 10) || 0)
  const diff = Math.abs(a - b)
  return diff
}

export function computeStandings(teams, matches) {
  const table = new Map()
  for (const team of teams) {
    table.set(team.name, {
      id: team.id,
      name: team.name,
      logo: team.logo || null,
      played: 0,
      wins: 0,
      losses: 0,
      points: 0,
      diff: 0,
    })
  }

  for (const match of matches) {
    if (!match.winner) continue // partido aún sin resultado registrado
    const { teamA, teamB, winner, score } = match
    const loser = winner === teamA ? teamB : teamA
    const diff = parseScoreDiff(score, winner, teamA, teamB)

    if (table.has(teamA)) table.get(teamA).played += 1
    if (table.has(teamB)) table.get(teamB).played += 1

    if (table.has(winner)) {
      const row = table.get(winner)
      row.wins += 1
      row.points += POINTS_PER_WIN
      row.diff += diff
    }
    if (table.has(loser)) {
      const row = table.get(loser)
      row.losses += 1
      row.diff -= diff
    }
  }

  const rows = Array.from(table.values()).sort((x, y) => {
    if (y.points !== x.points) return y.points - x.points
    if (y.wins !== x.wins) return y.wins - x.wins
    return y.diff - x.diff
  })

  return rows.map((row, i) => ({ position: i + 1, ...row }))
}
