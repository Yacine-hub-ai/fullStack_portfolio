/**
 * Serveur Express sans connexion MongoDB — utilisé uniquement pour les tests.
 * Permet d'isoler les tests du réseau et de MongoDB Atlas.
 */
import express from 'express'
import cors from 'cors'
import projetRoutes from './routes.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.get('/', (req, res) => {
  res.json({
    succes: true,
    message: 'API Portfolio opérationnelle',
    version: '1.0.0',
    endpoints: {
      'GET    /api/projets':     'Retourner tous les projets',
      'GET    /api/projets/:id': 'Retourner un projet par id',
      'POST   /api/projets':     'Ajouter un projet',
      'PUT    /api/projets/:id': 'Modifier un projet',
      'DELETE /api/projets/:id': 'Supprimer un projet',
    },
  })
})

app.use('/api/projets', projetRoutes)

app.use((req, res) => {
  res.status(404).json({ succes: false, message: `Route non trouvée : ${req.method} ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err.stack)
  res.status(500).json({ succes: false, message: 'Erreur interne du serveur' })
})

export default app
