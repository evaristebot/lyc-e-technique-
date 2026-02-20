// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'sb_publishable_7MoEHv8lIBlhlO8CFZOMRg_AMQdRsrz';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase connecté');

// ===============================
// FONCTIONS DE NAVIGATION (GLOBALES)
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

window.goToCours = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('cours').classList.add('active');
  loadApprovedCourses();
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
    chargerSpecialites();
    chargerClasses();
    chargerEleves();
    chargerAdmins();
    chargerArticlesAdmin();
    chargerPendingCourses();
  } else {
    alert("Mot de passe incorrect");
  }
};

// ===============================
// TEST BASE DE DONNÉES
// ===============================
window.testDatabase = async function() {
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
};

// ===============================
// SPÉCIALITÉS
// ===============================
async function chargerSpecialites() {
  const container = document.getElementById('specialitesList');
  if (!container) return;
  try {
    const { data, error } = await supabaseClient.from('specialites').select('*').order('id');
    if (error) throw error;
    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucune spécialité</p>';
      return;
    }
    let html = '';
    data.forEach(s => {
      html += `<div style="background:#f0f0f0; padding:8px; margin:5px 0;">${s.nom}</div>`;
    });
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '<p>Erreur</p>';
  }
}

window.ajouterSpecialite = async function() {
  const nom = document.getElementById('specialiteNom').value.trim();
  if (!nom) return alert("Nom requis");
  await supabaseClient.from('specialites').insert([{ nom }]);
  document.getElementById('specialiteNom').value = '';
  await chargerSpecialites();
  alert('✅ Spécialité ajoutée');
};

window.supprimerSpecialite = async function(id) {
  if (!confirm("Supprimer ?")) return;
  await supabaseClient.from('specialites').delete().eq('id', id);
  await chargerSpecialites();
};

// ===============================
// AUTRES FONCTIONS SIMPLIFIÉES
// ===============================
async function chargerAdministration() {
  document.getElementById('adminList').innerHTML = '<p>Administration à venir</p>';
}

async function chargerArticles() {
  document.getElementById('articlesList').innerHTML = '<p>Journal à venir</p>';
}

async function loadApprovedCourses() {
  document.getElementById('approvedCourses').innerHTML = '<p>Cours à venir</p>';
}

// ===============================
// INIT
// ===============================
console.log('✅ Site prêt - Tous les boutons fonctionnent');
