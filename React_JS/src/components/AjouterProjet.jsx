/**
 * AjouterProjet.jsx
 * ─────────────────────────────────────────────────────────────────
 * Composant formulaire pour ajouter un nouveau projet.
 *
 * Props :
 *   onAjouter   {Function} - callback (data) → appelé à la soumission
 *   onAnnuler   {Function} - retour à la liste
 * ─────────────────────────────────────────────────────────────────
 */
import { useState, useRef } from 'react'

export default function AjouterProjet({ onAjouter, onAnnuler }) {
  const [form, setForm] = useState({
    libelle: '',
    description: '',
    imageUrl: '',
    technologies: '',
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function validate() {
    const errs = {}
    if (!form.libelle.trim()) errs.libelle = 'Le libellé est obligatoire'
    if (!form.description.trim()) errs.description = 'La description est obligatoire'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const image = form.imageUrl.trim() || preview || ''
      await onAjouter({
        libelle: form.libelle.trim(),
        description: form.description.trim(),
        image,
        technologies: form.technologies.trim(),
      })
      setForm({ libelle: '', description: '', imageUrl: '', technologies: '' })
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 mb-10 px-4 fade-up">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-gray-800">Ajouter un projet</h2>
        <p className="text-gray-400 text-sm mt-1">
          Renseignez les informations de votre nouveau projet
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5">

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
            placeholder="Nom du projet"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
              ${errors.libelle ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.libelle && (
            <p className="text-red-500 text-xs mt-1">{errors.libelle}</p>
          )}
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
            placeholder="Décrivez votre projet..."
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y
              ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Image (URL)
          </label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://... (optionnel)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Image fichier */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            — ou choisir un fichier
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Aperçu"
              className="mt-3 w-full h-40 object-cover rounded-lg border border-gray-200"
            />
          )}
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
            onClick={onAnnuler}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow flex items-center justify-center gap-2"
          >
            {loading && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />}
            {loading ? 'En cours...' : 'Ajouter le projet'}
          </button>
        </div>
      </form>
    </div>
  )
}
