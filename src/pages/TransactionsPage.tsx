import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Pencil, Trash2, X, SlidersHorizontal } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { CategoryIcon } from '../components/ui/CategoryIcon'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { Modal } from '../components/ui/Modal'
import { useTransactionStore } from '../store/useTransactionStore'
import { useCategoryStore } from '../store/useCategoryStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatDate } from '../lib/utils'
import type { Transaction } from '../types/database'
import { Select } from '../components/ui/Select'

export const TransactionsPage = () => {
  const { transactions, fetchTransactions, deleteTransaction, setFilters, clearFilters, filters, getFiltered } = useTransactionStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (user) {
      fetchTransactions(user.id)
      fetchCategories(user.id)
    }
  }, [user])

  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => setFilters({ search: val }), 300)
  }, [setFilters])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await deleteTransaction(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  const filtered = getFiltered()
  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  const hasFilters = filters.type !== 'all' || filters.categoryId || filters.search

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Lançamentos</h1>
          <p className="text-slate-500 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
              {filtered.length} registros encontrados
            </span>
          </p>
        </div>
        <Button
          id="btn-add-transaction"
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => { setEditTx(null); setFormOpen(true) }}
          className="hidden sm:flex flex-shrink-0"
        >
          Novo lançamento
        </Button>
      </div>

      {/* Search + Filters */}
      <Card className="mb-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              id="search-transactions"
              placeholder="Buscar lançamentos..."
              icon={<Search size={15} />}
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant={filtersOpen ? 'primary' : 'outline'}
            size="md"
            icon={<SlidersHorizontal size={15} />}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <span className="hidden sm:inline">Filtros</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-indigo-400 ml-1" />}
          </Button>
        </div>

        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                <Select
                  label="Tipo"
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'income', label: 'Receitas' },
                    { value: 'expense', label: 'Despesas' },
                  ]}
                  value={filters.type || 'all'}
                  onChange={(e) => setFilters({ type: e.target.value as any })}
                />
                <Select
                  label="Categoria"
                  options={[
                    { value: '', label: 'Todas' },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  value={filters.categoryId || ''}
                  onChange={(e) => setFilters({ categoryId: e.target.value || undefined })}
                />
                {hasFilters && (
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="md"
                      icon={<X size={14} />}
                      onClick={() => { clearFilters(); setSearchInput('') }}
                      className="w-full"
                    >
                      Limpar
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Summary row */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-emerald-500/[0.08] border border-emerald-500/20 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-[inset_0_1px_0_rgba(16,185,129,0.1)]">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-400 text-xs font-bold">↑</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] font-medium text-emerald-500/70 uppercase tracking-wider">Receitas</span>
              <span className="text-sm font-semibold text-emerald-400 tabular-nums truncate">
                +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
              </span>
            </div>
          </div>
          <div className="bg-red-500/[0.08] border border-red-500/20 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-[inset_0_1px_0_rgba(239,68,68,0.1)]">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-red-400 text-xs font-bold">↓</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] font-medium text-red-500/70 uppercase tracking-wider">Despesas</span>
              <span className="text-sm font-semibold text-red-400 tabular-nums truncate">
                -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <Card padding="none">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
            <Filter size={32} className="opacity-30" />
            <p className="text-sm">
              {transactions.length === 0 ? 'Nenhum lançamento ainda' : 'Nenhum resultado para os filtros aplicados'}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((t) => {
              const cat = categories.find((c) => c.id === t.category_id)
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="group border-b border-white/[0.05] last:border-0"
                >
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-indigo-500/[0.03] transition-all duration-150 rounded-xl mx-1 my-0.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cat ? `${cat.color}22` : '#6366f122', boxShadow: cat ? `0 0 0 1px ${cat.color}18` : '0 0 0 1px #6366f118' }}
                    >
                      <CategoryIcon
                        name={cat?.icon || 'MoreHorizontal'}
                        size={17}
                        style={{ color: cat?.color || '#6366f1' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100 truncate">{t.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {cat && <Badge color={cat.color}>{cat.name}</Badge>}
                        <span className="text-xs text-slate-600">{formatDate(t.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-bold tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditTx(t); setFormOpen(true) }}
                          aria-label="Editar"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteId(t.id)}
                          aria-label="Excluir"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </Card>

      {/* Delete Confirm */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Excluir lançamento"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        }
      >
        <p className="text-slate-400 text-sm">
          Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
        </p>
      </Modal>

      <TransactionForm open={formOpen} editTransaction={editTx} onClose={() => { setFormOpen(false); setEditTx(null) }} />
    </div>
  )
}
