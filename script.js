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

let meuNome = localStorage.getItem("nome_usuario") || prompt("Qual o seu nome?") || "Aluno";
localStorage.setItem("nome_usuario", meuNome);

let msgParaResponder = null;

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

window.prepararResposta = (nome, texto) => {
    msgParaResponder = { nome, texto };
    document.getElementById('reply-preview').style.display = 'flex';
    document.getElementById('reply-user').innerText = `Respondendo ${nome}`;
    document.getElementById('reply-text').innerText = texto.substring(0, 30) + "...";
    document.getElementById('input-msg').focus();
};

window.cancelarResposta = () => {
    msgParaResponder = null;
    document.getElementById('reply-preview').style.display = 'none';
};

const chatRef = ref(db, "mensagens");

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;

    const dados = {
        nome: meuNome,
        texto: input.value,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (msgParaResponder) {
        dados.respostaDe = msgParaResponder.nome;
        dados.textoOriginal = msgParaResponder.texto;
    }

    push(chatRef, dados);
    input.value = "";
    cancelarResposta();
};

onValue(chatRef, (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if (!feed) return;
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === meuNome ? 'me' : 'outro'}`;
        div.onclick = () => prepararResposta(d.nome, d.texto);

        let html = `<span class="msg-name">${d.nome}</span>`;
        if (d.respostaDe) {
            html += `<div style="background:rgba(0,0,0,0.1); border-left:2px solid white; padding:5px; margin-bottom:5px; font-size:0.8rem;">
                        <small>↳ ${d.respostaDe}</small>
                     </div>`;
        }
        html += `<span class="msg-text">${d.texto}</span><span class="msg-time">${d.hora}</span>`;
        div.innerHTML = html;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});
