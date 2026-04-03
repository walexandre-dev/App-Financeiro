import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Wallet, Plus, ArrowRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CategoryIcon } from '../components/ui/CategoryIcon'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { useTransactionStore } from '../store/useTransactionStore'
import { useCategoryStore } from '../store/useCategoryStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatDate } from '../lib/utils'
import { useNavigate } from 'react-router-dom'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#141c2e] border border-white/10 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill }} className="font-medium">
          {p.dataKey === 'income' ? '↑ ' : '↓ '}
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.value)}
        </p>
      ))}
    </div>
  )
}

export const DashboardPage = () => {
  const { transactions, fetchTransactions, getMonthSummary, getChartData } = useTransactionStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)

  const now = new Date()
  const summary = getMonthSummary(now.getFullYear(), now.getMonth() + 1)
  const chartData = getChartData(6)
  const recent = transactions.slice(0, 6)

  useEffect(() => {
    if (user) {
      fetchTransactions(user.id)
      fetchCategories(user.id)
    }
  }, [user])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  }
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
  }

  const SUMMARY_CARDS = [
    {
      id: 'balance-card',
      label: 'Saldo do mês',
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? '#6366f1' : '#ef4444',
      bgColor: summary.balance >= 0 ? 'rgba(99,102,241,0.12)' : 'rgba(239,68,68,0.12)',
    },
    {
      id: 'income-card',
      label: 'Receitas',
      value: summary.income,
      icon: TrendingUp,
      color: '#10b981',
      bgColor: 'rgba(16,185,129,0.12)',
    },
    {
      id: 'expense-card',
      label: 'Despesas',
      value: summary.expense,
      icon: TrendingDown,
      color: '#ef4444',
      bgColor: 'rgba(239,68,68,0.12)',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(now)}
          </p>
        </div>
        <Button
          id="btn-new-transaction"
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => setFormOpen(true)}
          className="hidden sm:flex"
        >
          Novo lançamento
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-10"
      >
        {SUMMARY_CARDS.map(({ id, label, value, icon: Icon, color, bgColor }) => (
          <motion.div key={id} variants={itemVariants}>
            <Card className="relative overflow-hidden h-full">
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full -translate-y-10 translate-x-10 opacity-50"
                style={{ background: `radial-gradient(circle, ${bgColor} 0%, transparent 70%)` }}
              />
              <div className="flex items-center gap-3 mb-4">
                <div
                  id={id}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: bgColor, boxShadow: `0 0 16px ${bgColor}` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-sm font-medium text-slate-400">{label}</span>
              </div>
              <AnimatedCounter
                value={value}
                className="text-3xl font-bold text-white"
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-10"
      >
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Evolução Mensal</h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Receitas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Despesas
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={4} barCategoryGap="25%">
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#475569', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card padding="none">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-semibold text-white">Últimos Lançamentos</h2>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Ver todos <ArrowRight size={12} />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
              <Wallet size={32} className="opacity-30" />
              <p className="text-sm">Nenhum lançamento registrado</p>
              <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setFormOpen(true)}>
                Adicionar primeiro
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {recent.map((t) => {
                const cat = categories.find((c) => c.id === t.category_id)
                return (
                  <motion.div
                    key={t.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cat ? `${cat.color}18` : 'rgba(99,102,241,0.12)' }}
                    >
                      <CategoryIcon
                        name={cat?.icon || 'MoreHorizontal'}
                        size={16}
                        style={{ color: cat?.color || '#6366f1' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {cat && <Badge color={cat.color}>{cat.name}</Badge>}
                        <span className="text-xs text-slate-500">{formatDate(t.date)}</span>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </Card>
      </motion.div>

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
