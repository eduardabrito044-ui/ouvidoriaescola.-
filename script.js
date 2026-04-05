import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let nome = localStorage.getItem("nome") || prompt("Qual o seu nome?") || "Anônimo";
localStorage.setItem("nome", nome);

// Lógica de Resposta
let responderInfo = null;

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    document.getElementById(id).classList.add("active");
    if(document.getElementById("btn-"+id)) document.getElementById("btn-"+id).classList.add("active-btn");
};

// Ativar a resposta ao clicar
window.prepararResposta = (autor, texto) => {
    responderInfo = { autor, texto };
    const preview = document.getElementById("reply-preview");
    preview.style.display = "flex";
    document.getElementById("reply-user").innerText = `Respondendo a ${autor}`;
    document.getElementById("reply-text").innerText = texto;
    document.getElementById("input-msg").focus();
};

window.cancelarResposta = () => {
    responderInfo = null;
    document.getElementById("reply-preview").style.display = "none";
};

// CHAT
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;

    const dados = { 
        nome, 
        texto: input.value, 
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    if (responderInfo) {
        dados.respostaPara = responderInfo.autor;
        dados.textoOriginal = responderInfo.texto;
    }

    push(ref(db, "mensagens"), dados);
    input.value = "";
    cancelarResposta();
};

onValue(ref(db, "mensagens"), (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if(!feed) return; feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        
        div.onclick = () => prepararResposta(d.nome, d.texto);

        let html = `<span class="msg-name">${d.nome}</span>`;
        if (d.respostaPara) {
            html += `<div class="reply-inside"><small>↳ ${d.respostaPara}</small>${d.textoOriginal}</div>`;
        }
        html += `<span class="msg-text">${d.texto}</span><span class="msg-time">${d.hora}</span>`;
        
        div.innerHTML = html;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// MURAL
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if (!input.value.trim()) return;
    push(ref(db, "mural"), { autor: nome, texto: input.value, data: new Date().toLocaleDateString() });
    input.value = "";
};

onValue(ref(db, "mural"), (snapshot) => {
    const feed = document.getElementById("feed-mural");
    if(!feed) return; feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = "msg-post outro"; div.style.maxWidth = "100%";
        div.innerHTML = `<span class="msg-name">${d.autor || "Anônimo"}</span><span class="msg-text">${d.texto}</span><span class="msg-time">${d.data || ""}</span>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

window.votarHumor = (v) => { push(ref(db, "humor"), { nome, voto: v }); alert("Votado!"); };
window.enviarFeedback = () => {
    const t = document.getElementById("texto-feedback");
    push(ref(db, "feedback"), { nome, texto: t.value });
    t.value = ""; alert("Enviado!");
};
