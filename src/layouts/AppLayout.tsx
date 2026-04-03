import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, List, Tag, BarChart3, LogOut,
  Wallet, Plus, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useState } from 'react'
import { TransactionForm } from '../components/transactions/TransactionForm'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Visão geral' },
  { to: '/transactions', icon: List, label: 'Lançamentos', desc: 'Histórico' },
  { to: '/categories', icon: Tag, label: 'Categorias', desc: 'Organizar' },
  { to: '/reports', icon: BarChart3, label: 'Relatórios', desc: 'Análises' },
]

export const AppLayout = () => {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex w-full min-h-screen" style={{ background: '#080c14' }}>

      {/* ─── SIDEBAR ─── */}
      <aside
        className="hidden lg:flex flex-none flex-col w-[240px] h-screen sticky top-0 z-30"
        style={{
          background: 'rgba(11,16,28,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
          >
            <Wallet size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight tracking-tight">FinanceApp</p>
            <p className="text-[10px] text-slate-600 leading-tight">Controle financeiro</p>
          </div>
        </div>

        {/* New transaction button */}
        <div className="px-3 pt-4 pb-2">
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFormOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}
          >
            <Plus size={15} />
            Novo lançamento
          </motion.button>
        </div>

        {/* Section label */}
        <div className="px-5 pt-4 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-700">Menu</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-4 space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 group"
                  style={isActive ? {
                    background: 'rgba(99,102,241,0.12)',
                    color: '#a5b4fc',
                    borderLeft: '2px solid #6366f1',
                  } : {
                    color: '#64748b',
                    borderLeft: '2px solid transparent',
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  <span className="flex-1 truncate">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: '#6366f1' }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full flex-shrink-0 ring-1 ring-white/10" />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-600 truncate leading-tight">{user?.email}</p>
            </div>
            <ChevronRight size={12} className="text-slate-700 flex-shrink-0" />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer"
            style={{ color: '#475569' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f87171'
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#475569'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={13} />
            <span>Sair da conta</span>
          </motion.button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main
        className="flex-1 min-w-0 mb-16 lg:mb-0 min-h-screen flex flex-col overflow-x-hidden"
        style={{ background: '#080c14' }}
      >
        {/* Top bar (mobile header) */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-20"
          style={{ background: 'rgba(8,12,20,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
              <Wallet size={13} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm">FinanceApp</span>
          </div>
        </div>

        <div className="flex-1 w-full px-5 sm:px-8 lg:px-10 py-10">
          <Outlet />
        </div>
      </main>

      {/* FAB — mobile */}
      <motion.button
        id="fab-add-transaction"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05, y: -2 }}
        onClick={() => setFormOpen(true)}
        className="fixed right-5 bottom-[76px] lg:hidden z-40 w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
          boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
        }}
      >
        <Plus size={22} className="text-white" />
      </motion.button>

      {/* Bottom Nav — mobile */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex"
        style={{ background: 'rgba(8,12,20,0.97)', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
      >
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="flex-1">
            {({ isActive }) => (
              <div
                className="flex flex-col items-center gap-0.5 py-2.5 transition-all duration-150"
                style={{ color: isActive ? '#818cf8' : '#475569' }}
              >
                <div
                  className="relative p-1.5 rounded-xl"
                  style={isActive ? { background: 'rgba(99,102,241,0.12)' } : {}}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(99,102,241,0.12)' }}
                    />
                  )}
                  <Icon size={18} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
