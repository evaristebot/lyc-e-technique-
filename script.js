// ===============================
// DONNÉES EN MÉMOIRE (comme ARJAP)
// ===============================
let publications = [
  { 
    id: 1,
    titre: "Rentrée scolaire 2025", 
    contenu: "La rentrée aura lieu le 9 septembre 2025. Tous les élèves sont attendus.",
    date: new Date().toLocaleDateString('fr-FR')
  },
  { 
    id: 2,
    titre: "Journées Portes Ouvertes", 
    contenu: "Le lycée organise ses JPO les 20 et 21 novembre. Venez nombreux !",
    date: new Date().toLocaleDateString('fr-FR')
  }
];

let prochainId = 3;

// ===============================
// CONFIGURATION SUPABASE (optionnelle)
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'sb_publishable_7MoEHv8lIBlhlO8CFZOMRg_AMQdRsrz';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Système ARJAP activé');

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
};

window.goToAnciens = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('anciens').classList.add('active');
};

window.goToJournal = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('journal').classList.add('active');
  chargerPublications(); // Affiche les articles
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
  document.getElementById('adminPassword').value = '';
};

// ===============================
// ADMIN : MOT DE PASSE
// ===============================
window.checkAdminPassword = function() {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    chargerAdminPublications(); // Charge les articles dans l'admin
    chargerSpecialitesLocales();
  } else {
    alert('❌ Mot de passe incorrect');
  }
};

// ===============================
// SYSTÈME DE PUBLICATION (comme ARJAP)
// ===============================

// Afficher les articles dans la page Journal
function chargerPublications() {
  const container = document.getElementById('articlesList');
  if (!container) return;

  if (publications.length === 0) {
    container.innerHTML = '<p>Aucune publication pour le moment.</p>';
    return;
  }

  let html = '';
  publications.forEach(pub => {
    html += `
      <div class="card">
        <h3>${pub.titre}</h3>
        <p>${pub.contenu}</p>
        <small>📅 ${pub.date}</small>
      </div>
    `;
  });
  container.innerHTML = html;
}

// Afficher les articles dans l'espace admin
function chargerAdminPublications() {
  const container = document.getElementById('articlesAdminList');
  if (!container) return;

  if (publications.length === 0) {
    container.innerHTML = '<p>Aucune publication</p>';
    return;
  }

  let html = '';
  publications.forEach(pub => {
    html += `
      <div class="admin-item">
        <div>
          <strong>${pub.titre}</strong><br>
          <small>${pub.date}</small>
        </div>
        <button class="delete-btn" onclick="supprimerPublication(${pub.id})">🗑️ Supprimer</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

// Publier un nouvel article
window.publierArticle = function() {
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();

  if (!titre || !contenu) {
    alert('❌ Titre et contenu requis');
    return;
  }

  publications.push({
    id: prochainId++,
    titre: titre,
    contenu: contenu,
    date: new Date().toLocaleDateString('fr-FR')
  });

  // Réinitialiser le formulaire
  document.getElementById('articleTitre').value = '';
  document.getElementById('articleContenu').value = '';

  // Mettre à jour les affichages
  chargerPublications();
  chargerAdminPublications();

  alert('✅ Article publié !');
};

// Supprimer un article
window.supprimerPublication = function(id) {
  if (!confirm('Supprimer cette publication ?')) return;

  publications = publications.filter(p => p.id !== id);

  chargerPublications();
  chargerAdminPublications();
};

// ===============================
// GESTION DES SPÉCIALITÉS (locale)
// ===============================
let specialites = [
  { id: 1, nom: "Électricité" },
  { id: 2, nom: "Mécanique" },
  { id: 3, nom: "Comptabilité" }
];
let dernierIdSpecialite = 4;

function chargerSpecialitesLocales() {
  const container = document.getElementById('specialitesList');
  if (!container) return;

  if (specialites.length === 0) {
    container.innerHTML = '<p>Aucune spécialité</p>';
    return;
  }

  let html = '';
  specialites.forEach(s => {
    html += `
      <div class="admin-item">
        <span>${s.nom}</span>
        <button class="delete-btn" onclick="supprimerSpecialiteLocale(${s.id})">🗑️</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.ajouterSpecialite = function() {
  const nom = document.getElementById('specialiteNom').value.trim();
  if (!nom) {
    alert('❌ Nom requis');
    return;
  }

  specialites.push({
    id: dernierIdSpecialite++,
    nom: nom
  });

  document.getElementById('specialiteNom').value = '';
  chargerSpecialitesLocales();
  alert('✅ Spécialité ajoutée');
};

window.supprimerSpecialiteLocale = function(id) {
  if (!confirm('Supprimer cette spécialité ?')) return;
  specialites = specialites.filter(s => s.id !== id);
  chargerSpecialitesLocales();
};

// ===============================
// RECHERCHE SIMULÉE
// ===============================
window.rechercher = function() {
  const query = document.getElementById('searchQuery').value.trim();
  const results = document.getElementById('searchResults');

  if (!query) {
    results.innerHTML = '<p>Entrez un nom</p>';
    return;
  }

  results.innerHTML = `
    <div class="card">
      <h3>Résultats pour "${query}"</h3>
      <p><strong>Élèves:</strong> Jean NKOU (Électricité 1ère)</p>
      <p><strong>Enseignants:</strong> M. Pierre ESSOMBA (Chef des travaux)</p>
    </div>
  `;
};

// ===============================
// INITIALISATION
// ===============================
chargerPublications();
console.log('✅ Site prêt - Mode ARJAP activé');
