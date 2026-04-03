import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, BarChart2, Shield, ArrowRight, Sparkles, Globe } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const STATS = [
  { value: 'R$ 0', label: 'Saldo atual', color: '#6366f1' },
  { value: '0%', label: 'Meta mensal', color: '#10b981' },
  { value: '0', label: 'Lançamentos', color: '#f59e0b' },
]

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Receitas & Despesas',
    desc: 'Controle tudo em tempo real',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: BarChart2,
    title: 'Relatórios Visuais',
    desc: 'Gráficos mensais detalhados',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    desc: 'Seus dados criptografados',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
]

export const LoginPage = () => {
  const { user, loading, signInWithGoogle } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!loading && user) return <Navigate to="/dashboard" replace />

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch {
      setError('Erro ao conectar com o Google. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080c14' }}>

      {/* ─── LEFT PANEL — Hero ─── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #0f1623 50%, #0a1020 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '48px',
        }}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 0 24px rgba(99,102,241,0.5)' }}>
              <Wallet size={19} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">FinanceApp</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <Sparkles size={12} className="text-indigo-400" />
              <span className="text-indigo-300 text-xs font-medium">Controle financeiro inteligente</span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
              Suas finanças,<br />
              <span style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                sob controle.
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-10" style={{ maxWidth: 420 }}>
              Acompanhe receitas, despesas e relatórios em um só lugar. Simples, seguro e sempre sincronizado.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-3" style={{ maxWidth: 420 }}>
              {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: bg }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-700 ml-auto flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats bottom */}
        <div className="relative z-10">
          <div className="flex items-center gap-6">
            {STATS.map(({ value, label, color }) => (
              <div key={label}>
                <p className="text-xl font-bold text-white" style={{ color }}>{value}</p>
                <p className="text-slate-600 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-700 text-xs mt-4">Dados atualizados em tempo real via Supabase</p>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Auth ─── */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 lg:p-16 relative"
        style={{ background: '#080c14' }}>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
            <Wallet size={16} className="text-white" />
          </div>
          <span className="text-white font-bold">FinanceApp</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
          style={{ maxWidth: 380 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
              Bem-vindo de volta 👋
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Faça login para acessar seu painel financeiro e retomar de onde parou.
            </p>
          </div>

          {/* Auth card */}
          <div className="rounded-2xl p-6 mb-5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}>

            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-4">
              Continuar com
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <motion.button
              id="btn-google-login"
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9',
              }}
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isLoading ? 'Conectando...' : 'Continuar com Google'}
            </motion.button>

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-start gap-2">
                <Shield size={12} className="text-slate-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 text-xs leading-relaxed">
                  Usamos o OAuth do Google. Nunca armazenamos sua senha. Seus dados são criptografados e privados.
                </p>
              </div>
            </div>
          </div>

          {/* Divider with OR */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-slate-700 text-xs font-medium">100% gratuito</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: 'Seguro' },
              { icon: Globe, label: 'Online' },
              { icon: TrendingUp, label: 'Real-time' },
            ].map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Icon size={14} className="text-slate-600" />
                <span className="text-slate-600 text-[10px] font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="absolute bottom-6 text-slate-700 text-xs">
          © 2026 FinanceApp · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
