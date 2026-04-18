/**
 * Dossier.jsx
 * ─────────────────────────────────────────────────────────────────
 * Composant central de gestion du portfolio.
 * Il est responsable de :
 *   - Stocker la liste des projets (state)
 *   - Charger les projets depuis l'API
 *   - Rechercher des projets
 *   - Ajouter un projet  → délègue à AjouterProjet
 *   - Afficher la liste  → délègue à Projet (x N)
 *   - Afficher le détail → délègue à DetaillerProjet
 *   - Supprimer un projet (avec confirmation)
 *   - Éditer un projet   → délègue à DetaillerProjet (mode edit)
 *
 * Props :
 *   showToast  {Function} - afficher une notification
 *   page       {string}   - page courante ('projets' | 'ajouter')
 *   setPage    {Function} - naviguer vers une autre page
 * ─────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useCallback } from 'react'
import api from '../api'
import Projet from './Projet'
import AjouterProjet from './AjouterProjet'
import DetaillerProjet from './DetaillerProjet'
import ModalConfirm from './ModalConfirm'

export default function Dossier({ showToast, page, setPage }) {
  // ── STATE ──────────────────────────────────────────────────────
  const [projets, setProjets] = useState([])
  const [loading, setLoading] = useState(false)
  const [recherche, setRecherche] = useState('')
  const [projetActif, setProjetActif] = useState(null)   // projet affiché en détail
  const [modalOpen, setModalOpen] = useState(false)
  const [idASupprimer, setIdASupprimer] = useState(null)
  const [apiStatus, setApiStatus] = useState({ online: false, label: 'Chargement...' })

  // ── CHARGEMENT INITIAL ─────────────────────────────────────────
  const chargerProjets = useCallback(async (query = '') => {
    setLoading(true)
    try {
      const data = query ? await api.search(query) : await api.getAll()
      setProjets(data)
      setApiStatus({
        online: true,
        label: api.isOnline ? `Connecté à ${api.endpoint}` : 'Mode localStorage',
      })
    } catch (err) {
      showToast('Erreur de chargement : ' + err.message, 'error')
      setApiStatus({ online: false, label: 'Hors-ligne' })
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (page === 'projets') chargerProjets()
  }, [page, chargerProjets])

  // ── RECHERCHE ──────────────────────────────────────────────────
  function handleRecherche(e) {
    const q = e.target.value
    setRecherche(q)
    chargerProjets(q)
  }

  // ── AJOUTER ───────────────────────────────────────────────────
  async function handleAjouter(data) {
    try {
      const nouveau = await api.create(data)
      setProjets((prev) => [nouveau, ...prev])
      showToast('✓ Projet ajouté avec succès !')
      setPage('projets')
    } catch (err) {
      showToast("Erreur lors de l'ajout : " + err.message, 'error')
      throw err
    }
  }

  // ── DETAIL ────────────────────────────────────────────────────
  async function handleDetail(id) {
    try {
      const p = await api.getById(id)
      setProjetActif(p)
      setPage('detail')
    } catch (err) {
      showToast('Erreur : ' + err.message, 'error')
    }
  }

  // ── ÉDITER ────────────────────────────────────────────────────
  async function handleEditer(id, data) {
    try {
      const mis = await api.update(id, data)
      setProjets((prev) => prev.map((p) => (p.id === id ? mis : p)))
      setProjetActif(mis)
      showToast('✓ Projet mis à jour !')
    } catch (err) {
      showToast('Erreur : ' + err.message, 'error')
      throw err
    }
  }

  // ── SUPPRIMER — demande confirmation ──────────────────────────
  function demanderSuppression(id) {
    setIdASupprimer(id)
    setModalOpen(true)
  }

  async function confirmerSuppression() {
    setModalOpen(false)
    try {
      await api.delete(idASupprimer)
      setProjets((prev) => prev.filter((p) => p.id !== idASupprimer))
      showToast('🗑 Projet supprimé.')
      if (page === 'detail') setPage('projets')
    } catch (err) {
      showToast('Erreur : ' + err.message, 'error')
    } finally {
      setIdASupprimer(null)
    }
  }

  // ── RENDER — PAGE DETAIL ───────────────────────────────────────
  if (page === 'detail' && projetActif) {
    return (
      <>
        <DetaillerProjet
          projet={projetActif}
          onAnnuler={() => setPage('projets')}
          onEditer={handleEditer}
          onSupprimer={demanderSuppression}
        />
        <ModalConfirm
          isOpen={modalOpen}
          onConfirm={confirmerSuppression}
          onCancel={() => setModalOpen(false)}
        />
      </>
    )
  }

  // ── RENDER — PAGE AJOUTER ─────────────────────────────────────
  if (page === 'ajouter') {
    return (
      <AjouterProjet
        onAjouter={handleAjouter}
        onAnnuler={() => setPage('projets')}
      />
    )
  }

  // ── RENDER — PAGE PROJETS (liste) ─────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* En-tête liste */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Mes Projets</h2>
          {/* Statut API */}
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                apiStatus.online ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
            <span className="text-xs text-gray-400">{apiStatus.label}</span>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* Barre de recherche */}
          <input
            type="text"
            value={recherche}
            onChange={handleRecherche}
            placeholder="🔍 Rechercher..."
            className="flex-1 sm:w-56 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* Bouton ajouter */}
          <button
            onClick={() => setPage('ajouter')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow whitespace-nowrap"
          >
            + Nouveau
          </button>
        </div>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner" />
        </div>
      ) : projets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {recherche ? 'Aucun résultat' : 'Aucun projet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {recherche
              ? `Aucun projet ne correspond à "${recherche}"`
              : 'Commencez par ajouter votre premier projet.'}
          </p>
          {!recherche && (
            <button
              onClick={() => setPage('ajouter')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              + Ajouter un projet
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projets.map((p) => (
            <Projet
              key={p.id}
              projet={p}
              onDetail={handleDetail}
              onSupprimer={demanderSuppression}
            />
          ))}
        </div>
      )}

      {/* Modal confirmation suppression */}
      <ModalConfirm
        isOpen={modalOpen}
        onConfirm={confirmerSuppression}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  )
}
