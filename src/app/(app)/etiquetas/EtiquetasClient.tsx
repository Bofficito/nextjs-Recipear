'use client'
import { useState, useTransition } from 'react'
import { createTag, deleteTag } from '@/lib/actions/tags'
import type { Tag } from '@/lib/actions/tags'
import { X, Plus } from 'lucide-react'

const COLORS = [
  '#78716c', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#a855f7',
]

type Props = {
  tags: Tag[]
  maxTags: number | null
}

export default function EtiquetasClient({ tags: initial = [], maxTags }: Props) {
  const [tags, setTags] = useState<Tag[]>(initial)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [, startTransition] = useTransition()
  const atLimit = maxTags !== null && tags.length >= maxTags

  function handleCreate() {
    if (!name.trim()) return
    startTransition(async () => {
      await createTag(name.trim(), color)
      setTags(prev => [...prev, { id: crypto.randomUUID(), name: name.trim(), color }])
      setName('')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTag(id)
      setTags(prev => prev.filter(t => t.id !== id))
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Crear */}
      <div className="flex flex-col gap-3 border border-stone-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-stone-400">Nueva etiqueta</label>
          {maxTags !== null && (
            <span className={`text-xs ${atLimit ? 'text-red-400' : 'text-stone-400'}`}>
              {tags.length}/{maxTags}
            </span>
          )}
        </div>

        {atLimit && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Llegaste al límite de {maxTags} etiquetas del plan Pro. El plan Lifetime tiene etiquetas ilimitadas.
          </p>
        )}

        <div className="flex gap-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="Nombre de la etiqueta..."
            disabled={atLimit}
            className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || atLimit}
            className="flex items-center gap-1.5 bg-stone-900 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-stone-700 disabled:opacity-40 transition-colors"
          >
            <Plus size={14} />
            Crear
          </button>
        </div>
        {/* Selector de color */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Color:</span>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-stone-400' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span
            className="ml-2 text-xs px-2.5 py-1 rounded-lg font-medium"
            style={{ backgroundColor: color + '22', color }}
          >
            {name || 'Preview'}
          </span>
        </div>
      </div>

      {/* Lista */}
      {tags.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-8">Todavía no tenés etiquetas</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag.id}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: tag.color + '22', color: tag.color }}
            >
              {tag.name}
              <button
                onClick={() => handleDelete(tag.id)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}