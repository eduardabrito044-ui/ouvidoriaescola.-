import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
  authDomain: "siteescolaed uarda.firebaseapp.com",
  databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
  projectId: "siteescolaeduarda",
  storageBucket: "siteescolaeduarda.firebasestorage.app",
  messagingSenderId: "381495876879",
  appId: "1:381495876879:web:4366dc25b119a2567e327a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const mensagensRef = ref(db, "mensagens");

// --- FUNÇÃO DO TELEGRAM ---
async function enviarNotificacaoTelegram(texto) {
    const token = '8677563218:AAETd9WMADtAu1PG9i4pOmP07eKZTHtAOxE';
    const meuId = '8562940574';
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${meuId}&text=${encodeURIComponent(texto)}`;
    
    try {
        await fetch(url);
    } catch (e) {
        console.error("Erro Telegram:", e);
    }
}

// Nome automático
let meuNome = localStorage.getItem("nome");
if (!meuNome) {
  meuNome = prompt("Digite seu nome:");
  localStorage.setItem("nome", meuNome);
}

// Notificar quando o site for aberto (Opcional)
enviarNotificacaoTelegram(`🚀 ${meuNome} acabou de entrar no site!`);

// Trocar aba
window.mudarAba = function(id) {
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

// Enviar mensagem
window.salvarMensagem = function() {
  const msg = document.getElementById("input-msg").value;
  if (!msg) return;

  push(mensagensRef, {
    nome: meuNome,
    texto: msg,
    hora: new Date().toLocaleTimeString()
  });

  // AVISO NO TELEGRAM
  enviarNotificacaoTelegram(`📩 Nova mensagem no Fórum!\nDe: ${meuNome}\nTexto: ${msg}`);

  document.getElementById("input-msg").value = "";
};

// Receber mensagens
onValue(mensagensRef, (snapshot) => {
  const feed = document.getElementById("feed-forum");
  if (!feed) return;
  feed.innerHTML = "";

  snapshot.forEach((child) => {
    const dados = child.val();
    const div = document.createElement("div");
    div.classList.add("msg-post"); // Ajustado para sua classe CSS

    div.innerHTML = `
      <strong>${dados.nome}</strong><br>
      ${dados.texto}<br>
      <small>${dados.hora}</small>
    `;
    feed.appendChild(div);
  });
  feed.scrollTop = feed.scrollHeight;
});

// Funções extras com alertas
window.salvarIdeia = function() {
  const ideia = document.querySelector("#aba-ideias textarea").value;
  enviarNotificacaoTelegram(`💡 Nova Ideia Enviada por ${meuNome}: ${ideia}`);
  alert("Ideia enviada com sucesso!");
};

window.votarEmoji = function(tipo) {
  enviarNotificacaoTelegram(`📊 Voto de Humor: ${meuNome} marcou [${tipo}]`);
  alert("Voto registrado: " + tipo);
};

window.enviarFeedbackEscola = function() {
  enviarNotificacaoTelegram(`📝 Novo Feedback da Escola enviado por ${meuNome}`);
  alert("Feedback enviado!");
};


