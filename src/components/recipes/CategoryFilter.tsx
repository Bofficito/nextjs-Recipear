'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/types'

export default function CategoryFilter({ categories = [] }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('cat') ?? ''

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value === '') {
      params.delete('cat')
    } else {
      params.set('cat', e.target.value)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <select
      value={active}
      onChange={handleChange}
      className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-600 bg-white outline-none focus:border-stone-400 transition-colors cursor-pointer"
    >
      <option value="">Todas las categorías</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}