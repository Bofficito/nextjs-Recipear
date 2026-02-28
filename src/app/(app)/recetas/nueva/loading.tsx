export default function NuevaRecetaLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
      <div className="h-8 w-40 bg-stone-200 rounded-lg animate-pulse" />

      <div className="flex flex-col gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
            <div className="h-12 bg-stone-100 rounded-xl animate-pulse" />
          </div>
        ))}
        <div className="h-12 bg-stone-200 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}