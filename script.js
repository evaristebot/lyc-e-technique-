// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'wcypjvwincdcbkqrzrty';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ===============================
// NAVIGATION
// ===============================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

window.goHome = () => showPage('home');
window.goToAdministration = () => { showPage('administration'); chargerAdministration(); };
window.goToAnciens = () => { showPage('anciens'); chargerAnciens(); };
window.goToJournal = () => { showPage('journal'); chargerArticles(); };
window.goToBulletins = () => showPage('bulletins');
window.goToRecherche = () => showPage('recherche');

window.goToAdmin = () => {
  showPage('admin');
  document.getElementById('adminPasswordBox').style.display = 'block';
  document.getElementById('adminZone').style.display = 'none';
  chargerSpecialitesSelect();
};

// ===============================
// ADMIN : MOT DE PASSE
// ===============================
window.checkAdminPassword = () => {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    chargerSpecialites();
    chargerClasses();
    chargerMatieres();
    chargerEnseignantsAdmin();
    chargerAdministrationAdmin();
    chargerArticlesAdmin();
    chargerClassesSelect();
  } else {
    alert('Mot de passe incorrect');
  }
};

// ===============================
// SPÉCIALITÉS
// ===============================
window.ajouterSpecialite = async () => {
  const nom = document.getElementById('specialiteNom').value;
  if (!nom) return alert('Nom requis');
  await supabaseClient.from('specialites').insert([{ nom }]);
  alert('✅ Spécialité ajoutée');
  document.getElementById('specialiteNom').value = '';
  chargerSpecialites();
  chargerSpecialitesSelect();
};

async function chargerSpecialites() {
  const { data } = await supabaseClient.from('specialites').select('*');
  let html = '';
  data?.forEach(s => {
    html += `<div style="background:#f9f9f9; padding:5px; margin:2px;">${s.nom} <button onclick="supprimerSpecialite(${s.id})">🗑️</button></div>`;
  });
  document.getElementById('specialitesList').innerHTML = html;
}

window.supprimerSpecialite = async (id) => {
  if (confirm('Supprimer cette spécialité ?')) {
    await supabaseClient.from('specialites').delete().eq('id', id);
    chargerSpecialites();
    chargerSpecialitesSelect();
    chargerClasses();
  }
};

// ===============================
// CLASSES
// ===============================
window.ajouterClasse = async () => {
  const nom = document.getElementById('classeNom').value;
  const specialiteId = document.getElementById('classeSpecialite').value;
  if (!nom || !specialiteId) return alert('Remplis tous les champs');
  await supabaseClient.from('classes').insert([{ nom, specialite_id: specialiteId }]);
  alert('✅ Classe ajoutée');
  document.getElementById('classeNom').value = '';
  chargerClasses();
  chargerClassesSelect();
};

async function chargerClasses() {
  const { data } = await supabaseClient.from('classes').select('*, specialites(nom)');
  let html = '';
  data?.forEach(c => {
    html += `<div style="background:#f9f9f9; padding:5px; margin:2px;">${c.nom} (${c.specialites?.nom}) <button onclick="supprimerClasse(${c.id})">🗑️</button></div>`;
  });
  document.getElementById('classesList').innerHTML = html;
}

window.supprimerClasse = async (id) => {
  if (confirm('Supprimer cette classe ?')) {
    await supabaseClient.from('classes').delete().eq('id', id);
    chargerClasses();
    chargerClassesSelect();
    chargerMatieres();
  }
};

// ===============================
// MATIÈRES
// ===============================
window.ajouterMatiere = async () => {
  const nom = document.getElementById('matiereNom').value;
  const classeId = document.getElementById('matiereClasse').value;
  const coef = document.getElementById('matiereCoef').value;
  const pwd = document.getElementById('matierePassword').value;
  if (!nom || !classeId || !coef || !pwd) return alert('Remplis tous les champs');
  await supabaseClient.from('matieres').insert([{ nom, classe_id: classeId, coefficient: coef, mot_de_passe: pwd }]);
  alert('✅ Matière ajoutée');
  document.getElementById('matiereNom').value = '';
  document.getElementById('matiereCoef').value = '';
  document.getElementById('matierePassword').value = '';
  chargerMatieres();
};

