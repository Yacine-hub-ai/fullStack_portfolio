const API_URL = "http://localhost:3000/projets";

export async function getProjets() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function ajouterProjetAPI(projet) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projet)
  }).then(res => res.json());
}

export async function supprimerProjetAPI(id) {
  return fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}