// Carregar dados ao abrir o site
window.onload = () => {
    exibirMensagens();
    exibirIdeias();
    atualizarPlacarHumor();
};

function mudarAba(id) {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// --- LÓGICA DO FÓRUM ---
function salvarMensagem() {
    const nick = document.getElementById('input-nick').value || "Anônimo";
    const msg = document.getElementById('input-msg').value;
    
    if(!msg) return;

    const mensagens = JSON.parse(localStorage.getItem('forum_msgs') || '[]');
    mensagens.push({ nick, texto: msg });
    localStorage.setItem('forum_msgs', JSON.stringify(mensagens));
    
    document.getElementById('input-msg').value = "";
    exibirMensagens();
}

function exibirMensagens() {
    const feed = document.getElementById('feed-forum');
    const mensagens = JSON.parse(localStorage.getItem('forum_msgs') || '[]');
    feed.innerHTML = mensagens.map(m => `
        <div class="msg-post"><strong>@${m.nick}:</strong> ${m.texto}</div>
    `).join('');
    feed.scrollTop = feed.scrollHeight;
}

// --- LÓGICA DO MURAL DE IDEIAS ---
function salvarIdeia() {
    const texto = document.getElementById('input-ideia').value;
    if(!texto) return;

    const ideias = JSON.parse(localStorage.getItem('mural_ideias') || '[]');
    ideias.push({ texto, votos: 0 });
    localStorage.setItem('mural_ideias', JSON.stringify(ideias));

    document.getElementById('input-ideia').value = "";
    exibirIdeias();
}

function votarIdeia(index) {
    const ideias = JSON.parse(localStorage.getItem('mural_ideias'));
    ideias[index].votos += 1;
    localStorage.setItem('mural_ideias', JSON.stringify(ideias));
    exibirIdeias();
}

function exibirIdeias() {
    const feed = document.getElementById('feed-mural');
    const ideias = JSON.parse(localStorage.getItem('mural_ideias') || '[]');
    feed.innerHTML = ideias.map((ideia, i) => `
        <div class="msg-post" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${ideia.texto}</span>
            <button onclick="votarIdeia(${i})" style="background:#7c3aed; padding:5px 10px; border-radius:8px; border:none; color:white;">👍 ${ideia.votos}</button>
        </div>
    `).join('');
}

// --- LÓGICA DO HUMOR ---
function votarEmoji(tipo) {
    const humor = JSON.parse(localStorage.getItem('clima_escola') || '{"feliz":0,"triste":0,"cansado":0,"bravo":0}');
    humor[tipo] += 1;
    localStorage.setItem('clima_escola', JSON.stringify(humor));
    atualizarPlacarHumor();
}

function atualizarPlacarHumor() {
    const humor = JSON.parse(localStorage.getItem('clima_escola') || '{"feliz":0,"triste":0,"cansado":0,"bravo":0}');
    for (let t in humor) {
        document.getElementById(`v-${t}`).innerText = humor[t];
    }
}
// --- LÓGICA DE OPINIÃO SOBRE A ESCOLA ---
function salvarFeedbackEscola() {
    const texto = document.getElementById('feedback-texto').value;
    const nick = document.getElementById('input-nick').value || "Anônimo";

    if (!texto) {
        alert("Por favor, escreva sua opinião antes de enviar!");
        return;
    }

    // Busca o que já existe ou cria lista nova
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks_escola') || '[]');
    
    // Adiciona a nova opinião com data
    feedbacks.push({
        aluno: nick,
        opiniao: texto,
        data: new Date().toLocaleDateString('pt-BR')
    });

    // Salva de volta no navegador
    localStorage.setItem('feedbacks_escola', JSON.stringify(feedbacks));

    alert("Obrigada! Sua opinião sobre a escola foi salva com sucesso.");
    document.getElementById('feedback-texto').value = ""; // Limpa o campo
    
    // Opcional: Mostra no console para você monitorar
    console.log("Novo feedback recebido:", feedbacks);
}
