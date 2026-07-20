import { NavLink } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function Navbar() {
  const { config } = useData()
  return (
    <header style={{ borderBottom: '1px solid var(--steel-line)', position: 'sticky', top: 0, zIndex: 20, background: 'rgba(10,12,16,0.88)', backdropFilter: 'blur(8px)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, gap: 16 }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'conic-gradient(from 210deg, var(--bronze-bright), var(--ember), var(--bronze-bright))',
            display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#1a0d02', fontSize: 15,
          }}>FL</span>
          <span style={{ lineHeight: 1.05 }}>
            <span className="h-display" style={{ display: 'block', fontSize: 15 }}>FORGE OF LEGENDS</span>
            <span className="eyebrow" style={{ fontSize: 10 }}>{config?.edition || 'TOTAL WAR'}</span>
          </span>
        </NavLink>
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            ['/', 'Inicio'],
            ['/tabla', 'Tabla'],
            ['/fechas', 'Eras'],
            ['/admin', 'Admin'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: isActive ? 'var(--bronze-bright)' : 'var(--parchment-dim)',
                background: isActive ? 'rgba(213,154,79,0.12)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
