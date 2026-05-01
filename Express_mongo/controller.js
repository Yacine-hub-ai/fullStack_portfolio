/**
 * controller.js
 * ──────────────────────────────────────────────────────────────
 * Logique métier de l'API REST Portfolio.
 * Chaque fonction correspond à une route.
 *
 * Fonctions exportées :
 *   ajouterProjet       POST   /api/projets
 *   getTousProjets      GET    /api/projets
 *   getProjetParId      GET    /api/projets/:id
 *   modifierProjet      PUT    /api/projets/:id
 *   supprimerProjet     DELETE /api/projets/:id
 * ──────────────────────────────────────────────────────────────
 */

import Projet from './model.js'

/* ──────────────────────────────────────────────
   Helper : réponse d'erreur standardisée
────────────────────────────────────────────── */
const erreur = (res, status, message, details = null) => {
  const body = { succes: false, message }
  if (details) body.details = details
  return res.status(status).json(body)
}

/* ══════════════════════════════════════════════
   1. AJOUTER UN PROJET
   POST /api/projets
══════════════════════════════════════════════ */
export const ajouterProjet = async (req, res) => {
  try {
    const { libelle, description, image, technologies } = req.body

    // Validation manuelle (en plus de Mongoose)
    if (!libelle || !description) {
      return erreur(res, 400, 'Le libellé et la description sont obligatoires')
    }

    const projet = new Projet({ libelle, description, image, technologies })
    const nouveauProjet = await projet.save()

    return res.status(201).json({
      succes: true,
      message: 'Projet ajouté avec succès',
      data: nouveauProjet,
    })
  } catch (error) {
    // Erreur de validation Mongoose (ex: champ required manquant)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return erreur(res, 400, 'Erreur de validation', messages)
    }
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

/* ══════════════════════════════════════════════
   2. RETOURNER TOUS LES PROJETS
   GET /api/projets
   Query params optionnels :
     ?recherche=mot  → filtre texte sur libellé/technologies
     ?page=1         → pagination
     ?limite=10      → nb de résultats par page
══════════════════════════════════════════════ */
export const getTousProjets = async (req, res) => {
  try {
    const { recherche, page = 1, limite = 20 } = req.query

    // Construction du filtre
    let filtre = {}
    if (recherche) {
      filtre = {
        $or: [
          { libelle: { $regex: recherche, $options: 'i' } },
          { technologies: { $regex: recherche, $options: 'i' } },
          { description: { $regex: recherche, $options: 'i' } },
        ],
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limite)
    const total = await Projet.countDocuments(filtre)
    const projets = await Projet.find(filtre)
      .sort({ dateCreation: -1 }) // plus récent en premier
      .skip(skip)
      .limit(parseInt(limite))

    return res.status(200).json({
      succes: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limite)),
      data: projets,
    })
  } catch (error) {
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

/* ══════════════════════════════════════════════
   3. RETOURNER UN PROJET PAR ID
   GET /api/projets/:id
══════════════════════════════════════════════ */
export const getProjetParId = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id)

    if (!projet) {
      return erreur(res, 404, `Aucun projet trouvé avec l'id : ${req.params.id}`)
    }

    return res.status(200).json({
      succes: true,
      data: projet,
    })
  } catch (error) {
    // ID MongoDB invalide (mauvais format)
    if (error.name === 'CastError') {
      return erreur(res, 400, `ID invalide : ${req.params.id}`)
    }
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

/* ══════════════════════════════════════════════
   4. MODIFIER UN PROJET
   PUT /api/projets/:id
══════════════════════════════════════════════ */
export const modifierProjet = async (req, res) => {
  try {
    const { libelle, description, image, technologies } = req.body

    // Vérification que le projet existe
    const projetExistant = await Projet.findById(req.params.id)
    if (!projetExistant) {
      return erreur(res, 404, `Aucun projet trouvé avec l'id : ${req.params.id}`)
    }

    // Mise à jour (new: true → retourne le document mis à jour)
    const projetMaj = await Projet.findByIdAndUpdate(
      req.params.id,
      { libelle, description, image, technologies },
      {
        new: true,           // retourner le document après modification
        runValidators: true, // appliquer les validations du schéma
      }
    )

    return res.status(200).json({
      succes: true,
      message: 'Projet mis à jour avec succès',
      data: projetMaj,
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return erreur(res, 400, `ID invalide : ${req.params.id}`)
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message)
      return erreur(res, 400, 'Erreur de validation', messages)
    }
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

/* ══════════════════════════════════════════════
   5. SUPPRIMER UN PROJET
   DELETE /api/projets/:id
══════════════════════════════════════════════ */
export const supprimerProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id)

    if (!projet) {
      return erreur(res, 404, `Aucun projet trouvé avec l'id : ${req.params.id}`)
    }

    return res.status(200).json({
      succes: true,
      message: 'Projet supprimé avec succès',
      data: { id: req.params.id },
    })
  } catch (error) {
    if (error.name === 'CastError') {
      return erreur(res, 400, `ID invalide : ${req.params.id}`)
    }
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}