async function chargerMatieres() {
  const { data } = await supabaseClient.from('matieres').select('*, classes(nom)');
  let html = '';
  data?.forEach(m => {
    html += `<div style="background:#f9f9f9; padding:5px; margin:2px;">${m.nom} - ${m.classes?.nom} (coef ${m.coefficient}) <button onclick="supprimerMatiere(${m.id})">🗑️</button></div>`;
  });
  document.getElementById('matieresList').innerHTML = html;
}

window.supprimerMatiere = async (id) => {
  if (confirm('Supprimer cette matière ?')) {
    await supabaseClient.from('matieres').delete().eq('id', id);
    chargerMatieres();
  }
};

// ===============================
// ÉLÈVES
// ===============================
window.ajouterEleve = async () => {
  const nom = document.getElementById('eleveNom').value;
  const prenom = document.getElementById('elevePrenom').value;
  const classeId = document.getElementById('eleveClasseId').value;
  const parent = document.getElementById('eleveParent').value;
  if (!nom || !prenom || !classeId) return alert('Remplis les champs');
  await supabaseClient.from('eleves').insert([{ nom, prenom, classe_id: classeId, numero_parent: parent }]);
  alert('✅ Élève ajouté');
  document.getElementById('eleveNom').value = '';
  document.getElementById('elevePrenom').value = '';
  document.getElementById('eleveParent').value = '';
};

// ===============================
// ENSEIGNANTS
// ===============================
window.ajouterEnseignant = async () => {
  const nom = document.getElementById('ensNom').value;
  const prenom = document.getElementById('ensPrenom').value;
  const matiere = document.getElementById('ensMatiere').value;
  const tel = document.getElementById('ensTel').value;
  if (!nom || !prenom) return alert('Nom et prénom requis');
  await supabaseClient.from('enseignants').insert([{ nom, prenom, matiere, telephone: tel }]);
  alert('✅ Enseignant ajouté');
  document.getElementById('ensNom').value = '';
  document.getElementById('ensPrenom').value = '';
  document.getElementById('ensMatiere').value = '';
  document.getElementById('ensTel').value = '';
  chargerEnseignantsAdmin();
};

async function chargerEnseignantsAdmin() {
  const { data } = await supabaseClient.from('enseignants').select('*');
  let html = '';
  data?.forEach(e => {
    html += `<div style="background:#f9f9f9; padding:5px;">${e.nom} ${e.prenom} - ${e.matiere} <button onclick="supprimerEnseignant(${e.id})">🗑️</button></div>`;
  });
  document.getElementById('enseignantsAdminList').innerHTML = html;
}

window.supprimerEnseignant = async (id) => {
  if (confirm('Supprimer cet enseignant ?')) {
    await supabaseClient.from('enseignants').delete().eq('id', id);
    chargerEnseignantsAdmin();
  }
};

// ===============================
// ADMINISTRATION
// ===============================
window.ajouterAdminMembre = async () => {
  const role = document.getElementById('adminRole').value;
  const nom = document.getElementById('adminNom').value;
  const photo = document.getElementById('adminPhoto').value || null;
  const desc = document.getElementById('adminDesc').value || '';
  if (!role || !nom) return alert('Remplis les champs');
  await supabaseClient.from('administration').insert([{ role, nom, photo, description: desc }]);
  alert('✅ Membre ajouté');
  document.getElementById('adminRole').value = '';
  document.getElementById('adminNom').value = '';
  document.getElementById('adminPhoto').value = '';
  document.getElementById('adminDesc').value = '';
  chargerAdministrationAdmin();
};

async function chargerAdministrationAdmin() {
  const { data } = await supabaseClient.from('administration').select('*');
  let html = '';
  data?.forEach(a => {
    html += `<div style="background:#f9f9f9; padding:5px;">${a.role} - ${a.nom} <button onclick="supprimerAdminMembre(${a.id})">🗑️</button></div>`;
  });
  document.getElementById('adminAdminList').innerHTML = html;
}

window.supprimerAdminMembre = async (id) => {
  if (confirm('Supprimer ce membre ?')) {
    await supabaseClient.from('administration').delete().eq('id', id);
    chargerAdministrationAdmin();
  }
};

// ===============================
// ARTICLES
// ===============================
window.ajouterArticle = async () => {
  const titre = document.getElementById('articleTitre').value;
  const contenu = document.getElementById('articleContenu').value;
  if (!titre || !contenu) return alert('Remplis les champs');
  await supabaseClient.from('actualites').insert([{ titre, contenu }]);
  alert('✅ Article publié');
  document.getElementById('articleTitre').value = '';
  document.getElementById('articleContenu').value = '';
  chargerArticlesAdmin();
  chargerArticles();
};

