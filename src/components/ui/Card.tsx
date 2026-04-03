import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
  none: '',
}

export const Card = ({ children, className = '', hover = false, onClick, padding = 'md' }: CardProps) => {
  const base = `
    rounded-2xl border border-white/[0.07]
    bg-gradient-to-br from-[#161f33] to-[#131b2e]
    shadow-[0_2px_16px_rgba(0,0,0,0.35)]
    ${paddingStyles[padding]}
    ${hover || onClick ? 'cursor-pointer' : ''}
    ${className}
  `

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, borderColor: 'rgba(99,102,241,0.3)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={base}
        onClick={onClick}
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={base}>{children}</div>
}
