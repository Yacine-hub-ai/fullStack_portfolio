/**
 * DetaillerProjet.jsx
 * ─────────────────────────────────────────────────────────────────
 * Composant d'affichage complet d'un projet.
 * Contient :
 *   - Bouton « Annuler » → retour à la liste
 *   - Bouton « Editer » → bascule en mode édition
 *   - Bouton « Supprimer » → demande confirmation
 *
 * Props :
 *   projet       {Object}   - données complètes du projet
 *   onAnnuler    {Function} - retour à la liste
 *   onEditer     {Function} - callback (id, data) → met à jour
 *   onSupprimer  {Function} - callback (id) → supprime
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from 'react'

export default function DetaillerProjet({ projet, onAnnuler, onEditer, onSupprimer }) {
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    libelle: projet.libelle,
    description: projet.description,
    image: projet.image || '',
    technologies: projet.technologies || '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const errs = {}
    if (!form.libelle.trim()) errs.libelle = 'Obligatoire'
    if (!form.description.trim()) errs.description = 'Obligatoire'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setLoading(true)
    try {
      await onEditer(projet.id, {
        libelle: form.libelle.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        technologies: form.technologies.trim(),
      })
      setEditMode(false)
    } finally {
      setLoading(false)
    }
  }

  const tags = (form.technologies || projet.technologies || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  /* ── MODE AFFICHAGE ────────────────────────────────────────── */
  if (!editMode) {
    return (
      <div className="max-w-3xl mx-auto mt-8 mb-12 px-4 fade-up">
        <button
          onClick={onAnnuler}
          className="mb-6 inline-flex items-center gap-1 text-blue-500 hover:underline text-sm"
        >
          ← Retour à la liste
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Image */}
          {projet.image ? (
            <img
              src={projet.image}
              alt={projet.libelle}
              className="w-full h-64 object-cover rounded-lg mb-6 border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className="w-full h-64 bg-gray-100 rounded-lg mb-6 items-center justify-center text-6xl border border-gray-200"
            style={{ display: projet.image ? 'none' : 'flex' }}
          >
            🖼️
          </div>

          {/* Badge */}
          <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Projet #{projet.id}
          </span>

          {/* Titre */}
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-3 leading-tight">
            {projet.libelle}
          </h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            <strong className="text-gray-700">Description : </strong>
            {projet.description}
          </p>

          {/* Technologies */}
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Technologies utilisées
          </h3>
          <ul className="flex flex-wrap gap-2 mb-10">
            {tags.length > 0
              ? tags.map((t) => (
                  <li
                    key={t}
                    className="bg-gray-100 border border-gray-200 px-4 py-1.5 rounded-full text-sm text-gray-700"
                  >
                    {t}
                  </li>
                ))
              : <li className="text-gray-400 text-sm">Non précisé</li>}
          </ul>

          {/* Boutons d'action */}
          <div className="flex gap-3 flex-wrap">
            {/* Annuler → retour liste */}
            <button
              onClick={onAnnuler}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-5 py-2 rounded-lg text-sm transition-colors"
            >
              ← Annuler
            </button>

            {/* Editer → bascule en mode édition */}
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Éditer
            </button>

            {/* Supprimer */}
            <button
              onClick={() => onSupprimer(projet.id)}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2 rounded-lg text-sm transition-colors"
            >
               Supprimer
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── MODE ÉDITION ──────────────────────────────────────────── */
  return (
    <div className="max-w-xl mx-auto mt-8 mb-12 px-4 fade-up">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-800">
          Éditer le projet #{projet.id}
        </h2>
        <p className="text-gray-400 text-sm mt-1">Modifiez les informations du projet</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-5">

        {/* Libellé */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Libellé <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="libelle"
            value={form.libelle}
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
              ${errors.libelle ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.libelle && <p className="text-red-500 text-xs mt-1">{errors.libelle}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y
              ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Image (URL)</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Technologies utilisées
          </label>
          <input
            type="text"
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="HTML, CSS, JavaScript, ..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => { setEditMode(false); setErrors({}) }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow flex items-center justify-center gap-2"
          >
            {loading && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />}
            {loading ? 'Sauvegarde...' : '✓ Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
