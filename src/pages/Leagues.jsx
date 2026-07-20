import { useData } from '../context/DataContext'
import LeagueCard from '../components/LeagueCard'

export default function Leagues() {
  const { leagues, loading } = useData()
  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <span className="eyebrow">🏆 La Liga de las Eras</span>
      <h1 className="h-display" style={{ fontSize: 32, margin: '10px 0 24px' }}>Las 15 Fechas</h1>
      {loading ? (
        <p style={{ color: 'var(--parchment-dim)' }}>Cargando…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {leagues.map((l) => <LeagueCard key={l.id} league={l} />)}
        </div>
      )}
    </div>
  )
}
