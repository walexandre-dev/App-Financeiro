import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Check } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { CategoryIcon } from '../ui/CategoryIcon'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useCategoryStore } from '../../store/useCategoryStore'
import { useAuthStore } from '../../store/useAuthStore'
import type { Transaction } from '../../types/database'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  editTransaction?: Transaction | null
}

export const TransactionForm = ({ open, onClose, editTransaction }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useTransactionStore()
  const { categories } = useCategoryStore()
  const { user } = useAuthStore()

  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type)
      setAmount(String(editTransaction.amount))
      setDescription(editTransaction.description)
      setCategoryId(editTransaction.category_id || '')
      setDate(editTransaction.date)
    } else {
      setType('expense')
      setAmount('')
      setDescription('')
      setCategoryId('')
      setDate(new Date().toISOString().split('T')[0])
    }
    setErrors({})
  }, [editTransaction, open])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Valor inválido'
    if (!description.trim()) e.description = 'Descrição obrigatória'
    if (!date) e.date = 'Data obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || !user) return
    setLoading(true)
    try {
      const data = {
        type,
        amount: Number(amount),
        description: description.trim(),
        category_id: categoryId || null,
        date,
      }
      if (editTransaction) {
        await updateTransaction(editTransaction.id, data)
      } else {
        await addTransaction(data, user.id)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
      footer={
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            className="flex-1"
            loading={loading}
            onClick={handleSubmit}
            icon={<Check size={16} />}
          >
            {editTransaction ? 'Salvar' : 'Adicionar'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-[#0d1525] rounded-2xl">
          {(['expense', 'income'] as const).map((t) => (
            <motion.button
              key={t}
              onClick={() => setType(t)}
              whileTap={{ scale: 0.97 }}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 cursor-pointer
                ${type === t
                  ? t === 'income'
                    ? 'bg-emerald-500/15 text-emerald-400 shadow-lg'
                    : 'bg-red-500/15 text-red-400 shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'}
              `}
            >
              {t === 'income' ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
              {t === 'income' ? 'Receita' : 'Despesa'}
            </motion.button>
          ))}
        </div>

        {/* Amount */}
        <Input
          label="Valor"
          type="number"
          placeholder="0,00"
          prefix="R$"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          inputMode="decimal"
          step="0.01"
          min="0"
        />

        {/* Description */}
        <Input
          label="Descrição"
          placeholder="Ex: Mercado, salário..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Categoria</label>
          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryId(cat.id === categoryId ? '' : cat.id)}
                className={`
                  flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium
                  border transition-all duration-150 cursor-pointer
                  ${categoryId === cat.id
                    ? 'border-opacity-50 scale-[1.02]'
                    : 'border-white/5 hover:border-white/10 text-slate-400'}
                `}
                style={categoryId === cat.id ? {
                  backgroundColor: `${cat.color}18`,
                  borderColor: `${cat.color}50`,
                  color: cat.color,
                } : undefined}
              >
                <CategoryIcon name={cat.icon} size={16} />
                <span className="truncate w-full text-center leading-tight">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Date */}
        <Input
          label="Data"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
      </div>
    </Modal>
  )
}
