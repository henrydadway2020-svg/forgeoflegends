import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import StandingsTable from '../components/StandingsTable'
import LeagueCard from '../components/LeagueCard'

export default function Home() {
  const { config, leagues, standings, teams, loading } = useData()
  const activeLeague = leagues.find((l) => l.status === 'active')

  return (
    <div className="container" style={{ padding: '48px 20px 80px' }}>
      <section style={{ textAlign: 'center', marginBottom: 56 }}>
        <span className="eyebrow">{config?.edition || 'Edición 2 — La Liga de las Eras'}</span>
        <h1 className="h-display" style={{ fontSize: 'clamp(32px, 6vw, 56px)', margin: '14px 0' }}>
          FORGE OF LEGENDS
          <br />
          <span style={{ color: 'var(--bronze-bright)' }}>TOTAL WAR</span>
        </h1>
        <p style={{ color: 'var(--parchment-dim)', maxWidth: 560, margin: '0 auto' }}>
          {teams.length} equipos. 15 eras históricas de Pokémon TCG Pocket. Una sola tabla.
          Cada fecha reescribe quién manda en la liga.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link to="/tabla" className="btn btn-primary">Ver tabla general</Link>
          <Link to="/fechas" className="btn">Explorar las 15 eras</Link>
        </div>
      </section>

      {activeLeague && (
        <section style={{ marginBottom: 56 }}>
          <h2 className="h-display" style={{ fontSize: 20, marginBottom: 16 }}>Era en curso</h2>
          <div style={{ maxWidth: 380 }}>
            <LeagueCard league={activeLeague} />
          </div>
        </section>
      )}

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="h-display" style={{ fontSize: 20 }}>Tabla general</h2>
          <Link to="/tabla" style={{ fontSize: 13, color: 'var(--bronze)' }}>Ver completa →</Link>
        </div>
        {loading ? <p style={{ color: 'var(--parchment-dim)' }}>Cargando datos de la forja…</p> : (
          <StandingsTable rows={standings.slice(0, 8)} />
        )}
      </section>
    </div>
  )
}
