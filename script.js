// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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
  document.getElementById('adminPassword').value = '';
};

// ===============================
// ADMIN : MOT DE PASSE
// ===============================
window.checkAdminPassword = () => {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    
    // Charger toutes les données
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
  
  if (!nom) {
    alert('❌ Nom requis');
    return;
  }

  const { error } = await supabaseClient
    .from('specialites')
    .insert([{ nom }]);

  if (error) {
    alert('❌ Erreur : ' + error.message);
    console.error(error);
  } else {
    alert('✅ Spécialité ajoutée');
    document.getElementById('specialiteNom').value = '';
    chargerSpecialites();         // Recharge la liste
    chargerSpecialitesSelect();   // Recharge le select
  }
};

async function chargerSpecialites() {
  const { data, error } = await supabaseClient
    .from('specialites')
    .select('*')
    .order('id');

  if (error) {
    console.error('Erreur chargement spécialités:', error);
    return;
  }

  const container = document.getElementById('specialitesList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p style="color:#888;">Aucune spécialité</p>';
    return;
  }

  let html = '';
  data.forEach(s => {
    html += `
      <div style="background:#f0f0f0; padding:12px; margin:8px 0; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold;">${s.nom}</span>
        <button onclick="supprimerSpecialite(${s.id})" 
                style="background:#ff4444; color:white; border:none; padding:5px 15px; border-radius:20px; cursor:pointer;">
          🗑️ Supprimer
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
  console.log('✅ Spécialités chargées :', data.length);
}

window.supprimerSpecialite = async (id) => {
  if (!confirm('Supprimer cette spécialité ?')) return;

  const { error } = await supabaseClient
    .from('specialites')
    .delete()
    .eq('id', id);

  if (error) {
    alert('❌ Erreur : ' + error.message);
  } else {
    alert('✅ Spécialité supprimée');
    chargerSpecialites();
    chargerSpecialitesSelect();
    chargerClasses(); // Les classes liées seront aussi supprimées (CASCADE)
  }
};

// ===============================
// CLASSES
// ===============================
window.ajouterClasse = async () => {
  const nom = document.getElementById('classeNom').value.trim();
  const specialiteId = document.getElementById('classeSpecialite').value;

  if (!nom || !specialiteId) {
    alert('❌ Remplis tous les champs');
    return;
  }

  const { error } = await supabaseClient
    .from('classes')
    .insert([{ nom, specialite_id: specialiteId }]);

  if (error) {
    alert('❌ Erreur : ' + error.message);
  } else {
    alert('✅ Classe ajoutée');
    document.getElementById('classeNom').value = '';
    chargerClasses();
    chargerClassesSelect();
  }
};

async function chargerClasses() {
  const { data, error } = await supabaseClient
    .from('classes')
    .select('*, specialites(nom)');

  if (error) {
    console.error('Erreur chargement classes:', error);
    return;
  }

  const container = document.getElementById('classesList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucune classe</p>';
    return;
  }

  let html = '';
  data.forEach(c => {
    html += `
      <div style="background:#f0f0f0; padding:8px; margin:5px 0;">
        <strong>${c.nom}</strong> (${c.specialites?.nom || '?'})
        <button onclick="supprimerClasse(${c.id})" style="float:right; background:red; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.supprimerClasse = async (id) => {
  if (!confirm('Supprimer cette classe ?')) return;
  await supabaseClient.from('classes').delete().eq('id', id);
  chargerClasses();
  chargerClassesSelect();
};

// ===============================
// MATIÈRES
// ===============================
window.ajouterMatiere = async () => {
  const nom = document.getElementById('matiereNom').value.trim();
  const classeId = document.getElementById('matiereClasse').value;
  const coef = document.getElementById('matiereCoef').value;
  const pwd = document.getElementById('matierePassword').value;

  if (!nom || !classeId || !coef || !pwd) {
    alert('❌ Remplis tous les champs');
    return;
  }

  const { error } = await supabaseClient
    .from('matieres')
    .insert([{ nom, classe_id: classeId, coefficient: coef, mot_de_passe: pwd }]);

  if (error) {
    alert('❌ Erreur : ' + error.message);
  } else {
    alert('✅ Matière ajoutée');
    document.getElementById('matiereNom').value = '';
    document.getElementById('matiereCoef').value = '';
    document.getElementById('matierePassword').value = '';
    chargerMatieres();
  }
};

async function chargerMatieres() {
  const { data, error } = await supabaseClient
    .from('matieres')
    .select('*, classes(nom)');

  if (error) {
    console.error('Erreur chargement matières:', error);
    return;
  }

  const container = document.getElementById('matieresList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucune matière</p>';
    return;
  }

  let html = '';
  data.forEach(m => {
    html += `
      <div style="background:#f0f0f0; padding:8px; margin:5px 0;">
        <strong>${m.nom}</strong> - ${m.classes?.nom} (coef ${m.coefficient})
        <button onclick="supprimerMatiere(${m.id})" style="float:right; background:red; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.supprimerMatiere = async (id) => {
  if (!confirm('Supprimer cette matière ?')) return;
  await supabaseClient.from('matieres').delete().eq('id', id);
  chargerMatieres();
};

// ===============================
// CHARGEMENT DES SELECTS
// ===============================
async function chargerSpecialitesSelect() {
  const { data } = await supabaseClient.from('specialites').select('*');
  const select = document.getElementById('classeSpecialite');
  if (select) {
    select.innerHTML = '<option value="">Choisir une spécialité</option>';
    data?.forEach(s => {
      select.innerHTML += `<option value="${s.id}">${s.nom}</option>`;
    });
  }
}

async function chargerClassesSelect() {
  const { data } = await supabaseClient.from('classes').select('*');
  
  const selectMatiere = document.getElementById('matiereClasse');
  const selectEleve = document.getElementById('eleveClasseId');
  
  if (selectMatiere) {
    selectMatiere.innerHTML = '<option value="">Choisir une classe</option>';
    data?.forEach(c => {
      selectMatiere.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
    });
  }
  
  if (selectEleve) {
    selectEleve.innerHTML = '<option value="">Choisir une classe</option>';
    data?.forEach(c => {
      selectEleve.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
    });
  }
}

// ===============================
// ÉLÈVES
// ===============================
window.ajouterEleve = async () => {
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classeId = document.getElementById('eleveClasseId').value;
  const parent = document.getElementById('eleveParent').value.trim();

  if (!nom || !prenom || !classeId) {
    alert('❌ Nom, prénom et classe requis');
    return;
  }

  const { error } = await supabaseClient
    .from('eleves')
    .insert([{ nom, prenom, classe_id: classeId, numero_parent: parent }]);

  if (error) {
    alert('❌ Erreur : ' + error.message);
  } else {
    alert('✅ Élève ajouté');
    document.getElementById('eleveNom').value = '';
    document.getElementById('elevePrenom').value = '';
    document.getElementById('eleveParent').value = '';
  }
};

// ===============================
// ENSEIGNANTS
// ===============================
window.ajouterEnseignant = async () => {
  const nom = document.getElementById('ensNom').value.trim();
  const prenom = document.getElementById('ensPrenom').value.trim();
  const matiere = document.getElementById('ensMatiere').value.trim();
  const tel = document.getElementById('ensTel').value.trim();

  if (!nom || !prenom) {
    alert('❌ Nom et prénom requis');
    return;
  }

  const { error } = await supabaseClient
    .from('enseignants')
    .insert([{ nom, prenom, matiere, telephone: tel }]);

  if (error) {
    alert('❌ Erreur : ' + error.message);
  } else {
    alert('✅ Enseignant ajouté');
    document.getElementById('ensNom').value = '';
    document.getElementById('ensPrenom').value = '';
    document.getElementById('ensMatiere').value = '';
    document.getElementById('ensTel').value = '';
    chargerEnseignantsAdmin();
  }
};

async function chargerEnseignantsAdmin() {
  const { data } = await supabaseClient.from('enseignants').select('*');
  const container = document.getElementById('enseignantsAdminList');
  if (!container) return;
  
  let html = '';
  data?.forEach(e => {
    html += `<div style="background:#f0f0f0; padding:8px; margin:5px 0;">${e.nom} ${e.prenom} - ${e.matiere} <button onclick="supprimerEnseignant(${e.id})">🗑️</button></div>`;
  });
  container.innerHTML = html || '<p>Aucun enseignant</p>';
}

window.supprimerEnseignant = async (id) => {
  if (!confirm('Supprimer ?')) return;
  await supabaseClient.from('enseignants').delete().eq('id', id);
  chargerEnseignantsAdmin();
};

// ===============================
// ADMINISTRATION
// ===============================
window.ajouterAdminMembre = async () => {
  const role = document.getElementById('adminRole').value.trim();
  const nom = document.getElementById('adminNom').value.trim();
  if (!role || !nom) return alert('❌ Remplis les champs');
  await supabaseClient.from('administration').insert([{ role, nom }]);
  alert('✅ Membre ajouté');
  document.getElementById('adminRole').value = '';
  document.getElementById('adminNom').value = '';
  chargerAdministrationAdmin();
};

async function chargerAdministrationAdmin() {
  const { data } = await supabaseClient.from('administration').select('*');
  const container = document.getElementById('adminAdminList');
  if (!container) return;
  
  let html = '';
  data?.forEach(a => {
    html += `<div style="background:#f0f0f0; padding:8px;">${a.role} - ${a.nom} <button onclick="supprimerAdminMembre(${a.id})">🗑️</button></div>`;
  });
  container.innerHTML = html || '<p>Aucun membre</p>';
}

window.supprimerAdminMembre = async (id) => {
  if (!confirm('Supprimer ?')) return;
  await supabaseClient.from('administration').delete().eq('id', id);
  chargerAdministrationAdmin();
};

// ===============================
// ARTICLES
// ===============================
window.ajouterArticle = async () => {
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();
  if (!titre || !contenu) return alert('❌ Remplis les champs');
  await supabaseClient.from('actualites').insert([{ titre, contenu }]);
  alert('✅ Article publié');
  document.getElementById('articleTitre').value = '';
  document.getElementById('articleContenu').value = '';
  chargerArticlesAdmin();
  chargerArticles();
};

async function chargerArticlesAdmin() {
  const { data } = await supabaseClient.from('actualites').select('*').order('created_at', { ascending: false });
  const container = document.getElementById('articlesAdminList');
  if (!container) return;
  
  let html = '';
  data?.forEach(a => {
    html += `<div style="background:#f0f0f0; padding:8px;">${a.titre} <button onclick="supprimerArticle(${a.id})">🗑️</button></div>`;
  });
  container.innerHTML = html || '<p>Aucun article</p>';
}

window.supprimerArticle = async (id) => {
  if (!confirm('Supprimer ?')) return;
  await supabaseClient.from('actualites').delete().eq('id', id);
  chargerArticlesAdmin();
  chargerArticles();
};

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
// NOTES
// ===============================
async function chargerClassesPourNotes() {
  const { data } = await supabaseClient.from('classes').select('*');
  const select = document.getElementById('noteClasse');
  if (!select) return;
  select.innerHTML = '<option value="">Choisir une classe</option>';
  data?.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
  });
}

window.chargerMatieresPourNotes = async () => {
  const classeId = document.getElementById('noteClasse').value;
  if (!classeId) return;
  
  const { data } = await supabaseClient.from('matieres').select('*').eq('classe_id', classeId);
  const select = document.getElementById('noteMatiere');
  select.innerHTML = '<option value="">Choisir une matière</option>';
  data?.forEach(m => {
    select.innerHTML += `<option value="${m.id}">${m.nom} (coef ${m.coefficient})</option>`;
  });
};

window.chargerElevesPourNotes = async () => {
  const classeId = document.getElementById('noteClasse').value;
  const matiereId = document.getElementById('noteMatiere').value;
  const trimestre = document.getElementById('noteTrimestre').value;
  
  if (!classeId || !matiereId || !trimestre) return;
  
  const { data: eleves } = await supabaseClient.from('eleves').select('*').eq('classe_id', classeId);
  const { data: notesExistantes } = await supabaseClient.from('notes').select('*').eq('matiere_id', matiereId).eq('trimestre', trimestre);
  
  const notesMap = {};
  notesExistantes?.forEach(n => { notesMap[n.eleve_id] = n.note; });
  
  let html = '<h4>Saisie des notes</h4>';
  eleves?.forEach(e => {
    html += `
      <div style="display:flex; align-items:center; margin:10px 0;">
        <div style="flex:1;"><strong>${e.nom} ${e.prenom}</strong></div>
        <input type="number" step="0.01" min="0" max="20" id="note_${e.id}" value="${notesMap[e.id] || ''}" placeholder="Note" style="width:80px;">
        <button onclick="enregistrerNote(${e.id}, ${matiereId}, ${trimestre})">💾</button>
      </div>
    `;
  });
  document.getElementById('notesSaisie').innerHTML = html;
};

window.enregistrerNote = async (eleveId, matiereId, trimestre) => {
  const note = parseFloat(document.getElementById(`note_${eleveId}`).value);
  if (isNaN(note) || note < 0 || note > 20) return alert('Note invalide');
  
  const { data: existing } = await supabaseClient.from('notes').select('*').eq('eleve_id', eleveId).eq('matiere_id', matiereId).eq('trimestre', trimestre);
  
  if (existing && existing.length > 0) {
    await supabaseClient.from('notes').update({ note }).eq('eleve_id', eleveId).eq('matiere_id', matiereId).eq('trimestre', trimestre);
  } else {
    await supabaseClient.from('notes').insert([{ eleve_id: eleveId, matiere_id: matiereId, trimestre, note, annee_scolaire: "2025-2026" }]);
  }
  alert('✅ Note enregistrée');
};

// ===============================
// AUTRES
// ===============================
window.updateLogo = () => {
  const newUrl = document.getElementById('newLogo').value;
  if (!newUrl) return alert('Entre une URL');
  document.getElementById('mainLogo').src = newUrl;
  document.querySelector('.nav-logo img').src = newUrl;
  alert('Logo mis à jour');
  document.getElementById('newLogo').value = '';
};

// ===============================
// INIT
// ===============================
console.log("✅ Script prêt - Version corrigée");
