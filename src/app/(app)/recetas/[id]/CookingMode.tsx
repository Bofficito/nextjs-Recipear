'use client'
import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ChefHat } from 'lucide-react'
import type { Ingredient } from '@/lib/types'

type Props = {
  title:       string
  steps:       string
  ingredients: Ingredient[]
  onClose:     () => void
}

function parseSteps(steps: string): string[] {
  return steps
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
}

export default function CookingMode({ title, steps, ingredients, onClose }: Props) {
  const parsedSteps = parseSteps(steps)
  const [current, setCurrent] = useState(0)
  const isFirst = current === 0
  const isLast  = current === parsedSteps.length - 1

  // Wake Lock — mantiene la pantalla encendida
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null

    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen')
        }
      } catch {}
    }

    requestWakeLock()

    return () => {
      wakeLock?.release()
    }
  }, [])

  // cerrar con Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && !isLast)  setCurrent(c => c + 1)
      if (e.key === 'ArrowLeft'  && !isFirst) setCurrent(c => c - 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isFirst, isLast, onClose])

  return (
    <div className="fixed inset-0 bg-stone-950 z-50 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800">
        <div className="flex items-center gap-2 text-stone-400">
          <ChefHat size={16} />
          <span className="text-sm font-serif">{title}</span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Paso actual */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Contador */}
        <div className="text-stone-600 text-sm mb-8 tracking-wider uppercase">
          Paso {current + 1} de {parsedSteps.length}
        </div>

        {/* Texto del paso */}
        <p className="text-white text-2xl md:text-3xl font-serif leading-relaxed text-center max-w-2xl">
          {parsedSteps[current]}
        </p>

        {/* Barra de progreso */}
        <div className="flex gap-1.5 mt-12">
          {parsedSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-white w-8'
                  : i < current
                  ? 'bg-stone-600 w-4'
                  : 'bg-stone-800 w-4'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Ingredientes colapsables en la parte inferior */}
      {ingredients.length > 0 && (
        <IngredientDrawer ingredients={ingredients} />
      )}

      {/* Navegación */}
      <div className="flex items-center justify-between px-6 py-6 border-t border-stone-800">
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={isFirst}
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          Anterior
        </button>

        {isLast ? (
          <button
            onClick={onClose}
            className="bg-white text-stone-900 text-sm px-6 py-2.5 rounded-xl hover:bg-stone-100 transition-colors font-medium"
          >
            Terminar
          </button>
        ) : (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors"
          >
            Siguiente
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

function IngredientDrawer({ ingredients }: { ingredients: Ingredient[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-stone-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-stone-400 hover:text-white transition-colors"
      >
        <span className="text-xs uppercase tracking-wider">
          Ingredientes ({ingredients.length})
        </span>
        <ChevronLeft
          size={16}
          className={`transition-transform duration-200 ${open ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>

      {open && (
        <div className="px-6 pb-4 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-stone-300">
              <span className="w-1 h-1 rounded-full bg-stone-600 flex-shrink-0" />
              {[ing.qty, ing.unit, ing.name].filter(Boolean).join(' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}