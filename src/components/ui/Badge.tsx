import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: string
  className?: string
}

export const Badge = ({ children, color, className = '' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={color ? {
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}30`,
      } : undefined}
    >
      {children}
    </span>
  )
}
