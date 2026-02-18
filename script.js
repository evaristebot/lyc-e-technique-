// ===============================
// CONFIGURATION SUPABASE - CLÉ CORRECTE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase connecté avec la bonne clé");

// ===============================
// NAVIGATION
// ===============================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

window.goHome = () => showPage('home');
window.goToAdministration = () => { showPage('administration'); chargerAdministration(); };
window.goToAnciens = () => { showPage('anciens'); chargerAnciens(); };
window.goToJournal = () => { showPage('journal'); chargerArticles(); };
window.goToBulletins = () => showPage('bulletins');
window.goToRecherche = () => showPage('recherche');

window.goToAdmin = () => {
  showPage('admin');
  document.getElementById('adminPasswordBox').style.display = 'block';
  document.getElementById('adminZone').style.display = 'none';
};

// ===============================
// ADMIN : MOT DE PASSE
// ===============================
window.checkAdminPassword = () => {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    chargerSpecialites();
    chargerClasses();
    chargerMatieres();
    chargerEnseignantsAdmin();
    chargerAdministrationAdmin();
    chargerArticlesAdmin();
    chargerSpecialitesSelect();
    chargerClassesSelect();
    chargerClassesPourNotes();
  } else {
    alert('Mot de passe incorrect');
  }
};

// ===============================
// SPÉCIALITÉS
// ===============================
window.ajouterSpecialite = async () => {
  const nom = document.getElementById('specialiteNom').value.trim();
  if (!nom) return alert('Nom requis');
  
  const { error } = await supabaseClient.from('specialites').insert([{ nom }]);
  if (error) {
    alert('Erreur : ' + error.message);
  } else {
    alert('✅ Spécialité ajoutée');
    document.getElementById('specialiteNom').value = '';
    chargerSpecialites();
    chargerSpecialitesSelect();
  }
};

async function chargerSpecialites() {
  const { data } = await supabaseClient.from('specialites').select('*');
  const container = document.getElementById('specialitesList');
  if (!container) return;
  
  let html = '';
  data?.forEach(s => {
    html += `<div style="background:#f0f0f0; padding:10px; margin:5px 0;">${s.nom} <button onclick="supprimerSpecialite(${s.id})">🗑️</button></div>`;
  });
  container.innerHTML = html || '<p>Aucune spécialité</p>';
}

window.supprimerSpecialite = async (id) => {
  if (!confirm('Supprimer ?')) return;
  await supabaseClient.from('specialites').delete().eq('id', id);
  chargerSpecialites();
  chargerSpecialitesSelect();
};

// ===============================
// AUTRES FONCTIONS SIMPLIFIÉES
// ===============================
async function chargerSpecialitesSelect() {
  const { data } = await supabaseClient.from('specialites').select('*');
  const select = document.getElementById('classeSpecialite');
  if (select) {
    select.innerHTML = '<option value="">Choisir</option>';
    data?.forEach(s => {
      select.innerHTML += `<option value="${s.id}">${s.nom}</option>`;
    });
  }
}

// ===============================
// INIT
// ===============================
console.log("✅ Script prêt");
