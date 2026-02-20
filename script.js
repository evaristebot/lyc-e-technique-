// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'sb_publishable_7MoEHv8lIBlhlO8CFZOMRg_AMQdRsrz';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase connecté');

// ===============================
// NAVIGATION - TOUTES GLOBALES
// ===============================
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

// ===============================
// ADMIN
// ===============================
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

// ===============================
// PUBLICATIONS
// ===============================
async function chargerPublications() {
  const container = document.getElementById('articlesList');
  if (!container) return;
  const { data } = await supabase.from('actualites').select('*').order('created_at', { ascending: false });
  container.innerHTML = data?.length 
    ? data.map(p => `<div class="card"><h3>${p.titre}</h3><p>${p.contenu}</p></div>`).join('')
    : '<p>Aucune publication</p>';
}

async function chargerAdminPublications() {
  const container = document.getElementById('articlesAdminList');
  if (!container) return;
  const { data } = await supabase.from('actualites').select('*');
  container.innerHTML = data?.length 
    ? data.map(p => `<div class="admin-item"><span>${p.titre}</span><button class="delete-btn" onclick="supprimerPublication(${p.id})">🗑️</button></div>`).join('')
    : '<p>Aucune publication</p>';
}

window.publierArticle = async function() {
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();
  if (!titre || !contenu) return alert('❌ Titre et contenu requis');
  await supabase.from('actualites').insert([{ titre, contenu }]);
  document.getElementById('articleTitre').value = '';
  document.getElementById('articleContenu').value = '';
  chargerPublications();
  chargerAdminPublications();
  alert('✅ Article publié');
};

window.supprimerPublication = async function(id) {
  if (!confirm('Supprimer ?')) return;
  await supabase.from('actualites').delete().eq('id', id);
  chargerPublications();
  chargerAdminPublications();
};

// ===============================
// COURS
// ===============================
async function chargerCours() {
  const container = document.getElementById('coursList');
  if (!container) return;
  const { data } = await supabase.from('cours').select('*');
  container.innerHTML = data?.length 
    ? data.map(c => `<div class="card"><h3>${c.titre}</h3><p>${c.professeur}</p><p>${c.description}</p><a href="${c.lien}" target="_blank">${c.type === 'pdf' ? '📄 PDF' : '▶️ Vidéo'}</a></div>`).join('')
    : '<p>Aucun cours</p>';
}

async function chargerAdminCours() {
  const container = document.getElementById('coursAdminList');
  if (!container) return;
  const { data } = await supabase.from('cours').select('*');
  container.innerHTML = data?.length 
    ? data.map(c => `<div class="admin-item"><span>${c.titre}</span><button class="delete-btn" onclick="supprimerCours(${c.id})">🗑️</button></div>`).join('')
    : '<p>Aucun cours</p>';
}

window.ajouterCours = async function() {
  const t = document.getElementById('coursTitre').value.trim();
  const p = document.getElementById('coursProfesseur').value.trim();
  const d = document.getElementById('coursDescription').value.trim();
  const type = document.getElementById('coursType').value;
  const l = document.getElementById('coursLien').value.trim();
  if (!t || !p || !d || !l) return alert('❌ Tous les champs requis');
  await supabase.from('cours').insert([{ titre: t, professeur: p, description: d, type, lien: l }]);
  document.getElementById('coursTitre').value = '';
  document.getElementById('coursProfesseur').value = '';
  document.getElementById('coursDescription').value = '';
  document.getElementById('coursLien').value = '';
  chargerCours();
  chargerAdminCours();
  alert('✅ Cours ajouté');
};

window.supprimerCours = async function(id) {
  if (!confirm('Supprimer ?')) return;
  await supabase.from('cours').delete().eq('id', id);
  chargerCours();
  chargerAdminCours();
};

// ===============================
// CLASSES
// ===============================
async function chargerAdminClasses() {
  const container = document.getElementById('classesList');
  if (!container) return;
  const { data } = await supabase.from('classes').select('*');
  container.innerHTML = data?.length 
    ? data.map(c => `<div class="admin-item"><span>${c.nom}</span><button class="delete-btn" onclick="supprimerClasse(${c.id})">🗑️</button></div>`).join('')
    : '<p>Aucune classe</p>';
}

window.ajouterClasse = async function() {
  const nom = document.getElementById('classeNom').value.trim();
  if (!nom) return alert('❌ Nom requis');
  await supabase.from('classes').insert([{ nom }]);
  document.getElementById('classeNom').value = '';
  chargerAdminClasses();
  chargerClassesSelect();
  alert('✅ Classe ajoutée');
};

window.supprimerClasse = async function(id) {
  if (!confirm('Supprimer ?')) return;
  await supabase.from('classes').delete().eq('id', id);
  chargerAdminClasses();
  chargerClassesSelect();
};

