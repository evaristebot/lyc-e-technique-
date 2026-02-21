// ============================================
// CONFIGURATION SHEET.BEST
// ============================================
const BASE_URL = 'https://api.sheetbest.com/sheets/fe7efdc7-8f02-4758-8f02-b168b59db733';

// URLs pour chaque feuille (table)
const API = {
  eleves: BASE_URL + '/eleves',
  publications: BASE_URL + '/publications',
  cours: BASE_URL + '/cours',
  classes: BASE_URL + '/classes',
  admins: BASE_URL + '/administration',
  anciens: BASE_URL + '/anciens'
};

console.log('✅ Sheet.best configuré');

// ============================================
// FONCTIONS DE NAVIGATION
// ============================================
window.goHome = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('home').classList.add('active');
};

window.goToAdministration = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('administration').classList.add('active');
  chargerAdministration();
};

window.goToAnciens = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('anciens').classList.add('active');
  chargerAnciens();
};

window.goToJournal = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('journal').classList.add('active');
  chargerPublications();
};

window.goToCours = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('cours').classList.add('active');
  chargerCours();
};

window.goToRecherche = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('recherche').classList.add('active');
};

window.goToAdmin = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('admin').classList.add('active');
  document.getElementById('adminPasswordBox').style.display = 'block';
  document.getElementById('adminZone').style.display = 'none';
};

// ============================================
// ADMIN : MOT DE PASSE
// ============================================
window.checkAdminPassword = function() {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    chargerAdminPublications();
    chargerAdminCours();
    chargerAdminClasses();
    chargerAdminEleves();
    chargerAdminAdmins();
    chargerClassesSelect();
  } else {
    alert('❌ Mot de passe incorrect');
  }
};

// ============================================
// PUBLICATIONS (Journal)
// ============================================
async function chargerPublications() {
  const res = await fetch(API.publications);
  const data = await res.json();
  
  let html = '';
  data.forEach(p => {
    html += `<div class="card"><h3>${p.titre}</h3><p>${p.contenu}</p></div>`;
  });
  document.getElementById('articlesList').innerHTML = html || '<p>Aucune publication</p>';
}

async function chargerAdminPublications() {
  const res = await fetch(API.publications);
  const data = await res.json();
  
  let html = '';
  data.forEach((p, index) => {
    html += `
      <div class="admin-item">
        <span>${p.titre}</span>
        <button class="delete-btn" onclick="supprimerPublication('${index}')">🗑️</button>
      </div>
    `;
  });
  document.getElementById('articlesAdminList').innerHTML = html || '<p>Aucune publication</p>';
}

window.publierArticle = async function() {
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();
  if (!titre || !contenu) return alert('❌ Titre et contenu requis');

  await fetch(API.publications, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ titre, contenu }])
  });

  document.getElementById('articleTitre').value = '';
  document.getElementById('articleContenu').value = '';
  chargerPublications();
  chargerAdminPublications();
  alert('✅ Article publié');
};

window.supprimerPublication = async function(index) {
  if (!confirm('Supprimer ?')) return;
  await fetch(`${API.publications}/${index}`, { method: 'DELETE' });
  chargerPublications();
  chargerAdminPublications();
};

// ============================================
// COURS
// ============================================
async function chargerCours() {
  const res = await fetch(API.cours);
  const data = await res.json();
  
  let html = '';
  data.forEach(c => {
    html += `
      <div class="card">
        <h3>${c.titre}</h3>
        <p><strong>${c.professeur}</strong></p>
        <p>${c.description}</p>
        <a href="${c.lien}" target="_blank" class="cours-link">
          ${c.type === 'pdf' ? '📄 Voir PDF' : '▶️ Voir vidéo'}
        </a>
      </div>
    `;
  });
  document.getElementById('coursList').innerHTML = html || '<p>Aucun cours</p>';
}

