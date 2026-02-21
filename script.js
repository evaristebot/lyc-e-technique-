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

// Pages publiques
window.goToEleves = () => { showPage('eleves'); afficherPublic('eleves'); };
window.goToEnseignants = () => { showPage('enseignants'); afficherPublic('enseignants'); };
window.goToCours = () => { showPage('cours'); afficherPublic('cours'); };
window.goToPublications = () => { showPage('publications'); afficherPublic('publications'); };
window.goToClasses = () => { showPage('classes'); afficherPublic('classes'); };
window.goToSpecialites = () => { showPage('specialites'); afficherPublic('specialites'); };
window.goToAdministration = () => { showPage('administration'); afficherPublic('administration'); };
window.goToAnciens = () => { showPage('anciens'); afficherPublic('anciens'); };
window.goToBulletins = () => { showPage('bulletins'); remplirSelectClasses(); };
window.goToAdmin = () => showPage('admin');

// ==================== AFFICHAGE PUBLIC ====================
function afficherPublic(type) {
    let data = [];
    let containerId = '';

    switch(type) {
        case 'eleves': data = eleves; containerId = 'elevesListPublic'; break;
        case 'enseignants': data = enseignants; containerId = 'enseignantsListPublic'; break;
        case 'cours': data = cours; containerId = 'coursListPublic'; break;
        case 'publications': data = publications; containerId = 'publicationsListPublic'; break;
        case 'classes': data = classes; containerId = 'classesListPublic'; break;
        case 'specialites': data = specialites; containerId = 'specialitesListPublic'; break;
        case 'administration': data = administration; containerId = 'administrationListPublic'; break;
        case 'anciens': data = anciens; containerId = 'anciensListPublic'; break;
    }

    let html = '';
    data.forEach(item => {
        if (type === 'eleves') html += `<div class="card"><h3>${item.nom} ${item.prenom}</h3><p>Classe: ${item.classe}<br>☎️ ${item.contact}</p></div>`;
        else if (type === 'enseignants') html += `<div class="card"><h3>${item.nom} ${item.prenom}</h3><p>${item.matiere}<br>☎️ ${item.contact}</p></div>`;
        else if (type === 'cours') html += `<div class="card"><h3>${item.titre}</h3><p>${item.prof}<br>${item.desc}</p><a href="${item.lien}" target="_blank">${item.type}</a></div>`;
        else if (type === 'publications') html += `<div class="card"><h3>${item.titre}</h3><p>${item.contenu}</p></div>`;
        else if (type === 'classes') html += `<div class="card"><h3>${item.nom}</h3></div>`;
        else if (type === 'specialites') html += `<div class="card"><h3>${item.nom}</h3></div>`;
        else if (type === 'administration') html += `<div class="card"><h3>${item.nom}</h3><p>${item.role}<br>☎️ ${item.contact}</p></div>`;
        else if (type === 'anciens') html += `<div class="card"><h3>${item.nom}</h3><p>${item.annee}<br>${item.parcours}</p></div>`;
    });
    document.getElementById(containerId).innerHTML = html || '<p>Aucune donnée</p>';
}

// ==================== ADMIN ====================
window.checkAdminPassword = () => {
    if (document.getElementById('adminPassword').value === "LTB2025") {
        document.getElementById('adminPasswordBox').style.display = 'none';
        document.getElementById('adminZone').style.display = 'block';
        adminAfficherTout();
    } else alert('Mot de passe incorrect');
};

function adminAfficherTout() {
    adminAfficher('eleves', 'adminElevesList');
    adminAfficher('enseignants', 'adminEnseignantsList');
    adminAfficher('cours', 'adminCoursList');
    adminAfficher('publications', 'adminPublicationsList');
    adminAfficher('classes', 'adminClassesList');
    adminAfficher('specialites', 'adminSpecialitesList');
    adminAfficher('administration', 'adminAdministrationList');
    adminAfficher('anciens', 'adminAnciensList');
}

function adminAfficher(type, containerId) {
    let data = [];
    switch(type) {
        case 'eleves': data = eleves; break;
        case 'enseignants': data = enseignants; break;
        case 'cours': data = cours; break;
        case 'publications': data = publications; break;
        case 'classes': data = classes; break;
        case 'specialites': data = specialites; break;
        case 'administration': data = administration; break;
        case 'anciens': data = anciens; break;
    }

    let html = '';
    data.forEach((item, index) => {
        html += `<div class="admin-item">${JSON.stringify(item)} <button class="delete-btn" onclick="adminSupprimer('${type}', ${index})">🗑️</button></div>`;
    });
    document.getElementById(containerId).innerHTML = html || '<p>Aucune donnée</p>';
}

window.adminSupprimer = (type, index) => {
    if (!confirm('Supprimer ?')) return;
    switch(type) {
        case 'eleves': eleves.splice(index,1); break;
        case 'enseignants': enseignants.splice(index,1); break;
        case 'cours': cours.splice(index,1); break;
        case 'publications': publications.splice(index,1); break;
        case 'classes': classes.splice(index,1); break;
        case 'specialites': specialites.splice(index,1); break;
        case 'administration': administration.splice(index,1); break;
        case 'anciens': anciens.splice(index,1); break;
    }
    sauvegarder();
    adminAfficherTout();
    afficherPublic(type);
};

