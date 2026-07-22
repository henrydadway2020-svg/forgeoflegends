const POINTS_PER_WIN = 3

function parseScoreDiff(score) {
  if (!score || !score.includes('-')) return 0
  const [a, b] = score.split('-').map((n) => parseInt(n, 10) || 0)
  return Math.abs(a - b)
}

export function computeStandings(teams, matches) {
  const table = new Map()
  for (const team of teams) {
    table.set(team.id, {
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
    if (!match.winnerId) continue // partido aún sin resultado
    const { teamAId, teamBId, winnerId, score } = match
    const loserId = winnerId === teamAId ? teamBId : teamAId
    const diff = parseScoreDiff(score)

    if (table.has(teamAId)) table.get(teamAId).played += 1
    if (table.has(teamBId)) table.get(teamBId).played += 1

    if (table.has(winnerId)) {
      const row = table.get(winnerId)
      row.wins += 1
      row.points += POINTS_PER_WIN
      row.diff += diff
    }
    if (table.has(loserId)) {
      const row = table.get(loserId)
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