async function chargerAdminCours() {
  const res = await fetch(API.cours);
  const data = await res.json();
  
  let html = '';
  data.forEach((c, index) => {
    html += `
      <div class="admin-item">
        <span>${c.titre} - ${c.professeur}</span>
        <button class="delete-btn" onclick="supprimerCours('${index}')">🗑️</button>
      </div>
    `;
  });
  document.getElementById('coursAdminList').innerHTML = html || '<p>Aucun cours</p>';
}

window.ajouterCours = async function() {
  const titre = document.getElementById('coursTitre').value.trim();
  const professeur = document.getElementById('coursProfesseur').value.trim();
  const description = document.getElementById('coursDescription').value.trim();
  const type = document.getElementById('coursType').value;
  const lien = document.getElementById('coursLien').value.trim();

  if (!titre || !professeur || !description || !lien) {
    return alert('❌ Tous les champs requis');
  }

  await fetch(API.cours, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ titre, professeur, description, type, lien }])
  });

  document.getElementById('coursTitre').value = '';
  document.getElementById('coursProfesseur').value = '';
  document.getElementById('coursDescription').value = '';
  document.getElementById('coursLien').value = '';
  
  chargerCours();
  chargerAdminCours();
  alert('✅ Cours ajouté');
};

window.supprimerCours = async function(index) {
  if (!confirm('Supprimer ?')) return;
  await fetch(`${API.cours}/${index}`, { method: 'DELETE' });
  chargerCours();
  chargerAdminCours();
};

// ============================================
// CLASSES
// ============================================
async function chargerAdminClasses() {
  const res = await fetch(API.classes);
  const data = await res.json();
  
  let html = '';
  data.forEach((c, index) => {
    html += `
      <div class="admin-item">
        <span>${c.nom}</span>
        <button class="delete-btn" onclick="supprimerClasse('${index}')">🗑️</button>
      </div>
    `;
  });
  document.getElementById('classesList').innerHTML = html || '<p>Aucune classe</p>';
}

window.ajouterClasse = async function() {
  const nom = document.getElementById('classeNom').value.trim();
  if (!nom) return alert('❌ Nom requis');

  await fetch(API.classes, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ nom }])
  });

  document.getElementById('classeNom').value = '';
  chargerAdminClasses();
  chargerClassesSelect();
  alert('✅ Classe ajoutée');
};

window.supprimerClasse = async function(index) {
  if (!confirm('Supprimer ?')) return;
  await fetch(`${API.classes}/${index}`, { method: 'DELETE' });
  chargerAdminClasses();
  chargerClassesSelect();
};

async function chargerClassesSelect() {
  const res = await fetch(API.classes);
  const data = await res.json();
  
  let html = '<option value="">Choisir une classe</option>';
  data.forEach(c => {
    html += `<option value="${c.nom}">${c.nom}</option>`;
  });
  document.getElementById('eleveClasse').innerHTML = html;
}

// ============================================
// ÉLÈVES
// ============================================
async function chargerAdminEleves() {
  const res = await fetch(API.eleves);
  const data = await res.json();
  
  let html = '';
  data.forEach((e, index) => {
    html += `
      <div class="admin-item">
        <span>${e.nom} ${e.prenom} - ${e.classe}</span>
        <button class="delete-btn" onclick="supprimerEleve('${index}')">🗑️</button>
      </div>
    `;
  });
  document.getElementById('elevesList').innerHTML = html || '<p>Aucun élève</p>';
}

window.ajouterEleve = async function() {
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classe = document.getElementById('eleveClasse').value;

  if (!nom || !prenom || !classe) {
    return alert('❌ Tous les champs requis');
  }

  await fetch(API.eleves, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ nom, prenom, classe }])
  });

  document.getElementById('eleveNom').value = '';
  document.getElementById('elevePrenom').value = '';
  
  chargerAdminEleves();
  alert('✅ Élève ajouté');
};

