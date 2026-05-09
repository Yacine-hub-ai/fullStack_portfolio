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
    },
  },
  {
    timestamps: { createdAt: 'dateCreation', updatedAt: 'dateMaj' },
    collection: 'projets',
  }
)

ProjetSchema.index({ libelle: 'text', technologies: 'text' })

export default mongoose.model('Projet', ProjetSchema)
