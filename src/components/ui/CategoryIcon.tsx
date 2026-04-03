import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface CategoryIconProps extends Omit<LucideProps, 'ref'> {
  name: string
}

export const CategoryIcon = ({ name, ...props }: CategoryIconProps) => {
  const Icon = (Icons as any)[name] as React.FC<LucideProps> | undefined
  if (!Icon) return <Icons.MoreHorizontal {...props} />
  return <Icon {...props} />
}

export const AVAILABLE_ICONS = [
  'Banknote', 'Laptop', 'TrendingUp', 'TrendingDown', 'UtensilsCrossed',
  'Car', 'Heart', 'Gamepad2', 'Home', 'BookOpen', 'ShoppingCart',
  'Plane', 'Coffee', 'Music', 'Shirt', 'Smartphone', 'Dumbbell',
  'Gift', 'PiggyBank', 'CreditCard', 'Fuel', 'Stethoscope',
  'GraduationCap', 'Baby', 'Dog', 'Tree', 'MoreHorizontal',
] as const

export const PALETTE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#10b981', '#14b8a6', '#3b82f6', '#06b6d4',
  '#64748b', '#a3a3a3',
]
