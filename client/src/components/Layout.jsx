import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/home', label: 'Home', icon: '⌂' },
  { to: '/users', label: 'Users', icon: '👤' },
  { to: '/activity', label: 'Activity', icon: '📈' },
{ to: '/transactions', label: 'Trans.', icon: '💳' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Layout() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-5 h-12 bg-brand text-white shrink-0">
        <span className="font-semibold text-[15px] tracking-[0.5px]">CSR Portal</span>
        <span className="text-[13px] text-dim">Trent J. 👤</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-20 bg-brand flex flex-col pt-3 shrink-0">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2.5 no-underline text-[11px] gap-0.5 transition-colors duration-150 ${
                  isActive
                    ? 'text-white border-l-[3px] border-accent'
                    : 'text-accent-dim hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              <span className="text-[10px]">{label}</span>
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 overflow-auto bg-page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
