import { logout } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { UtensilsCrossed, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-stone-200 bg-white px-4 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-stone-900 hover:text-stone-600 transition-colors">
          <UtensilsCrossed size={18} />
          <span className="font-serif text-lg">mis recetas</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs text-stone-400 hidden sm:block">
            {user?.email}
          </span>
          <form>
            <button
              formAction={logout}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-900 transition-colors"
            >
              <LogOut size={14} />
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}