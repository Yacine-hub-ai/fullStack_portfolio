/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────
 * Composant racine de l'application SPA.
 * Gère :
 *   - La navigation entre les pages (état local `page`)
 *   - L'instanciation du composant Dossier (gestionnaire de projets)
 *   - Les notifications Toast globales
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from 'react'
import Header from './components/Header'
import Dossier from './components/Dossier'
import Toast, { useToast } from './components/Toast'

/* ── Pages statiques ─── */
function PageAccueil({ setPage }) {
  return (
    <div className="fade-up">
      {/* Hero */}
      <section className="bg-white shadow text-center py-20 px-6">
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow-md bg-blue-500 flex items-center justify-center">
            <img
              src="yass1.jpeg"
              alt="Mame Yacine"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                const parent = e.target.parentElement
                parent.querySelector('span').style.display = 'flex'
              }}
            />
            <span
              className="text-white text-3xl font-bold items-center justify-center"
              style={{ display: 'none' }}
            >
              MY
            </span>
          </div>
        </div>
        <h1 className="font-display text-4xl font-extrabold text-gray-800 mb-3">
          Bienvenue sur mon Portfolio
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
          Découvrez mes projets et compétences en développement web, mobile, réseaux et
          administration système.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setPage('projets')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow"
          >
            Voir mes projets →
          </button>
          <button
            onClick={() => setPage('contact')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Me contacter
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        {/* À propos */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">À propos de moi</h2>
          <p className="text-gray-600 leading-relaxed">
            Étudiante en <strong>Réseaux, Services et Systèmes</strong>, je suis passionnée par les
            infrastructures cloud, la virtualisation et l'administration système. Mon parcours couvre
            Linux, Windows Server, les réseaux TCP/IP et les environnements cloud.
          </p>
        </section>

        {/* Compétences */}
        <section className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">Compétences</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {[
              'Web : HTML, CSS, JavaScript',
              'Mobile : Flutter',
              'Design : Figma, Adobe XD',
              'Réseaux : TCP/IP, OSPF, BGP',
              'Systèmes : Linux, Windows Server',
              'Cloud : Virtualisation, Administration',
            ].map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <span className="text-blue-500 font-bold">●</span> {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Projets récents */}
        <section className="mt-6 mb-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">Projets Récents</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><strong>Projet 1 :</strong> Gestion des versions avec Git</li>
            <li><strong>Projet 2 :</strong> Infrastructure réseau avec routage et switching</li>
            <li><strong>Projet 3 :</strong> Serveur Ubuntu avec services web et sécurité</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function PageContact() {
  return (
    <div className="max-w-lg mx-auto mt-12 mb-12 px-4 fade-up">
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Me contacter</h2>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {[
          { icon: '📧', label: 'Email', value: 'nyacine183@gmail.com', href: 'mailto:nyacine183@gmail.com' },
          { icon: '📞', label: 'Téléphone', value: '+221 77 129 73 86' },
          { icon: '📍', label: 'Localisation', value: 'Dakar, Sénégal' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{item.label}</div>
              {item.href
                ? <a href={item.href} className="text-blue-500 hover:underline text-sm font-medium">{item.value}</a>
                : <span className="text-gray-700 text-sm font-medium">{item.value}</span>
              }
            </div>
          </div>
        ))}

        <div className="pt-2">
          <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Réseaux Sociaux</div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: '💼 LinkedIn', href: 'https://www.linkedin.com/in/mame-yacine-ndiaye-301925259/' },
              { label: '🐙 GitHub', href: 'https://github.com/dashboard' },
              { label: '📘 Facebook', href: 'https://www.facebook.com/' },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-500 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   COMPOSANT RACINE
═══════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('accueil')
  const { toast, showToast } = useToast()

  // Pages gérées par Dossier (gestion projets)
  const pagesDossier = ['projets', 'ajouter', 'detail']

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header navigation */}
      <Header page={page} setPage={setPage} />

      {/* Contenu principal */}
      <main className="flex-1">
        {page === 'accueil' && <PageAccueil setPage={setPage} />}
        {page === 'contact' && <PageContact />}

        {/* Le composant Dossier gère projets / ajouter / detail */}
        {pagesDossier.includes(page) && (
          <Dossier page={page} setPage={setPage} showToast={showToast} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center text-sm py-4 mt-6">
        <p>&copy; 2026 Mame Yacine Ndiaye — Fullstack Portfolio</p>
      </footer>

      {/* Notification globale */}
      <Toast toast={toast} />
    </div>
  )
}
