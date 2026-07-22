// Generador de versus mediante el "método del círculo" (round-robin clásico).
// IMPORTANTE: el roster se ordena por `id` antes de armar el calendario, así
// el orden en que agregaste/renombraste equipos en /admin nunca cambia el
// cronograma. Los partidos se guardan por teamAId/teamBId (nunca por nombre),
// así que renombrar un equipo después no rompe nada.

export function buildRoundRobinSchedule(teamList) {
  const teams = [...teamList].sort((a, b) => a.id - b.id)
  if (teams.length % 2 !== 0) teams.push({ id: 'BYE', name: 'BYE', bye: true })

  const n = teams.length
  const rounds = n - 1
  const half = n / 2
  const fixed = teams[0]
  let rotating = teams.slice(1)

  const schedule = []
  for (let r = 0; r < rounds; r++) {
    const roundTeams = [fixed, ...rotating]
    const pairs = []
    for (let i = 0; i < half; i++) {
      const a = roundTeams[i]
      const b = roundTeams[n - 1 - i]
      if (a.bye || b.bye) continue
      pairs.push(
        r % 2 === 0
          ? { teamAId: a.id, teamBId: b.id }
          : { teamAId: b.id, teamBId: a.id }
      )
    }
    schedule.push(pairs)
    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, rotating.length - 1)]
  }
  return schedule // schedule[0] => Fecha 1, schedule[1] => Fecha 2, ...
}

// Genera (o recupera) el versus de una fecha específica a partir de la lista
// completa de equipos. Determinista: la MISMA lista de ids de equipos siempre
// produce el mismo emparejamiento para una fecha dada, sin importar el orden
// en que fueron creados o el orden del array en memoria.
export function generateVersusForFecha(teams, fechaNumber) {
  if (!teams || teams.length < 2) return []
  const schedule = buildRoundRobinSchedule(teams)
  const idx = fechaNumber - 1
  if (idx < 0 || idx >= schedule.length) return []
  return schedule[idx]
}

// Verifica si dos equipos (por id) ya se enfrentaron antes.
export function haveTeamsPlayed(matches, teamAId, teamBId) {
  return matches.some(
    (m) =>
      (m.teamAId === teamAId && m.teamBId === teamBId) ||
      (m.teamAId === teamBId && m.teamBId === teamAId)
  )
}