// ==================== ADMIN AJOUT ====================
window.adminAjouterEleve = () => {
    let n = document.getElementById('adminEleveNom').value.trim();
    let p = document.getElementById('adminElevePrenom').value.trim();
    let c = document.getElementById('adminEleveClasse').value.trim();
    let co = document.getElementById('adminEleveContact').value.trim();
    if (!n || !p || !c || !co) return alert('Tous les champs requis');
    eleves.push({ nom: n, prenom: p, classe: c, contact: co });
    sauvegarder();
    document.getElementById('adminEleveNom').value = '';
    document.getElementById('adminElevePrenom').value = '';
    document.getElementById('adminEleveClasse').value = '';
    document.getElementById('adminEleveContact').value = '';
    adminAfficher('eleves', 'adminElevesList');
    afficherPublic('eleves');
};

window.adminAjouterEnseignant = () => {
    let n = document.getElementById('adminEnsNom').value.trim();
    let p = document.getElementById('adminEnsPrenom').value.trim();
    let m = document.getElementById('adminEnsMatiere').value.trim();
    let co = document.getElementById('adminEnsContact').value.trim();
    if (!n || !p || !m || !co) return alert('Tous les champs requis');
    enseignants.push({ nom: n, prenom: p, matiere: m, contact: co });
    sauvegarder();
    document.getElementById('adminEnsNom').value = '';
    document.getElementById('adminEnsPrenom').value = '';
    document.getElementById('adminEnsMatiere').value = '';
    document.getElementById('adminEnsContact').value = '';
    adminAfficher('enseignants', 'adminEnseignantsList');
    afficherPublic('enseignants');
};

window.adminAjouterCours = () => {
    let t = document.getElementById('adminCoursTitre').value.trim();
    let pr = document.getElementById('adminCoursProf').value.trim();
    let d = document.getElementById('adminCoursDesc').value.trim();
    let ty = document.getElementById('adminCoursType').value;
    let l = document.getElementById('adminCoursLien').value.trim();
    if (!t || !pr || !d || !l) return alert('Tous les champs requis');
    cours.push({ titre: t, prof: pr, desc: d, type: ty, lien: l });
    sauvegarder();
    document.getElementById('adminCoursTitre').value = '';
    document.getElementById('adminCoursProf').value = '';
    document.getElementById('adminCoursDesc').value = '';
    document.getElementById('adminCoursLien').value = '';
    adminAfficher('cours', 'adminCoursList');
    afficherPublic('cours');
};

window.adminAjouterPublication = () => {
    let t = document.getElementById('adminPubTitre').value.trim();
    let c = document.getElementById('adminPubContenu').value.trim();
    if (!t || !c) return alert('Titre et contenu requis');
    publications.push({ titre: t, contenu: c });
    sauvegarder();
    document.getElementById('adminPubTitre').value = '';
    document.getElementById('adminPubContenu').value = '';
    adminAfficher('publications', 'adminPublicationsList');
    afficherPublic('publications');
};

window.adminAjouterClasse = () => {
    let n = document.getElementById('adminClasseNom').value.trim();
    if (!n) return alert('Nom requis');
    classes.push({ nom: n });
    sauvegarder();
    document.getElementById('adminClasseNom').value = '';
    adminAfficher('classes', 'adminClassesList');
    afficherPublic('classes');
};

window.adminAjouterSpecialite = () => {
    let n = document.getElementById('adminSpecialiteNom').value.trim();
    if (!n) return alert('Nom requis');
    specialites.push({ nom: n });
    sauvegarder();
    document.getElementById('adminSpecialiteNom').value = '';
    adminAfficher('specialites', 'adminSpecialitesList');
    afficherPublic('specialites');
};

window.adminAjouterAdmin = () => {
    let n = document.getElementById('adminAdminNom').value.trim();
    let r = document.getElementById('adminAdminRole').value.trim();
    let c = document.getElementById('adminAdminContact').value.trim();
    if (!n || !r || !c) return alert('Tous les champs requis');
    administration.push({ nom: n, role: r, contact: c });
    sauvegarder();
    document.getElementById('adminAdminNom').value = '';
    document.getElementById('adminAdminRole').value = '';
    document.getElementById('adminAdminContact').value = '';
    adminAfficher('administration', 'adminAdministrationList');
    afficherPublic('administration');
};

window.adminAjouterAncien = () => {
    let n = document.getElementById('adminAncienNom').value.trim();
    let a = document.getElementById('adminAncienAnnee').value.trim();
    let p = document.getElementById('adminAncienParcours').value.trim();
    if (!n || !a || !p) return alert('Tous les champs requis');
    anciens.push({ nom: n, annee: a, parcours: p });
    sauvegarder();
    document.getElementById('adminAncienNom').value = '';
    document.getElementById('adminAncienAnnee').value = '';
    document.getElementById('adminAncienParcours').value = '';
    adminAfficher('anciens', 'adminAnciensList');
    afficherPublic('anciens');
};

// ==================== BULLETINS ====================
function remplirSelectClasses() {
    let select = document.getElementById('bulletinClasse');
    select.innerHTML = '<option value="">Choisir une classe</option>';
    classes.forEach(c => select.innerHTML += `<option value="${c.nom}">${c.nom}</option>`);
}

window.afficherBulletinsPublic = () => {
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
        html += `<div class="card"><h3>${e.nom} ${e.prenom}</h3><p>Moyenne T${trimestre} : <strong>${moyenne}/20</strong></p></div>`;
    });
    document.getElementById('bulletinsListPublic').innerHTML = html || '<p>Aucun bulletin</p>';
};

// ==================== INIT ====================
afficherPublic('eleves');
afficherPublic('enseignants');
afficherPublic('cours');
afficherPublic('publications');
afficherPublic('classes');
afficherPublic('specialites');
afficherPublic('administration');
afficherPublic('anciens');
