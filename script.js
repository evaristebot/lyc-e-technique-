// ===============================
// CONFIGURATION SUPABASE (CORRIGÉE)
// ===============================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';  // ✅ URL correcte
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase connecté avec la bonne URL');

// ===============================
// NAVIGATION
// ===============================
function showPage(pageId){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

window.goHome = function(){ showPage('home'); }
window.goToAdministration = function(){ showPage('administration'); chargerAdministration(); }
window.goToAnciens = function(){ showPage('anciens'); }
window.goToJournal = function(){ showPage('journal'); chargerArticles(); }
window.goToBulletins = function(){ showPage('bulletins'); }
window.goToRecherche = function(){ showPage('recherche'); }
window.goToCours = function(){ showPage('cours'); loadApprovedCourses(); }
window.goToAdmin = function(){
  showPage('admin');
  document.getElementById('adminPasswordBox').style.display='block';
  document.getElementById('adminZone').style.display='none';
}

// ===============================
// ADMIN PASSWORD
// ===============================
window.checkAdminPassword = function(){
  const pwd = document.getElementById('adminPassword').value;
  if(pwd === "LTB2025"){
    document.getElementById('adminPasswordBox').style.display='none';
    document.getElementById('adminZone').style.display='block';
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
    }
  } catch (err) {
    resultDiv.innerHTML = `❌ Exception: ${err.message}`;
  }
}

// ===============================
// SPÉCIALITÉS
// ===============================
async function chargerSpecialites(){
  const { data } = await supabaseClient.from('specialites').select('*');

  const container = document.getElementById('specialitesList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucune spécialité</p>';
    return;
  }

  container.innerHTML = data.map(s=>`
    <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px;">
      ${s.nom}
      <button onclick="modifierSpecialite(${s.id},'${s.nom}')" style="margin-left:10px;">✏️</button>
      <button onclick="supprimerSpecialite(${s.id})">🗑️</button>
    </div>
  `).join('');

  const select1 = document.getElementById('classeSpecialite');
  const select2 = document.getElementById('eleveSpecialite');

  if(select1) select1.innerHTML = '<option value="">Choisir...</option>' + data.map(s=>`<option value="${s.id}">${s.nom}</option>`).join('');
  if(select2) select2.innerHTML = '<option value="">Choisir...</option>' + data.map(s=>`<option value="${s.id}">${s.nom}</option>`).join('');
}

window.ajouterSpecialite = async function(){
  const nom = document.getElementById('specialiteNom').value.trim();
  if(!nom) return alert("Nom requis");
  await supabaseClient.from('specialites').insert([{nom}]);
  document.getElementById('specialiteNom').value='';
  chargerSpecialites();
}

window.modifierSpecialite = async function(id, oldNom){
  const nom = prompt("Modifier spécialité", oldNom);
  if(!nom) return;
  await supabaseClient.from('specialites').update({nom}).eq('id',id);
  chargerSpecialites();
}

window.supprimerSpecialite = async function(id){
  if(!confirm("Supprimer cette spécialité ?")) return;
  await supabaseClient.from('specialites').delete().eq('id',id);
  chargerSpecialites();
}

// ===============================
// CLASSES
// ===============================
async function chargerClasses(){
  const { data } = await supabaseClient
    .from('classes')
    .select('id, nom, specialite_id, specialite:specialites(nom)');

  const container = document.getElementById('classesList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucune classe</p>';
    return;
  }

  container.innerHTML = data.map(c=>`
    <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px;">
      ${c.nom} (${c.specialite?.nom || '?'})
      <button onclick="supprimerClasse(${c.id})" style="float:right;">🗑️</button>
    </div>
  `).join('');
}

window.ajouterClasse = async function(){
  const nom = document.getElementById('classeNom').value.trim();
  const specialite_id = document.getElementById('classeSpecialite').value;
  if(!nom || !specialite_id) return alert("Nom et spécialité requis");

  await supabaseClient.from('classes').insert([{nom, specialite_id}]);
  document.getElementById('classeNom').value='';
  chargerClasses();
}

