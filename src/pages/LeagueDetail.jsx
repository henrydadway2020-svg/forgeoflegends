import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import MatchCard from '../components/MatchCard'

export default function LeagueDetail() {
  const { id } = useParams()
  const { leagues, matches, teams, loading } = useData()
  const league = leagues.find((l) => String(l.id) === id)

  const teamsById = new Map(teams.map((t) => [t.id, t]))
  const teamName = (tid) => teamsById.get(tid)?.name || '???'

  const leagueMatches = matches
    .filter((m) => String(m.date) === id)
    .map((m) => ({
      teamA: teamName(m.teamAId),
      teamB: teamName(m.teamBId),
      winner: m.winnerId ? teamName(m.winnerId) : null,
      score: m.score,
    }))

  if (loading) return <div className="container" style={{ padding: 40 }}>Cargando…</div>
  if (!league) {
    return (
      <div className="container" style={{ padding: 40 }}>
        <p>No se encontró esa fecha.</p>
        <Link to="/fechas" className="btn">Volver a las eras</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <Link to="/fechas" style={{ fontSize: 13, color: 'var(--bronze)' }}>← Todas las eras</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 14, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="eyebrow">Fecha {String(league.id).padStart(2, '0')}</span>
          <h1 className="h-display" style={{ fontSize: 34, margin: '8px 0' }}>{league.name}</h1>
        </div>
        <span className={`badge ${league.status === 'active' ? 'badge-active' : 'badge-blocked'}`}>
          {league.status === 'active' ? 'Activa' : 'Bloqueada'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, margin: '24px 0 32px' }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Formato</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{league.format}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Último campeón</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--bronze-bright)' }}>{league.lastChampion || '—'}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Reglas oficiales</div>
        {league.note && <p style={{ marginTop: 0, color: 'var(--parchment-dim)' }}>{league.note}</p>}
        {league.rules?.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
            {league.rules.map((r, i) => <li key={i} style={{ fontSize: 14 }}>{r}</li>)}
          </ul>
        )}
        {!league.note && league.rules?.length === 0 && (
          <p style={{ color: 'var(--parchment-dim)', margin: 0 }}>Sin reglas especiales registradas.</p>
        )}
      </div>

      <h2 className="h-display" style={{ fontSize: 20, marginBottom: 16 }}>Versus</h2>
      {leagueMatches.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--parchment-dim)' }}>
          El versus de esta fecha aún no ha sido generado desde el panel administrador.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {leagueMatches.map((m, i) => <MatchCard key={i} match={m} />)}
        </div>
      )}
    </div>
  )
}
