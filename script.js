// ============================================
// CONFIGURATION SHEET.BEST
// ============================================
const BASE_URL = 'https://api.sheetbest.com/sheets/70923d86-6d1a-4756-bf21-a869acf3e029';

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
// FONCTIONS DE NAVIGATION (GLOBALES)
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
  try {
    const res = await fetch(API.publications);
    const data = await res.json();
    
    let html = '';
    data.forEach(p => {
      html += `<div class="card"><h3>${p.titre || ''}</h3><p>${p.contenu || ''}</p></div>`;
    });
    document.getElementById('articlesList').innerHTML = html || '<p>Aucune publication</p>';
  } catch (err) {
    console.error('Erreur chargement publications:', err);
    document.getElementById('articlesList').innerHTML = '<p>Erreur de chargement</p>';
  }
}

async function chargerAdminPublications() {
  try {
    const res = await fetch(API.publications);
    const data = await res.json();
    
    let html = '';
    data.forEach((p, index) => {
      const ligneId = index + 1;
      html += `
        <div class="admin-item">
          <span>${p.titre || ''}</span>
          <button class="delete-btn" onclick="supprimerPublication('${ligneId}')">🗑️</button>
        </div>
      `;
    });
    document.getElementById('articlesAdminList').innerHTML = html || '<p>Aucune publication</p>';
  } catch (err) {
    console.error('Erreur chargement admin publications:', err);
  }
}

