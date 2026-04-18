/**
 * Header.jsx
 * Barre de navigation principale de la SPA
 */
export default function Header({ page, setPage }) {
  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'projets', label: 'Projets' },
    { id: 'ajouter', label: 'Ajouter' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center bg-gray-900 text-white px-6 py-3 shadow-lg">
      {/* Marque / Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center flex-shrink-0">
          <img
            src="yass1.jpeg"
            alt="Mame Yacine"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentElement.querySelector('span').style.display = 'flex'
            }}
          />
          <span
            className="text-white font-bold text-sm hidden w-full h-full items-center justify-center"
            style={{ display: 'none' }}
          >
            MY
          </span>
        </div>
        <span className="font-display font-bold text-base tracking-tight">
          Mame Yacine Ndiaye
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              page === item.id
                ? 'text-blue-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
