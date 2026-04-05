import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let nome = localStorage.getItem("nome") || prompt("Seu nome:") || "Estudante";
localStorage.setItem("nome", nome);

window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    document.getElementById(id).classList.add("active");
    if(document.getElementById("btn-"+id)) document.getElementById("btn-"+id).classList.add("active-btn");
};

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (input.value.trim()) push(ref(db, "mensagens"), { nome, texto: input.value });
    input.value = "";
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.innerHTML = `<b>${d.nome}</b>${d.texto}`;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if(input.value.trim()) push(ref(db, "mural"), { autor: nome, texto: input.value, votos: 0 });
    input.value = "";
};

window.votarIdeia = (id) => runTransaction(ref(db, `mural/${id}/votos`), v => (v || 0) + 1);

onValue(ref(db, "mural"), snap => {
    const feed = document.getElementById("feed-mural"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = "insta-card";
        div.innerHTML = `<b>${d.autor}:</b> ${d.texto} <button onclick="votarIdeia('${c.key}')" style="float:right; border:none; background:none; color:var(--primary); font-weight:bold;">❤️ ${d.votos || 0}</button>`;
        feed.appendChild(div);
    });
});

window.salvarAviso = () => {
    if(prompt("Senha:") === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(input.value.trim()) push(ref(db, "avisos"), { texto: input.value });
        input.value = "";
    }
};

onValue(ref(db, "avisos"), snap => {
    const feed = document.getElementById("feed-avisos"); feed.innerHTML = "";
    snap.forEach(c => {
        const div = document.createElement("div"); div.className = "insta-card";
        div.innerHTML = `<b>DIREÇÃO:</b> ${c.val().texto}`;
        feed.prepend(div);
    });
});

window.enviarFeedback = () => {
    const t = document.getElementById("texto-feedback");
    if(t.value.trim()) { push(ref(db, "feedbacks_privados"), { aluno: nome, texto: t.value }); t.value = ""; alert("Enviado!"); }
};

window.votarHumor = (h) => { push(ref(db, "humor"), { nome, status: h }); alert("Registrado!"); };
