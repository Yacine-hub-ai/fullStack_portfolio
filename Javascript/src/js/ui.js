/**
 * ui.js
 * ──────────────────────────────────────────────────────────────
 * Utilitaires d'interface :
 *   - Navigation SPA (showPage)
 *   - Notifications toast
 *   - Modal de confirmation
 *   - Aperçu d'image dans le formulaire
 *   - Statut API
 * ──────────────────────────────────────────────────────────────
 */

/* ─── NAVIGATION SPA ─── */
function showPage(page) {
    // Cacher toutes les pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
    // Désactiver tous les boutons nav
    document.querySelectorAll('nav button').forEach(b => {
      b.classList.remove('text-blue-300');
      b.classList.add('text-gray-400');
    });
  
    // Afficher la page cible
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      targetPage.classList.add('active');
    }
  
    // Activer le bouton nav correspondant
    const navBtn = document.getElementById(`nav-${page}`);
    if (navBtn) {
      navBtn.classList.remove('text-gray-400');
      navBtn.classList.add('text-blue-300');
    }
  
    // Charger les projets si on va sur cette page
    if (page === 'projets') afficherProjets();
  
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /* ─── TOAST ─── */
  let toastTimer;
  
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
  
    // Reset classes
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300';
  
    if (type === 'error') {
      toast.classList.add('bg-red-500', 'text-white');
    } else {
      toast.classList.add('bg-blue-500', 'text-white');
    }
  
    // Afficher
    toast.classList.remove('opacity-0', 'translate-y-8');
    toast.classList.add('opacity-100', 'translate-y-0');
  
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-8');
    }, 3000);
  }
  
  /* ─── MODAL CONFIRMATION SUPPRESSION ─── */
  let idASupprimer = null;
  
  function demanderSuppression(id) {
    idASupprimer = id;
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById('modal-overlay').classList.add('flex');
  }
  
  function fermerModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-overlay').classList.remove('flex');
    idASupprimer = null;
  }
  
  // Confirmation suppression
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
      if (idASupprimer === null) return;
      const id = idASupprimer;
      fermerModal();
      await supprimerProjet(id);
    });
  
    // Fermer modal au clic sur l'overlay
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) fermerModal();
    });
  });
  
  /* ─── APERÇU IMAGE ─── */
  function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById('f-preview');
      img.src = e.target.result;
      img.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
  
  /* ─── LIRE IMAGE EN BASE64 ─── */
  function lireImageBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  /* ─── ÉCHAPPER HTML ─── */
  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }
  
  /* ─── STATUT API ─── */
  function updateApiStatus(online, url) {
    const dot = document.getElementById('api-dot');
    const label = document.getElementById('api-label');
    if (!dot || !label) return;
  
    if (online) {
      dot.classList.remove('bg-red-500');
      dot.classList.add('bg-green-400');
      label.textContent = url ? `Connecté à ${url}` : 'Mode hors-ligne (localStorage)';
    } else {
      dot.classList.remove('bg-green-400');
      dot.classList.add('bg-red-500');
      label.textContent = 'Hors-ligne';
    }
  }
  