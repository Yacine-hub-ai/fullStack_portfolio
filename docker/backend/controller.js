import Projet from './model.js'

const erreur = (res, status, message, details = null) => {
  const body = { succes: false, message }
  if (details) body.details = details
  return res.status(status).json(body)
}

export const ajouterProjet = async (req, res) => {
  try {
    const { libelle, description, image, technologies } = req.body
    if (!libelle || !description)
      return erreur(res, 400, 'Le libellé et la description sont obligatoires')
    const projet = await new Projet({ libelle, description, image, technologies }).save()
    return res.status(201).json({ succes: true, message: 'Projet ajouté avec succès', data: projet })
  } catch (error) {
    if (error.name === 'ValidationError')
      return erreur(res, 400, 'Erreur de validation', Object.values(error.errors).map(e => e.message))
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

export const getTousProjets = async (req, res) => {
  try {
    const { recherche, page = 1, limite = 20 } = req.query
    let filtre = {}
    if (recherche) {
      filtre = { $or: [
        { libelle: { $regex: recherche, $options: 'i' } },
        { technologies: { $regex: recherche, $options: 'i' } },
        { description: { $regex: recherche, $options: 'i' } },
      ]}
    }
    const skip = (parseInt(page) - 1) * parseInt(limite)
    const total = await Projet.countDocuments(filtre)
    const projets = await Projet.find(filtre).sort({ dateCreation: -1 }).skip(skip).limit(parseInt(limite))
    return res.status(200).json({ succes: true, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limite)), data: projets })
  } catch (error) {
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

export const getProjetParId = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id)
    if (!projet) return erreur(res, 404, `Aucun projet trouvé avec l'id : ${req.params.id}`)
    return res.status(200).json({ succes: true, data: projet })
  } catch (error) {
    if (error.name === 'CastError') return erreur(res, 400, `ID invalide : ${req.params.id}`)
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

export const modifierProjet = async (req, res) => {
  try {
    const { libelle, description, image, technologies } = req.body
    if (!await Projet.findById(req.params.id))
      return erreur(res, 404, `Aucun projet trouvé avec l'id : ${req.params.id}`)
    const projetMaj = await Projet.findByIdAndUpdate(
      req.params.id,
      { libelle, description, image, technologies },
      { new: true, runValidators: true }
    )
    return res.status(200).json({ succes: true, message: 'Projet mis à jour avec succès', data: projetMaj })
  } catch (error) {
    if (error.name === 'CastError') return erreur(res, 400, `ID invalide : ${req.params.id}`)
    if (error.name === 'ValidationError')
      return erreur(res, 400, 'Erreur de validation', Object.values(error.errors).map(e => e.message))
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}

export const supprimerProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id)
    if (!projet) return erreur(res, 404, `Aucun projet trouvé avec l'id : ${req.params.id}`)
    return res.status(200).json({ succes: true, message: 'Projet supprimé avec succès', data: { id: req.params.id } })
  } catch (error) {
    if (error.name === 'CastError') return erreur(res, 400, `ID invalide : ${req.params.id}`)
    return erreur(res, 500, 'Erreur serveur', error.message)
  }
}
