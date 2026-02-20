
  // ===============================
// CONFIGURATION SUPABASE
// ===============================
const supabaseUrl = 'https://ildczvkvhblawzqjunbh.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ===============================
// NAVIGATION
// ===============================
function showPage(pageId){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function goHome(){ showPage('home'); }
function goToAdministration(){ showPage('administration'); chargerAdministration(); }
function goToAnciens(){ showPage('anciens'); }
function goToJournal(){ showPage('journal'); chargerArticles(); }
function goToBulletins(){ showPage('bulletins'); }
function goToRecherche(){ showPage('recherche'); }
function goToProf(){ showPage('cours'); loadApprovedCourses(); }
function goToAdmin(){
  showPage('admin');
  document.getElementById('adminPasswordBox').style.display='block';
  document.getElementById('adminZone').style.display='none';
}

// ===============================
// ADMIN PASSWORD
// ===============================
function checkAdminPassword(){
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
// SPÉCIALITÉS
// ===============================
async function chargerSpecialites(){
  const { data } = await supabaseClient.from('specialites').select('*');

  document.getElementById('specialitesList').innerHTML = data.map(s=>`
    <div>
      ${s.nom}
      <button onclick="modifierSpecialite(${s.id},'${s.nom}')">✏️</button>
      <button onclick="supprimerSpecialite(${s.id})">🗑️</button>
    </div>
  `).join('');

  const select1 = document.getElementById('classeSpecialite');
  const select2 = document.getElementById('eleveSpecialite');

  if(select1) select1.innerHTML = data.map(s=>`<option value="${s.id}">${s.nom}</option>`).join('');
  if(select2) select2.innerHTML = data.map(s=>`<option value="${s.id}">${s.nom}</option>`).join('');

  chargerClassesSelect();
}

async function ajouterSpecialite(){
  const nom = document.getElementById('specialiteNom').value.trim();
  if(!nom) return alert("Nom requis");
  await supabaseClient.from('specialites').insert([{nom}]);
  document.getElementById('specialiteNom').value='';
  chargerSpecialites();
}

async function modifierSpecialite(id, oldNom){
  const nom = prompt("Modifier spécialité", oldNom);
  if(!nom) return;
  await supabaseClient.from('specialites').update({nom}).eq('id',id);
  chargerSpecialites();
}

async function supprimerSpecialite(id){
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

  document.getElementById('classesList').innerHTML = data.map(c=>`
    <div>
      ${c.nom} (${c.specialite.nom})
      <button onclick="supprimerClasse(${c.id})">🗑️</button>
    </div>
  `).join('');
}

async function ajouterClasse(){
  const nom = document.getElementById('classeNom').value.trim();
  const specialite_id = document.getElementById('classeSpecialite').value;
  if(!nom) return alert("Nom requis");

  await supabaseClient.from('classes').insert([{nom, specialite_id}]);
  document.getElementById('classeNom').value='';
  chargerClasses();
}

async function supprimerClasse(id){
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

  document.getElementById('elevesList').innerHTML = data.map(e=>`
    <div>
      ${e.nom} ${e.prenom} - ${e.classe.specialite.nom} / ${e.classe.nom}
      <button onclick="supprimerEleve(${e.id})">🗑️</button>
    </div>
  `).join('');
}

async function chargerClassesSelect(){
  const specialite_id = document.getElementById('eleveSpecialite')?.value;
  if(!specialite_id) return;

  const { data } = await supabaseClient
    .from('classes')
    .select('*')
    .eq('specialite_id', specialite_id);

  document.getElementById('eleveClasse').innerHTML =
    data.map(c=>`<option value="${c.id}">${c.nom}</option>`).join('');
}

async function ajouterEleve(){
  const nom = document.getElementById('eleveNom').value.trim();
  const prenom = document.getElementById('elevePrenom').value.trim();
  const classe_id = document.getElementById('eleveClasse').value;

  if(!nom || !prenom) return alert("Tout est requis");

  await supabaseClient.from('eleves').insert([{nom, prenom, classe_id}]);

  document.getElementById('eleveNom').value='';
  document.getElementById('elevePrenom').value='';
  chargerEleves();
}

async function supprimerEleve(id){
  if(!confirm("Supprimer élève ?")) return;
  await supabaseClient.from('eleves').delete().eq('id',id);
  chargerEleves();
}

// ===============================
// ADMINISTRATION
// ===============================
async function chargerAdministration(){
  const { data } = await supabaseClient.from('administration').select('*');

  document.getElementById('adminList').innerHTML = data.map(a=>`
    <div class="card">
      <strong>${a.nom}</strong><br>
      ${a.role}
    </div>
  `).join('');
}

async function chargerAdmins(){
  const { data } = await supabaseClient.from('administration').select('*');

  document.getElementById('adminsList').innerHTML = data.map(a=>`
    <div>
      ${a.nom} - ${a.role}
      <button onclick="supprimerAdmin(${a.id})">🗑️</button>
    </div>
  `).join('');
}

async function ajouterAdmin(){
  const nom = document.getElementById('adminNom').value.trim();
  const role = document.getElementById('adminRole').value.trim();

  if(!nom || !role) return alert("Tout est requis");

  await supabaseClient.from('administration').insert([{nom, role}]);

  document.getElementById('adminNom').value='';
  document.getElementById('adminRole').value='';

  chargerAdmins();
  chargerAdministration();
}

async function supprimerAdmin(id){
  if(!confirm("Supprimer ?")) return;
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

  document.getElementById('articlesList').innerHTML = data.map(a=>`
    <div class="card">
      <h3>${a.titre}</h3>
      <p>${a.contenu}</p>
    </div>
  `).join('');
}

async function chargerArticlesAdmin(){
  const { data } = await supabaseClient.from('actualites').select('*');

  document.getElementById('articlesAdminList').innerHTML = data.map(a=>`
    <div>
      ${a.titre}
      <button onclick="supprimerArticle(${a.id})">🗑️</button>
    </div>
  `).join('');
}

async function ajouterArticle(){
  const titre = document.getElementById('articleTitre').value.trim();
  const contenu = document.getElementById('articleContenu').value.trim();

  if(!titre || !contenu) return alert("Tout est requis");

  await supabaseClient.from('actualites').insert([{titre, contenu}]);

  document.getElementById('articleTitre').value='';
  document.getElementById('articleContenu').value='';

  chargerArticles();
  chargerArticlesAdmin();
}

async function supprimerArticle(id){
  if(!confirm("Supprimer article ?")) return;
  await supabaseClient.from('actualites').delete().eq('id',id);
  chargerArticles();
  chargerArticlesAdmin();
}

// ===============================
// COURS PDF / VIDEO
// ===============================
async function submitCourse(){
  const teacher = document.getElementById('teacherName').value.trim();
  const title = document.getElementById('courseTitle').value.trim();
  const description = document.getElementById('courseDesc').value.trim();
  const type = document.getElementById('courseType').value;

  if(!teacher || !title || !description)
    return alert("Tout est requis");

  let link = '';

  if(type === "pdf"){
    const file = document.getElementById('pdfFile').files[0];
    if(!file) return alert("Choisir PDF");

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

  loadApprovedCourses();
  chargerPendingCourses();
}

async function chargerPendingCourses(){
  const { data } = await supabaseClient
    .from('cours')
    .select('*')
    .eq('status','pending');

  document.getElementById('pendingCourses').innerHTML =
    data.map(c=>`
      <div>
        ${c.title}
        <button onclick="validerCourse(${c.id})">✅</button>
        <button onclick="supprimerCourse(${c.id})">🗑️</button>
      </div>
    `).join('');
}

async function validerCourse(id){
  await supabaseClient.from('cours')
    .update({status:'approved'})
    .eq('id',id);
  chargerPendingCourses();
  loadApprovedCourses();
}

async function supprimerCourse(id){
  if(!confirm("Supprimer ?")) return;
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

  document.getElementById('approvedCourses').innerHTML =
    data.map(c=>`
      <div class="card">
        <h4>${c.title}</h4>
        <p>${c.description}</p>
        <a href="${c.link}" target="_blank">
          ${c.type === 'pdf' ? '📄 PDF' : '▶️ Vidéo'}
        </a>
      </div>
    `).join('');
}
