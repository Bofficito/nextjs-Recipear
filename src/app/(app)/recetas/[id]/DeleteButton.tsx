'use client'
import { deleteRecipe } from '@/lib/actions/recipes'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false)

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-stone-400">¿Seguro?</span>
        <button
          onClick={() => deleteRecipe(id)}
          className="text-sm bg-red-600 text-white rounded-xl px-3 py-2 hover:bg-red-700 transition-colors"
        >
          Eliminar
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-sm border border-stone-200 rounded-xl px-3 py-2 hover:border-stone-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1.5 text-sm border border-stone-200 rounded-xl px-3 py-2 hover:border-red-200 hover:text-red-600 transition-colors"
    >
      <Trash2 size={13} />
      Eliminar
    </button>
  )
}