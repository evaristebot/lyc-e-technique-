// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'sb_publishable_7MoEHv8lIBlhlO8CFZOMRg_AMQdRsrz';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase connecté - Mode sauvegarde activé');

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
  chargerPublications();
};

window.goToCours = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('cours').classList.add('active');
  chargerCours();
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
// ADMIN : MOT DE PASSE
// ===============================
window.checkAdminPassword = function() {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === "LTB2025") {
    document.getElementById('adminPasswordBox').style.display = 'none';
    document.getElementById('adminZone').style.display = 'block';
    chargerAdminPublications();
    chargerAdminCours();
    chargerAdminClasses();
    chargerAdminEleves();
    chargerAdminAdmins();
    chargerClassesSelect();
  } else {
    alert('❌ Mot de passe incorrect');
  }
};

// ===============================
// PUBLICATIONS (Journal) - SAUVEGARDÉES
// ===============================
async function chargerPublications() {
  const container = document.getElementById('articlesList');
  if (!container) return;

  const { data, error } = await supabase
    .from('actualites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = '<p>Erreur de chargement</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucune publication</p>';
    return;
  }

  let html = '';
  data.forEach(pub => {
    html += `
      <div class="card">
        <h3>${pub.titre}</h3>
        <p>${pub.contenu}</p>
        <small>📅 ${new Date(pub.created_at).toLocaleDateString('fr-FR')}</small>
      </div>
    `;
  });
  container.innerHTML = html;
}

