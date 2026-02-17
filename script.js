// Configuration Supabase
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Navigation
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
  document.getElementById('adminPasswordBox').style.display = 'block';
  document.getElementById('adminZone').style.display = 'none';
};

// Admin
window.checkAdminPassword = function() {
  const pwd = document.getElementById('adminPassword').value;
  if(pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
  } else {
    alert('Mot de passe incorrect');
  }
};

// Gestion élèves
window.ajouterEleve = function() {
  const nom = document.getElementById('eleveNom').value;
  const prenom = document.getElementById('elevePrenom').value;
  if(!nom || !prenom) {
    alert('Remplis le nom et prénom');
    return;
  }
  alert('Élève ajouté');
  document.getElementById('eleveNom').value = '';
  document.getElementById('elevePrenom').value = '';
  document.getElementById('eleveClasse').value = '';
};

// Gestion anciens
window.ajouterAncien = function() {
  const nom = document.getElementById('ancienNom').value;
  const prenom = document.getElementById('ancienPrenom').value;
  const annee = document.getElementById('ancienAnnee').value;
  alert(`Ancien ${nom} ${prenom} (${annee}) ajouté`);
  document.getElementById('ancienNom').value = '';
  document.getElementById('ancienPrenom').value = '';
  document.getElementById('ancienAnnee').value = '';
};

// Logo
window.updateLogo = function() {
  const newUrl = document.getElementById('newLogo').value;
  if(newUrl) {
    document.getElementById('mainLogo').src = newUrl;
    document.querySelector('.nav-logo img').src = newUrl;
    alert('Logo mis à jour');
    document.getElementById('newLogo').value = '';
  }
};

// Recherche
window.rechercher = function() {
  const query = document.getElementById('searchQuery').value;
  const results = document.getElementById('searchResults');
  if(!query) {
    results.innerHTML = '<p>Entrez un nom</p>';
    return;
  }
  results.innerHTML = `
    <div style="background:#f9f9f9; padding:15px;">
      <p><strong>Jean NKOU</strong> - Électricité 1ère</p>
      <p><strong>M. Pierre ESSOMBA</strong> - WhatsApp</p>
    </div>
  `;
};

// Bulletin
window.rechercherBulletin = function() {
  const nom = document.getElementById('searchEleve').value;
  const result = document.getElementById('bulletinResult');
  if(!nom) {
    result.innerHTML = '<p>Entrez un nom</p>';
    return;
  }
  result.innerHTML = `
    <div style="background:white; padding:20px;">
      <h3>Jean NKOU</h3>
      <p>Maths: 14/20 (coef 4)</p>
      <p>Français: 12/20 (coef 2)</p>
      <p>Moyenne: 13.33/20</p>
    </div>
  `;
};

// Articles
function chargerArticles() {
  document.getElementById('articlesList').innerHTML = `
    <div style="background:white; padding:20px;">
      <h3>Rentrée 2025</h3>
      <p>La rentrée aura lieu le 9 septembre.</p>
    </div>
  `;
}

console.log('Site prêt');
