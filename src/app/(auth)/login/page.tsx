import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-serif font-normal text-stone-900 mb-1">
          mis recetas
        </h1>
        <p className="text-sm text-stone-400 mb-8">iniciá sesión para continuar</p>
        <LoginForm />
      </div>
    </div>
  )
}