window.publierArticle = async function() {
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();
  if (!titre || !contenu) return alert('❌ Titre et contenu requis');

  try {
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
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

window.supprimerPublication = async function(ligneId) {
  if (!confirm('Supprimer cette publication ?')) return;
  try {
    await fetch(`${API.publications}/${ligneId}`, { method: 'DELETE' });
    chargerPublications();
    chargerAdminPublications();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

// ============================================
// COURS
// ============================================
async function chargerCours() {
  try {
    const res = await fetch(API.cours);
    const data = await res.json();
    
    let html = '';
    data.forEach(c => {
      html += `
        <div class="card">
          <h3>${c.titre || ''}</h3>
          <p><strong>${c.professeur || ''}</strong></p>
          <p>${c.description || ''}</p>
          ${c.lien ? `<a href="${c.lien}" target="_blank" class="cours-link">${c.type === 'pdf' ? '📄 Voir PDF' : '▶️ Voir vidéo'}</a>` : ''}
        </div>
      `;
    });
    document.getElementById('coursList').innerHTML = html || '<p>Aucun cours</p>';
  } catch (err) {
    console.error('Erreur chargement cours:', err);
  }
}

async function chargerAdminCours() {
  try {
    const res = await fetch(API.cours);
    const data = await res.json();
    
    let html = '';
    data.forEach((c, index) => {
      const ligneId = index + 1;
      html += `
        <div class="admin-item">
          <span>${c.titre || ''} - ${c.professeur || ''}</span>
          <button class="delete-btn" onclick="supprimerCours('${ligneId}')">🗑️</button>
        </div>
      `;
    });
    document.getElementById('coursAdminList').innerHTML = html || '<p>Aucun cours</p>';
  } catch (err) {
    console.error('Erreur chargement admin cours:', err);
  }
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

  try {
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
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

window.supprimerCours = async function(ligneId) {
  if (!confirm('Supprimer ce cours ?')) return;
  try {
    await fetch(`${API.cours}/${ligneId}`, { method: 'DELETE' });
    chargerCours();
    chargerAdminCours();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

// ============================================
// CLASSES
// ============================================
async function chargerAdminClasses() {
  try {
    const res = await fetch(API.classes);
    const data = await res.json();
    
    let html = '';
    data.forEach((c, index) => {
      const ligneId = index + 1;
      html += `
        <div class="admin-item">
          <span>${c.nom || ''}</span>
          <button class="delete-btn" onclick="supprimerClasse('${ligneId}')">🗑️</button>
        </div>
      `;
    });
    document.getElementById('classesList').innerHTML = html || '<p>Aucune classe</p>';
  } catch (err) {
    console.error('Erreur chargement classes:', err);
  }
}

window.ajouterClasse = async function() {
  const nom = document.getElementById('classeNom').value.trim();
  if (!nom) return alert('❌ Nom requis');

  try {
    await fetch(API.classes, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ nom }])
    });

    document.getElementById('classeNom').value = '';
    chargerAdminClasses();
    chargerClassesSelect();
    alert('✅ Classe ajoutée');
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

window.supprimerClasse = async function(ligneId) {
  if (!confirm('Supprimer cette classe ?')) return;
  try {
    await fetch(`${API.classes}/${ligneId}`, { method: 'DELETE' });
    chargerAdminClasses();
    chargerClassesSelect();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

async function chargerClassesSelect() {
  try {
    const res = await fetch(API.classes);
    const data = await res.json();
    
    let html = '<option value="">Choisir une classe</option>';
    data.forEach(c => {
      html += `<option value="${c.nom}">${c.nom}</option>`;
    });
    document.getElementById('eleveClasse').innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement select classes:', err);
  }
}

// ============================================
// ÉLÈVES
// ============================================
async function chargerAdminEleves() {
  try {
    const res = await fetch(API.eleves);
    const data = await res.json();
    
    let html = '';
    data.forEach((e, index) => {
      const ligneId = index + 1;
      html += `
        <div class="admin-item">
          <span>${e.nom || ''} ${e.prenom || ''} - ${e.classe || ''}</span>
          <button class="delete-btn" onclick="supprimerEleve('${ligneId}')">🗑️</button>
        </div>
      `;
    });
    document.getElementById('elevesList').innerHTML = html || '<p>Aucun élève</p>';
  } catch (err) {
    console.error('Erreur chargement élèves:', err);
  }
}

window.ajouterEleve = async function() {
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classe = document.getElementById('eleveClasse').value;

  if (!nom || !prenom || !classe) {
    return alert('❌ Tous les champs requis');
  }

  try {
    await fetch(API.eleves, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ nom, prenom, classe }])
    });

    document.getElementById('eleveNom').value = '';
    document.getElementById('elevePrenom').value = '';
    
    chargerAdminEleves();
    alert('✅ Élève ajouté');
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

window.supprimerEleve = async function(ligneId) {
  if (!confirm('Supprimer cet élève ?')) return;
  try {
    await fetch(`${API.eleves}/${ligneId}`, { method: 'DELETE' });
    chargerAdminEleves();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

// ============================================
// ADMINISTRATION
// ============================================
async function chargerAdministration() {
  try {
    const res = await fetch(API.admins);
    const data = await res.json();
    
    let html = '';
    data.forEach(a => {
      html += `<div class="card"><h3>${a.nom || ''}</h3><p><strong>${a.role || ''}</strong></p></div>`;
    });
    document.getElementById('adminList').innerHTML = html || '<p>Aucun membre</p>';
  } catch (err) {
    console.error('Erreur chargement administration:', err);
  }
}

async function chargerAdminAdmins() {
  try {
    const res = await fetch(API.admins);
    const data = await res.json();
    
    let html = '';
    data.forEach((a, index) => {
      const ligneId = index + 1;
      html += `
        <div class="admin-item">
          <span>${a.nom || ''} - ${a.role || ''}</span>
          <button class="delete-btn" onclick="supprimerAdmin('${ligneId}')">🗑️</button>
        </div>
      `;
    });
    document.getElementById('adminsList').innerHTML = html || '<p>Aucun membre</p>';
  } catch (err) {
    console.error('Erreur chargement admin admins:', err);
  }
}

window.ajouterAdmin = async function() {
  const nom = document.getElementById('adminNom').value.trim();
  const role = document.getElementById('adminRole').value.trim();
  if (!nom || !role) return alert('❌ Nom et rôle requis');

  try {
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
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

window.supprimerAdmin = async function(ligneId) {
  if (!confirm('Supprimer ce membre ?')) return;
  try {
    await fetch(`${API.admins}/${ligneId}`, { method: 'DELETE' });
    chargerAdministration();
    chargerAdminAdmins();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

// ============================================
// ANCIENS ÉLÈVES
// ============================================
async function chargerAnciens() {
  try {
    const res = await fetch(API.anciens);
    const data = await res.json();
    
    let html = '';
    data.forEach(a => {
      html += `<div class="card"><h3>${a.nom || ''}</h3><p>${a.annee || ''} - ${a.parcours || ''}</p></div>`;
    });
    document.getElementById('anciensList').innerHTML = html || '<p>Aucun ancien</p>';
  } catch (err) {
    console.error('Erreur chargement anciens:', err);
  }
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

  try {
    // Recherche dans les élèves
    const elevesRes = await fetch(API.eleves);
    const eleves = await elevesRes.json();
    eleves.forEach(e => {
      if ((e.nom && e.nom.toLowerCase().includes(query)) || 
          (e.prenom && e.prenom.toLowerCase().includes(query))) {
        html += `<div class="card"><h3>👨‍🎓 ${e.nom} ${e.prenom}</h3><p>Classe: ${e.classe}</p></div>`;
      }
    });

    // Recherche dans les admins
    const adminsRes = await fetch(API.admins);
    const admins = await adminsRes.json();
    admins.forEach(a => {
      if (a.nom && a.nom.toLowerCase().includes(query)) {
        html += `<div class="card"><h3>👨‍🏫 ${a.nom}</h3><p>${a.role}</p></div>`;
      }
    });

    // Recherche dans les cours
    const coursRes = await fetch(API.cours);
    const cours = await coursRes.json();
    cours.forEach(c => {
      if ((c.titre && c.titre.toLowerCase().includes(query)) || 
          (c.professeur && c.professeur.toLowerCase().includes(query))) {
        html += `<div class="card"><h3>📚 ${c.titre}</h3><p>Par ${c.professeur}</p></div>`;
      }
    });

    results.innerHTML = html || '<p>Aucun résultat trouvé</p>';
  } catch (err) {
    console.error('Erreur recherche:', err);
    results.innerHTML = '<p>Erreur lors de la recherche</p>';
  }
};

// ============================================
// RAFRAÎCHISSEMENT AUTOMATIQUE (optionnel)
// ============================================
function autoRefresh() {
  setInterval(async () => {
    console.log('🔄 Rafraîchissement automatique...');
    await chargerPublications();
    await chargerCours();
    await chargerAdministration();
    await chargerAnciens();
  }, 30000); // 30 secondes
}

// ============================================
// INITIALISATION
// ============================================
chargerPublications();
chargerCours();
chargerAdministration();
chargerAnciens();
autoRefresh();
console.log('✅ Site prêt avec Sheet.best');