async function chargerAdminPublications() {
  const container = document.getElementById('articlesAdminList');
  if (!container) return;

  const { data, error } = await supabase
    .from('actualites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucune publication</p>';
    return;
  }

  let html = '';
  data.forEach(pub => {
    html += `
      <div class="admin-item">
        <span>${pub.titre}</span>
        <button class="delete-btn" onclick="supprimerPublication(${pub.id})">🗑️</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.publierArticle = async function() {
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();

  if (!titre || !contenu) {
    alert('❌ Titre et contenu requis');
    return;
  }

  const { error } = await supabase
    .from('actualites')
    .insert([{ titre, contenu }]);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    alert('✅ Article publié et sauvegardé !');
    document.getElementById('articleTitre').value = '';
    document.getElementById('articleContenu').value = '';
    chargerPublications();
    chargerAdminPublications();
  }
};

window.supprimerPublication = async function(id) {
  if (!confirm('Supprimer cette publication ?')) return;

  const { error } = await supabase
    .from('actualites')
    .delete()
    .eq('id', id);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    chargerPublications();
    chargerAdminPublications();
  }
};

// ===============================
// COURS - SAUVEGARDÉS
// ===============================
async function chargerCours() {
  const container = document.getElementById('coursList');
  if (!container) return;

  const { data, error } = await supabase
    .from('cours')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucun cours disponible</p>';
    return;
  }

  let html = '';
  data.forEach(c => {
    html += `
      <div class="card">
        <h3>${c.titre}</h3>
        <p><strong>${c.professeur}</strong></p>
        <p>${c.description}</p>
        <a href="${c.lien}" target="_blank" class="cours-link">
          ${c.type === 'pdf' ? '📄 Voir PDF' : '▶️ Voir vidéo'}
        </a>
      </div>
    `;
  });
  container.innerHTML = html;
}

async function chargerAdminCours() {
  const container = document.getElementById('coursAdminList');
  if (!container) return;

  const { data, error } = await supabase
    .from('cours')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucun cours</p>';
    return;
  }

  let html = '';
  data.forEach(c => {
    html += `
      <div class="admin-item">
        <span>${c.titre} - ${c.professeur}</span>
        <button class="delete-btn" onclick="supprimerCours(${c.id})">🗑️</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.ajouterCours = async function() {
  const titre = document.getElementById('coursTitre').value.trim();
  const professeur = document.getElementById('coursProfesseur').value.trim();
  const description = document.getElementById('coursDescription').value.trim();
  const type = document.getElementById('coursType').value;
  const lien = document.getElementById('coursLien').value.trim();

  if (!titre || !professeur || !description || !lien) {
    alert('❌ Tous les champs requis');
    return;
  }

  const { error } = await supabase
    .from('cours')
    .insert([{ titre, professeur, description, type, lien }]);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    alert('✅ Cours ajouté et sauvegardé !');
    document.getElementById('coursTitre').value = '';
    document.getElementById('coursProfesseur').value = '';
    document.getElementById('coursDescription').value = '';
    document.getElementById('coursLien').value = '';
    chargerCours();
    chargerAdminCours();
  }
};

window.supprimerCours = async function(id) {
  if (!confirm('Supprimer ce cours ?')) return;

  const { error } = await supabase
    .from('cours')
    .delete()
    .eq('id', id);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    chargerCours();
    chargerAdminCours();
  }
};

// ===============================
// CLASSES - SAUVEGARDÉES
// ===============================
async function chargerAdminClasses() {
  const container = document.getElementById('classesList');
  if (!container) return;

  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('nom');

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucune classe</p>';
    return;
  }

  let html = '';
  data.forEach(c => {
    html += `
      <div class="admin-item">
        <span>${c.nom}</span>
        <button class="delete-btn" onclick="supprimerClasse(${c.id})">🗑️</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.ajouterClasse = async function() {
  const nom = document.getElementById('classeNom').value.trim();
  if (!nom) {
    alert('❌ Nom requis');
    return;
  }

  const { error } = await supabase
    .from('classes')
    .insert([{ nom }]);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    alert('✅ Classe ajoutée');
    document.getElementById('classeNom').value = '';
    chargerAdminClasses();
    chargerClassesSelect();
  }
};

window.supprimerClasse = async function(id) {
  if (!confirm('Supprimer cette classe ?')) return;

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    chargerAdminClasses();
    chargerClassesSelect();
    chargerAdminEleves(); // Les élèves liés seront aussi supprimés (CASCADE)
  }
};

async function chargerClassesSelect() {
  const select = document.getElementById('eleveClasse');
  if (!select) return;

  const { data } = await supabase
    .from('classes')
    .select('*')
    .order('nom');

  select.innerHTML = '<option value="">Choisir une classe</option>';
  data?.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
  });
}

// ===============================
// ÉLÈVES - SAUVEGARDÉS
// ===============================
async function chargerAdminEleves() {
  const container = document.getElementById('elevesList');
  if (!container) return;

  const { data, error } = await supabase
    .from('eleves')
    .select(`
      id, nom, prenom,
      classe:classes(nom)
    `)
    .order('nom');

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucun élève</p>';
    return;
  }

  let html = '';
  data.forEach(e => {
    html += `
      <div class="admin-item">
        <span>${e.nom} ${e.prenom} - ${e.classe?.nom || '?'}</span>
        <button class="delete-btn" onclick="supprimerEleve(${e.id})">🗑️</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.ajouterEleve = async function() {
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classeId = document.getElementById('eleveClasse').value;

  if (!nom || !prenom || !classeId) {
    alert('❌ Tous les champs requis');
    return;
  }

  const { error } = await supabase
    .from('eleves')
    .insert([{ nom, prenom, classe_id: classeId }]);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    alert('✅ Élève ajouté');
    document.getElementById('eleveNom').value = '';
    document.getElementById('elevePrenom').value = '';
    chargerAdminEleves();
  }
};

window.supprimerEleve = async function(id) {
  if (!confirm('Supprimer cet élève ?')) return;

  const { error } = await supabase
    .from('eleves')
    .delete()
    .eq('id', id);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    chargerAdminEleves();
  }
};

// ===============================
// ADMINISTRATION - SAUVEGARDÉE
// ===============================
async function chargerAdministration() {
  const container = document.getElementById('adminList');
  if (!container) return;

  const { data, error } = await supabase
    .from('administration')
    .select('*')
    .order('nom');

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucun membre</p>';
    return;
  }

  let html = '';
  data.forEach(a => {
    html += `
      <div class="card">
        <h3>${a.nom}</h3>
        <p><strong>${a.role}</strong></p>
      </div>
    `;
  });
  container.innerHTML = html;
}

