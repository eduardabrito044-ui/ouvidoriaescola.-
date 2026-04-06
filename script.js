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
let nome = localStorage.getItem("nome") || prompt("Qual seu nome?") || "Aluno";
localStorage.setItem("nome", nome);
let responderInfo = null;

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.menu-scroll button').forEach(b => b.classList.remove('active-btn'));
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-'+id).classList.add('active-btn');
};

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    const msg = {
        nome,
        texto: input.value,
        hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    if (responderInfo) {
        msg.replyTo = responderInfo.autor;
        msg.replyText = responderInfo.texto;
    }
    push(ref(db, "mensagens"), msg);
    input.value = ""; cancelarResposta();
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.onclick = () => prepararResposta(d.nome, d.texto);
        div.innerHTML = `
            <span class="msg-name">${d.nome}</span>
            <div class="bubble">
                ${d.replyTo ? `<div style="opacity:0.6; font-size:11px; border-bottom:1px solid; margin-bottom:5px;">↳ ${d.replyTo}: ${d.replyText}</div>` : ''}
                ${d.texto}
            </div>
            <span class="msg-time">${d.hora}</span>
        `;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

window.prepararResposta = (autor, texto) => {
    responderInfo = { autor, texto };
    document.getElementById("reply-preview").style.display = "flex";
    document.getElementById("reply-user").innerText = "Respondendo a " + autor;
    document.getElementById("reply-text").innerText = texto;
};

window.cancelarResposta = () => {
    responderInfo = null;
    document.getElementById("reply-preview").style.display = "none";
};

window.enviarFeedback = () => {
    const texto = document.getElementById("texto-feedback");
    if(texto.value.trim()){
        push(ref(db, "feedbacks_privados"), { de: nome, msg: texto.value });
        alert("Enviado para a Eduarda!");
        texto.value = "";
    }
};

window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if(input.value.trim()) push(ref(db, "mural"), { autor: nome, texto: input.value, votos: 0 });
    input.value = "";
};

onValue(ref(db, "mural"), snap => {
    const feed = document.getElementById("feed-mural"); feed.innerHTML = "";
    let lista = []; snap.forEach(c => lista.push({id: c.key, ...c.val()}));
    lista.sort((a,b) => (b.votos || 0) - (a.votos || 0)).forEach((d, i) => {
        const div = document.createElement("div"); div.className = "msg-post outro"; div.style.maxWidth = "100%";
        div.innerHTML = `<div class="bubble"><strong>${i===0?'👑 ':''}${d.autor}:</strong> ${d.texto} <button onclick="votarIdeia('${d.id}')" style="float:right; background:none; border:none; cursor:pointer;">👍 ${d.votos || 0}</button></div>`;
        feed.appendChild(div);
    });
});

window.votarIdeia = (id) => runTransaction(ref(db, `mural/${id}/votos`), v => (v || 0) + 1);
