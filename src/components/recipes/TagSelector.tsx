'use client'
import type { Tag } from '@/lib/types'
import { Check } from 'lucide-react'

type Props = {
  tags: Tag[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function TagSelector({ tags, selected, onChange }: Props) {
  if (tags.length === 0) return (
    <p className="text-xs text-stone-400">
      Todavía no tenés etiquetas.{' '}
      <a href="/etiquetas" className="underline hover:text-stone-600 transition-colors">
        Crear etiquetas
      </a>
    </p>
  )

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => {
        const isSelected = selected.includes(tag.id)
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all"
            style={isSelected
              ? { backgroundColor: tag.color + '22', color: tag.color, borderColor: tag.color + '66' }
              : { backgroundColor: 'white', color: '#78716c', borderColor: '#e7e5e4' }
            }
          >
            {isSelected && <Check size={11} />}
            {tag.name}
          </button>
        )
      })}
    </div>
  )
}