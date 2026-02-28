'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const q = searchParams.get('q') ?? ''

  const handleChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }, [router, searchParams])

  return (
    <div className="relative">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      <input
        defaultValue={q}
        onChange={e => handleChange(e.target.value)}
        placeholder="Buscar por nombre o ingrediente..."
        className="w-full border border-stone-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-900 bg-white outline-none focus:border-stone-400 transition-colors"
      />
      {q && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}