async function chargerArticlesAdmin() {
  const { data } = await supabaseClient.from('actualites').select('*').order('created_at', { ascending: false });
  let html = '';
  data?.forEach(a => {
    html += `<div style="background:#f9f9f9; padding:5px;">${a.titre} <button onclick="supprimerArticle(${a.id})">🗑️</button></div>`;
  });
  document.getElementById('articlesAdminList').innerHTML = html;
}

window.supprimerArticle = async (id) => {
  if (confirm('Supprimer cet article ?')) {
    await supabaseClient.from('actualites').delete().eq('id', id);
    chargerArticlesAdmin();
    chargerArticles();
  }
};

// ===============================
// AFFICHAGE PUBLIC
// ===============================
async function chargerAdministration() {
  const { data } = await supabaseClient.from('administration').select('*');
  let html = '';
  data?.forEach(a => {
    html += `<div class="card"><h3>${a.nom}</h3><p>${a.role}</p><p>${a.description || ''}</p></div>`;
  });
  document.getElementById('adminList').innerHTML = html;
}

async function chargerAnciens() {
  const { data } = await supabaseClient.from('anciens_eleves').select('*');
  let html = '';
  data?.forEach(a => {
    html += `<div class="card"><h3>${a.nom} ${a.prenom}</h3><p>Bac ${a.annee_bac}</p><p>${a.parcours || ''}</p></div>`;
  });
  document.getElementById('anciensList').innerHTML = html;
}

async function chargerArticles() {
  const { data } = await supabaseClient.from('actualites').select('*').order('created_at', { ascending: false });
  let html = '';
  data?.forEach(a => {
    html += `<div class="card"><h3>${a.titre}</h3><p>${a.contenu}</p><small>${new Date(a.created_at).toLocaleDateString()}</small></div>`;
  });
  document.getElementById('articlesList').innerHTML = html;
}

// ===============================
// CHARGEMENT DES SELECT
// ===============================
async function chargerSpecialitesSelect() {
  const { data } = await supabaseClient.from('specialites').select('*');
  const select = document.getElementById('classeSpecialite');
  if (select) {
    select.innerHTML = '<option value="">Choisir une spécialité</option>';
    data?.forEach(s => {
      select.innerHTML += `<option value="${s.id}">${s.nom}</option>`;
    });
  }
}

async function chargerClassesSelect() {
  const { data } = await supabaseClient.from('classes').select('*');
  const selectMatiere = document.getElementById('matiereClasse');
  const selectEleve = document.getElementById('eleveClasseId');
  
  if (selectMatiere) {
    selectMatiere.innerHTML = '<option value="">Choisir une classe</option>';
    data?.forEach(c => {
      selectMatiere.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
    });
  }
  
  if (selectEleve) {
    selectEleve.innerHTML = '<option value="">Choisir une classe</option>';
    data?.forEach(c => {
      selectEleve.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
    });
  }
}

// ===============================
// AUTRES FONCTIONS
// ===============================
window.updateLogo = () => {
  const newUrl = document.getElementById('newLogo').value;
  if (!newUrl) return alert('Entre une URL');
  document.getElementById('mainLogo').src = newUrl;
  document.querySelector('.nav-logo img').src = newUrl;
  alert('Logo mis à jour');
  document.getElementById('newLogo').value = '';
};

window.rechercher = () => {
  const query = document.getElementById('searchQuery').value;
  const results = document.getElementById('searchResults');
  if (!query) {
    results.innerHTML = '<p>Entrez un nom</p>';
    return;
  }
  results.innerHTML = '<p>Recherche simulée (à connecter à la base plus tard)</p>';
};

window.rechercherBulletin = () => {
  const nom = document.getElementById('searchEleve').value;
  const result = document.getElementById('bulletinResult');
  if (!nom) {
    result.innerHTML = '<p>Entrez un nom</p>';
    return;
  }
  result.innerHTML = '<p>Bulletin simulé (à connecter plus tard)</p>';
};

// ===============================
// INIT
// ===============================
chargerAdministration();
chargerAnciens();
chargerArticles();
console.log("✅ Site prêt avec Supabase - Clé API incluse");
