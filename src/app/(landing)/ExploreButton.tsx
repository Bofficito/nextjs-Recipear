'use client'
export default function ExploraButton() {
  function handleClick() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleClick}
      className="bg-stone-900 text-white px-6 py-3 rounded-xl text-sm hover:bg-stone-700 transition-colors"
    >
      Explorá sobre tu Recetario
    </button>
  )
}