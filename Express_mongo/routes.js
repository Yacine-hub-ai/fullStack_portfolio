/**
 * routes.js
 * ──────────────────────────────────────────────────────────────
 * Définition des routes de l'API REST Portfolio.
 *
 * Toutes les routes sont préfixées par /api/projets
 * (le préfixe est défini dans app.js)
 *
 * Routes disponibles :
 *   GET    /api/projets          → getTousProjets
 *   GET    /api/projets/:id      → getProjetParId
 *   POST   /api/projets          → ajouterProjet
 *   PUT    /api/projets/:id      → modifierProjet
 *   DELETE /api/projets/:id      → supprimerProjet
 * ──────────────────────────────────────────────────────────────
 */

import { Router } from 'express'
import {
  ajouterProjet,
  getTousProjets,
  getProjetParId,
  modifierProjet,
  supprimerProjet,
} from './controller.js'

const router = Router()

/* ── Routes sur la collection /projets ── */
router
  .route('/')
  .get(getTousProjets)   // GET    /api/projets
  .post(ajouterProjet)   // POST   /api/projets

/* ── Routes sur un projet individuel /projets/:id ── */
router
  .route('/:id')
  .get(getProjetParId)      // GET    /api/projets/:id
  .put(modifierProjet)      // PUT    /api/projets/:id
  .delete(supprimerProjet)  // DELETE /api/projets/:id

export default router
