import { motion } from 'framer-motion'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'success' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'bg-transparent hover:bg-white/8 text-slate-400 hover:text-slate-100 border border-transparent hover:border-white/8',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40',
  success: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40',
  outline: 'bg-transparent border border-white/12 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-300 hover:text-white',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200 ease-out cursor-pointer select-none will-change-transform
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </motion.button>
  )
}
