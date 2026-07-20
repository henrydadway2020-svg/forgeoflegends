export default function MatchCard({ match, onRegister }) {
  const decided = Boolean(match.winner)
  return (
    <div className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <TeamSlot name={match.teamA} isWinner={match.winner === match.teamA} decided={decided} />
      <div style={{ textAlign: 'center', minWidth: 64 }}>
        {decided ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--bronze-bright)' }}>{match.score}</div>
        ) : (
          <div className="eyebrow" style={{ fontSize: 11 }}>VS</div>
        )}
      </div>
      <TeamSlot name={match.teamB} isWinner={match.winner === match.teamB} decided={decided} align="right" />
      {onRegister && !decided && (
        <button className="btn btn-primary btn-sm" onClick={() => onRegister(match)} style={{ flexShrink: 0 }}>
          Registrar
        </button>
      )}
    </div>
  )
}

function TeamSlot({ name, isWinner, decided, align = 'left' }) {
  return (
    <div style={{ flex: 1, textAlign: align, minWidth: 0 }}>
      <div
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: decided ? (isWinner ? 'var(--emerald)' : 'var(--parchment-dim)') : 'var(--parchment)',
          textDecoration: decided && !isWinner ? 'line-through' : 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {name}
      </div>
    </div>
  )
}
