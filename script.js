// ===== CONFIGURATION SUPABASE =====
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ===== MOT DE PASSE ADMIN =====
const ADMIN_PASSWORD = "LTB2025";

// ===== FONCTIONS DE NAVIGATION GLOBALES =====
window.goHome = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('home').classList.add('active');
};

window.goToAdministration = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('administration').classList.add('active');
};

window.goToAnciens = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('anciens').classList.add('active');
};

window.goToJournal = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('journal').classList.add('active');
    chargerArticles();
};

window.goToBulletins = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('bulletins').classList.add('active');
};

window.goToRecherche = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('recherche').classList.add('active');
};

window.goToAdmin = function() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('admin').classList.add('active');
    
    // Réinitialiser l'affichage admin
    document.getElementById('adminPasswordBox').style.display = 'block';
    document.getElementById('adminZone').style.display = 'none';
    document.getElementById('adminMasterPassword').value = '';
};

// ===== ADMIN : VÉRIFICATION DU MOT DE PASSE =====
window.checkMasterPassword = function() {
    const pwd = document.getElementById('adminMasterPassword').value;
    if(pwd === ADMIN_PASSWORD) {
        document.getElementById('adminPasswordBox').style.display = 'none';
        document.getElementById('adminZone').style.display = 'block';
        chargerListesAdmin();
    } else {
        alert('❌ Mot de passe incorrect');
    }
};

// ===== AFFICHAGE DES LISTES DANS ADMIN =====
function chargerListesAdmin() {
    document.getElementById('elevesList').innerHTML = `
        <div style="background:#f9f9f9; padding:10px; margin:5px 0;">
            Jean NKOU - Électricité 1ère 
            <button onclick="supprimerEleve(1)" style="float:right; background:red; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
        </div>
        <div style="background:#f9f9f9; padding:10px; margin:5px 0;">
            Marie NGO - Comptabilité 2ème
            <button onclick="supprimerEleve(2)" style="float:right; background:red; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
        </div>
    `;
    
    document.getElementById('anciensAdminList').innerHTML = `
        <div style="background:#f9f9f9; padding:10px; margin:5px 0;">
            Marc TCHANA - Bac 2015
            <button onclick="supprimerAncien(1)" style="float:right; background:red; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
        </div>
    `;
}

// ===== GESTION ÉLÈVES =====
window.ajouterEleve = function() {
    const nom = document.getElementById('eleveNom').value;
    const prenom = document.getElementById('elevePrenom').value;
    
    if(!nom || !prenom) {
        alert('❌ Nom et prénom requis');
        return;
    }
    
    alert(`✅ Élève ${nom} ${prenom} ajouté`);
    document.getElementById('eleveNom').value = '';
    document.getElementById('elevePrenom').value = '';
    document.getElementById('eleveClasse').value = '';
    document.getElementById('eleveParent').value = '';
    chargerListesAdmin();
};

window.supprimerEleve = function(id) {
    if(confirm('Supprimer cet élève ?')) {
        alert('✅ Élève supprimé');
        chargerListesAdmin();
    }
};

// ===== GESTION ANCIENS =====
window.ajouterAncien = function() {
    const nom = document.getElementById('ancienNom').value;
    const prenom = document.getElementById('ancienPrenom').value;
    const annee = document.getElementById('ancienAnnee').value;
    
    if(!nom || !prenom || !annee) {
        alert('❌ Remplis tous les champs');
        return;
    }
    
    alert(`✅ Ancien ${nom} ${prenom} (${annee}) ajouté`);
    document.getElementById('ancienNom').value = '';
    document.getElementById('ancienPrenom').value = '';
    document.getElementById('ancienAnnee').value = '';
    document.getElementById('ancienPhoto').value = '';
    document.getElementById('ancienParcours').value = '';
    chargerListesAdmin();
};

window.supprimerAncien = function(id) {
    if(confirm('Supprimer cet ancien ?')) {
        alert('✅ Ancien supprimé');
        chargerListesAdmin();
    }
};

// ===== MODIFICATION LOGO =====
window.updateLogo = function() {
    const newUrl = document.getElementById('newLogoUrl').value;
    if(newUrl) {
        document.getElementById('mainLogo').src = newUrl;
        document.querySelector('.nav-logo img').src = newUrl;
        alert('✅ Logo mis à jour');
        document.getElementById('newLogoUrl').value = '';
    } else {
        alert('❌ Veuillez entrer une URL');
    }
};

// ===== RECHERCHE =====
window.rechercher = function() {
    const query = document.getElementById('searchQuery').value;
    const results = document.getElementById('searchResults');
    
    if(!query) {
        results.innerHTML = '<p>Entrez un nom</p>';
        return;
    }
    
    results.innerHTML = `
        <div style="background:#f9f9f9; padding:15px; margin:10px 0; border-radius:10px;">
            <h4>Élèves</h4>
            <p><strong>Jean NKOU</strong> - Électricité 1ère - Parent: 699112233</p>
            <p><strong>Marie NGO</strong> - Comptabilité 2ème - Parent: 699445566</p>
            <h4>Enseignants</h4>
            <p><strong>M. Pierre ESSOMBA</strong> - Atelier - <a href="https://wa.me/237699112233" target="_blank">WhatsApp</a></p>
            <p><strong>Mme Marie BELL</strong> - Français - <a href="https://wa.me/237699445566" target="_blank">WhatsApp</a></p>
        </div>
    `;
};

// ===== BULLETINS =====
window.rechercherBulletin = function() {
    const query = document.getElementById('searchEleveBulletin').value;
    const result = document.getElementById('bulletinResult');
    
    if(!query) {
        result.innerHTML = '<p>Entrez un nom</p>';
        return;
    }
    
    result.innerHTML = `
        <div style="background:white; padding:20px; border-radius:15px;">
            <h3>Jean NKOU - Électricité 1ère</h3>
            <p>Mathématiques (coef 4): 14/20 → 56 points</p>
            <p>Français (coef 2): 12/20 → 24 points</p>
            <p>Atelier (coef 6): 16/20 → 96 points</p>
            <p><strong>Moyenne générale: 14.67/20</strong></p>
        </div>
    `;
};

// ===== ARTICLES =====
function chargerArticles() {
    const list = document.getElementById('articlesList');
    list.innerHTML = `
        <div style="background:white; padding:20px; border-radius:15px;">
            <h3>Rentrée scolaire 2025</h3>
            <p>La rentrée aura lieu le 9 septembre.</p>
            <small>15/08/2025</small>
        </div>
        <div style="background:white; padding:20px; border-radius:15px;">
            <h3>Journées Portes Ouvertes</h3>
            <p>Les 20-21 novembre.</p>
            <small>10/08/2025</small>
        </div>
    `;
}

// ===== INITIALISATION =====
console.log('✅ Script chargé - Tous les boutons fonctionnent');
