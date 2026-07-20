export default function StandingsTable({ rows, highlightTop = 3 }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card" style={{ padding: 28, textAlign: 'center', color: 'var(--parchment-dim)' }}>
        Aún no hay equipos ni resultados registrados. La tabla se llenará fecha tras fecha.
      </div>
    )
  }
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--steel-line)' }}>
            {['#', 'Equipo', 'PJ', 'G', 'P', 'Dif', 'Pts'].map((h, i) => (
              <th
                key={h}
                style={{
                  textAlign: i === 1 ? 'left' : 'center',
                  padding: '14px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--parchment-dim)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.name}
              style={{
                borderBottom: '1px solid rgba(51,60,74,0.5)',
                background: r.position <= highlightTop ? 'rgba(213,154,79,0.06)' : 'transparent',
              }}
            >
              <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: r.position === 1 ? 'var(--bronze-bright)' : 'var(--parchment-dim)' }}>
                {r.position}
              </td>
              <td style={{ padding: '12px', fontWeight: 600 }}>{r.name}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: 'var(--parchment-dim)' }}>{r.played}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: 'var(--emerald)' }}>{r.wins}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: 'var(--ember-bright)' }}>{r.losses}</td>
              <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.diff > 0 ? `+${r.diff}` : r.diff}</td>
              <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--bronze-bright)' }}>{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
