import { Router } from 'express'
import { ajouterProjet, getTousProjets, getProjetParId, modifierProjet, supprimerProjet } from './controller.js'

const router = Router()

router.route('/').get(getTousProjets).post(ajouterProjet)
router.route('/:id').get(getProjetParId).put(modifierProjet).delete(supprimerProjet)

export default router
