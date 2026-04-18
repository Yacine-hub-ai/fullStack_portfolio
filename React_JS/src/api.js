/**
 * api.js
 * ─────────────────────────────────────────────────────────────────
 * Couche d'accès aux données — localStorage (offline) ou json-server
 *
 * Pour passer en mode json-server :
 *   1. npm install -g json-server
 *   2. Créer db.json à la racine :
 *      { "projets": [] }
 *   3. json-server --watch db.json --port 3001
 *   4. Changer API_URL = 'http://localhost:3001'
 * ─────────────────────────────────────────────────────────────────
 */

const API_URL = null // null = localStorage | 'http://localhost:3001' = json-server

const PROJETS_INITIAUX = [
  {
    id: 1,
    libelle: 'Gestion de version avec Git',
    description:
      "La gestion des versions avec Git permet de suivre, d'enregistrer et de gérer les modifications apportées aux fichiers d'un projet au fil du temps.",
    image: '',
    technologies: 'Git, Terminal, GitHub',
  },
  {
    id: 2,
    libelle: 'Routage réseau',
    description:
      "Le routage est le processus par lequel un routeur sélectionne le meilleur chemin pour acheminer des paquets de données d'un point A vers un point B à travers différents réseaux interconnectés.",
    image: '',
    technologies: 'OSPF, BGP, EIGRP, Dijkstra',
  },
  {
    id: 3,
    libelle: 'Serveur Linux Ubuntu',
    description:
      "Un serveur Linux est un ordinateur (physique ou virtuel) qui utilise Linux pour fournir des services, des données ou des ressources à d'autres ordinateurs sur un réseau.",
    image: '',
    technologies: 'Ubuntu, SSH, Ansible, Cockpit',
  },
]

function lsGet() {
  return JSON.parse(localStorage.getItem('projets') || '[]')
}
function lsSet(data) {
  localStorage.setItem('projets', JSON.stringify(data))
}

if (!localStorage.getItem('projets')) {
  lsSet(PROJETS_INITIAUX)
  localStorage.setItem('nextId', '4')
}

const api = {
  /** Récupère tous les projets */
  async getAll() {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets`)
      if (!r.ok) throw new Error('Erreur réseau')
      return r.json()
    }
    return lsGet()
  },

  /** Récupère un projet par id */
  async getById(id) {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets/${id}`)
      if (!r.ok) throw new Error('Projet introuvable')
      return r.json()
    }
    return lsGet().find((p) => p.id == id) || null
  },

  /** Crée un projet */
  async create(data) {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return r.json()
    }
    const all = lsGet()
    const id = parseInt(localStorage.getItem('nextId') || '1')
    const nouveau = { ...data, id }
    lsSet([...all, nouveau])
    localStorage.setItem('nextId', String(id + 1))
    return nouveau
  },

  /** Met à jour un projet */
  async update(id, data) {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id }),
      })
      return r.json()
    }
    const all = lsGet()
    const updated = all.map((p) => (p.id == id ? { ...p, ...data } : p))
    lsSet(updated)
    return updated.find((p) => p.id == id)
  },

  /** Supprime un projet */
  async delete(id) {
    if (API_URL) {
      await fetch(`${API_URL}/projets/${id}`, { method: 'DELETE' })
      return
    }
    lsSet(lsGet().filter((p) => p.id != id))
  },

  /** Recherche par libellé ou technologie */
  async search(query) {
    const all = await this.getAll()
    if (!query.trim()) return all
    const q = query.toLowerCase()
    return all.filter(
      (p) =>
        p.libelle.toLowerCase().includes(q) ||
        (p.technologies && p.technologies.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  },

  /** Statut de la connexion */
  get isOnline() {
    return API_URL !== null
  },
  get endpoint() {
    return API_URL
  },
}

export default api
