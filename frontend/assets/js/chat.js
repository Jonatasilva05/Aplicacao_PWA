// assets/js/chat.js
const usuarioLogado = localStorage.getItem('usuario_denuncia');
if (!usuarioLogado) window.location.href = 'login.html';

document.getElementById('nome-usuario').innerText = usuarioLogado;
const container = document.getElementById('mensagens-container');
const inputMsg = document.getElementById('input-msg');
const statusOffline = document.getElementById('status-offline');

// Inicia o Socket.io
const socket = io(API_URL);

// Carrega Histórico
apiBuscarHistorico().then(mensagens => {
    mensagens.forEach(msg => renderizarMensagem(msg));
});

// Escuta novas mensagens em tempo real
socket.on('receber_denuncia', (msg) => renderizarMensagem(msg));

function renderizarMensagem(msg) {
    const div = document.createElement('div');
    div.classList.add('mensagem');
    if (msg.autor === usuarioLogado) div.classList.add('minha');
    
    div.innerHTML = `<strong>${msg.autor}</strong>${msg.texto}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Lógica de Enviar
async function enviarMensagem() {
    const texto = inputMsg.value.trim();
    if (!texto) return;

    const denuncia = { autor: usuarioLogado, texto: texto };
    inputMsg.value = '';

    if (navigator.onLine) {
        try {
            await apiEnviarDenuncia(denuncia);
        } catch (e) { 
            // Se o servidor cair, salva offline
            salvarOffline(denuncia, () => statusOffline.style.display = 'block'); 
        }
    } else {
        // Se não tem internet, salva offline
        salvarOffline(denuncia, () => statusOffline.style.display = 'block');
    }
}

function sair() {
    localStorage.removeItem('usuario_denuncia');
    window.location.href = 'login.html';
}

// Monitores de Internet
window.addEventListener('online', () => statusOffline.style.display = 'none');
window.addEventListener('offline', () => statusOffline.style.display = 'block');

// Registra o Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('SW Registrado!'));
}