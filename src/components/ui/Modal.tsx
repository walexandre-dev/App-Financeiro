import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  footer?: ReactNode
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export const Modal = ({ open, onClose, title, children, size = 'md', footer }: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`
              relative w-full ${sizeStyles[size]}
              bg-gradient-to-br from-[#141c2e] to-[#111827]
              border border-white/8 rounded-t-3xl sm:rounded-3xl
              shadow-2xl overflow-hidden
            `}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
              {title && <h2 className="text-base font-semibold text-white">{title}</h2>}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto -mr-1"
                onClick={onClose}
                aria-label="Fechar"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="px-6 py-5 overflow-y-auto max-h-[80vh]">
              {children}
            </div>

            {footer && (
              <div className="px-6 pb-5 pt-2 border-t border-white/5">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
