import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchJSON, writeJSON } from '../utils/github'
import { computeStandings } from '../utils/standings'

const DataContext = createContext(null)

const LOCAL_PATH = (file) => `/data/${file}`

async function fetchLocal(file, fallback) {
  try {
    const res = await fetch(LOCAL_PATH(file), { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn(`[data] fallback vacío para ${file}:`, err.message)
    return fallback
  }
}

function isRealRepo(config) {
  return (
    config?.github?.owner &&
    config?.github?.repo &&
    config.github.owner !== 'TU_USUARIO' &&
    config.github.repo !== 'TU_REPOSITORIO'
  )
}

export function DataProvider({ children }) {
  const [config, setConfig] = useState(null)
  const [teams, setTeams] = useState([])
  const [leagues, setLeagues] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setTokenState] = useState(() => sessionStorage.getItem('forge_gh_token') || '')

  const setToken = (t) => {
    setTokenState(t)
    if (t) sessionStorage.setItem('forge_gh_token', t)
    else sessionStorage.removeItem('forge_gh_token')
  }

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const cfg = await fetchLocal('config.json', {})
      let t, l, m
      if (isRealRepo(cfg)) {
        const { owner, repo, branch } = cfg.github
        ;[t, l, m] = await Promise.all([
          fetchJSON(owner, repo, branch, 'public/data/teams.json', { fallback: null }),
          fetchJSON(owner, repo, branch, 'public/data/leagues.json', { fallback: null }),
          fetchJSON(owner, repo, branch, 'public/data/matches.json', { fallback: null }),
        ])
      }
      setConfig(cfg)
      setTeams(t ?? (await fetchLocal('teams.json', [])))
      setLeagues(l ?? (await fetchLocal('leagues.json', [])))
      setMatches(m ?? (await fetchLocal('matches.json', [])))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const standings = useMemo(() => computeStandings(teams, matches), [teams, matches])

  const persist = useCallback(
    async (file, data, message) => {
      if (!config) throw new Error('Config no cargada todavía.')
      if (!isRealRepo(config)) {
        throw new Error(
          'Configura tu owner/repo de GitHub en public/data/config.json antes de guardar cambios.'
        )
      }
      const { owner, repo, branch } = config.github
      return writeJSON({ owner, repo, branch, token, path: `public/data/${file}`, data, message })
    },
    [config, token]
  )

  const saveTeams = useCallback(
    async (next) => {
      await persist('teams.json', next, 'Actualizar equipos')
      setTeams(next)
    },
    [persist]
  )

  const saveLeagues = useCallback(
    async (next) => {
      await persist('leagues.json', next, 'Actualizar fechas')
      setLeagues(next)
    },
    [persist]
  )

  const saveMatches = useCallback(
    async (next) => {
      await persist('matches.json', next, 'Actualizar resultados y versus')
      setMatches(next)
      // standings.json se guarda como caché de solo lectura para consumidores externos
      const nextStandings = computeStandings(teams, next)
      try {
        await persist('standings.json', nextStandings, 'Recalcular tabla general')
      } catch (err) {
        console.warn('No se pudo cachear standings.json:', err.message)
      }
    },
    [persist, teams]
  )

  const value = {
    config,
    teams,
    leagues,
    matches,
    standings,
    loading,
    error,
    token,
    setToken,
    saveTeams,
    saveLeagues,
    saveMatches,
    refresh: loadAll,
    isRepoConfigured: isRealRepo(config),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>')
  return ctx
}
