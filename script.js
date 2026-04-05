import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Suas configurações do Firebase já estão salvas aqui
const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let responderInfo = null;

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".menu-scroll button").forEach(b => b.classList.remove("active-btn"));
    document.getElementById(id).classList.add("active");
    document.getElementById("btn-"+id).classList.add("active-btn");
};

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    const msg = { 
        nome: localStorage.getItem("nome") || "Anônimo", 
        texto: input.value, 
        hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };
    if (responderInfo) { msg.replyTo = responderInfo.autor; msg.replyText = responderInfo.texto; }
    push(ref(db, "mensagens"), msg);
    input.value = ""; cancelarResposta();
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === localStorage.getItem("nome") ? 'me' : 'outro'}`;
        div.innerHTML = `
            <div class="bubble">
                ${d.replyTo ? `<div class="reply-inside"><small>${d.replyTo}</small>${d.replyText}</div>` : ''}
                ${d.texto}
            </div>
            <span style="font-size:10px; color:gray; margin-top:3px;">${d.hora}</span>`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});
