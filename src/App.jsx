import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Standings from './pages/Standings'
import Leagues from './pages/Leagues'
import LeagueDetail from './pages/LeagueDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminGuard from './pages/admin/AdminGuard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTeams from './pages/admin/AdminTeams'
import AdminLeagues from './pages/admin/AdminLeagues'
import AdminMatches from './pages/admin/AdminMatches'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tabla" element={<Standings />} />
        <Route path="/fechas" element={<Leagues />} />
        <Route path="/fechas/:id" element={<LeagueDetail />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/equipos" element={<AdminGuard><AdminTeams /></AdminGuard>} />
        <Route path="/admin/fechas" element={<AdminGuard><AdminLeagues /></AdminGuard>} />
        <Route path="/admin/versus" element={<AdminGuard><AdminMatches /></AdminGuard>} />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}
