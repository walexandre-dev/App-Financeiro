import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-slate-500 pointer-events-none">
              {icon}
            </span>
          )}
          {prefix && (
            <span className="absolute left-3 text-slate-500 text-sm font-medium pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-[#0d1525] border border-white/8 rounded-xl
              text-slate-100 placeholder-slate-600 text-sm
              transition-all duration-150
              focus:outline-none focus:border-indigo-500/60 focus:bg-[#0f1a2e]
              focus:ring-1 focus:ring-indigo-500/20
              ${icon ? 'pl-9' : prefix ? 'pl-8' : 'pl-4'}
              ${suffix ? 'pr-12' : 'pr-4'}
              py-2.5
              ${error ? 'border-red-500/50 focus:border-red-500/60' : ''}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-slate-500 text-sm pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
