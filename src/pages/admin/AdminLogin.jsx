import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'

export default function AdminLogin() {
  const { config, token, setToken } = useData()
  const [pin, setPin] = useState('')
  const [ghToken, setGhToken] = useState(token)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const expectedPin = config?.adminPin || 'forge2024'
    if (pin !== expectedPin) {
      setError('PIN incorrecto.')
      return
    }
    sessionStorage.setItem('forge_admin_authed', '1')
    setToken(ghToken.trim())
    navigate('/admin/panel')
  }

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 460 }}>
      <span className="eyebrow">Acceso restringido</span>
      <h1 className="h-display" style={{ fontSize: 28, margin: '10px 0 20px' }}>Panel Administrador</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24, display: 'grid', gap: 16 }}>
        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--parchment-dim)' }}>
          PIN de administrador
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••••••" required />
        </label>
        <label style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--parchment-dim)' }}>
          GitHub Personal Access Token
          <input
            type="password"
            value={ghToken}
            onChange={(e) => setGhToken(e.target.value)}
            placeholder="ghp_… (permiso repo/contents)"
          />
          <span style={{ fontSize: 11 }}>
            Se usa solo en tu navegador para escribir los archivos JSON en GitHub. Nunca se envía a
            ningún servidor propio y no se guarda de forma permanente.
          </span>
        </label>
        {error && <p style={{ color: 'var(--ember-bright)', fontSize: 13, margin: 0 }}>{error}</p>}
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  )
}
