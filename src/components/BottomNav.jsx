import { NavLink } from 'react-router-dom'
import { Home, Users, BarChart2 } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`} id="nav-home">
        <Home size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/people" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`} id="nav-people">
        <Users size={22} />
        <span>People</span>
      </NavLink>
      <NavLink to="/balance" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`} id="nav-balance">
        <BarChart2 size={22} />
        <span>Balance</span>
      </NavLink>
    </nav>
  )
}
