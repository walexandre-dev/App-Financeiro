export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category_id: string | null
  date: string
  created_at: string
  categories?: Category | null
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export interface MonthSummary {
  income: number
  expense: number
  balance: number
}

export interface ChartDataPoint {
  month: string
  income: number
  expense: number
}

export interface CategorySummary {
  category: Category
  total: number
  percentage: number
}
