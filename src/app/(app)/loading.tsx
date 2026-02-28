export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-32 bg-stone-200 rounded-lg animate-pulse" />
          <div className="h-4 w-24 bg-stone-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-stone-200 rounded-xl animate-pulse" />
      </div>

      {/* Search + filter */}
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-stone-100 rounded-xl animate-pulse" />
        <div className="h-10 w-40 bg-stone-100 rounded-xl animate-pulse" />
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3">
            <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
            <div className="h-6 w-48 bg-stone-200 rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
              <div className="h-3 w-24 bg-stone-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}