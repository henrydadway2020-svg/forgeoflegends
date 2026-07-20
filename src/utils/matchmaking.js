// Generador de versus mediante el "método del círculo" (round-robin clásico).
// Con 16 equipos y 15 fechas, este método produce exactamente 15 rondas en las
// que cada equipo enfrenta a todos los demás una única vez: cero repeticiones
// posibles mientras el torneo esté completo. Si aún faltan equipos por cargar,
// se usan "BYE" (descanso) para no romper el algoritmo.

export function buildRoundRobinSchedule(teamList) {
  const teams = [...teamList]
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
          ? { teamA: a, teamB: b }
          : { teamA: b, teamB: a } // alterna local/visitante para variar el orden visual
      )
    }
    schedule.push(pairs)
    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, rotating.length - 1)]
  }
  return schedule // schedule[0] => Fecha 1, schedule[1] => Fecha 2, ...
}

// Genera (o recupera) el versus de una fecha específica a partir de la lista
// completa de equipos. Determinista: la misma lista de equipos siempre produce
// el mismo emparejamiento para una fecha dada.
export function generateVersusForFecha(teams, fechaNumber) {
  if (!teams || teams.length < 2) return []
  const schedule = buildRoundRobinSchedule(teams)
  const idx = fechaNumber - 1
  if (idx < 0 || idx >= schedule.length) return []
  return schedule[idx]
}

// Verifica si dos equipos ya se enfrentaron antes (útil para validar manualmente).
export function haveTeamsPlayed(matches, teamAName, teamBName) {
  return matches.some(
    (m) =>
      (m.teamA === teamAName && m.teamB === teamBName) ||
      (m.teamA === teamBName && m.teamB === teamAName)
  )
}
