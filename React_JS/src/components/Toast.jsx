/**
 * Toast.jsx
 * Composant de notification temporaire (succès / erreur)
 */
import { useEffect, useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type, id: Date.now() })
  }

  return { toast, showToast }
}

export default function Toast({ toast }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(t)
  }, [toast])

  if (!toast || !visible) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 text-white
        ${toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
    >
      {toast.message}
    </div>
  )
}
