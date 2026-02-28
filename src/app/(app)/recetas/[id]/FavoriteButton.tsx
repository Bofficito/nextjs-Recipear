'use client'
import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '@/lib/actions/recipes'

type Props = {
  id:          string
  isFavorite:  boolean
}

export default function FavoriteButton({ id, isFavorite }: Props) {
  const [active, setActive]   = useState(isFavorite)
  const [, startTransition]   = useTransition()

  function handleToggle() {
    const next = !active
    setActive(next)
    startTransition(() => {
      toggleFavorite(id, next)
    })
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-sm border rounded-xl px-3 py-2 transition-colors ${
        active
          ? 'border-red-200 text-red-400 hover:border-red-300'
          : 'border-stone-200 text-stone-400 hover:border-stone-400'
      }`}
    >
      <Heart size={13} className={active ? 'fill-red-400' : ''} />
      {active ? 'Guardada' : 'Guardar'}
    </button>
  )
}