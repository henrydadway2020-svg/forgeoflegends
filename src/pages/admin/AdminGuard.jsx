import { Navigate } from 'react-router-dom'

export default function AdminGuard({ children }) {
  const authed = sessionStorage.getItem('forge_admin_authed') === '1'
  if (!authed) return <Navigate to="/admin" replace />
  return children
}
