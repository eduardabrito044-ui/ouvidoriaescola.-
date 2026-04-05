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

let nome = localStorage.getItem("nome");
if (!nome) {
    nome = prompt("Seu nome:") || "Anônimo";
    localStorage.setItem("nome", nome);
}

// ABAS
window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.getElementById(id).classList.add("active");
};

// CHAT
const chatRef = ref(db, "mensagens");

window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    const texto = input.value.trim();
    if (!texto) return;

    push(chatRef, {
        nome,
        texto,
        hora: new Date().toLocaleTimeString()
    });

    input.value = "";
};

onValue(chatRef, (snapshot) => {
    const feed = document.getElementById("feed-forum");
    feed.innerHTML = "";

    snapshot.forEach((child) => {
        const dados = child.val();

        const div = document.createElement("div");
        div.className = "msg-post " + (dados.nome === nome ? "me" : "outro");

        div.innerHTML = `
            <b>${dados.nome}</b><br>
            ${dados.texto}<br>
            <small>${dados.hora}</small>
        `;

        feed.appendChild(div);
    });

    setTimeout(() => {
        feed.scrollTop = feed.scrollHeight;
    }, 100);
});

// MURAL
const muralRef = ref(db, "mural");

window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    const texto = input.value.trim();
    if (!texto) return;

    push(muralRef, {
        autor: nome,
        texto,
        data: new Date().toLocaleDateString()
    });

    input.value = "";
};

onValue(muralRef, (snapshot) => {
    const feed = document.getElementById("feed-mural");
    feed.innerHTML = "";

    snapshot.forEach((child) => {
        const dados = child.val();

        const div = document.createElement("div");
        div.className = "msg-post outro";

        div.innerHTML = `
            <b>${dados.autor}</b><br>
            ${dados.texto}<br>
            <small>${dados.data}</small>
        `;

        feed.appendChild(div);
    });
});

// HUMOR (EMOJIS FUNCIONANDO)
window.votarHumor = (tipo) => {
    push(ref(db, "humor"), {
        usuario: nome,
        voto: tipo,
        data: new Date().toLocaleDateString()
    });

    alert("Voto registrado!");
};

// FEEDBACK
window.enviarFeedback = () => {
    const texto = document.getElementById("texto-feedback").value.trim();
    if (!texto) return;

    push(ref(db, "feedback"), {
        usuario: nome,
        comentario: texto
    });

    document.getElementById("texto-feedback").value = "";
    alert("Enviado!");
};
