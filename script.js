import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuração do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
  authDomain: "siteescolaeduarda.firebaseapp.com",
  databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
  projectId: "siteescolaeduarda",
  storageBucket: "siteescolaeduarda.firebasestorage.app",
  messagingSenderId: "381495876879",
  appId: "1:381495876879:web:4366dc25b119a2567e327a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sistema de Nome de Usuário
let meuNome = localStorage.getItem("nome_usuario");
if (!meuNome) {
    meuNome = prompt("Seja bem-vindo! Qual o seu nome?") || "Anônimo";
    localStorage.setItem("nome_usuario", meuNome);
}

// NAVEGAÇÃO DE ABAS
window.mudarAba = function(id) {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

// CHAT EM TEMPO REAL
const chatRef = ref(db, "mensagens");

window.salvarMensagem = function() {
    const input = document.getElementById("input-msg");
    const msg = input.value.trim();
    if (!msg) return;

    push(chatRef, {
        nome: meuNome,
        texto: msg,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    input.value = "";
};

// Listener do Chat
onValue(chatRef, (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if (!feed) return;
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const dados = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${dados.nome === meuNome ? 'me' : 'outro'}`;
        div.innerHTML = `<strong>${dados.nome}</strong>${dados.texto}<small>${dados.hora}</small>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// MURAL DE IDEIAS
const muralRef = ref(db, "mural");

window.salvarIdeia = function() {
    const input = document.getElementById("input-ideia");
    const texto = input.value.trim();
    if (!texto) return;

    push(muralRef, {
        autor: meuNome,
        texto: texto,
        data: new Date().toLocaleDateString()
    });
    input.value = "";
    alert("Sua ideia foi enviada ao mural!");
};

onValue(muralRef, (snapshot) => {
    const feedMural = document.getElementById("feed-mural");
    if (!feedMural) return;
    feedMural.innerHTML = "";
    snapshot.forEach((child) => {
        const dados = child.val();
        const div = document.createElement("div");
        div.className = "msg-post outro";
        div.innerHTML = `<strong>💡 Sugestão de ${dados.autor}</strong>${dados.texto}`;
        feedMural.appendChild(div);
    });
});

// HUMOR DO DIA
window.votarHumor = function(tipo) {
    push(ref(db, "humor"), {
        usuario: meuNome,
        voto: tipo,
        data: new Date().toLocaleDateString()
    });
    alert("Voto registrado! Obrigado por compartilhar como se sente.");
};

// FEEDBACK
window.enviarFeedback = function() {
    const area = document.getElementById("texto-feedback");
    const texto = area.value.trim();
    if (!texto) return;

    push(ref(db, "feedback"), {
        usuario: meuNome,
        comentario: texto,
        data: new Date().toLocaleString()
    });
    area.value = "";
    alert("Feedback enviado com sucesso!");
};

// Atalho Enter para o input de mensagem
document.addEventListener("keypress", (e) => {
    if(e.key === "Enter" && document.activeElement.id === "input-msg") {
        salvarMensagem();
    }
});
