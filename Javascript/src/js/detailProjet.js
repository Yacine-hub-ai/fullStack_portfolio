export function detaillerProjet(projet) {
    const box = document.getElementById("detail-contenu");
    const modal = document.getElementById("section-detail");
  
    box.innerHTML = `
      <h2>${projet.libelle}</h2>
      <img src="${projet.image}" />
    `;
  
    modal.classList.remove("hidden");
  }