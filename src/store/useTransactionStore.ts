import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Transaction, MonthSummary, ChartDataPoint, CategorySummary } from '../types/database'
import { useCategoryStore } from './useCategoryStore'

interface TransactionFilters {
  type?: 'income' | 'expense' | 'all'
  categoryId?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  filters: TransactionFilters

  fetchTransactions: (userId: string) => Promise<void>
  addTransaction: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'categories'>, userId: string) => Promise<void>
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'categories'>>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setFilters: (filters: Partial<TransactionFilters>) => void
  clearFilters: () => void

  // Computed
  getFiltered: () => Transaction[]
  getMonthSummary: (year: number, month: number) => MonthSummary
  getChartData: (months?: number) => ChartDataPoint[]
  getCategorySummary: (year: number, month: number, type: 'income' | 'expense') => CategorySummary[]
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  filters: { type: 'all' },

  fetchTransactions: async (userId) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    if (!error && data) set({ transactions: data as Transaction[], loading: false })
    else set({ loading: false })
  },

  addTransaction: async (data, userId) => {
    const { data: inserted, error } = await supabase
      .from('transactions')
      .insert([{ ...data, user_id: userId }])
      .select('*, categories(*)')
      .single()
    if (!error && inserted) {
      set((s) => ({
        transactions: [inserted as Transaction, ...s.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }))
    }
  },

  updateTransaction: async (id, data) => {
    const { data: updated, error } = await supabase
      .from('transactions')
      .update(data)
      .eq('id', id)
      .select('*, categories(*)')
      .single()
    if (!error && updated) {
      set((s) => ({ transactions: s.transactions.map((t) => (t.id === id ? (updated as Transaction) : t)) }))
    }
  },

  deleteTransaction: async (id) => {
    await supabase.from('transactions').delete().eq('id', id)
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }))
  },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  clearFilters: () => set({ filters: { type: 'all' } }),

  getFiltered: () => {
    const { transactions, filters } = get()
    return transactions.filter((t) => {
      if (filters.type && filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.categoryId && t.category_id !== filters.categoryId) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!t.description.toLowerCase().includes(q)) return false
      }
      if (filters.dateFrom && t.date < filters.dateFrom) return false
      if (filters.dateTo && t.date > filters.dateTo) return false
      return true
    })
  },

  getMonthSummary: (year, month) => {
    const { transactions } = get()
    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const end = new Date(year, month, 0).toISOString().split('T')[0]
    const inRange = transactions.filter((t) => t.date >= start && t.date <= end)
    const income = inRange.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expense = inRange.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return { income, expense, balance: income - expense }
  },

  getChartData: (months = 6) => {
    const result: ChartDataPoint[] = []
    const now = new Date()
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const y = d.getFullYear()
      const m = d.getMonth() + 1
      const summary = get().getMonthSummary(y, m)
      result.push({
        month: `${String(m).padStart(2, '0')}/${String(y).slice(2)}`,
        income: summary.income,
        expense: summary.expense,
      })
    }
    return result
  },

  getCategorySummary: (year, month, type) => {
    const { transactions } = get()
    const categories = useCategoryStore.getState().categories
    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const end = new Date(year, month, 0).toISOString().split('T')[0]
    const inRange = transactions.filter((t) => t.date >= start && t.date <= end && t.type === type)
    const total = inRange.reduce((s, t) => s + Number(t.amount), 0)
    const byCategory: Record<string, number> = {}
    inRange.forEach((t) => {
      const key = t.category_id || 'uncategorized'
      byCategory[key] = (byCategory[key] || 0) + Number(t.amount)
    })
    return Object.entries(byCategory)
      .map(([catId, amount]) => {
        const category = categories.find((c) => c.id === catId) || {
          id: catId, name: 'Sem categoria', icon: 'MoreHorizontal', color: '#64748b',
          user_id: '', created_at: '',
        }
        return { category, total: amount, percentage: total > 0 ? (amount / total) * 100 : 0 }
      })
      .sort((a, b) => b.total - a.total)
  },
}))
