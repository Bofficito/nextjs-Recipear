'use client'
import { useState } from 'react'
import { ChefHat } from 'lucide-react'
import CookingMode from './CookingMode'
import type { Ingredient } from '@/lib/types'

type Props = {
  title:       string
  steps:       string
  ingredients: Ingredient[]
}

export default function CookingModeButton({ title, steps, ingredients }: Props) {
  const [active, setActive] = useState(false)

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-1.5 text-sm border border-stone-200 rounded-xl px-3 py-2 hover:border-stone-400 transition-colors"
      >
        <ChefHat size={13} />
        Cocinar
      </button>

      {active && (
        <CookingMode
          title={title}
          steps={steps}
          ingredients={ingredients}
          onClose={() => setActive(false)}
        />
      )}
    </>
  )
}