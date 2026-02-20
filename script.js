// ===============================
// DONNÉES EN MÉMOIRE
// ===============================

// Publications (journal)
let publications = [
{ id: 1, titre: "Rentrée scolaire 2025", contenu: "La rentrée aura lieu le 9 septembre.", date: new Date().toLocaleDateString('fr-FR') }
];
let prochainIdPub = 2;

// Cours
let cours = [
{ id: 1, titre: "Introduction à l'électricité", professeur: "M. NKOU", description: "Les bases du courant continu", type: "video", lien: "https://youtube.com/..." },
{ id: 2, titre: "Cours de mécanique", professeur: "M. ESSOMBA", description: "PDF du chapitre 1", type: "pdf", lien: "https://drive.google.com/..." }
];
let prochainIdCours = 3;

// Classes
let classes = [
{ id: 1, nom: "1ère Électricité" },
{ id: 2, nom: "2ème Électricité" },
{ id: 3, nom: "1ère Mécanique" }
];
let prochainIdClasse = 4;

// Élèves
let eleves = [
{ id: 1, nom: "NKOU", prenom: "Jean", classeId: 1 },
{ id: 2, nom: "NGO", prenom: "Marie", classeId: 3 }
];
let prochainIdEleve = 3;

// Administration
let admins = [
{ id: 1, nom: "Jean NTOMBA", role: "Proviseur" },
{ id: 2, nom: "Pierre ESSOMBA", role: "Chef des travaux" }
];
let prochainIdAdmin = 3;

// Anciens élèves
let anciens = [
{ id: 1, nom: "Marc TCHANA", prenom: "", annee: "2015", parcours: "Ingénieur" },
{ id: 2, nom: "Sophie NZINGA", prenom: "", annee: "2018", parcours: "Chef d'atelier" }
];

console.log('✅ Données initialisées');

// ===============================
// FONCTIONS DE NAVIGATION
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
// ADMIN : MOT DE PASSE
// ===============================
window.checkAdminPassword = function() {
const pwd = document.getElementById('adminPassword').value;
if (pwd === "LTB2025") {
document.getElementById('adminPasswordBox').style.display = 'none';
document.getElementById('adminZone').style.display = 'block';
chargerAdminPublications();
chargerAdminCours();
chargerClassesList();
chargerElevesList();
chargerAdminsList();
chargerClassesSelect();
} else {
alert('❌ Mot de passe incorrect');
}
};

// ===============================
// PUBLICATIONS (Journal)
// ===============================
function chargerPublications() {
const container = document.getElementById('articlesList');
if (!container) return;
if (publications.length === 0) {
container.innerHTML = '<p>Aucune publication</p>';
return;
}
let html = '';
publications.forEach(p => {
html += <div class="card"><h3>${p.titre}</h3><p>${p.contenu}</p><small>${p.date}</small></div>;
});
container.innerHTML = html;
}

function chargerAdminPublications() {
const container = document.getElementById('articlesAdminList');
if (!container) return;
if (publications.length === 0) {
container.innerHTML = '<p>Aucune publication</p>';
return;
}
let html = '';
publications.forEach(p => {
html += <div class="admin-item"><span>${p.titre}</span><button class="delete-btn" onclick="supprimerPublication(${p.id})">🗑️</button></div>;
});
container.innerHTML = html;
}

window.publierArticle = function() {
const titre = document.getElementById('articleTitre').value.trim();
const contenu = document.getElementById('articleContenu').value.trim();
if (!titre || !contenu) return alert('❌ Titre et contenu requis');
publications.push({
id: prochainIdPub++,
titre: titre,
contenu: contenu,
date: new Date().toLocaleDateString('fr-FR')
});
document.getElementById('articleTitre').value = '';
document.getElementById('articleContenu').value = '';
chargerPublications();
chargerAdminPublications();
alert('✅ Article publié');
};

window.supprimerPublication = function(id) {
if (!confirm('Supprimer ?')) return;
publications = publications.filter(p => p.id !== id);
chargerPublications();
chargerAdminPublications();
};

