/**
 * connectdb.js
 * ──────────────────────────────────────────────────────────────
 * Module de connexion à MongoDB via Mongoose.
 * Lit la variable MONGO_URI depuis le fichier .env
 * ──────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Options recommandées Mongoose 8+
      serverSelectionTimeoutMS: 5000, // timeout si MongoDB inaccessible
    })

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`)
    console.log(`   Base de données  : ${conn.connection.name}`)
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`)
    // Quitter le processus si la connexion échoue au démarrage
    process.exit(1)
  }
}

// Événements de connexion Mongoose
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB déconnecté')
})

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnecté')
})

export default connectDB
