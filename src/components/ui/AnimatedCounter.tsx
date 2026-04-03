import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { formatCurrency } from '../../lib/utils'

interface AnimatedCounterProps {
  value: number
  className?: string
  prefix?: string
  isCurrency?: boolean
  duration?: number
}

export const AnimatedCounter = ({
  value,
  className = '',
  isCurrency = true,
  duration = 1.2,
}: AnimatedCounterProps) => {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (v) =>
    isCurrency ? formatCurrency(v) : v.toFixed(2)
  )
  const [displayValue, setDisplayValue] = useState(
    isCurrency ? formatCurrency(0) : '0.00'
  )
  const prevRef = useRef(0)

  useEffect(() => {
    spring.set(value)
    prevRef.current = value
  }, [value, spring])

  useEffect(() => {
    const unsub = display.on('change', (v) => setDisplayValue(v))
    return unsub
  }, [display])

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {displayValue}
    </motion.span>
  )
}