// ===============================
// COURS
// ===============================
function chargerCours() {
const container = document.getElementById('coursList');
if (!container) return;
if (cours.length === 0) {
container.innerHTML = '<p>Aucun cours disponible</p>';
return;
}
let html = '';
cours.forEach(c => {
html +=   <div class="card">   <h3>${c.titre}</h3>   <p><strong>${c.professeur}</strong></p>   <p>${c.description}</p>   <a href="${c.lien}" target="_blank" class="cours-link">   ${c.type === 'pdf' ? '📄 Voir PDF' : '▶️ Voir vidéo'}   </a>   </div>  ;
});
container.innerHTML = html;
}

function chargerAdminCours() {
const container = document.getElementById('coursAdminList');
if (!container) return;
if (cours.length === 0) {
container.innerHTML = '<p>Aucun cours</p>';
return;
}
let html = '';
cours.forEach(c => {
html += <div class="admin-item"><span>${c.titre} - ${c.professeur}</span><button class="delete-btn" onclick="supprimerCours(${c.id})">🗑️</button></div>;
});
container.innerHTML = html;
}

window.ajouterCours = function() {
const titre = document.getElementById('coursTitre').value.trim();
const professeur = document.getElementById('coursProfesseur').value.trim();
const description = document.getElementById('coursDescription').value.trim();
const type = document.getElementById('coursType').value;
const lien = document.getElementById('coursLien').value.trim();

if (!titre || !professeur || !description || !lien) return alert('❌ Tous les champs requis');

cours.push({
id: prochainIdCours++,
titre: titre,
professeur: professeur,
description: description,
type: type,
lien: lien
});

document.getElementById('coursTitre').value = '';
document.getElementById('coursProfesseur').value = '';
document.getElementById('coursDescription').value = '';
document.getElementById('coursLien').value = '';

chargerCours();
chargerAdminCours();
alert('✅ Cours ajouté');
};

window.supprimerCours = function(id) {
if (!confirm('Supprimer ce cours ?')) return;
cours = cours.filter(c => c.id !== id);
chargerCours();
chargerAdminCours();
};

// ===============================
// CLASSES
// ===============================
function chargerClassesList() {
const container = document.getElementById('classesList');
if (!container) return;
if (classes.length === 0) {
container.innerHTML = '<p>Aucune classe</p>';
return;
}
let html = '';
classes.forEach(c => {
html += <div class="admin-item"><span>${c.nom}</span><button class="delete-btn" onclick="supprimerClasse(${c.id})">🗑️</button></div>;
});
container.innerHTML = html;
}

window.ajouterClasse = function() {
const nom = document.getElementById('classeNom').value.trim();
if (!nom) return alert('❌ Nom requis');
classes.push({ id: prochainIdClasse++, nom: nom });
document.getElementById('classeNom').value = '';
chargerClassesList();
chargerClassesSelect();
alert('✅ Classe ajoutée');
};

window.supprimerClasse = function(id) {
if (!confirm('Supprimer cette classe ?')) return;
classes = classes.filter(c => c.id !== id);
eleves = eleves.filter(e => e.classeId !== id); // Supprime aussi les élèves liés
chargerClassesList();
chargerClassesSelect();
chargerElevesList();
};

// ===============================
// ÉLÈVES
// ===============================
function chargerClassesSelect() {
const select = document.getElementById('eleveClasse');
if (!select) return;
select.innerHTML = '<option value="">Choisir une classe</option>';
classes.forEach(c => {
select.innerHTML += <option value="${c.id}">${c.nom}</option>;
});
}

function chargerElevesList() {
const container = document.getElementById('elevesList');
if (!container) return;
if (eleves.length === 0) {
container.innerHTML = '<p>Aucun élève</p>';
return;
}
let html = '';
eleves.forEach(e => {
const classe = classes.find(c => c.id === e.classeId);
html += <div class="admin-item"><span>${e.nom} ${e.prenom} - ${classe?.nom || '?'}</span><button class="delete-btn" onclick="supprimerEleve(${e.id})">🗑️</button></div>;
});
container.innerHTML = html;
}

window.ajouterEleve = function() {
const nom = document.getElementById('eleveNom').value.trim();
const prenom = document.getElementById('elevePrenom').value.trim();
const classeId = document.getElementById('eleveClasse').value;

if (!nom || !prenom || !classeId) return alert('❌ Tous les champs requis');

eleves.push({
id: prochainIdEleve++,
nom: nom,
prenom: prenom,
classeId: parseInt(classeId)
});

document.getElementById('eleveNom').value = '';
document.getElementById('elevePrenom').value = '';

chargerElevesList();
alert('✅ Élève ajouté');
};

