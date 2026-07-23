// Generador de versus mediante el "método del círculo" (round-robin clásico).
//
// SEASON_CIRCLE_ORDER fija el orden de posiciones para esta temporada de 18
// equipos. Los primeros 16 puestos reproducen EXACTAMENTE el versus ya jugado
// en la Fecha 1 (antes de sumar a Palomos Team #17 y Los Primates #18), y a
// partir de ahí la rotación estándar del método del círculo sigue siendo
// matemáticamente válida: garantiza que las 17 fechas cubran todos los cruces
// posibles entre los 18 equipos exactamente una vez, sin repetir ninguno.
const SEASON_CIRCLE_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 17, 18, 9, 10, 11, 12, 13, 14, 15, 16]

export function buildRoundRobinSchedule(teamList) {
  const byId = new Map(teamList.map((t) => [t.id, t]))
  // Usa el orden fijo de temporada para los ids conocidos; cualquier equipo
  // nuevo que no esté en SEASON_CIRCLE_ORDER se agrega al final por id
  // ascendente, para que la liga no se rompa si en el futuro suman más.
  const orderedIds = [
    ...SEASON_CIRCLE_ORDER.filter((id) => byId.has(id)),
    ...teamList
      .map((t) => t.id)
      .filter((id) => !SEASON_CIRCLE_ORDER.includes(id))
      .sort((a, b) => a - b),
  ]
  const teams = orderedIds.map((id) => byId.get(id))
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
  return schedule
}

export function generateVersusForFecha(teams, fechaNumber) {
  if (!teams || teams.length < 2) return []
  const schedule = buildRoundRobinSchedule(teams)
  const idx = fechaNumber - 1
  if (idx < 0 || idx >= schedule.length) return []
  return schedule[idx]
}

export function haveTeamsPlayed(matches, teamAId, teamBId) {
  return matches.some(
    (m) =>
      (m.teamAId === teamAId && m.teamBId === teamBId) ||
      (m.teamAId === teamBId && m.teamBId === teamAId)
  )
}
