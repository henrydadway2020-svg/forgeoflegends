import { useData } from '../context/DataContext'
import StandingsTable from '../components/StandingsTable'

export default function Standings() {
  const { standings, loading } = useData()
  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <span className="eyebrow">Ranking global</span>
      <h1 className="h-display" style={{ fontSize: 32, margin: '10px 0 24px' }}>Tabla General</h1>
      {loading ? (
        <p style={{ color: 'var(--parchment-dim)' }}>Cargando…</p>
      ) : (
        <StandingsTable rows={standings} />
      )}
      <p style={{ marginTop: 20, fontSize: 12, color: 'var(--parchment-dim)' }}>
        Orden: puntos → victorias → diferencia de resultados. Cada victoria otorga 3 puntos.
      </p>
    </div>
  )
}