window.supprimerEleve = async function(index) {
  if (!confirm('Supprimer ?')) return;
  await fetch(`${API.eleves}/${index}`, { method: 'DELETE' });
  chargerAdminEleves();
};

// ============================================
// ADMINISTRATION
// ============================================
async function chargerAdministration() {
  const res = await fetch(API.admins);
  const data = await res.json();
  
  let html = '';
  data.forEach(a => {
    html += `<div class="card"><h3>${a.nom}</h3><p><strong>${a.role}</strong></p></div>`;
  });
  document.getElementById('adminList').innerHTML = html || '<p>Aucun membre</p>';
}

async function chargerAdminAdmins() {
  const res = await fetch(API.admins);
  const data = await res.json();
  
  let html = '';
  data.forEach((a, index) => {
    html += `
      <div class="admin-item">
        <span>${a.nom} - ${a.role}</span>
        <button class="delete-btn" onclick="supprimerAdmin('${index}')">🗑️</button>
      </div>
    `;
  });
  document.getElementById('adminsList').innerHTML = html || '<p>Aucun membre</p>';
}

window.ajouterAdmin = async function() {
  const nom = document.getElementById('adminNom').value.trim();
  const role = document.getElementById('adminRole').value.trim();
  if (!nom || !role) return alert('❌ Nom et rôle requis');

  await fetch(API.admins, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ nom, role }])
  });

  document.getElementById('adminNom').value = '';
  document.getElementById('adminRole').value = '';
  
  chargerAdministration();
  chargerAdminAdmins();
  alert('✅ Membre ajouté');
};

window.supprimerAdmin = async function(index) {
  if (!confirm('Supprimer ?')) return;
  await fetch(`${API.admins}/${index}`, { method: 'DELETE' });
  chargerAdministration();
  chargerAdminAdmins();
};

// ============================================
// ANCIENS ÉLÈVES
// ============================================
async function chargerAnciens() {
  const res = await fetch(API.anciens);
  const data = await res.json();
  
  let html = '';
  data.forEach(a => {
    html += `<div class="card"><h3>${a.nom}</h3><p>${a.annee} - ${a.parcours}</p></div>`;
  });
  document.getElementById('anciensList').innerHTML = html || '<p>Aucun ancien</p>';
}

// ============================================
// RECHERCHE
// ============================================
window.rechercher = async function() {
  const query = document.getElementById('searchQuery').value.toLowerCase().trim();
  const results = document.getElementById('searchResults');

  if (!query) {
    results.innerHTML = '<p>Entrez un terme de recherche</p>';
    return;
  }

  let html = '';

  // Recherche dans les élèves
  const elevesRes = await fetch(API.eleves);
  const eleves = await elevesRes.json();
  eleves.forEach(e => {
    if (e.nom.toLowerCase().includes(query) || e.prenom.toLowerCase().includes(query)) {
      html += `<div class="card"><h3>👨‍🎓 ${e.nom} ${e.prenom}</h3><p>Classe: ${e.classe}</p></div>`;
    }
  });

  // Recherche dans les admins
  const adminsRes = await fetch(API.admins);
  const admins = await adminsRes.json();
  admins.forEach(a => {
    if (a.nom.toLowerCase().includes(query)) {
      html += `<div class="card"><h3>👨‍🏫 ${a.nom}</h3><p>${a.role}</p></div>`;
    }
  });

  // Recherche dans les cours
  const coursRes = await fetch(API.cours);
  const cours = await coursRes.json();
  cours.forEach(c => {
    if (c.titre.toLowerCase().includes(query) || c.professeur.toLowerCase().includes(query)) {
      html += `<div class="card"><h3>📚 ${c.titre}</h3><p>Par ${c.professeur}</p></div>`;
    }
  });

  results.innerHTML = html || '<p>Aucun résultat trouvé</p>';
};

// ============================================
// INIT
// ============================================
chargerPublications();
chargerCours();
chargerAdministration();
chargerAnciens();
console.log('✅ Site prêt avec Sheet.best');
