// ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase connecté');

// ===============================
// FONCTIONS DE NAVIGATION (GLOBALES)
// ===============================
window.showPage = function(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

window.goHome = function() { window.showPage('home'); }
window.goToAdministration = function() { 
  window.showPage('administration'); 
  chargerAdministration(); 
}
window.goToAnciens = function() { window.showPage('anciens'); }
window.goToJournal = function() { 
  window.showPage('journal'); 
  chargerArticles(); 
}
window.goToBulletins = function() { window.showPage('bulletins'); }
window.goToRecherche = function() { window.showPage('recherche'); }
window.goToCours = function() { 
  window.showPage('cours'); 
  loadApprovedCourses(); 
}
window.goToAdmin = function() {
  window.showPage('admin');
  document.getElementById('adminPasswordBox').style.display = 'block';
  document.getElementById('adminZone').style.display = 'none';
}

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
}

// ===============================
// TEST BASE DE DONNÉES
// ===============================
window.testDatabase = async function() {
  const resultDiv = document.getElementById('testResult');
  if (!resultDiv) return;
  
  resultDiv.innerHTML = '⏳ Test en cours...';
  
  try {
    const { data, error } = await supabaseClient
      .from('specialites')
      .select('*')
      .limit(5);
    
    if (error) {
      resultDiv.innerHTML = `❌ Erreur: ${error.message}`;
      console.error(error);
    } else {
      const count = data?.length || 0;
      resultDiv.innerHTML = `✅ Connexion réussie! ${count} spécialité(s) trouvée(s)`;
      if (count > 0) {
        resultDiv.innerHTML += `<br><small>${JSON.stringify(data)}</small>`;
      }
    }
  } catch (err) {
    resultDiv.innerHTML = `❌ Exception: ${err.message}`;
  }
}

// ===============================
// SPÉCIALITÉS
// ===============================
async function chargerSpecialites() {
  const container = document.getElementById('specialitesList');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient
      .from('specialites')
      .select('*')
      .order('id');

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color:#888;">Aucune spécialité</p>';
      return;
    }

    let html = '';
    data.forEach(s => {
      html += `
        <div style="background:#f0f0f0; padding:10px; margin:5px 0; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:bold;">${s.nom}</span>
          <div>
            <button onclick="modifierSpecialite(${s.id}, '${s.nom}')" style="margin-right:5px; background:#ffb347; border:none; padding:5px 10px; border-radius:20px; cursor:pointer;">✏️</button>
            <button onclick="supprimerSpecialite(${s.id})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:20px; cursor:pointer;">🗑️</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    // Mise à jour des selects
    const select1 = document.getElementById('classeSpecialite');
    const select2 = document.getElementById('eleveSpecialite');

    const options = '<option value="">Choisir...</option>' + 
      data.map(s => `<option value="${s.id}">${s.nom}</option>`).join('');

    if (select1) select1.innerHTML = options;
    if (select2) select2.innerHTML = options;

  } catch (err) {
    console.error('Erreur chargement spécialités:', err);
    container.innerHTML = '<p style="color:red;">Erreur de chargement</p>';
  }
}

window.ajouterSpecialite = async function() {
  const nom = document.getElementById('specialiteNom').value.trim();
  if (!nom) return alert("❌ Nom requis");

  try {
    const { error } = await supabaseClient.from('specialites').insert([{ nom }]);
    if (error) throw error;

    alert('✅ Spécialité ajoutée');
    document.getElementById('specialiteNom').value = '';
    await chargerSpecialites();
    console.log('🔄 Liste rechargée');
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
    console.error(err);
  }
}

window.modifierSpecialite = async function(id, oldNom) {
  const nom = prompt("Modifier la spécialité", oldNom);
  if (!nom || nom === oldNom) return;

  try {
    const { error } = await supabaseClient.from('specialites').update({ nom }).eq('id', id);
    if (error) throw error;
    await chargerSpecialites();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

window.supprimerSpecialite = async function(id) {
  if (!confirm("Supprimer cette spécialité ?")) return;

  try {
    const { error } = await supabaseClient.from('specialites').delete().eq('id', id);
    if (error) throw error;
    await chargerSpecialites();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

// ===============================
// CLASSES
// ===============================
async function chargerClasses() {
  const container = document.getElementById('classesList');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient
      .from('classes')
      .select('id, nom, specialite_id, specialite:specialites(nom)');

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucune classe</p>';
      return;
    }

    let html = '';
    data.forEach(c => {
      html += `
        <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px; display:flex; justify-content:space-between;">
          <span>${c.nom} (${c.specialite?.nom || '?'})</span>
          <button onclick="supprimerClasse(${c.id})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement classes:', err);
    container.innerHTML = '<p style="color:red;">Erreur</p>';
  }
}