window.supprimerClasse = async function(id){
  if(!confirm("Supprimer classe ?")) return;
  await supabaseClient.from('classes').delete().eq('id',id);
  chargerClasses();
}

// ===============================
// ÉLÈVES
// ===============================
async function chargerEleves(){
  const { data } = await supabaseClient
    .from('eleves')
    .select(`
      id, nom, prenom,
      classe:classes(id, nom, specialite:specialites(nom))
    `)
    .order('nom');

  const container = document.getElementById('elevesList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucun élève</p>';
    return;
  }

  container.innerHTML = data.map(e=>`
    <div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px;">
      ${e.nom} ${e.prenom} - ${e.classe?.specialite?.nom || ''} / ${e.classe?.nom || ''}
      <button onclick="supprimerEleve(${e.id})" style="float:right;">🗑️</button>
    </div>
  `).join('');
}

window.chargerClassesSelect = async function(){
  const specialite_id = document.getElementById('eleveSpecialite')?.value;
  if(!specialite_id) return;

  const { data } = await supabaseClient
    .from('classes')
    .select('*')
    .eq('specialite_id', specialite_id);

  const select = document.getElementById('eleveClasse');
  if (!select) return;

  select.innerHTML = '<option value="">Choisir...</option>' +
    data.map(c=>`<option value="${c.id}">${c.nom}</option>`).join('');
}

window.ajouterEleve = async function(){
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classe_id = document.getElementById('eleveClasse').value;

  if(!nom || !prenom || !classe_id) return alert("Tous les champs sont requis");

  await supabaseClient.from('eleves').insert([{nom, prenom, classe_id}]);

  document.getElementById('eleveNom').value='';
  document.getElementById('elevePrenom').value='';
  chargerEleves();
}

window.supprimerEleve = async function(id){
  if(!confirm("Supprimer élève ?")) return;
  await supabaseClient.from('eleves').delete().eq('id',id);
  chargerEleves();
}

// ===============================
// ADMINISTRATION
// ===============================
async function chargerAdministration(){
  const { data } = await supabaseClient.from('administration').select('*');

  const container = document.getElementById('adminList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucun membre</p>';
    return;
  }

  container.innerHTML = data.map(a=>`
    <div class="card">
      <strong>${a.nom}</strong><br>
      ${a.role}
    </div>
  `).join('');
}

async function chargerAdmins(){
  const { data } = await supabaseClient.from('administration').select('*');

  const container = document.getElementById('adminsList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucun membre</p>';
    return;
  }

  container.innerHTML = data.map(a=>`
    <div style="background:#f0f0f0; padding:8px; margin:5px 0;">
      ${a.nom} - ${a.role}
      <button onclick="supprimerAdmin(${a.id})" style="float:right;">🗑️</button>
    </div>
  `).join('');
}

window.ajouterAdmin = async function(){
  const nom = document.getElementById('adminNom').value.trim();
  const role = document.getElementById('adminRole').value.trim();

  if(!nom || !role) return alert("Tous les champs sont requis");

  await supabaseClient.from('administration').insert([{nom, role}]);

  document.getElementById('adminNom').value='';
  document.getElementById('adminRole').value='';

  chargerAdmins();
  chargerAdministration();
}

window.supprimerAdmin = async function(id){
  if(!confirm("Supprimer ce membre ?")) return;
  await supabaseClient.from('administration').delete().eq('id',id);
  chargerAdmins();
  chargerAdministration();
}

// ===============================
// ARTICLES
// ===============================
async function chargerArticles(){
  const { data } = await supabaseClient
    .from('actualites')
    .select('*')
    .order('created_at',{ascending:false});

  const container = document.getElementById('articlesList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucun article</p>';
    return;
  }

  container.innerHTML = data.map(a=>`
    <div class="card">
      <h3>${a.titre}</h3>
      <p>${a.contenu}</p>
    </div>
  `).join('');
}

