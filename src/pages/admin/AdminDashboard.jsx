import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'

export default function AdminDashboard() {
  const { teams, leagues, matches, isRepoConfigured } = useData()
  const played = matches.filter((m) => m.winner).length

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <span className="eyebrow">Panel administrador</span>
      <h1 className="h-display" style={{ fontSize: 30, margin: '10px 0 8px' }}>Control de la Liga</h1>

      {!isRepoConfigured && (
        <div className="card" style={{ padding: 16, borderColor: 'var(--ember)', marginBottom: 24, fontSize: 13 }}>
          ⚠️ Aún no configuraste tu repositorio de GitHub en <code>public/data/config.json</code>.
          Los cambios que hagas aquí no podrán guardarse hasta que completes <code>github.owner</code> y{' '}
          <code>github.repo</code>.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
        <Stat label="Equipos" value={`${teams.length}/16`} />
        <Stat label="Fechas activas" value={leagues.filter((l) => l.status === 'active').length} />
        <Stat label="Partidos jugados" value={played} />
        <Stat label="Partidos totales" value={matches.length} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <AdminLink to="/admin/equipos" title="Equipos" desc="Crear, editar, eliminar equipos y subir logos." />
        <AdminLink to="/admin/fechas" title="Fechas" desc="Bloquear/desbloquear fechas y elegir la fecha activa." />
        <AdminLink to="/admin/versus" title="Versus" desc="Generar enfrentamientos y registrar resultados." />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 16, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--bronze-bright)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--parchment-dim)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function AdminLink({ to, title, desc }) {
  return (
    <Link to={to} className="card" style={{ padding: 20, display: 'block' }}>
      <h3 className="h-display" style={{ fontSize: 18, margin: '0 0 8px' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--parchment-dim)' }}>{desc}</p>
    </Link>
  )
}
