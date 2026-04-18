/**
 * ModalConfirm.jsx
 * Modal de confirmation générique (utilisé pour la suppression)
 */
export default function ModalConfirm({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-11/12 text-center fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-3">🗑</div>
        <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
          Supprimer le projet ?
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          {message || 'Cette action est irréversible.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}