window.ajouterClasse = async function() {
  const nom = document.getElementById('classeNom').value.trim();
  const specialite_id = document.getElementById('classeSpecialite').value;

  if (!nom || !specialite_id) return alert("❌ Nom et spécialité requis");

  try {
    const { error } = await supabaseClient.from('classes').insert([{ nom, specialite_id }]);
    if (error) throw error;

    alert('✅ Classe ajoutée');
    document.getElementById('classeNom').value = '';
    await chargerClasses();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

window.supprimerClasse = async function(id) {
  if (!confirm("Supprimer cette classe ?")) return;

  try {
    const { error } = await supabaseClient.from('classes').delete().eq('id', id);
    if (error) throw error;
    await chargerClasses();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

// ===============================
// ÉLÈVES
// ===============================
window.chargerClassesSelect = async function() {
  const specialite_id = document.getElementById('eleveSpecialite')?.value;
  if (!specialite_id) return;

  try {
    const { data } = await supabaseClient
      .from('classes')
      .select('*')
      .eq('specialite_id', specialite_id);

    const select = document.getElementById('eleveClasse');
    if (!select) return;

    select.innerHTML = '<option value="">Choisir...</option>' +
      data.map(c => `<option value="${c.id}">${c.nom}</option>`).join('');
  } catch (err) {
    console.error('Erreur chargement classes select:', err);
  }
}

async function chargerEleves() {
  const container = document.getElementById('elevesList');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient
      .from('eleves')
      .select(`
        id, nom, prenom,
        classe:classes(id, nom, specialite:specialites(nom))
      `)
      .order('nom');

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucun élève</p>';
      return;
    }

    let html = '';
    data.forEach(e => {
      html += `
        <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px; display:flex; justify-content:space-between;">
          <span>${e.nom} ${e.prenom} - ${e.classe?.specialite?.nom || ''} / ${e.classe?.nom || ''}</span>
          <button onclick="supprimerEleve(${e.id})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement élèves:', err);
    container.innerHTML = '<p style="color:red;">Erreur</p>';
  }
}

window.ajouterEleve = async function() {
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classe_id = document.getElementById('eleveClasse').value;

  if (!nom || !prenom || !classe_id) return alert("❌ Tous les champs sont requis");

  try {
    const { error } = await supabaseClient.from('eleves').insert([{ nom, prenom, classe_id }]);
    if (error) throw error;

    alert('✅ Élève ajouté');
    document.getElementById('eleveNom').value = '';
    document.getElementById('elevePrenom').value = '';
    await chargerEleves();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

window.supprimerEleve = async function(id) {
  if (!confirm("Supprimer cet élève ?")) return;

  try {
    const { error } = await supabaseClient.from('eleves').delete().eq('id', id);
    if (error) throw error;
    await chargerEleves();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

// ===============================
// ADMINISTRATION
// ===============================
async function chargerAdministration() {
  const container = document.getElementById('adminList');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient.from('administration').select('*');
    if (error) throw error;

    if (!data || data.length === 0) {
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
  } catch (err) {
    console.error('Erreur chargement administration:', err);
  }
}

async function chargerAdmins() {
  const container = document.getElementById('adminsList');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient.from('administration').select('*');
    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucun membre</p>';
      return;
    }

    let html = '';
    data.forEach(a => {
      html += `
        <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px; display:flex; justify-content:space-between;">
          <span>${a.nom} - ${a.role}</span>
          <button onclick="supprimerAdmin(${a.id})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement admins:', err);
  }
}

window.ajouterAdmin = async function() {
  const nom = document.getElementById('adminNom').value.trim();
  const role = document.getElementById('adminRole').value.trim();

  if (!nom || !role) return alert("❌ Tous les champs sont requis");

  try {
    const { error } = await supabaseClient.from('administration').insert([{ nom, role }]);
    if (error) throw error;

    alert('✅ Membre ajouté');
    document.getElementById('adminNom').value = '';
    document.getElementById('adminRole').value = '';

    await chargerAdmins();
    await chargerAdministration();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

window.supprimerAdmin = async function(id) {
  if (!confirm("Supprimer ce membre ?")) return;

  try {
    const { error } = await supabaseClient.from('administration').delete().eq('id', id);
    if (error) throw error;

    await chargerAdmins();
    await chargerAdministration();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

// ===============================
// ARTICLES
// ===============================
async function chargerArticles() {
  const container = document.getElementById('articlesList');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient
      .from('actualites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucun article</p>';
      return;
    }

    let html = '';
    data.forEach(a => {
      html += `
        <div class="card">
          <h3>${a.titre}</h3>
          <p>${a.contenu}</p>
          <small>${new Date(a.created_at).toLocaleDateString('fr-FR')}</small>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement articles:', err);
  }
}

async function chargerArticlesAdmin() {
  const container = document.getElementById('articlesAdminList');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient
      .from('actualites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucun article</p>';
      return;
    }

    let html = '';
    data.forEach(a => {
      html += `
        <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px; display:flex; justify-content:space-between;">
          <span>${a.titre}</span>
          <button onclick="supprimerArticle(${a.id})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement articles admin:', err);
  }
}

window.ajouterArticle = async function() {
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();

  if (!titre || !contenu) return alert("❌ Titre et contenu requis");

  try {
    const { error } = await supabaseClient.from('actualites').insert([{ titre, contenu }]);
    if (error) throw error;

    alert('✅ Article publié');
    document.getElementById('articleTitre').value = '';
    document.getElementById('articleContenu').value = '';

    await chargerArticles();
    await chargerArticlesAdmin();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

window.supprimerArticle = async function(id) {
  if (!confirm("Supprimer cet article ?")) return;

  try {
    const { error } = await supabaseClient.from('actualites').delete().eq('id', id);
    if (error) throw error;

    await chargerArticles();
    await chargerArticlesAdmin();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

// ===============================
// COURS
// ===============================
window.submitCourse = async function() {
  const teacher = document.getElementById('teacherName').value.trim();
  const title = document.getElementById('courseTitle').value.trim();
  const description = document.getElementById('courseDesc').value.trim();
  const type = document.getElementById('courseType').value;

  if (!teacher || !title || !description)
    return alert("❌ Tous les champs sont requis");

  let link = '';

  try {
    if (type === "pdf") {
      const file = document.getElementById('pdfFile').files[0];
      if (!file) return alert("❌ Choisir un fichier PDF");

      const { data, error } = await supabaseClient
        .storage
        .from('cours')
        .upload(`pdf/${Date.now()}-${file.name}`, file);

      if (error) throw error;

      const { data: publicUrl } =
        supabaseClient.storage.from('cours').getPublicUrl(data.path);

      link = publicUrl.publicUrl;
    }

    if (type === "video") {
      link = document.getElementById('videoLink').value.trim();
      if (!link) return alert("❌ Lien vidéo requis");
    }

    const { error } = await supabaseClient.from('cours').insert([
      { teacher, title, description, type, link, status: 'pending' }
    ]);

    if (error) throw error;

    alert("✅ Cours soumis en attente d'approbation");

    document.getElementById('teacherName').value = '';
    document.getElementById('courseTitle').value = '';
    document.getElementById('courseDesc').value = '';
    document.getElementById('videoLink').value = '';
    document.getElementById('pdfFile').value = '';

    await loadApprovedCourses();
    await chargerPendingCourses();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
    console.error(err);
  }
}

async function chargerPendingCourses() {
  const container = document.getElementById('pendingCourses');
  if (!container) return;

  try {
    const { data, error } = await supabaseClient
      .from('cours')
      .select('*')
      .eq('status', 'pending');

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucun cours en attente</p>';
      return;
    }

    let html = '';
    data.forEach(c => {
      html += `
        <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px; display:flex; justify-content:space-between; align-items:center;">
          <span>${c.title}</span>
          <div>
            <button onclick="validerCourse(${c.id})" style="background:#00C851; color:white; border:none; padding:5px 10px; border-radius:20px; margin-right:5px;">✅</button>
            <button onclick="supprimerCourse(${c.id})" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:20px;">🗑️</button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement cours en attente:', err);
  }
}

window.validerCourse = async function(id) {
  try {
    const { error } = await supabaseClient.from('cours')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) throw error;

    await chargerPendingCourses();
    await loadApprovedCourses();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

window.supprimerCourse = async function(id) {
  if (!confirm("Supprimer ce cours ?")) return;

  try {
    const { error } = await supabaseClient.from('cours').delete().eq('id', id);
    if (error) throw error;

    await chargerPendingCourses();
    await loadApprovedCourses();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

async function loadApprovedCourses() {
  const container = document.getElementById('approvedCourses');
  if (!container) return;
  
  try {
    const { data, error } = await supabaseClient
      .from('cours')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucun cours disponible</p>';
      return;
    }

    let html = '';
    data.forEach(c => {
      html += `
        <div class="card">
          <h3>${c.title}</h3>
          <p><strong>${c.teacher}</strong></p>
          <p>${c.description}</p>
          <a href="${c.link}" target="_blank" style="display:inline-block; background:#ffb347; color:#0b2f2f; padding:8px 16px; border-radius:30px; text-decoration:none; margin-top:10px;">
            ${c.type === 'pdf' ? '📄 Télécharger PDF' : '▶️ Regarder la vidéo'}
          </a>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Erreur chargement cours approuvés:', err);
  }
}

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
      <p>Jean NKOU - Électricité 1ère</p>
      <p>Marie NGO - Comptabilité 2ème</p>
    </div>
  `;
}

window.rechercherBulletin = function() {
  const nom = document.getElementById('searchEleve').value.trim();
  const result = document.getElementById('bulletinResult');

  if (!nom) {
    result.innerHTML = '<p>Entrez un nom</p>';
    return;
  }

  result.innerHTML = `
    <div class="card">
      <h3>Bulletin de ${nom}</h3>
      <p>Mathématiques: 14/20</p>
      <p>Français: 12/20</p>
      <p>Moyenne: 13/20</p>
    </div>
  `;
}

// ===============================
// INITIALISATION
// ===============================
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Script prêt - Toutes les fonctions sont globales');
  chargerAdministration();
  loadApprovedCourses();
});
```
