import { Link } from 'react-router-dom'

export default function LeagueCard({ league }) {
  const active = league.status === 'active'
  return (
    <Link
      to={`/fechas/${league.id}`}
      className="card"
      style={{
        display: 'block',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        borderColor: active ? 'var(--bronze)' : 'var(--steel-line)',
      }}
    >
      <div
        style={{
          position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%',
          background: active
            ? 'conic-gradient(from 120deg, var(--bronze-bright), var(--ember), var(--bronze-bright))'
            : 'conic-gradient(from 120deg, #2b3340, #1a1f28, #2b3340)',
          opacity: 0.35,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <span className="eyebrow">Fecha {String(league.id).padStart(2, '0')}</span>
        <span className={`badge ${active ? 'badge-active' : 'badge-blocked'}`}>
          {active ? 'Activa' : 'Bloqueada'}
        </span>
      </div>
      <h3 className="h-display" style={{ fontSize: 22, margin: '10px 0 6px', position: 'relative' }}>{league.name}</h3>
      <p style={{ margin: '0 0 12px', color: 'var(--parchment-dim)', fontSize: 13 }}>
        Formato {league.format}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <span style={{ fontSize: 12, color: 'var(--parchment-dim)' }}>Último campeón</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--bronze-bright)', fontWeight: 700 }}>
          {league.lastChampion || '—'}
        </span>
      </div>
    </Link>
  )
}
