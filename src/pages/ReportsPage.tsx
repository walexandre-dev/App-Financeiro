import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, BarChart2, PieChart as PieIcon } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { useTransactionStore } from '../store/useTransactionStore'
import { useCategoryStore } from '../store/useCategoryStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatCurrency } from '../lib/utils'

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export const ReportsPage = () => {
  const { fetchTransactions, getChartData, getCategorySummary } = useTransactionStore()
  const { fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [pieType, setPieType] = useState<'expense' | 'income'>('expense')
  const [chartMonths, setChartMonths] = useState(6)

  useEffect(() => {
    if (user) {
      fetchTransactions(user.id)
      fetchCategories(user.id)
    }
  }, [user])

  const chartData = getChartData(chartMonths)
  const categorySummary = getCategorySummary(year, month, pieType)

  const YEARS = Array.from({ length: 3 }, (_, i) => ({
    value: String(now.getFullYear() - i),
    label: String(now.getFullYear() - i),
  }))
  const MONTHS = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(2000, i)),
  }))

  const handleExportCSV = () => {
    const { transactions } = useTransactionStore.getState()
    const { categories } = useCategoryStore.getState()
    const rows = [
      ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor (R$)'],
      ...transactions.map((t) => {
        const cat = categories.find((c) => c.id === t.category_id)
        return [
          t.date,
          t.type === 'income' ? 'Receita' : 'Despesa',
          t.description,
          cat?.name || '',
          t.amount.toFixed(2).replace('.', ','),
        ]
      }),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(';')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financeiro_${now.getFullYear()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#141c2e] border border-white/10 rounded-xl p-3 text-xs shadow-xl">
        <p className="font-medium text-white mb-1">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.fill || payload[0].fill }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-slate-400 text-sm mt-0.5">Visão analítica das suas finanças</p>
        </div>
        <Button
          id="btn-export-csv"
          variant="outline"
          size="md"
          icon={<Download size={15} />}
          onClick={handleExportCSV}
        >
          <span className="hidden sm:inline">Exportar CSV</span>
        </Button>
      </div>

      {/* Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <BarChart2 size={17} className="text-indigo-400" />
              <h2 className="font-semibold text-white text-sm">Receitas vs Despesas</h2>
            </div>
            <Select
              options={[
                { value: '3', label: 'Últimos 3 meses' },
                { value: '6', label: 'Últimos 6 meses' },
                { value: '12', label: 'Últimos 12 meses' },
              ]}
              value={String(chartMonths)}
              onChange={(e) => setChartMonths(Number(e.target.value))}
              className="w-44 text-xs"
            />
          </div>
          <ResponsiveContainer width="100%" height={220}>
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
              <Bar dataKey="income" name="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Receitas</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />Despesas</span>
          </div>
        </Card>
      </motion.div>

      {/* Pie Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <PieIcon size={17} className="text-indigo-400" />
              <h2 className="font-semibold text-white text-sm">Por Categoria</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 p-1 bg-[#0d1525] rounded-xl">
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPieType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${pieType === t
                        ? t === 'expense'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                        : 'text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    {t === 'expense' ? 'Despesas' : 'Receitas'}
                  </button>
                ))}
              </div>
              <Select
                options={MONTHS}
                value={String(month)}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-36 text-xs"
              />
              <Select
                options={YEARS}
                value={String(year)}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-24 text-xs"
              />
            </div>
          </div>

          {categorySummary.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-slate-500">
              <PieIcon size={36} className="opacity-20" />
              <p className="text-sm">Nenhum dado para o período selecionado</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categorySummary}
                    dataKey="total"
                    nameKey="category.name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                    labelLine={false}
                    label={<CustomPieLabel />}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categorySummary.map((entry, i) => (
                      <Cell key={i} fill={entry.category.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="w-full lg:w-64 space-y-2 lg:max-h-56 overflow-y-auto pr-1">
                {categorySummary.map((entry) => (
                  <div key={entry.category.id} className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.category.color }}
                    />
                    <span className="text-sm text-slate-300 flex-1 truncate">{entry.category.name}</span>
                    <span className="text-xs text-slate-500 tabular-nums">{entry.percentage.toFixed(1)}%</span>
                    <span className="text-xs font-medium text-white tabular-nums ml-1">
                      {formatCurrency(entry.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
