/**
 * model.js
 * ──────────────────────────────────────────────────────────────
 * Modèle de données Mongoose pour un Projet du portfolio.
 *
 * Champs :
 *   libelle       String  — nom du projet (obligatoire)
 *   description   String  — description détaillée (obligatoire)
 *   image         String  — URL ou chemin de l'image (optionnel)
 *   technologies  String  — technologies séparées par virgule
 *   dateCreation  Date    — date de création (auto)
 *   dateMaj       Date    — date de dernière modification (auto)
 * ──────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose'

const ProjetSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: [true, 'Le libellé est obligatoire'],
      trim: true,
      maxlength: [100, 'Le libellé ne peut pas dépasser 100 caractères'],
    },

    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
    },

    image: {
      type: String,
      trim: true,
      default: '',
    },

    technologies: {
      type: String,
      trim: true,
      default: '',
      // ex: "HTML, CSS, JavaScript, React"
    },
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: {
      createdAt: 'dateCreation',
      updatedAt: 'dateMaj',
    },
    // Nom de la collection dans MongoDB
    collection: 'projets',
  }
)

// Index pour accélérer la recherche par libellé
ProjetSchema.index({ libelle: 'text', technologies: 'text' })

const Projet = mongoose.model('Projet', ProjetSchema)

export default Projet
