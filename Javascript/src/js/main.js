import "src/output.css"

const conteneur = document.getElementById("conteneur-projets");
const form = document.getElementById("formulaireProjet");
const compteur = document.getElementById("compteurProjets");

let projets = [];

function ajouterProjet(libelle, image) {
    const projet = {
      id: Date.now(),
      libelle,
      image
    };
  
    projets.push(projet);
    creerProjet(projet.id, projet.libelle, projet.image);
  
    updateCount();
  }

  function supprimerProjet(id, element) {
    projets = projets.filter(p => p.id !== id);
    element.remove();
    updateCount();
  }