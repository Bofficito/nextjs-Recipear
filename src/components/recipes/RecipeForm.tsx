'use client'
import { useState } from 'react'
import type { Recipe, Ingredient, RecipeInsert, Category, Unit, Method, TimeRange } from '@/lib/types'
import { Plus, X } from 'lucide-react'

type Props = {
  initial?:       Recipe
  onSubmit:       (data: RecipeInsert) => Promise<void>
  pending?:       boolean
  categories:     Category[]
  units:          Unit[]
  methods:        Method[]
  timeRanges:     TimeRange[]
  maxIngredients: number
}

const emptyIngredient = (): Ingredient => ({ qty: '', unit: '', name: '' })

export default function RecipeForm({
  initial, onSubmit, pending,
  categories, units, methods, timeRanges,
  maxIngredients,
}: Props) {
  const [title, setTitle]       = useState(initial?.title ?? '')
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.name ?? '')
  const [method, setMethod]     = useState(initial?.method ?? '')
  const [timeRange, setTimeRange] = useState(initial?.time ?? '')
  const [notes, setNotes]       = useState(initial?.notes ?? '')
  const [steps, setSteps]       = useState(initial?.steps ?? '')
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initial?.ingredients?.length
      ? [...initial.ingredients, emptyIngredient()]
      : [emptyIngredient()]
  )
  const [error, setError] = useState('')

  function updateIngredient(i: number, field: keyof Ingredient, value: string) {
    setIngredients(prev => {
      const updated = prev.map((row, idx) =>
        idx === i ? { ...row, [field]: value } : row
      )
      const last = updated[updated.length - 1]
      const filledCount = updated.filter(ing => ing.name.trim()).length
      // solo agrega fila nueva si no llegó al límite
      if ((last.qty || last.unit || last.name) && filledCount < maxIngredients) {
        updated.push(emptyIngredient())
      }
      return updated
    })
  }

  function removeIngredient(i: number) {
    setIngredients(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('El nombre es obligatorio'); return }
    const filtered = ingredients.filter(ing => ing.name.trim())
    await onSubmit({
      title:       title.trim(),
      category,
      method:      method || null,
      time:        timeRange || null,
      notes:       notes.trim() || null,
      steps:       steps.trim() || null,
      ingredients: filtered,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">Nombre *</label>
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); setError('') }}
          placeholder="Ej: Tarta de espinaca"
          className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      {/* Categoría + Método */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider text-stone-400">Categoría</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer"
          >
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider text-stone-400">Método</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer"
          >
            <option value="">— Sin especificar</option>
            {methods.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tiempo */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">Tiempo</label>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={timeRanges.some(t => t.label === timeRange) ? timeRange : ''}
            onChange={e => setTimeRange(e.target.value)}
            className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer"
          >
            <option value="">Seleccionar...</option>
            {timeRanges.map(t => (
              <option key={t.id} value={t.label}>{t.label}</option>
            ))}
          </select>
          <input
            value={timeRanges.some(t => t.label === timeRange) ? '' : timeRange}
            onChange={e => setTimeRange(e.target.value)}
            placeholder="O escribí: 1h 20min"
            className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
          />
        </div>
        <p className="text-xs text-stone-400">Seleccioná un rango o escribí el tiempo exacto</p>
      </div>

      {/* Nota */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">Nota personal</label>
        <input
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Ej: Receta de la abuela, sin TACC..."
          className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
        />
      </div>

      {/* Ingredientes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-stone-400">Ingredientes</label>
          <span className={`text-xs ${
            ingredients.filter(i => i.name.trim()).length >= maxIngredients
              ? 'text-red-400'
              : 'text-stone-400'
          }`}>
            {ingredients.filter(i => i.name.trim()).length}/{maxIngredients}
          </span>
        </div>
        {ingredients.map((ing, i) => {
          const isLast = i === ingredients.length - 1
          return (
            <div key={i} className="grid grid-cols-[56px_100px_1fr_32px] gap-2 items-center">
              <input
                value={ing.qty}
                onChange={e => updateIngredient(i, 'qty', e.target.value)}
                placeholder="2"
                className="border border-stone-200 rounded-lg px-2 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
              />
              <select
                value={ing.unit}
                onChange={e => updateIngredient(i, 'unit', e.target.value)}
                className="border border-stone-200 rounded-lg px-2 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer"
              >
                {units.map(u => (
                  <option key={u.id} value={u.value}>{u.label}</option>
                ))}
              </select>
              <input
                value={ing.name}
                onChange={e => updateIngredient(i, 'name', e.target.value)}
                placeholder={isLast ? 'Agregar ingrediente...' : ''}
                className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
              />
              {!isLast ? (
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="flex items-center justify-center text-stone-300 hover:text-red-400 transition-colors"
                >
                  <X size={15} />
                </button>
              ) : <div />}
            </div>
          )
        })}
      </div>

      {/* Preparación */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-stone-400">Preparación</label>
        <textarea
          value={steps}
          onChange={e => setSteps(e.target.value)}
          placeholder="Escribí los pasos..."
          rows={6}
          className="border border-stone-200 rounded-xl px-4 py-3 text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-stone-900 text-white rounded-xl py-3 text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {pending ? 'Guardando...' : 'Guardar receta'}
      </button>
    </form>
  )
}