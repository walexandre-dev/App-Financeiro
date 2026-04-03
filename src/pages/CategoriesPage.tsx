import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { CategoryIcon, AVAILABLE_ICONS, PALETTE_COLORS } from '../components/ui/CategoryIcon'
import { useCategoryStore } from '../store/useCategoryStore'
import { useAuthStore } from '../store/useAuthStore'
import type { Category } from '../types/database'

interface CategoryFormState {
  name: string
  icon: string
  color: string
}

const INITIAL_FORM: CategoryFormState = {
  name: '',
  icon: 'Tag',
  color: PALETTE_COLORS[0],
}

export const CategoriesPage = () => {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore()
  const { user } = useAuthStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CategoryFormState>(INITIAL_FORM)
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (user) fetchCategories(user.id)
  }, [user])

  const openEdit = (cat: Category) => {
    setEditCat(cat)
    setForm({ name: cat.name, icon: cat.icon, color: cat.color })
    setFormOpen(true)
  }

  const openNew = () => {
    setEditCat(null)
    setForm(INITIAL_FORM)
    setFormOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setNameError('Nome obrigatório'); return }
    setNameError('')
    setLoading(true)
    try {
      if (editCat) {
        await updateCategory(editCat.id, form)
      } else if (user) {
        await addCategory(form, user.id)
      }
      setFormOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await deleteCategory(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Categorias</h1>
          <p className="text-slate-400 text-sm mt-0.5">{categories.length} categorias</p>
        </div>
        <Button
          id="btn-add-category"
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={openNew}
        >
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence initial={false}>
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <Card hover className="group">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <CategoryIcon name={cat.icon} size={20} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{cat.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs text-slate-500">{cat.color}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} aria-label="Editar">
                      <Pencil size={13} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteId(cat.id)} aria-label="Excluir">
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {categories.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
          <Tag size={40} className="opacity-20" />
          <p className="text-sm">Nenhuma categoria ainda</p>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editCat ? 'Editar Categoria' : 'Nova Categoria'}
        footer={
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button variant="primary" className="flex-1" loading={loading} onClick={handleSubmit}>
              {editCat ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          {/* Preview */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${form.color}20`, boxShadow: `0 8px 24px ${form.color}25` }}
            >
              <CategoryIcon name={form.icon} size={28} style={{ color: form.color }} />
            </div>
          </div>

          <Input
            label="Nome"
            placeholder="Ex: Alimentação"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={nameError}
          />

          {/* Icon Picker */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Ícone</label>
            <div className="grid grid-cols-7 gap-2">
              {AVAILABLE_ICONS.map((iconName) => (
                <motion.button
                  key={iconName}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setForm((f) => ({ ...f, icon: iconName }))}
                  title={iconName}
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer
                    transition-all duration-150
                    ${form.icon === iconName
                      ? 'ring-2 ring-offset-1 ring-offset-[#111827]'
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'}
                  `}
                  style={form.icon === iconName ? {
                    backgroundColor: `${form.color}20`,
                    color: form.color,
                    boxShadow: `0 0 0 2px ${form.color}`,
                  } : undefined}
                >
                  <CategoryIcon name={iconName} size={16} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Cor</label>
            <div className="flex flex-wrap gap-2">
              {PALETTE_COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  className="w-8 h-8 rounded-full cursor-pointer transition-transform"
                  style={{
                    backgroundColor: color,
                    boxShadow: form.color === color ? `0 0 0 3px #111827, 0 0 0 5px ${color}` : 'none',
                    transform: form.color === color ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Excluir categoria"
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>Excluir</Button>
          </div>
        }
      >
        <p className="text-slate-400 text-sm">
          Excluir esta categoria não apagará os lançamentos vinculados, apenas removerá a classificação deles.
        </p>
      </Modal>
    </div>
  )
}
