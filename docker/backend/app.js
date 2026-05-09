import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './connectdb.js'
import projetRoutes from './routes.js'

await connectDB()

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    const autorise =
      !origin ||
      origin === 'null' ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin) ||
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin)
    callback(null, autorise)
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

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
  res.status(500).json({
    succes: false,
    message: 'Erreur interne du serveur',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`)
})

export default app
