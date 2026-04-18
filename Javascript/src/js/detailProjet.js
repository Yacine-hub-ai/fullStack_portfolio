/**
 * detailProjet.js
 * ──────────────────────────────────────────────────────────────
 * Affichage du détail d'un projet :
 *   - detaillerProjet(id) → navigue vers la page détail
 *                           et affiche toutes les infos du projet
 * ──────────────────────────────────────────────────────────────
 */

/**
 * Affiche les caractéristiques complètes d'un projet.
 * Navigue automatiquement vers la page "detail".
 * @param {number|string} id - Identifiant du projet
 */
async function detaillerProjet(id) {
  // Naviguer vers la page détail
  showPage('detail');

  const container = document.getElementById('detail-content');
  container.innerHTML = `
    <div class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>`;

  try {
    const p = await Api.getById(id);
    if (!p) throw new Error('Projet introuvable');

    // Image ou placeholder
    const imgHtml = p.image
      ? `<img src="${escHtml(p.image)}" alt="${escHtml(p.libelle)}"
             class="w-full h-64 object-cover rounded-lg mb-6 border border-gray-200"
             onerror="this.outerHTML='<div class=\\'w-full h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center text-6xl\\'>🖼️</div>'">`
      : `<div class="w-full h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center text-6xl border border-gray-200">🖼️</div>`;

    // Liste des technologies
    const techItems = p.technologies
      ? p.technologies.split(',')
          .map(t => `<li class="bg-gray-100 border border-gray-200 px-4 py-1.5 rounded-full text-sm text-gray-700">${escHtml(t.trim())}</li>`)
          .join('')
      : `<li class="text-gray-400 text-sm">Non précisé</li>`;

    container.innerHTML = `
      ${imgHtml}

      <span class="inline-block bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
        Projet #${escHtml(String(p.id))}
      </span>

      <h2 class="text-3xl font-bold text-gray-800 mb-3 leading-tight">
        ${escHtml(p.libelle)}
      </h2>

      <p class="text-gray-600 leading-relaxed mb-8 text-base">
        <strong class="text-gray-700">Description : </strong>${escHtml(p.description)}
      </p>

      <h3 class="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Technologies utilisées
      </h3>
      <ul class="flex flex-wrap gap-2 mb-10">
        ${techItems}
      </ul>

      <div class="flex gap-3 flex-wrap">
        <button
          onclick="showPage('projets')"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 px-5 py-2 rounded-lg transition-colors text-sm">
          ← Retour à la liste
        </button>
        <button
          onclick="demanderSuppression(${p.id})"
          class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2 rounded-lg transition-colors text-sm">
          🗑 Supprimer ce projet
        </button>
      </div>
    `;

  } catch (err) {
    container.innerHTML = `
      <div class="text-center py-20">
        <div class="text-5xl mb-4">⚠️</div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">${escHtml(err.message)}</h3>
        <button onclick="showPage('projets')"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors text-sm">
          ← Retour à la liste
        </button>
      </div>`;
  }
}
