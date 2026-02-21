// ==================== DONNÉES ====================
let specialites = JSON.parse(localStorage.getItem('specialites')) || [];
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let eleves = JSON.parse(localStorage.getItem('eleves')) || [];
let enseignants = JSON.parse(localStorage.getItem('enseignants')) || [];
let cours = JSON.parse(localStorage.getItem('cours')) || [];
let publications = JSON.parse(localStorage.getItem('publications')) || [];
let administration = JSON.parse(localStorage.getItem('administration')) || [];
let anciens = JSON.parse(localStorage.getItem('anciens')) || [];
let bulletins = JSON.parse(localStorage.getItem('bulletins')) || [];

function sauvegarder() {
    localStorage.setItem('specialites', JSON.stringify(specialites));
    localStorage.setItem('classes', JSON.stringify(classes));
    localStorage.setItem('eleves', JSON.stringify(eleves));
    localStorage.setItem('enseignants', JSON.stringify(enseignants));
    localStorage.setItem('cours', JSON.stringify(cours));
    localStorage.setItem('publications', JSON.stringify(publications));
    localStorage.setItem('administration', JSON.stringify(administration));
    localStorage.setItem('anciens', JSON.stringify(anciens));
    localStorage.setItem('bulletins', JSON.stringify(bulletins));
}

// ==================== NAVIGATION ====================
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
window.goHome = () => showPage('home');
window.goToEleves = () => { showPage('eleves'); afficherEleves(); };
window.goToEnseignants = () => { showPage('enseignants'); afficherEnseignants(); };
window.goToCours = () => { showPage('cours'); afficherCours(); };
window.goToPublications = () => { showPage('publications'); afficherPublications(); };
window.goToClasses = () => { showPage('classes'); afficherClasses(); };
window.goToSpecialites = () => { showPage('specialites'); afficherSpecialites(); };
window.goToAdministration = () => { showPage('administration'); afficherAdministration(); };
window.goToAnciens = () => { showPage('anciens'); afficherAnciens(); };
window.goToBulletins = () => { showPage('bulletins'); remplirSelectClasses(); afficherBulletins(); };
window.goToAdmin = () => showPage('admin');

// ==================== SPÉCIALITÉS ====================
function afficherSpecialites() {
    let html = '';
    specialites.forEach((s, i) => {
        html += `<div class="item">${s.nom} <button class="delete-btn" onclick="supprimerSpecialite(${i})">🗑️</button></div>`;
    });
    document.getElementById('specialitesList').innerHTML = html || '<p>Aucune spécialité</p>';
}
window.ajouterSpecialite = () => {
    let nom = document.getElementById('specialiteNom').value.trim();
    if (!nom) return alert('Nom requis');
    specialites.push({ nom });
    sauvegarder();
    document.getElementById('specialiteNom').value = '';
    afficherSpecialites();
};
window.supprimerSpecialite = (i) => { specialites.splice(i,1); sauvegarder(); afficherSpecialites(); };

// ==================== CLASSES ====================
function afficherClasses() {
    let html = '';
    classes.forEach((c, i) => {
        html += `<div class="item">${c.nom} <button class="delete-btn" onclick="supprimerClasse(${i})">🗑️</button></div>`;
    });
    document.getElementById('classesList').innerHTML = html || '<p>Aucune classe</p>';
}
window.ajouterClasse = () => {
    let nom = document.getElementById('classeNom').value.trim();
    if (!nom) return alert('Nom requis');
    classes.push({ nom });
    sauvegarder();
    document.getElementById('classeNom').value = '';
    afficherClasses();
};
window.supprimerClasse = (i) => { classes.splice(i,1); sauvegarder(); afficherClasses(); };

