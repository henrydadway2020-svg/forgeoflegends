import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { generateVersusForFecha } from '../../utils/matchmaking'

export default function AdminMatches() {
  const { teams, leagues, matches, saveMatches } = useData()
  const activeLeague = leagues.find((l) => l.status === 'active') || leagues[0]
  const [fechaId, setFechaId] = useState(activeLeague?.id || 1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [drafts, setDrafts] = useState({})

  const teamsById = new Map(teams.map((t) => [t.id, t]))
  const teamName = (id) => teamsById.get(id)?.name || `(equipo eliminado #${id})`

  const fechaMatches = matches
    .map((m, idx) => ({ ...m, _idx: idx }))
    .filter((m) => String(m.date) === String(fechaId))

  const rosterComplete = teams.length === 16
  const canGenerate = rosterComplete && fechaMatches.length === 0

  async function handleGenerate() {
    setBusy(true)
    setError('')
    try {
      const pairs = generateVersusForFecha(teams, Number(fechaId))
      if (pairs.length === 0) {
        setError('No se pudo generar el versus.')
        return
      }
      const newMatches = pairs.map((p) => ({
        date: Number(fechaId),
        teamAId: p.teamAId,
        teamBId: p.teamBId,
        winnerId: null,
        score: null,
      }))
      await saveMatches([...matches, ...newMatches])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function updateDraft(idx, patch) {
    setDrafts((d) => ({ ...d, [idx]: { ...d[idx], ...patch } }))
  }

  async function handleSaveResult(match) {
    const draft = drafts[match._idx]
    if (!draft?.winnerId || !draft?.score) {
      setError('Elige un ganador y escribe el marcador antes de guardar.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const next = matches.map((m, i) =>
        i === match._idx ? { ...m, winnerId: Number(draft.winnerId), score: draft.score } : m
      )
      await saveMatches(next)
      setDrafts((d) => {
        const copy = { ...d }
        delete copy[match._idx]
        return copy
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <span className="eyebrow">Panel administrador</span>
      <h1 className="h-display" style={{ fontSize: 28, margin: '10px 0 24px' }}>Versus y resultados</h1>

      {!rosterComplete && (
        <div className="card" style={{ padding: 16, borderColor: 'var(--ember)', marginBottom: 24, fontSize: 13 }}>
          ⚠️ Tienes {teams.length}/16 equipos cargados. No se puede generar ningún versus hasta
          completar los 16 — así el calendario round-robin queda fijo y nunca vuelve a
          desincronizarse al agregar equipos después.
        </div>
      )}

      <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--parchment-dim)' }}>
          Fecha
          <select value={fechaId} onChange={(e) => setFechaId(e.target.value)}>
            {leagues.map((l) => <option key={l.id} value={l.id}>Fecha {l.id} — {l.name}</option>)}
          </select>
        </label>
        <button className="btn btn-primary" disabled={!canGenerate || busy} onClick={handleGenerate}>
          {fechaMatches.length > 0 ? 'Versus ya generado' : 'Generar versus'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--ember-bright)' }}>{error}</p>}

      <div style={{ display: 'grid', gap: 10 }}>
        {fechaMatches.map((m) => (
          <div key={m._idx} className="card" style={{ padding: 16, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>{teamName(m.teamAId)}</span>
              <span className="eyebrow">VS</span>
              <span>{teamName(m.teamBId)}</span>
            </div>
            {m.winnerId ? (
              <div style={{ fontSize: 13, color: 'var(--emerald)' }}>
                Ganador: <strong>{teamName(m.winnerId)}</strong> · Marcador {m.score}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={drafts[m._idx]?.winnerId || ''}
                  onChange={(e) => updateDraft(m._idx, { winnerId: e.target.value })}
                  style={{ maxWidth: 200 }}
                >
                  <option value="">Elegir ganador…</option>
                  <option value={m.teamAId}>{teamName(m.teamAId)}</option>
                  <option value={m.teamBId}>{teamName(m.teamBId)}</option>
                </select>
                <input
                  type="text"
                  placeholder="Marcador (3-1)"
                  value={drafts[m._idx]?.score || ''}
                  onChange={(e) => updateDraft(m._idx, { score: e.target.value })}
                  style={{ maxWidth: 140 }}
                />
                <button className="btn btn-sm btn-primary" disabled={busy} onClick={() => handleSaveResult(m)}>
                  Guardar resultado
                </button>
              </div>
            )}
          </div>
        ))}
        {fechaMatches.length === 0 && (
          <p style={{ color: 'var(--parchment-dim)' }}>Esta fecha todavía no tiene versus generado.</p>
        )}
      </div>
    </div>
  )
}