window.supprimerEleve = function(id) {
if (!confirm('Supprimer cet élève ?')) return;
eleves = eleves.filter(e => e.id !== id);
chargerElevesList();
};

// ===============================
// ADMINISTRATION
// ===============================
function chargerAdministration() {
const container = document.getElementById('adminList');
if (!container) return;
if (admins.length === 0) {
container.innerHTML = '<p>Aucun membre</p>';
return;
}
let html = '';
admins.forEach(a => {
html += <div class="card"><h3>${a.nom}</h3><p><strong>${a.role}</strong></p></div>;
});
container.innerHTML = html;
}

function chargerAdminsList() {
const container = document.getElementById('adminsList');
if (!container) return;
if (admins.length === 0) {
container.innerHTML = '<p>Aucun membre</p>';
return;
}
let html = '';
admins.forEach(a => {
html += <div class="admin-item"><span>${a.nom} - ${a.role}</span><button class="delete-btn" onclick="supprimerAdmin(${a.id})">🗑️</button></div>;
});
container.innerHTML = html;
}

window.ajouterAdmin = function() {
const nom = document.getElementById('adminNom').value.trim();
const role = document.getElementById('adminRole').value.trim();
if (!nom || !role) return alert('❌ Nom et rôle requis');
admins.push({ id: prochainIdAdmin++, nom: nom, role: role });
document.getElementById('adminNom').value = '';
document.getElementById('adminRole').value = '';
chargerAdministration();
chargerAdminsList();
alert('✅ Membre ajouté');
};

window.supprimerAdmin = function(id) {
if (!confirm('Supprimer ce membre ?')) return;
admins = admins.filter(a => a.id !== id);
chargerAdministration();
chargerAdminsList();
};

// ===============================
// ANCIENS ÉLÈVES
// ===============================
function chargerAnciens() {
const container = document.getElementById('anciensList');
if (!container) return;
if (anciens.length === 0) {
container.innerHTML = '<p>Aucun ancien élève</p>';
return;
}
let html = '';
anciens.forEach(a => {
html += <div class="card"><h3>${a.nom}</h3><p>Bac ${a.annee} - ${a.parcours}</p></div>;
});
container.innerHTML = html;
}

// ===============================
// RECHERCHE
// ===============================
window.rechercher = function() {
const query = document.getElementById('searchQuery').value.toLowerCase().trim();
const results = document.getElementById('searchResults');

if (!query) {
results.innerHTML = '<p>Entrez un terme de recherche</p>';
return;
}

// Recherche dans les élèves
const elevesTrouves = eleves.filter(e =>
e.nom.toLowerCase().includes(query) || e.prenom.toLowerCase().includes(query)
).map(e => {
const classe = classes.find(c => c.id === e.classeId);
return <div class="card"><h3>👨‍🎓 ${e.nom} ${e.prenom}</h3><p>Classe: ${classe?.nom || '?'}</p></div>;
}).join('');

// Recherche dans les enseignants
const adminsTrouves = admins.filter(a =>
a.nom.toLowerCase().includes(query)
).map(a => {
return <div class="card"><h3>👨‍🏫 ${a.nom}</h3><p>${a.role}</p></div>;
}).join('');

// Recherche dans les cours
const coursTrouves = cours.filter(c =>
c.titre.toLowerCase().includes(query) || c.professeur.toLowerCase().includes(query)
).map(c => {
return <div class="card"><h3>📚 ${c.titre}</h3><p>Par ${c.professeur}</p></div>;
}).join('');

if (!elevesTrouves && !adminsTrouves && !coursTrouves) {
results.innerHTML = '<p>Aucun résultat trouvé</p>';
} else {
results.innerHTML = elevesTrouves + adminsTrouves + coursTrouves;
}
};

// ===============================
// INIT
// ===============================
chargerPublications();
chargerCours();
chargerAdministration();
chargerAnciens();
console.log('✅ Site prêt avec toutes les fonctionnalités');