async function chargerClassesSelect() {
  const select = document.getElementById('eleveClasse');
  if (!select) return;
  const { data } = await supabase.from('classes').select('*');
  select.innerHTML = '<option value="">Choisir</option>';
  data?.forEach(c => select.innerHTML += `<option value="${c.id}">${c.nom}</option>`);
}

// ===============================
// ÉLÈVES
// ===============================
async function chargerAdminEleves() {
  const container = document.getElementById('elevesList');
  if (!container) return;
  const { data } = await supabase.from('eleves').select('*, classes(nom)');
  container.innerHTML = data?.length 
    ? data.map(e => `<div class="admin-item"><span>${e.nom} ${e.prenom} - ${e.classes?.nom}</span><button class="delete-btn" onclick="supprimerEleve(${e.id})">🗑️</button></div>`).join('')
    : '<p>Aucun élève</p>';
}

window.ajouterEleve = async function() {
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classeId = document.getElementById('eleveClasse').value;
  if (!nom || !prenom || !classeId) return alert('❌ Tous les champs requis');
  await supabase.from('eleves').insert([{ nom, prenom, classe_id: classeId }]);
  document.getElementById('eleveNom').value = '';
  document.getElementById('elevePrenom').value = '';
  chargerAdminEleves();
  alert('✅ Élève ajouté');
};

window.supprimerEleve = async function(id) {
  if (!confirm('Supprimer ?')) return;
  await supabase.from('eleves').delete().eq('id', id);
  chargerAdminEleves();
};

// ===============================
// ADMINISTRATION
// ===============================
async function chargerAdministration() {
  const container = document.getElementById('adminList');
  if (!container) return;
  const { data } = await supabase.from('administration').select('*');
  container.innerHTML = data?.length 
    ? data.map(a => `<div class="card"><h3>${a.nom}</h3><p>${a.role}</p></div>`).join('')
    : '<p>Aucun membre</p>';
}

async function chargerAdminAdmins() {
  const container = document.getElementById('adminsList');
  if (!container) return;
  const { data } = await supabase.from('administration').select('*');
  container.innerHTML = data?.length 
    ? data.map(a => `<div class="admin-item"><span>${a.nom} - ${a.role}</span><button class="delete-btn" onclick="supprimerAdmin(${a.id})">🗑️</button></div>`).join('')
    : '<p>Aucun membre</p>';
}

window.ajouterAdmin = async function() {
  const nom = document.getElementById('adminNom').value.trim();
  const role = document.getElementById('adminRole').value.trim();
  if (!nom || !role) return alert('❌ Nom et rôle requis');
  await supabase.from('administration').insert([{ nom, role }]);
  document.getElementById('adminNom').value = '';
  document.getElementById('adminRole').value = '';
  chargerAdministration();
  chargerAdminAdmins();
  alert('✅ Membre ajouté');
};

window.supprimerAdmin = async function(id) {
  if (!confirm('Supprimer ?')) return;
  await supabase.from('administration').delete().eq('id', id);
  chargerAdministration();
  chargerAdminAdmins();
};

// ===============================
// ANCIENS
// ===============================
async function chargerAnciens() {
  const container = document.getElementById('anciensList');
  if (!container) return;
  const { data } = await supabase.from('anciens_eleves').select('*');
  container.innerHTML = data?.length 
    ? data.map(a => `<div class="card"><h3>${a.nom}</h3><p>${a.annee_bac} - ${a.parcours}</p></div>`).join('')
    : '<p>Aucun ancien</p>';
}

// ===============================
// RECHERCHE
// ===============================
window.rechercher = async function() {
  const query = document.getElementById('searchQuery').value.trim();
  const results = document.getElementById('searchResults');
  if (!query) return results.innerHTML = '<p>Entrez un nom</p>';
  
  let html = '';
  const { data: eleves } = await supabase.from('eleves').select('*, classes(nom)').ilike('nom', `%${query}%`);
  eleves?.forEach(e => html += `<div class="card"><h3>👨‍🎓 ${e.nom} ${e.prenom}</h3><p>${e.classes?.nom}</p></div>`);
  
  const { data: admins } = await supabase.from('administration').select('*').ilike('nom', `%${query}%`);
  admins?.forEach(a => html += `<div class="card"><h3>👨‍🏫 ${a.nom}</h3><p>${a.role}</p></div>`);
  
  const { data: cours } = await supabase.from('cours').select('*').ilike('titre', `%${query}%`);
  cours?.forEach(c => html += `<div class="card"><h3>📚 ${c.titre}</h3><p>${c.professeur}</p></div>`);
  
  results.innerHTML = html || '<p>Aucun résultat</p>';
};

// ===============================
// INIT
// ===============================
chargerPublications();
chargerCours();
chargerAdministration();
chargerAnciens();
console.log('✅ Site prêt avec toutes les fonctions globales');
