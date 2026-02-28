'use client'
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { Ingredient } from '@/lib/types'

type Props = {
  ingredients: Ingredient[]
}

function scaleQty(qty: string, factor: number): string {
  // intenta parsear la cantidad como número
  const n = parseFloat(qty.replace(',', '.'))
  if (isNaN(n)) return qty // si no es número, lo deja igual (ej: "al gusto")
  const result = n * factor
  // evita decimales innecesarios: 1.0 → "1", 1.5 → "1.5"
  return Number.isInteger(result) ? String(result) : result.toFixed(1).replace(/\.0$/, '')
}

export default function PortionScaler({ ingredients }: Props) {
  const [portions, setPortions] = useState(1)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-wider text-stone-400">
          Ingredientes
        </h2>

        {/* Control de porciones */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400">porciones</span>
          <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-2 py-1">
            <button
              onClick={() => setPortions(p => Math.max(1, p - 1))}
              disabled={portions === 1}
              className="text-stone-400 hover:text-stone-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={13} />
            </button>
            <span className="text-sm text-stone-900 w-4 text-center">
              {portions}
            </span>
            <button
              onClick={() => setPortions(p => Math.min(20, p + 1))}
              disabled={portions === 20}
              className="text-stone-400 hover:text-stone-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-stone-100">
        {ingredients.map((ing, i) => (
          <li key={i} className="flex items-center gap-3 py-3">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
            <span className="text-stone-900">
              {[
                ing.qty ? scaleQty(ing.qty, portions) : '',
                ing.unit,
                ing.name,
              ].filter(Boolean).join(' ')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}