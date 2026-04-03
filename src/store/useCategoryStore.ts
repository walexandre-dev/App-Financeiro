import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Category } from '../types/database'

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
  { name: 'Salário', icon: 'Banknote', color: '#10b981' },
  { name: 'Freelance', icon: 'Laptop', color: '#6366f1' },
  { name: 'Investimentos', icon: 'TrendingUp', color: '#8b5cf6' },
  { name: 'Alimentação', icon: 'UtensilsCrossed', color: '#f59e0b' },
  { name: 'Transporte', icon: 'Car', color: '#3b82f6' },
  { name: 'Saúde', icon: 'Heart', color: '#ef4444' },
  { name: 'Lazer', icon: 'Gamepad2', color: '#ec4899' },
  { name: 'Moradia', icon: 'Home', color: '#14b8a6' },
  { name: 'Educação', icon: 'BookOpen', color: '#f97316' },
  { name: 'Outros', icon: 'MoreHorizontal', color: '#64748b' },
]

interface CategoryState {
  categories: Category[]
  loading: boolean
  fetchCategories: (userId: string) => Promise<void>
  addCategory: (data: Omit<Category, 'id' | 'user_id' | 'created_at'>, userId: string) => Promise<void>
  updateCategory: (id: string, data: Partial<Pick<Category, 'name' | 'icon' | 'color'>>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  seedDefaults: (userId: string) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  fetchCategories: async (userId) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    if (!error && data) {
      set({ categories: data as Category[], loading: false })
      if (data.length === 0) await get().seedDefaults(userId)
    } else {
      set({ loading: false })
    }
  },

  addCategory: async (data, userId) => {
    const { data: inserted, error } = await supabase
      .from('categories')
      .insert([{ ...data, user_id: userId }])
      .select()
      .single()
    if (!error && inserted) {
      set((s) => ({ categories: [...s.categories, inserted as Category].sort((a, b) => a.name.localeCompare(b.name)) }))
    }
  },

  updateCategory: async (id, data) => {
    const { data: updated, error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (!error && updated) {
      set((s) => ({ categories: s.categories.map((c) => (c.id === id ? (updated as Category) : c)) }))
    }
  },

  deleteCategory: async (id) => {
    await supabase.from('categories').delete().eq('id', id)
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
  },

  seedDefaults: async (userId) => {
    const rows = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId }))
    const { data, error } = await supabase.from('categories').insert(rows).select()
    if (!error && data) set({ categories: data as Category[] })
  },
}))
