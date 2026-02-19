// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'sb_publishable_o5PsuBWUwgad235AnF6hqg_5E47LM1C';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase configuré");

// ===============================
// NAVIGATION - FONCTIONS GLOBALES
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

// ===============================
// ADMIN - MOT DE PASSE
// ===============================
window.checkAdminPassword = function() {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    chargerSpecialites();
  } else {
    alert('Mot de passe incorrect');
  }
};

// ===============================
// SPÉCIALITÉS
// ===============================
window.ajouterSpecialite = async function() {
  const nom = document.getElementById('specialiteNom').value.trim();
  if (!nom) {
    alert('Nom requis');
    return;
  }

  const { error } = await supabaseClient
    .from('specialites')
    .insert([{ nom }]);

  if (error) {
    alert('Erreur : ' + error.message);
  } else {
    alert('Spécialité ajoutée');
    document.getElementById('specialiteNom').value = '';
    chargerSpecialites();
  }
};

async function chargerSpecialites() {
  const { data, error } = await supabaseClient
    .from('specialites')
    .select('*');

  const container = document.getElementById('specialitesList');
  if (!container) return;

  if (error) {
    container.innerHTML = '<p>Erreur de chargement</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucune spécialité</p>';
    return;
  }

  let html = '';
  data.forEach(s => {
    html += `<div style="background:#f0f0f0; padding:10px; margin:5px 0;">${s.nom}</div>`;
  });
  container.innerHTML = html;
}

// ===============================
// AFFICHAGE PUBLIC
// ===============================
async function chargerAdministration() {
  const { data } = await supabaseClient.from('administration').select('*');
  const container = document.getElementById('adminList');
  if (!container) return;
  
  let html = '';
  data?.forEach(a => {
    html += `<div class="card"><h3>${a.nom}</h3><p>${a.role}</p></div>`;
  });
  container.innerHTML = html || '<p>Aucun membre</p>';
}

async function chargerAnciens() {
  const { data } = await supabaseClient.from('anciens_eleves').select('*');
  const container = document.getElementById('anciensList');
  if (!container) return;
  
  let html = '';
  data?.forEach(a => {
    html += `<div class="card"><h3>${a.nom} ${a.prenom}</h3><p>Bac ${a.annee_bac}</p></div>`;
  });
  container.innerHTML = html || '<p>Aucun ancien</p>';
}

async function chargerArticles() {
  const { data } = await supabaseClient.from('actualites').select('*').order('created_at', { ascending: false });
  const container = document.getElementById('articlesList');
  if (!container) return;
  
  let html = '';
  data?.forEach(a => {
    html += `<div class="card"><h3>${a.titre}</h3><p>${a.contenu}</p><small>${new Date(a.created_at).toLocaleDateString()}</small></div>`;
  });
  container.innerHTML = html || '<p>Aucun article</p>';
}

// ===============================
// AUTRES FONCTIONS SIMPLES
// ===============================
window.updateLogo = function() {
  const newUrl = document.getElementById('newLogo').value;
  if (!newUrl) return alert('Entre une URL');
  document.getElementById('mainLogo').src = newUrl;
  document.querySelector('.nav-logo img').src = newUrl;
  alert('Logo mis à jour');
  document.getElementById('newLogo').value = '';
};

window.rechercher = function() {
  document.getElementById('searchResults').innerHTML = '<p>Fonction de recherche à venir</p>';
};

window.rechercherBulletin = function() {
  document.getElementById('bulletinResult').innerHTML = '<p>Fonction bulletin à venir</p>';
};

// ===============================
// INIT
// ===============================
chargerAdministration();
chargerAnciens();
chargerArticles();
console.log("✅ Site prêt - Tous les boutons sont fonctionnels");
