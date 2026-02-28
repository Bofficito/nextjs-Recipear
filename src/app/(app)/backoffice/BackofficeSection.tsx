'use client'
import { useState } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'

type Item = { id: string; label: string; sublabel?: string }
type Field = { name: string; label: string; placeholder?: string; type?: string }

type Props = {
  title:    string
  items:    Item[]
  fields:   Field[]
  onCreate: (formData: FormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function BackofficeSection({
  title, items, fields, onCreate, onDelete,
}: Props) {
  const [open, setOpen]       = useState(false)
  const [adding, setAdding]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  return (
    <section className="border border-stone-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg text-stone-900">{title}</span>
          <span className="text-xs text-stone-400 bg-stone-100 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        </div>
        {open ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
      </button>

      {open && (
        <div className="border-t border-stone-100">
          {/* Lista */}
          <ul className="divide-y divide-stone-100">
            {items.map(item => (
              <li key={item.id} className="flex items-center justify-between px-6 py-3 bg-white">
                <div>
                  <span className="text-sm text-stone-900">{item.label}</span>
                  {item.sublabel && (
                    <span className="text-xs text-stone-400 ml-2">{item.sublabel}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="text-stone-300 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
            {items.length === 0 && (
              <li className="px-6 py-4 text-sm text-stone-400 bg-white">
                Sin elementos
              </li>
            )}
          </ul>

          {/* Formulario de agregar */}
          <div className="border-t border-stone-100 bg-stone-50 px-6 py-4">
            {!adding ? (
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors"
              >
                <Plus size={14} />
                Agregar
              </button>
            ) : (
              <form
                action={async (formData) => {
                  await onCreate(formData)
                  setAdding(false)
                }}
                className="flex flex-col gap-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  {fields.map(field => (
                    <div key={field.name} className="flex flex-col gap-1">
                      <label className="text-xs text-stone-400">{field.label}</label>
                      <input
                        name={field.name}
                        type={field.type ?? 'text'}
                        placeholder={field.placeholder}
                        required={field.name !== 'position' && field.name !== 'icon'}
                        className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="text-sm bg-stone-900 text-white rounded-lg px-4 py-2 hover:bg-stone-700 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="text-sm border border-stone-200 rounded-lg px-4 py-2 hover:border-stone-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}