async function chargerAdminAdmins() {
  const container = document.getElementById('adminsList');
  if (!container) return;

  const { data, error } = await supabase
    .from('administration')
    .select('*')
    .order('nom');

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucun membre</p>';
    return;
  }

  let html = '';
  data.forEach(a => {
    html += `
      <div class="admin-item">
        <span>${a.nom} - ${a.role}</span>
        <button class="delete-btn" onclick="supprimerAdmin(${a.id})">🗑️</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.ajouterAdmin = async function() {
  const nom = document.getElementById('adminNom').value.trim();
  const role = document.getElementById('adminRole').value.trim();

  if (!nom || !role) {
    alert('❌ Nom et rôle requis');
    return;
  }

  const { error } = await supabase
    .from('administration')
    .insert([{ nom, role }]);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    alert('✅ Membre ajouté');
    document.getElementById('adminNom').value = '';
    document.getElementById('adminRole').value = '';
    chargerAdministration();
    chargerAdminAdmins();
  }
};

window.supprimerAdmin = async function(id) {
  if (!confirm('Supprimer ce membre ?')) return;

  const { error } = await supabase
    .from('administration')
    .delete()
    .eq('id', id);

  if (error) {
    alert('❌ Erreur: ' + error.message);
  } else {
    chargerAdministration();
    chargerAdminAdmins();
  }
};

// ===============================
// ANCIENS ÉLÈVES
// ===============================
async function chargerAnciens() {
  const container = document.getElementById('anciensList');
  if (!container) return;

  const { data, error } = await supabase
    .from('anciens_eleves')
    .select('*')
    .order('nom');

  if (error || !data) {
    container.innerHTML = '<p>Erreur</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Aucun ancien élève</p>';
    return;
  }

  let html = '';
  data.forEach(a => {
    html += `
      <div class="card">
        <h3>${a.nom} ${a.prenom || ''}</h3>
        <p>Bac ${a.annee_bac || ''} - ${a.parcours || ''}</p>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ===============================
// RECHERCHE
// ===============================
window.rechercher = async function() {
  const query = document.getElementById('searchQuery').value.toLowerCase().trim();
  const results = document.getElementById('searchResults');

  if (!query) {
    results.innerHTML = '<p>Entrez un terme de recherche</p>';
    return;
  }

  let resultatsHtml = '';

  // Recherche dans les élèves
  const { data: eleves } = await supabase
    .from('eleves')
    .select(`
      nom, prenom,
      classe:classes(nom)
    `)
    .ilike('nom', `%${query}%`)
    .or(`prenom.ilike.%${query}%`);

  if (eleves && eleves.length > 0) {
    eleves.forEach(e => {
      resultatsHtml += `
        <div class="card">
          <h3>👨‍🎓 ${e.nom} ${e.prenom}</h3>
          <p>Classe: ${e.classe?.nom || '?'}</p>
        </div>
      `;
    });
  }

  // Recherche dans l'administration
  const { data: admins } = await supabase
    .from('administration')
    .select('nom, role')
    .ilike('nom', `%${query}%`);

  if (admins && admins.length > 0) {
    admins.forEach(a => {
      resultatsHtml += `
        <div class="card">
          <h3>👨‍🏫 ${a.nom}</h3>
          <p>${a.role}</p>
        </div>
      `;
    });
  }

  // Recherche dans les cours
  const { data: coursData } = await supabase
    .from('cours')
    .select('titre, professeur')
    .ilike('titre', `%${query}%`)
    .or(`professeur.ilike.%${query}%`);

  if (coursData && coursData.length > 0) {
    coursData.forEach(c => {
      resultatsHtml += `
        <div class="card">
          <h3>📚 ${c.titre}</h3>
          <p>Par ${c.professeur}</p>
        </div>
      `;
    });
  }

  if (!resultatsHtml) {
    results.innerHTML = '<p>Aucun résultat trouvé</p>';
  } else {
    results.innerHTML = resultatsHtml;
  }
};

// ===============================
// INIT
// ===============================
chargerPublications();
chargerCours();
chargerAdministration();
chargerAnciens();
console.log('✅ Site prêt avec sauvegarde Supabase');
