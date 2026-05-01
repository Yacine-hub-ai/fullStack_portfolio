/**
 * app.js
 * ──────────────────────────────────────────────────────────────
 * Point d'entrée de l'API REST Portfolio
 * Framework : Express JS
 * Base de données : MongoDB via Mongoose
 *
 * Démarrage :
 *   npm run dev   (développement avec nodemon)
 *   npm start     (production)
 * ──────────────────────────────────────────────────────────────
 */

import 'dotenv/config'           // Charge les variables du fichier .env
import express from 'express'
import cors from 'cors'
import connectDB from './connectdb.js'
import projetRoutes from './routes.js'

/* ── Connexion à MongoDB ── */
await connectDB()

/* ── Création de l'application Express ── */
const app = express()

/* ══════════════════════════════════════════════
   MIDDLEWARES GLOBAUX
══════════════════════════════════════════════ */

// Autoriser les requêtes cross-origin (depuis le front React/Vanilla JS)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

// Parser le corps des requêtes en JSON
app.use(express.json())

// Parser les données de formulaires URL-encoded
app.use(express.urlencoded({ extended: true }))

/* ══════════════════════════════════════════════
   ROUTES
══════════════════════════════════════════════ */

// Route de santé — vérifier que l'API tourne
app.get('/', (req, res) => {
  res.json({
    succes: true,
    message: '🚀 API Portfolio opérationnelle',
    version: '1.0.0',
    endpoints: {
      'GET    /api/projets':       'Retourner tous les projets',
      'GET    /api/projets/:id':   'Retourner un projet par id',
      'POST   /api/projets':       'Ajouter un projet',
      'PUT    /api/projets/:id':   'Modifier un projet',
      'DELETE /api/projets/:id':   'Supprimer un projet',
    },
  })
})

// Routes projets (préfixe /api/projets)
app.use('/api/projets', projetRoutes)

/* ══════════════════════════════════════════════
   MIDDLEWARE 404 — route non trouvée
══════════════════════════════════════════════ */
app.use((req, res) => {
  res.status(404).json({
    succes: false,
    message: `Route non trouvée : ${req.method} ${req.originalUrl}`,
  })
})

/* ══════════════════════════════════════════════
   MIDDLEWARE GESTION D'ERREURS GLOBALES
══════════════════════════════════════════════ */
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err.stack)
  res.status(500).json({
    succes: false,
    message: 'Erreur interne du serveur',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

/* ══════════════════════════════════════════════
   DÉMARRAGE DU SERVEUR
══════════════════════════════════════════════ */
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('─────────────────────────────────────────')
  console.log(`🚀 Serveur Express démarré`)
  console.log(`   URL     : http://localhost:${PORT}`)
  console.log(`   API     : http://localhost:${PORT}/api/projets`)
  console.log(`   Mode    : ${process.env.NODE_ENV}`)
  console.log('─────────────────────────────────────────')
})

export default app
