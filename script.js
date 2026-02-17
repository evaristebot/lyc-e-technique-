// ===== SUPABASE CONFIG SAFE =====
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'TA_CLE_ICI';

let supabaseClient = null;

try {
  if (window.supabase) {
    const { createClient } = window.supabase;
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase connecté");
  }
} catch (e) {
  console.warn("⚠️ Supabase indisponible");
}

// ===== NAVIGATION =====
window.showPage = function(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
};

// ===== MOT DE PASSE =====
const MASTER_PASSWORD = "LTB2025";

window.checkMasterPassword = function() {
  const pwd = document.getElementById('adminMasterPassword').value;

  if (pwd === MASTER_PASSWORD) {
    document.getElementById('adminZone').style.display = "block";
    alert("Accès autorisé ✅");
  } else {
    alert("Mot de passe incorrect ❌");
  }
};

console.log("🚀 Script chargé");
