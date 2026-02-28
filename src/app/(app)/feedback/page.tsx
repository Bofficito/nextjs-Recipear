import { createClient } from '@/lib/supabase/server'
import FeedbackForm from './FeedbackForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function FeedbackPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/recetario"
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Volver
        </Link>
        <h1 className="font-serif text-3xl text-stone-900">Feedback</h1>
        <p className="text-sm text-stone-400 mt-1">
          Contanos qué pensás, reportá un bug o sugerí algo nuevo.
        </p>
      </div>

      <FeedbackForm userEmail={user?.email ?? ''} />
    </div>
  )
}