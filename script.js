// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase connecté');

// ===============================
// NAVIGATION
// ===============================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

window.goHome = () => showPage('home');
window.goToAdministration = () => { showPage('administration'); chargerAdministration(); };
window.goToAnciens = () => showPage('anciens');
window.goToJournal = () => { showPage('journal'); chargerArticles(); };
window.goToBulletins = () => showPage('bulletins');
window.goToRecherche = () => showPage('recherche');
window.goToCours = () => { showPage('cours'); loadApprovedCourses(); };
window.goToAdmin = () => {
  showPage('admin');
  document.getElementById('adminPasswordBox').style.display = 'block';
  document.getElementById('adminZone').style.display = 'none';
}

// ===============================
// ADMIN PASSWORD
// ===============================
window.checkAdminPassword = () => {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    chargerSpecialites();
    chargerClasses();
    chargerEleves();
    chargerAdmins();
    chargerArticlesAdmin();
    chargerPendingCourses();
  } else {
    alert("Mot de passe incorrect");
  }
}

// ===============================
// TEST BASE DE DONNÉES
// ===============================
window.testDatabase = async () => {
  const resultDiv = document.getElementById('testResult');
  if (!resultDiv) return;
  resultDiv.innerHTML = '⏳ Test...';
  try {
    const { data, error } = await supabaseClient.from('specialites').select('*').limit(5);
    if (error) throw error;
    resultDiv.innerHTML = `✅ Connecté: ${data?.length || 0} spécialité(s)`;
  } catch (err) {
    resultDiv.innerHTML = `❌ Erreur: ${err.message}`;
  }
}

// ===============================
// SPÉCIALITÉS
// ===============================
async function chargerSpecialites() {
  const { data } = await supabaseClient.from('specialites').select('*');
  const container = document.getElementById('specialitesList');
  if (!container) return;
  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucune spécialité</p>';
    return;
  }
  container.innerHTML = data.map(s => `
    <div style="background:#f0f0f0; padding:8px; margin:5px 0;">
      ${s.nom}
      <button onclick="modifierSpecialite(${s.id},'${s.nom}')">✏️</button>
      <button onclick="supprimerSpecialite(${s.id})">🗑️</button>
    </div>
  `).join('');
  
  const opts = '<option value="">Choisir...</option>' + data.map(s => `<option value="${s.id}">${s.nom}</option>`).join('');
  if (document.getElementById('classeSpecialite')) document.getElementById('classeSpecialite').innerHTML = opts;
  if (document.getElementById('eleveSpecialite')) document.getElementById('eleveSpecialite').innerHTML = opts;
}

window.ajouterSpecialite = async () => {
  const nom = document.getElementById('specialiteNom').value.trim();
  if (!nom) return alert("Nom requis");
  await supabaseClient.from('specialites').insert([{ nom }]);
  document.getElementById('specialiteNom').value = '';
  await chargerSpecialites();
  alert('✅ Spécialité ajoutée');
}

window.modifierSpecialite = async (id, old) => {
  const nom = prompt("Modifier", old);
  if (!nom || nom === old) return;
  await supabaseClient.from('specialites').update({ nom }).eq('id', id);
  await chargerSpecialites();
}

window.supprimerSpecialite = async (id) => {
  if (!confirm("Supprimer ?")) return;
  await supabaseClient.from('specialites').delete().eq('id', id);
  await chargerSpecialites();
}

// ===============================
// VERSIONS SIMPLIFIÉES DES AUTRES FONCTIONS
// ===============================
async function chargerClasses() { /* version simplifiée */ }
async function chargerEleves() { /* version simplifiée */ }
async function chargerAdministration() { /* version simplifiée */ }
async function chargerAdmins() { /* version simplifiée */ }
async function chargerArticles() { /* version simplifiée */ }
async function chargerArticlesAdmin() { /* version simplifiée */ }
async function chargerPendingCourses() { /* version simplifiée */ }
async function loadApprovedCourses() { /* version simplifiée */ }

window.ajouterClasse = async () => { alert('Fonction à implémenter'); }
window.ajouterEleve = async () => { alert('Fonction à implémenter'); }
window.ajouterAdmin = async () => { alert('Fonction à implémenter'); }
window.ajouterArticle = async () => { alert('Fonction à implémenter'); }
window.submitCourse = async () => { alert('Fonction à implémenter'); }
window.rechercher = () => { document.getElementById('searchResults').innerHTML = '<p>Recherche simulée</p>'; }
window.rechercherBulletin = () => { document.getElementById('bulletinResult').innerHTML = '<p>Bulletin simulé</p>'; }
window.chargerClassesSelect = () => {}

// ===============================
// INIT
// ===============================
chargerAdministration();
loadApprovedCourses();
console.log('✅ Script prêt');
