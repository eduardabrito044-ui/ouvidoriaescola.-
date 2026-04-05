// CONFIGURAÇÃO FIREBASE (Certifique-se de que os dados estão corretos)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "ouvidoriaescola.firebaseapp.com",
    databaseURL: "https://ouvidoriaescola-default-rtdb.firebaseio.com",
    projectId: "ouvidoriaescola",
    storageBucket: "ouvidoriaescola.appspot.com",
    messagingSenderId: "SEU_ID",
    appId: "SEU_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// TROCA DE ABAS
function mudarAba(idAba, event) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('active'));
    document.querySelectorAll('.nav-buttons button').forEach(btn => btn.classList.remove('active-btn'));
    
    document.getElementById(idAba).classList.add('active');
    if (event) event.currentTarget.classList.add('active-btn');
    
    if(idAba === 'forum') rolarChat();
}

// ROLAGEM AUTOMÁTICA DO CHAT
function rolarChat() {
    const feed = document.getElementById('feed-forum');
    if (feed) {
        setTimeout(() => {
            feed.scrollTop = feed.scrollHeight;
        }, 200);
    }
}

// TEMA DARK/LIGHT
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
    }
}

// ENVIAR MENSAGEM CHAT
function enviarMensagem() {
    const input = document.getElementById('input-chat');
    const msg = input.value;
    if(msg.trim() !== "") {
        db.ref('mensagens').push({
            texto: msg,
            usuario: "Aluno",
            data: new Date().getTime()
        });
        input.value = "";
        rolarChat();
    }
}

// OUVIR MENSAGENS (EXEMPLO)
db.ref('mensagens').on('child_added', (snapshot) => {
    const data = snapshot.val();
    const feed = document.getElementById('feed-forum');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg-post');
    if(data.usuario === "Aluno") msgDiv.classList.add('me');
    msgDiv.innerHTML = `<span class="msg-text">${data.texto}</span>`;
    feed.appendChild(msgDiv);
    rolarChat();
});

// ENVIAR FEEDBACK
function enviarFeedback() {
    const texto = document.getElementById('texto-feedback').value;
    if(texto.trim() !== "") {
        db.ref('feedback').push({ mensagem: texto });
        alert("Valeu! Tua opinião foi enviada.");
        document.getElementById('texto-feedback').value = "";
    }
}
