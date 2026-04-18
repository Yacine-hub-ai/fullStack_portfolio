/**
 * main.js
 * ──────────────────────────────────────────────────────────────
 * Point d'entrée de l'application SPA Portfolio.
 * Initialise l'API, affiche la page d'accueil,
 * et configure la photo de profil.
 *
 * Ordre de chargement dans index.html :
 *   1. api.js
 *   2. ui.js
 *   3. gestionProjet.js
 *   4. detailProjet.js
 *   5. main.js  ← ce fichier (dernier)
 * ──────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Initialiser l'API (localStorage) ── */
  Api.init();
  updateApiStatus(true, typeof API_URL !== 'undefined' ? API_URL : null);

  /* ── 2. Afficher la page d'accueil par défaut ── */
  showPage('accueil');

  /* ── 3. Photo de profil — chargement dynamique ── */
  // Remplacez 'yass1.jpeg' par le chemin réel de votre photo
  // ou laissez le placeholder avec les initiales "MY"
  const PHOTO_PROFIL = 'yass1.jpeg'; // ← votre photo ici

  const avatarImg  = document.getElementById('avatar-img');
  const avatarText = document.getElementById('avatar-text');

  if (avatarImg && PHOTO_PROFIL) {
    avatarImg.src = PHOTO_PROFIL;
    avatarImg.onload  = () => { avatarImg.classList.remove('hidden'); avatarText.classList.add('hidden'); };
    avatarImg.onerror = () => { avatarImg.classList.add('hidden'); avatarText.classList.remove('hidden'); };
  }

  /* ── 4. Gestion clavier : Escape ferme le modal ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fermerModal();
  });

});
