'use client'
import { CATEGORIES, CATEGORY_ICON_COMPONENTS } from '@/lib/types'
import type { Category } from '@/lib/types'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = (searchParams.get('cat') ?? 'Todas') as Category | 'Todas'

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'Todas') {
      params.delete('cat')
    } else {
      params.set('cat', cat)
    }
    router.push(`/?${params.toString()}`)
  }

  const all = ['Todas', ...CATEGORIES] as const

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {all.map((cat) => {
        const isActive = cat === active
        const Icon = cat !== 'Todas' ? CATEGORY_ICON_COMPONENTS[cat as Category] : null

        return (
          <button
            key={cat}
            onClick={() => select(cat)}
            className={`flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full text-sm border transition-colors ${
              isActive
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
          >
            {Icon && <Icon size={13} />}
            {cat}
          </button>
        )
      })}
    </div>
  )
}