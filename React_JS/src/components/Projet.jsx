/**
 * Projet.jsx
 * ─────────────────────────────────────────────────────────────────
 * Composant chargé d'afficher :
 *   - Le libellé du projet (ancre cliquable → DetaillerProjet)
 *   - L'image du projet
 *   - Les tags de technologies
 *   - Un bouton « Supprimer »
 *
 * Props :
 *   projet       {Object}   - données du projet
 *   onDetail     {Function} - callback (id) → affiche DetaillerProjet
 *   onSupprimer  {Function} - callback (id) → demande confirmation suppression
 * ─────────────────────────────────────────────────────────────────
 */
export default function Projet({ projet, onDetail, onSupprimer }) {
  const tags = projet.technologies
    ? projet.technologies.split(',').map((t) => t.trim())
    : []

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 fade-up flex flex-col">
      {/* Image */}
      {projet.image ? (
        <img
          src={projet.image}
          alt={projet.libelle}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className="w-full h-40 bg-gray-100 items-center justify-center text-4xl"
        style={{ display: projet.image ? 'none' : 'flex' }}
      >
        🖼️
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Libellé — ancre cliquable vers le détail */}
        <button
          onClick={() => onDetail(projet.id)}
          className="text-left text-lg font-bold text-gray-800 hover:text-blue-500 transition-colors mb-1 leading-tight"
        >
          {projet.libelle}
        </button>

        {/* Description (tronquée) */}
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2 flex-1">
          {projet.description}
        </p>

        {/* Tags technologies */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full border border-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onDetail(projet.id)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 px-3 rounded transition-colors"
          >
            Voir détails
          </button>
          <button
            onClick={() => onSupprimer(projet.id)}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm py-1.5 px-3 rounded transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
