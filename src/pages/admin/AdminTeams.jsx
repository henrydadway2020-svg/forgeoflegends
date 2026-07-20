import { useState } from 'react'
import { useData } from '../../context/DataContext'
import TeamCard from '../../components/TeamCard'

const emptyForm = { id: null, name: '', logo: null }

export default function AdminTeams() {
  const { teams, saveTeams } = useData()
  const [form, setForm] = useState(emptyForm)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function resetForm() {
    setForm(emptyForm)
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, logo: reader.result }))
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (!form.id && teams.length >= 16) {
      setError('Ya hay 16 equipos cargados: el límite de la liga.')
      return
    }
    setBusy(true)
    setError('')
    try {
      let next
      if (form.id) {
        next = teams.map((t) => (t.id === form.id ? { ...t, name: form.name.trim(), logo: form.logo } : t))
      } else {
        const nextId = teams.length ? Math.max(...teams.map((t) => t.id)) + 1 : 1
        next = [...teams, { id: nextId, name: form.name.trim(), logo: form.logo }]
      }
      await saveTeams(next)
      resetForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(team) {
    if (!confirm(`¿Eliminar a ${team.name}? Esto no borra sus partidos ya jugados.`)) return
    setBusy(true)
    setError('')
    try {
      await saveTeams(teams.filter((t) => t.id !== team.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <span className="eyebrow">Panel administrador</span>
      <h1 className="h-display" style={{ fontSize: 28, margin: '10px 0 24px' }}>Equipos ({teams.length}/16)</h1>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 20, display: 'grid', gap: 12, marginBottom: 28, maxWidth: 420 }}>
        <h3 className="h-display" style={{ fontSize: 16, margin: 0 }}>{form.id ? 'Editar equipo' : 'Nuevo equipo'}</h3>
        <input type="text" placeholder="Nombre del equipo" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        <input type="file" accept="image/*" onChange={handleLogoChange} />
        {form.logo && <img src={form.logo} alt="logo" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />}
        {error && <p style={{ color: 'var(--ember-bright)', fontSize: 13, margin: 0 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" disabled={busy} type="submit">{busy ? 'Guardando…' : form.id ? 'Guardar cambios' : 'Crear equipo'}</button>
          {form.id && <button className="btn" type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <div style={{ display: 'grid', gap: 10 }}>
        {teams.map((t) => (
          <TeamCard key={t.id} team={t} onEdit={(team) => setForm(team)} onDelete={handleDelete} />
        ))}
        {teams.length === 0 && <p style={{ color: 'var(--parchment-dim)' }}>Todavía no hay equipos cargados.</p>}
      </div>
    </div>
  )
}
