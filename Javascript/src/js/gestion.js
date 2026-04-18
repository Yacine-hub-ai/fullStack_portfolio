/**
 * gestionProjet.js
 * ──────────────────────────────────────────────────────────────
 * Gestion des projets :
 *   - creerProjet()    → construit le nœud DOM d'une carte projet
 *   - afficherProjets() → charge et affiche tous les projets
 *   - ajouterProjet()  → ajoute un projet en mémoire + interface
 *   - supprimerProjet() → supprime un projet de la mémoire + interface
 * ──────────────────────────────────────────────────────────────
 */

/**
 * Crée un nœud DOM (carte projet) et le retourne.
 * @param {Object} projet - { id, libelle, description, image, technologies }
 * @returns {HTMLElement}
 */
function creerProjet(projet) {
  const card = document.createElement('div');
  card.id = `projet-${projet.id}`;
  card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer';

  // Image ou placeholder
  const imgHtml = projet.image
    ? `<img src="${escHtml(projet.image)}" alt="${escHtml(projet.libelle)}"
           class="w-full h-40 object-cover"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    + `<div class="w-full h-40 bg-gray-100 hidden items-center justify-center text-4xl">🖼️</div>`
    : `<div class="w-full h-40 bg-gray-100 flex items-center justify-center text-4xl">🖼️</div>`;

  // Tags technologies
  const tags = projet.technologies
    ? projet.technologies.split(',')
        .map(t => `<span class="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full border border-blue-200">${escHtml(t.trim())}</span>`)
        .join('')
    : '';

  card.innerHTML = `
    ${imgHtml}
    <div class="p-4">
      <h3 class="text-lg font-bold text-gray-800 mb-1 hover:text-blue-500 transition-colors">
        ${escHtml(projet.libelle)}
      </h3>
      <p class="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
        ${escHtml(projet.description)}
      </p>
      <div class="flex flex-wrap gap-1 mb-4">${tags}</div>
      <div class="flex gap-2">
        <button
          onclick="detaillerProjet(${projet.id})"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 px-3 rounded transition-colors">
          Voir détails
        </button>
        <button
          onclick="demanderSuppression(${projet.id})"
          class="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm py-1.5 px-3 rounded transition-colors">
          Supprimer
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Charge tous les projets via l'API et les affiche dans la grille.
 * Insère les cartes dans l'ordre inverse (dernier ajouté en premier).
 */
async function afficherProjets() {
  const grid = document.getElementById('projets-grid');
  grid.innerHTML = `
    <div class="col-span-3 flex justify-center items-center py-16">
      <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>`;

  try {
    const projets = await Api.getAll();

    if (projets.length === 0) {
      grid.innerHTML = `
        <div class="col-span-3 text-center py-20">
          <div class="text-5xl mb-4">📂</div>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Aucun projet</h3>
          <p class="text-gray-400 mb-6">Commencez par ajouter votre premier projet.</p>
          <button onclick="showPage('ajouter')"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            + Ajouter un projet
          </button>
        </div>`;
      return;
    }

    grid.innerHTML = '';
    // Afficher en ordre inverse : dernier ajouté en premier
    [...projets].reverse().forEach(p => {
      grid.appendChild(creerProjet(p));
    });

  } catch (err) {
    grid.innerHTML = `
      <div class="col-span-3 text-center py-20">
        <div class="text-5xl mb-4">⚠️</div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Erreur de chargement</h3>
        <p class="text-gray-400">${escHtml(err.message)}</p>
      </div>`;
  }
}

/**
 * Lit le formulaire, valide, appelle Api.create(),
 * insère la carte en tête de grille et réinitialise le formulaire.
 */
async function ajouterProjet() {
  const libelle      = document.getElementById('f-libelle').value.trim();
  const description  = document.getElementById('f-description').value.trim();
  const imageUrl     = document.getElementById('f-image-url').value.trim();
  const technologies = document.getElementById('f-technologies').value.trim();
  const fileInput    = document.getElementById('f-image-file');

  if (!libelle || !description) {
    showToast('Le libellé et la description sont obligatoires.', 'error');
    return;
  }

  const btn = document.getElementById('btn-ajouter');
  btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>En cours...`;
  btn.disabled = true;

  // Priorité : URL saisie → fichier uploadé → vide
  let image = imageUrl;
  if (!image && fileInput.files[0]) {
    image = await lireImageBase64(fileInput.files[0]);
  }

  try {
    const nouveau = await Api.create({ libelle, description, image, technologies });

    // Insérer en premier dans la grille
    const grid = document.getElementById('projets-grid');
    if (grid.querySelector('[class*="col-span"]')) {
      grid.innerHTML = '';
    }
    const card = creerProjet(nouveau);
    grid.insertBefore(card, grid.firstChild);

    // Réinitialiser le formulaire
    document.getElementById('f-libelle').value      = '';
    document.getElementById('f-description').value  = '';
    document.getElementById('f-image-url').value    = '';
    document.getElementById('f-image-file').value   = '';
    document.getElementById('f-technologies').value = '';
    document.getElementById('f-preview').classList.add('hidden');

    showToast('✓ Projet ajouté avec succès !');
    showPage('projets');

  } catch (err) {
    showToast("Erreur lors de l'ajout : " + err.message, 'error');
  } finally {
    btn.innerHTML = 'Ajouter le projet';
    btn.disabled = false;
  }
}

/**
 * Supprime un projet de l'API et retire sa carte du DOM avec une animation.
 * @param {number} id - Identifiant du projet
 */
async function supprimerProjet(id) {
  try {
    await Api.delete(id);

    // Retirer la carte avec animation
    const card = document.getElementById(`projet-${id}`);
    if (card) {
      card.style.transition = 'opacity .3s, transform .3s';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => {
        card.remove();
        // Vérifier si la grille est vide
        const grid = document.getElementById('projets-grid');
        if (grid && grid.children.length === 0) {
          grid.innerHTML = `
            <div class="col-span-3 text-center py-20">
              <div class="text-5xl mb-4">📂</div>
              <h3 class="text-xl font-bold text-gray-700 mb-2">Aucun projet</h3>
              <p class="text-gray-400 mb-6">Commencez par ajouter votre premier projet.</p>
              <button onclick="showPage('ajouter')"
                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                + Ajouter un projet
              </button>
            </div>`;
        }
      }, 300);
    }

    showToast('🗑 Projet supprimé.');

    // Si on est sur la page détail, retourner à la liste
    const pageDetail = document.getElementById('page-detail');
    if (pageDetail && !pageDetail.classList.contains('hidden')) {
      showPage('projets');
    }

  } catch (err) {
    showToast('Erreur : ' + err.message, 'error');
  }
}
