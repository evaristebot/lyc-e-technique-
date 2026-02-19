const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'sb_publishable_o5PsuBWUwgad235AnF6hqg_5E47LM1C';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// NAVIGATION
function showPage(id){ document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); document.getElementById(id).classList.add('active'); }
window.goHome=()=>showPage('home');
window.goToAdministration=()=>{showPage('administration'); chargerAdministration();}
window.goToAnciens=()=>{showPage('anciens'); chargerAnciens();}
window.goToJournal=()=>{showPage('journal'); chargerArticles();}
window.goToBulletins=()=>showPage('bulletins');
window.goToRecherche=()=>showPage('recherche');
window.goToProf=()=>{showPage('cours'); chargerCoursApprouves();}
window.goToAdmin=()=>{showPage('admin'); document.getElementById('adminPasswordBox').style.display='block'; document.getElementById('adminZone').style.display='none';};

// ADMIN PASSWORD
window.checkAdminPassword=()=>{
  if(document.getElementById('adminPassword').value==="LTB2025"){
    document.getElementById('adminPasswordBox').style.display='none';
    document.getElementById('adminZone').style.display='block';
    chargerSpecialites(); chargerCoursEnAttente();
  } else alert("Mot de passe incorrect");
};

// SPECIALITES
window.ajouterSpecialite=async()=>{
  const nom=document.getElementById('specialiteNom').value.trim();
  if(!nom) return alert("Nom requis");
  const {error}=await supabaseClient.from('specialites').insert([{nom}]);
  if(error) alert("Erreur: "+error.message);
  else { document.getElementById('specialiteNom').value=''; chargerSpecialites(); }
};
async function chargerSpecialites(){
  const {data,error}=await supabaseClient.from('specialites').select('*');
  const container=document.getElementById('specialitesList');
  if(!container) return;
  if(error) container.innerHTML='<p>Erreur</p>';
  else container.innerHTML = data.map(s=>`<div>${s.nom}</div>`).join('');
}

// AFFICHAGE PUBLIC
async function chargerAdministration(){
  const {data}=await supabaseClient.from('administration').select('*');
  document.getElementById('adminList').innerHTML=data?.map(a=>`<div>${a.nom} - ${a.role}</div>`).join('')||'<p>Aucun membre</p>';
}
async function chargerAnciens(){
  const {data}=await supabaseClient.from('anciens_eleves').select('*');
  document.getElementById('anciensList').innerHTML=data?.map(a=>`<div>${a.nom} ${a.prenom} - Bac ${a.annee_bac}</div>`).join('')||'<p>Aucun ancien</p>';
}
async function chargerArticles(){
  const {data}=await supabaseClient.from('actualites').select('*').order('created_at',{ascending:false});
  document.getElementById('articlesList').innerHTML=data?.map(a=>`<div>${a.titre}<p>${a.contenu}</p></div>`).join('')||'<p>Aucun article</p>';
}

// RECHERCHE / BULLETINS
window.rechercher=()=>document.getElementById('searchResults').innerHTML='<p>Fonction recherche à venir</p>';
window.rechercherBulletin=()=>document.getElementById('bulletinResult').innerHTML='<p>Fonction bulletin à venir</p>';

// COURS
window.submitCourse=async()=>{
  const title=document.getElementById('courseTitle').value.trim();
  const description=document.getElementById('courseDesc').value.trim();
  const teacherName=document.getElementById('teacherName').value.trim();
  const type=document.getElementById('courseType').value;
  const videoLink=document.getElementById('videoLink').value.trim();
  const pdfFile=document.getElementById('pdfFile').files[0];
  if(!title||!teacherName) return alert("Titre et professeur requis");

  let fileUrl="";
  if(type==="video") fileUrl=videoLink;
  if(type==="pdf" && pdfFile){
    const {data,error}=await supabaseClient.storage.from("cours").upload(`pdf/${Date.now()}-${pdfFile.name}`,pdfFile);
    if(error){ alert("Erreur upload PDF"); return; }
    const {data:publicUrl}=supabaseClient.storage.from("cours").getPublicUrl(data.path);
    fileUrl=publicUrl.publicUrl;
  }

  // Récupérer teacher_id si existe
  let {data:teacher}=await supabaseClient.from('enseignants').select('id').ilike('nom',teacherName).limit(1);
  let teacher_id=teacher?.[0]?.id||null;
  if(!teacher_id) return alert("Professeur introuvable dans la base");

  const {error}=await supabaseClient.from('courses').insert([{title,description,file_url:fileUrl,type,teacher_id,status:'pending'}]);
  if(error) alert("Erreur: "+error.message);
  else document.getElementById('courseMessage').innerText="⏳ Cours envoyé, en attente de validation";
};

async function chargerCoursApprouves(){
  const {data}=await supabaseClient.from('courses').select('*,enseignants(nom)').eq('status','approved').order('created_at',{ascending:false});
  const container=document.getElementById('approvedCourses');
  container.innerHTML=data?.map(c=>{
    if(c.type==='video') return `<div>${c.title}<p>${c.description}</p><iframe src="${c.file_url}" width="100%" height="200"></iframe><p>${c.enseignants.nom}</p></div>`;
    else return `<div>${c.title}<p>${c.description}</p><a href="${c.file_url}" target="_blank">📄 PDF</a><p>${c.enseignants.nom}</p></div>`;
  }).join('')||'<p>Aucun cours disponible</p>';
}

// ADMIN VALIDATION
async function chargerCoursEnAttente(){
  const {data}=await supabaseClient.from('courses').select('*,enseignants(nom)').eq('status','pending');
  const container=document.getElementById('pendingCourses');
  if(!data || data.length===0){ container.innerHTML="<p>Aucun cours en attente</p>"; return; }
  container.innerHTML=data.map(c=>`<div>${c.title} - ${c.enseignants.nom}<button onclick="approveCourse(${c.id})">✅</button><button onclick="rejectCourse(${c.id})">❌</button></div>`).join('');
}
window.approveCourse=async(id)=>{await supabaseClient.from('courses').update({status:'approved'}).eq('id',id); chargerCoursEnAttente();}
window.rejectCourse=async(id)=>{await supabaseClient.from('courses').update({status:'rejected'}).eq('id',id); chargerCoursEnAttente();}

// INIT
chargerAdministration(); chargerAnciens(); chargerArticles(); chargerCoursApprouves();
console.log("✅ Site prêt");