async function chargerArticlesAdmin(){
  const { data } = await supabaseClient.from('actualites').select('*').order('created_at',{ascending:false});

  const container = document.getElementById('articlesAdminList');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucun article</p>';
    return;
  }

  container.innerHTML = data.map(a=>`
    <div style="background:#f0f0f0; padding:8px; margin:5px 0;">
      ${a.titre}
      <button onclick="supprimerArticle(${a.id})" style="float:right;">🗑️</button>
    </div>
  `).join('');
}

window.ajouterArticle = async function(){
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();

  if(!titre || !contenu) return alert("Titre et contenu requis");

  await supabaseClient.from('actualites').insert([{titre, contenu}]);

  document.getElementById('articleTitre').value='';
  document.getElementById('articleContenu').value='';

  chargerArticles();
  chargerArticlesAdmin();
}

window.supprimerArticle = async function(id){
  if(!confirm("Supprimer article ?")) return;
  await supabaseClient.from('actualites').delete().eq('id',id);
  chargerArticles();
  chargerArticlesAdmin();
}

// ===============================
// COURS PDF / VIDEO
// ===============================
window.submitCourse = async function(){
  const teacher = document.getElementById('teacherName').value.trim();
  const title = document.getElementById('courseTitle').value.trim();
  const description = document.getElementById('courseDesc').value.trim();
  const type = document.getElementById('courseType').value;

  if(!teacher || !title || !description)
    return alert("Tous les champs sont requis");

  let link = '';

  if(type === "pdf"){
    const file = document.getElementById('pdfFile').files[0];
    if(!file) return alert("Choisir un fichier PDF");

    const { data, error } = await supabaseClient
      .storage
      .from('cours')
      .upload(`pdf/${Date.now()}-${file.name}`, file);

    if(error) return alert(error.message);

    const { data: publicUrl } =
      supabaseClient.storage.from('cours').getPublicUrl(data.path);

    link = publicUrl.publicUrl;
  }

  if(type === "video"){
    link = document.getElementById('videoLink').value.trim();
    if(!link) return alert("Lien vidéo requis");
  }

  await supabaseClient.from('cours').insert([
    { teacher, title, description, type, link, status:'pending' }
  ]);

  alert("Cours soumis en attente d'approbation");

  document.getElementById('teacherName').value='';
  document.getElementById('courseTitle').value='';
  document.getElementById('courseDesc').value='';
  document.getElementById('videoLink').value='';
  document.getElementById('pdfFile').value='';

  loadApprovedCourses();
  chargerPendingCourses();
}

async function chargerPendingCourses(){
  const { data } = await supabaseClient
    .from('cours')
    .select('*')
    .eq('status','pending');

  const container = document.getElementById('pendingCourses');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucun cours en attente</p>';
    return;
  }

  container.innerHTML = data.map(c=>`
    <div style="background:#f0f0f0; padding:8px; margin:5px 0;">
      ${c.title}
      <button onclick="validerCourse(${c.id})">✅</button>
      <button onclick="supprimerCourse(${c.id})">🗑️</button>
    </div>
  `).join('');
}

window.validerCourse = async function(id){
  await supabaseClient.from('cours')
    .update({status:'approved'})
    .eq('id',id);
  chargerPendingCourses();
  loadApprovedCourses();
}

window.supprimerCourse = async function(id){
  if(!confirm("Supprimer ce cours ?")) return;
  await supabaseClient.from('cours').delete().eq('id',id);
  chargerPendingCourses();
  loadApprovedCourses();
}

async function loadApprovedCourses(){
  const { data } = await supabaseClient
    .from('cours')
    .select('*')
    .eq('status','approved')
    .order('created_at',{ascending:false});

  const container = document.getElementById('approvedCourses');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Aucun cours disponible</p>';
    return;
  }

  container.innerHTML = data.map(c=>`
    <div class="card">
      <h4>${c.title}</h4>
      <p><strong>${c.teacher}</strong></p>
      <p>${c.description}</p>
      <a href="${c.link}" target="_blank">
        ${c.type === 'pdf' ? '📄 PDF' : '▶️ Vidéo'}
      </a>
    </div>
  `).join('');
}

// ===============================
// INITIALISATION
// ===============================
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Script prêt - Toutes les fonctions sont globales');
  chargerAdministration();
  loadApprovedCourses();
});
