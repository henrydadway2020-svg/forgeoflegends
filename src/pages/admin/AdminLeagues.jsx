import { useState } from 'react'
import { useData } from '../../context/DataContext'

export default function AdminLeagues() {
  const { leagues, saveLeagues } = useData()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function setActive(id) {
    setBusy(true)
    setError('')
    try {
      const next = leagues.map((l) => ({ ...l, status: l.id === id ? 'active' : l.status === 'active' ? 'blocked' : l.status }))
      await saveLeagues(next)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function toggleBlocked(id) {
    setBusy(true)
    setError('')
    try {
      const next = leagues.map((l) =>
        l.id === id ? { ...l, status: l.status === 'blocked' ? 'unlocked' : 'blocked' } : l
      )
      await saveLeagues(next)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <span className="eyebrow">Panel administrador</span>
      <h1 className="h-display" style={{ fontSize: 28, margin: '10px 0 24px' }}>Fechas</h1>
      {error && <p style={{ color: 'var(--ember-bright)' }}>{error}</p>}
      <div style={{ display: 'grid', gap: 10 }}>
        {leagues.map((l) => (
          <div key={l.id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700 }}>Fecha {l.id} — {l.name}</div>
              <div style={{ fontSize: 12, color: 'var(--parchment-dim)' }}>{l.format} · {l.status}</div>
            </div>
            <button className="btn btn-sm" disabled={busy || l.status === 'active'} onClick={() => setActive(l.id)}>
              {l.status === 'active' ? 'Es la activa' : 'Marcar activa'}
            </button>
            <button className="btn btn-sm" disabled={busy || l.status === 'active'} onClick={() => toggleBlocked(l.id)}>
              {l.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
