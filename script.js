import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
let nomeUser = localStorage.getItem("nome") || prompt("Olá! Como se chama?") || "Anônimo";
localStorage.setItem("nome", nomeUser);

// NAVEGAÇÃO
window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".nav-scroll button").forEach(b => b.classList.remove("active-btn"));
    document.getElementById(id).classList.add("active");
    document.getElementById("btn-"+id).classList.add("active-btn");
};

window.toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark", document.body.classList.contains("dark-mode"));
};
if(localStorage.getItem("dark") === "true") document.body.classList.add("dark-mode");

// SALVAR MENSAGEM
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), { 
        dono: nomeUser, 
        texto: input.value, 
        hora: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) 
    });
    input.value = "";
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg ${d.dono === nomeUser ? 'me' : 'outro'}`;
        div.innerHTML = `${d.texto} <small>${d.hora}</small>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// IDEIAS E RANKING
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if(input.value.trim()) push(ref(db, "mural"), { autor: nomeUser, texto: input.value, votos: 0 });
    input.value = "";
};

window.votarIdeia = (id) => runTransaction(ref(db, `mural/${id}/votos`), v => (v || 0) + 1);

onValue(ref(db, "mural"), snap => {
    const feed = document.getElementById("feed-mural"); feed.innerHTML = "";
    let lista = []; snap.forEach(c => lista.push({id: c.key, ...c.val()}));
    lista.sort((a,b) => (b.votos || 0) - (a.votos || 0)).forEach((d, idx) => {
        const isGold = (idx === 0 && d.votos > 0) ? "gold" : "";
        feed.innerHTML += `
            <div class="msg outro ${isGold}" style="max-width:100%; margin-bottom:10px;">
                <strong>${d.autor}:</strong> ${d.texto}
                <button onclick="votarIdeia('${d.id}')" style="float:right; border:none; background:var(--azul); color:white; border-radius:10px; padding:4px 8px; cursor:pointer;">👍 ${d.votos || 0}</button>
            </div>`;
    });
});

window.enviarSentimento = (h, e) => {
    push(ref(db, "sentimentos"), { aluno: nomeUser, humor: h, emoji: e, data: new Date().toLocaleString() });
    alert("Humor enviado!");
};

window.enviarFeedback = () => {
    const txt = document.getElementById("texto-feedback");
    if(txt.value.trim()) {
        push(ref(db, "feedbacks"), { aluno: nomeUser, texto: txt.value });
        txt.value = ""; alert("Enviado com sucesso!");
    }
};
