// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


// ===============================
// SYSTEME DE NAVIGATION
// ===============================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
  }
}

window.goHome = () => showPage('home');
window.goToAdministration = () => showPage('administration');
window.goToAnciens = () => showPage('anciens');

window.goToJournal = () => {
  showPage('journal');
  chargerArticles();
};

window.goToBulletins = () => showPage('bulletins');
window.goToRecherche = () => showPage('recherche');

window.goToAdmin = () => {
  showPage('admin');
  document.getElementById('adminPasswordBox').style.display = 'block';
  document.getElementById('adminZone').style.display = 'none';
};


// ===============================
// ADMIN
// ===============================
window.checkAdminPassword = () => {
  const pwd = document.getElementById('adminPassword').value;

  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
  } else {
    alert('Mot de passe incorrect');
  }
};


// ===============================
// GESTION ELEVES
// ===============================
window.ajouterEleve = () => {
  const nom = document.getElementById('eleveNom').value;
  const prenom = document.getElementById('elevePrenom').value;
  const classe = document.getElementById('eleveClasse').value;

  if (!nom || !prenom) {
    alert('Remplis le nom et prénom');
    return;
  }

  alert(`Élève ${nom} ${prenom} (${classe}) ajouté`);

  document.getElementById('eleveNom').value = '';
  document.getElementById('elevePrenom').value = '';
  document.getElementById('eleveClasse').value = '';
};


// ===============================
// GESTION ANCIENS
// ===============================
window.ajouterAncien = () => {
  const nom = document.getElementById('ancienNom').value;
  const prenom = document.getElementById('ancienPrenom').value;
  const annee = document.getElementById('ancienAnnee').value;

  if (!nom || !prenom || !annee) {
    alert("Remplis tous les champs");
    return;
  }

  alert(`Ancien ${nom} ${prenom} (${annee}) ajouté`);

  document.getElementById('ancienNom').value = '';
  document.getElementById('ancienPrenom').value = '';
  document.getElementById('ancienAnnee').value = '';
};


// ===============================
// MODIFICATION LOGO
// ===============================
window.updateLogo = () => {
  const newUrl = document.getElementById('newLogo').value;

  if (!newUrl) {
    alert("Entre une URL valide");
    return;
  }

  document.getElementById('mainLogo').src = newUrl;
  document.querySelector('.nav-logo img').src = newUrl;

  alert('Logo mis à jour');
  document.getElementById('newLogo').value = '';
};


// ===============================
// RECHERCHE
// ===============================
window.rechercher = () => {
  const query = document.getElementById('searchQuery').value;
  const results = document.getElementById('searchResults');

  if (!query) {
    results.innerHTML = '<p>Entrez un nom</p>';
    return;
  }

  results.innerHTML = `
    <div style="background:#f9f9f9; padding:15px; border-radius:10px;">
      <p><strong>Jean NKOU</strong> - Électricité 1ère</p>
      <p><strong>M. Pierre ESSOMBA</strong> - WhatsApp</p>
    </div>
  `;
};


// ===============================
// BULLETINS
// ===============================
window.rechercherBulletin = () => {
  const nom = document.getElementById('searchEleve').value;
  const result = document.getElementById('bulletinResult');

  if (!nom) {
    result.innerHTML = '<p>Entrez un nom</p>';
    return;
  }

  result.innerHTML = `
    <div style="background:white; padding:20px; border-radius:10px;">
      <h3>Jean NKOU</h3>
      <p>Maths: 14/20 (coef 4)</p>
      <p>Français: 12/20 (coef 2)</p>
      <p>Moyenne: 13.33/20</p>
    </div>
  `;
};


// ===============================
// ARTICLES
// ===============================
function chargerArticles() {
  document.getElementById('articlesList').innerHTML = `
    <div style="background:white; padding:20px; border-radius:10px;">
      <h3>Rentrée 2025</h3>
      <p>La rentrée aura lieu le 9 septembre.</p>
    </div>
  `;
}

console.log("✅ Site prêt - Script chargé");