// ==================== ÉLÈVES ====================
function afficherEleves() {
    let html = '';
    eleves.forEach((e, i) => {
        html += `<div class="item">${e.nom} ${e.prenom} - ${e.classe} (☎️ ${e.contact}) <button class="delete-btn" onclick="supprimerEleve(${i})">🗑️</button></div>`;
    });
    document.getElementById('elevesList').innerHTML = html || '<p>Aucun élève</p>';
}
window.ajouterEleve = () => {
    let nom = document.getElementById('eleveNom').value.trim();
    let prenom = document.getElementById('elevePrenom').value.trim();
    let classe = document.getElementById('eleveClasse').value.trim();
    let contact = document.getElementById('eleveContact').value.trim();
    if (!nom || !prenom || !classe || !contact) return alert('Tous les champs requis');
    eleves.push({ nom, prenom, classe, contact });
    sauvegarder();
    document.getElementById('eleveNom').value = '';
    document.getElementById('elevePrenom').value = '';
    document.getElementById('eleveClasse').value = '';
    document.getElementById('eleveContact').value = '';
    afficherEleves();
};
window.supprimerEleve = (i) => { eleves.splice(i,1); sauvegarder(); afficherEleves(); };

// ==================== ENSEIGNANTS ====================
function afficherEnseignants() {
    let html = '';
    enseignants.forEach((e, i) => {
        html += `<div class="item">${e.nom} ${e.prenom} - ${e.matiere} (☎️ ${e.contact}) <button class="delete-btn" onclick="supprimerEnseignant(${i})">🗑️</button></div>`;
    });
    document.getElementById('enseignantsList').innerHTML = html || '<p>Aucun enseignant</p>';
}
window.ajouterEnseignant = () => {
    let nom = document.getElementById('ensNom').value.trim();
    let prenom = document.getElementById('ensPrenom').value.trim();
    let matiere = document.getElementById('ensMatiere').value.trim();
    let contact = document.getElementById('ensContact').value.trim();
    if (!nom || !prenom || !matiere || !contact) return alert('Tous les champs requis');
    enseignants.push({ nom, prenom, matiere, contact });
    sauvegarder();
    document.getElementById('ensNom').value = '';
    document.getElementById('ensPrenom').value = '';
    document.getElementById('ensMatiere').value = '';
    document.getElementById('ensContact').value = '';
    afficherEnseignants();
};
window.supprimerEnseignant = (i) => { enseignants.splice(i,1); sauvegarder(); afficherEnseignants(); };

// ==================== COURS ====================
function afficherCours() {
    let html = '';
    cours.forEach((c, i) => {
        html += `<div class="item">${c.titre} - ${c.prof} (${c.type}) <button class="delete-btn" onclick="supprimerCours(${i})">🗑️</button></div>`;
    });
    document.getElementById('coursList').innerHTML = html || '<p>Aucun cours</p>';
}
window.ajouterCours = () => {
    let titre = document.getElementById('coursTitre').value.trim();
    let prof = document.getElementById('coursProf').value.trim();
    let desc = document.getElementById('coursDesc').value.trim();
    let type = document.getElementById('coursType').value;
    let lien = document.getElementById('coursLien').value.trim();
    if (!titre || !prof || !desc || !lien) return alert('Tous les champs requis');
    cours.push({ titre, prof, desc, type, lien });
    sauvegarder();
    document.getElementById('coursTitre').value = '';
    document.getElementById('coursProf').value = '';
    document.getElementById('coursDesc').value = '';
    document.getElementById('coursLien').value = '';
    afficherCours();
};
window.supprimerCours = (i) => { cours.splice(i,1); sauvegarder(); afficherCours(); };

// ==================== PUBLICATIONS ====================
function afficherPublications() {
    let html = '';
    publications.forEach((p, i) => {
        html += `<div class="item"><strong>${p.titre}</strong> : ${p.contenu} <button class="delete-btn" onclick="supprimerPublication(${i})">🗑️</button></div>`;
    });
    document.getElementById('publicationsList').innerHTML = html || '<p>Aucune publication</p>';
}
window.ajouterPublication = () => {
    let titre = document.getElementById('pubTitre').value.trim();
    let contenu = document.getElementById('pubContenu').value.trim();
    if (!titre || !contenu) return alert('Titre et contenu requis');
    publications.push({ titre, contenu });
    sauvegarder();
    document.getElementById('pubTitre').value = '';
    document.getElementById('pubContenu').value = '';
    afficherPublications();
};
window.supprimerPublication = (i) => { publications.splice(i,1); sauvegarder(); afficherPublications(); };

