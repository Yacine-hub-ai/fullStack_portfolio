/**
 * api.js
 * ──────────────────────────────────────────────────────────────
 * Couche d'accès aux données — abstraction localStorage / json-server
 *
 * MODE OFFLINE  : API_URL = null  → données dans localStorage
 * MODE JSON-SERVER:
 *   1. npm install -g json-server
 *   2. Créer db.json : { "projets": [] }
 *   3. json-server --watch db.json --port 3000
 *   4. Changer API_URL = 'http://localhost:3000'
 * ──────────────────────────────────────────────────────────────
 */

const API_URL = null; // null = localStorage, 'http://localhost:3000' = json-server

const PROJETS_INITIAUX = [
  {
    id: 1,
    libelle: "Gestion de version avec Git",
    description: "La gestion des versions avec Git permet de suivre, d'enregistrer et de gérer les modifications apportées aux fichiers d'un projet au fil du temps.",
    image: "",
    technologies: "Git, Terminal, GitHub"
  },
  {
    id: 2,
    libelle: "Routage réseau",
    description: "Le routage est le processus par lequel un routeur sélectionne le meilleur chemin pour acheminer des paquets de données d'un point A vers un point B à travers différents réseaux interconnectés.",
    image: "",
    technologies: "OSPF, BGP, EIGRP, Dijkstra"
  },
  {
    id: 3,
    libelle: "Serveur Linux Ubuntu",
    description: "Un serveur Linux est un ordinateur (physique ou virtuel) qui utilise Linux pour fournir des services, des données ou des ressources à d'autres ordinateurs sur un réseau.",
    image: "",
    technologies: "Ubuntu, SSH, Ansible, Cockpit"
  }
];

const Api = {

  /** Initialise le localStorage avec les données de démo si vide */
  init() {
    if (!localStorage.getItem('projets')) {
      localStorage.setItem('projets', JSON.stringify(PROJETS_INITIAUX));
      localStorage.setItem('nextId', '4');
    }
  },

  /** Récupère tous les projets */
  async getAll() {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets`);
      if (!r.ok) throw new Error('Erreur réseau : ' + r.status);
      return r.json();
    }
    return JSON.parse(localStorage.getItem('projets') || '[]');
  },

  /** Récupère un projet par son id */
  async getById(id) {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets/${id}`);
      if (!r.ok) throw new Error('Projet introuvable');
      return r.json();
    }
    const projets = JSON.parse(localStorage.getItem('projets') || '[]');
    return projets.find(p => p.id == id) || null;
  },

  /** Crée un nouveau projet */
  async create(data) {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!r.ok) throw new Error('Erreur lors de la création');
      return r.json();
    }
    const projets = JSON.parse(localStorage.getItem('projets') || '[]');
    const id = parseInt(localStorage.getItem('nextId') || '1');
    const nouveau = { ...data, id };
    projets.push(nouveau);
    localStorage.setItem('projets', JSON.stringify(projets));
    localStorage.setItem('nextId', String(id + 1));
    return nouveau;
  },

  /** Supprime un projet par son id */
  async delete(id) {
    if (API_URL) {
      const r = await fetch(`${API_URL}/projets/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Erreur lors de la suppression');
      return;
    }
    let projets = JSON.parse(localStorage.getItem('projets') || '[]');
    projets = projets.filter(p => p.id != id);
    localStorage.setItem('projets', JSON.stringify(projets));
  }
};
