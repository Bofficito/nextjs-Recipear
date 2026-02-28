export default function RecipeLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-9 w-24 bg-stone-100 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Título */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
          <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-3/4 bg-stone-200 rounded-lg animate-pulse" />
        <div className="h-10 w-1/2 bg-stone-200 rounded-lg animate-pulse" />
      </div>

      {/* Ingredientes */}
      <div className="flex flex-col gap-4">
        <div className="h-3 w-24 bg-stone-100 rounded animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-stone-100">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-200 flex-shrink-0" />
            <div className="h-4 bg-stone-100 rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
          </div>
        ))}
      </div>

      {/* Pasos */}
      <div className="flex flex-col gap-4">
        <div className="h-3 w-24 bg-stone-100 rounded animate-pulse" />
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-stone-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 35}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}