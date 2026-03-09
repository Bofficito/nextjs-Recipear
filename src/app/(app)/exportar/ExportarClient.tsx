'use client'
import { useState } from 'react'
import { FileDown, CheckSquare, Square } from 'lucide-react'

type Recipe = {
  id: string
  title: string
  category: string
  time?: string | null
}

export default function ExportarClient({ recipes }: { recipes: Recipe[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(recipes.map(r => r.id)))
  const [loading, setLoading] = useState(false)

  function toggleAll() {
    if (selected.size === recipes.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(recipes.map(r => r.id)))
    }
  }

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleExport() {
    if (selected.size === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/book-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mi-recetario.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  const allSelected = selected.size === recipes.length

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          {allSelected
            ? <CheckSquare size={15} className="text-stone-900" />
            : <Square size={15} />
          }
          {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>
        <span className="text-xs text-stone-400">
          {selected.size} de {recipes.length} seleccionada{selected.size !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2">
        {recipes.map(recipe => {
          const isSelected = selected.has(recipe.id)
          return (
            <button
              key={recipe.id}
              onClick={() => toggle(recipe.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
                isSelected
                  ? 'border-stone-900 bg-white'
                  : 'border-stone-200 bg-white opacity-50'
              }`}
            >
              {isSelected
                ? <CheckSquare size={16} className="text-stone-900 flex-shrink-0" />
                : <Square size={16} className="text-stone-300 flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{recipe.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {recipe.category}{recipe.time ? ` · ${recipe.time}` : ''}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Botón exportar */}
      <div className="sticky bottom-6 mt-2">
        <button
          onClick={handleExport}
          disabled={selected.size === 0 || loading}
          className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 rounded-xl text-sm hover:bg-stone-700 disabled:opacity-40 transition-colors"
        >
          <FileDown size={16} />
          {loading ? 'Generando PDF...' : `Exportar ${selected.size} receta${selected.size !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  )
}