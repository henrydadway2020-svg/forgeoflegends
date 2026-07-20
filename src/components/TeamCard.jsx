export default function TeamCard({ team, onEdit, onDelete }) {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: team.logo ? `url(${team.logo}) center/cover` : 'linear-gradient(135deg, var(--steel), var(--obsidian-2))',
          display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700,
          border: '1px solid var(--steel-line)',
        }}
      >
        {!team.logo && team.name.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700 }}>{team.name}</div>
        <div style={{ fontSize: 12, color: 'var(--parchment-dim)' }}>ID #{team.id}</div>
      </div>
      {(onEdit || onDelete) && (
        <div style={{ display: 'flex', gap: 6 }}>
          {onEdit && <button className="btn btn-sm" onClick={() => onEdit(team)}>Editar</button>}
          {onDelete && <button className="btn btn-sm btn-danger" onClick={() => onDelete(team)}>Eliminar</button>}
        </div>
      )}
    </div>
  )
}