// ==================== ADMINISTRATION ====================
function afficherAdministration() {
    let html = '';
    administration.forEach((a, i) => {
        html += `<div class="item">${a.nom} - ${a.role} (☎️ ${a.contact}) <button class="delete-btn" onclick="supprimerAdmin(${i})">🗑️</button></div>`;
    });
    document.getElementById('administrationList').innerHTML = html || '<p>Aucun membre</p>';
}
window.ajouterAdmin = () => {
    let nom = document.getElementById('adminNom').value.trim();
    let role = document.getElementById('adminRole').value.trim();
    let contact = document.getElementById('adminContact').value.trim();
    if (!nom || !role || !contact) return alert('Tous les champs requis');
    administration.push({ nom, role, contact });
    sauvegarder();
    document.getElementById('adminNom').value = '';
    document.getElementById('adminRole').value = '';
    document.getElementById('adminContact').value = '';
    afficherAdministration();
};
window.supprimerAdmin = (i) => { administration.splice(i,1); sauvegarder(); afficherAdministration(); };

// ==================== ANCIENS ====================
function afficherAnciens() {
    let html = '';
    anciens.forEach((a, i) => {
        html += `<div class="item">${a.nom} (${a.annee}) - ${a.parcours} <button class="delete-btn" onclick="supprimerAncien(${i})">🗑️</button></div>`;
    });
    document.getElementById('anciensList').innerHTML = html || '<p>Aucun ancien</p>';
}
window.ajouterAncien = () => {
    let nom = document.getElementById('ancienNom').value.trim();
    let annee = document.getElementById('ancienAnnee').value.trim();
    let parcours = document.getElementById('ancienParcours').value.trim();
    if (!nom || !annee || !parcours) return alert('Tous les champs requis');
    anciens.push({ nom, annee, parcours });
    sauvegarder();
    document.getElementById('ancienNom').value = '';
    document.getElementById('ancienAnnee').value = '';
    document.getElementById('ancienParcours').value = '';
    afficherAnciens();
};
window.supprimerAncien = (i) => { anciens.splice(i,1); sauvegarder(); afficherAnciens(); };

// ==================== BULLETINS ====================
function remplirSelectClasses() {
    let select = document.getElementById('bulletinClasse');
    select.innerHTML = '<option value="">Choisir une classe</option>';
    classes.forEach(c => select.innerHTML += `<option value="${c.nom}">${c.nom}</option>`);
}

function afficherBulletins() {
    let classe = document.getElementById('bulletinClasse').value;
    let trimestre = document.getElementById('bulletinTrimestre').value;
    if (!classe) return;

    let elevesDeLaClasse = eleves.filter(e => e.classe === classe);
    let html = '';

    elevesDeLaClasse.forEach(e => {
        let notes = bulletins.filter(b => b.eleve === e.nom && b.classe === classe && b.trimestre == trimestre);
        let totalPoints = 0, totalCoeff = 0;
        notes.forEach(n => {
            totalPoints += n.note * n.coeff;
            totalCoeff += n.coeff;
        });
        let moyenne = totalCoeff ? (totalPoints / totalCoeff).toFixed(2) : '—';
        html += `<div class="item"><strong>${e.nom} ${e.prenom}</strong> : Moyenne ${moyenne}/20</div>`;
    });
    document.getElementById('bulletinsList').innerHTML = html || '<p>Aucun bulletin</p>';
}

// ==================== ADMIN ESPACE ====================
window.checkAdminPassword = () => {
    if (document.getElementById('adminPassword').value === "LTB2025") {
        document.getElementById('adminPasswordBox').style.display = 'none';
        document.getElementById('adminZone').style.display = 'block';
    } else alert('Mot de passe incorrect');
};

// ==================== INIT ====================
afficherSpecialites();
afficherClasses();
afficherEleves();
afficherEnseignants();
afficherCours();
afficherPublications();
afficherAdministration();
afficherAnciens();
