'use client'
import { useState } from 'react'
import { Link as LinkIcon, Loader } from 'lucide-react'
import type { RecipeInsert, Category, Unit } from '@/lib/types'

type Props = {
  categories: Category[]
  units:      Unit[]
  isPro:      boolean
  onImport:   (recipe: RecipeInsert) => void
}

export default function ImportFromUrl({ categories, units, isPro, onImport }: Props) {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleImport() {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/import-recipe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          url,
          categories: categories.map(c => c.name),
          units:      units.map(u => u.value),
        }),
      })
      if (!res.ok) throw new Error()
      const recipe = await res.json()
      onImport(recipe)
    } catch {
      setError('No se pudo importar. Verificá la URL o ingresá la receta manualmente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isPro) {
    return (
      <div className="flex flex-col gap-3">
        <label className="text-xs uppercase tracking-wider text-stone-400">
          Importar desde URL
        </label>
        <div className="border border-stone-200 rounded-xl px-4 py-4 flex items-center justify-between bg-stone-50">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-stone-500">Importá recetas desde cualquier sitio web</span>
            <span className="text-xs text-stone-400">Disponible en el plan Pro</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400 border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white">
            🔒 Pro
          </div>
        </div>
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-stone-100" />
          <span className="text-xs text-stone-300">o cargá manualmente</span>
          <div className="flex-1 h-px bg-stone-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs uppercase tracking-wider text-stone-400">
        Importar desde URL
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            value={url}
            onChange={e => { setUrl(e.target.value); setError('') }}
            placeholder="https://..."
            className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          />
        </div>
        <button
          onClick={handleImport}
          disabled={loading || !url.trim()}
          className="flex items-center gap-2 bg-stone-900 text-white text-sm px-4 rounded-xl hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader size={14} className="animate-spin" /> : 'Importar'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-stone-100" />
        <span className="text-xs text-stone-300">o cargá manualmente</span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>
    </div>
  )
}