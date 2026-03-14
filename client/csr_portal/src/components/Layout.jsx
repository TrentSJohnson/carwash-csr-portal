import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { to: '/home', label: 'Home', icon: '⌂' },
  { to: '/users', label: 'Users', icon: '👤' },
  { to: '/activity', label: 'Activity', icon: '📈' },
  { to: '/plans', label: 'Plans', icon: '📋' },
  { to: '/transactions', label: 'Trans.', icon: '💳' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <span className="layout-header-logo">≡ CSR Portal</span>
        <span className="layout-header-user">Trent J. 👤</span>
      </header>
      <div className="layout-body">
        <nav className="layout-sidebar">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
              }
            >
              <span className="sidebar-icon">{icon}</span>
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
