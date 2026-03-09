'use client'
import { useState } from 'react'
import { FileDown } from 'lucide-react'

export default function DownloadPDFButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(`/api/recipe-pdf/${id}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receta.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm border border-stone-200 rounded-xl px-3 py-2 hover:border-stone-400 transition-colors disabled:opacity-50"
    >
      <FileDown size={13} />
      {loading ? 'Generando...' : 'PDF'}
    </button>
  )
}