// assets/js/chat.js
const usuarioLogado = localStorage.getItem('usuario_denuncia');
if (!usuarioLogado) window.location.href = 'login.html';

document.getElementById('nome-usuario').innerText = usuarioLogado;
const container = document.getElementById('mensagens-container');
const inputMsg = document.getElementById('input-msg');
const statusOffline = document.getElementById('status-offline');

const socket = io(API_URL);

// Função para deixar a data bonita (Ex: 14:30)
function formatarHora(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Retorna os ícones de check corretos
function obterIconesCheck(status) {
    if (status === 'enviado') return '<span class="check">✓</span>';
    if (status === 'entregue') return '<span class="check entregue">✓✓</span>';
    if (status === 'lido') return '<span class="check lido">✓✓</span>';
    return '';
}

// Carrega Histórico Antigo
apiBuscarHistorico().then(mensagens => {
    mensagens.forEach(msg => renderizarMensagem(msg));
});

// Escuta Novas Mensagens
socket.on('receber_denuncia', (msg) => {
    renderizarMensagem(msg);

    // Se eu recebi a mensagem de outra pessoa, eu aviso o servidor que ela chegou!
    if (msg.autor !== usuarioLogado) {
        // Se a minha tela está visível/focada, marca como 'lido', senão, apenas 'entregue'
        const novoStatus = document.visibilityState === 'visible' ? 'lido' : 'entregue';
        socket.emit('atualizar_status', { id_mensagem: msg.id, status: novoStatus });
    }
});

// Escuta Atualização de Status (Mudar os Checks)
socket.on('status_atualizado', (dados) => {
    const spanStatus = document.getElementById(`status-${dados.id_mensagem}`);
    if (spanStatus) {
        spanStatus.innerHTML = obterIconesCheck(dados.status);
    }
});

// Função de Renderizar na Tela
function renderizarMensagem(msg) {
    const div = document.createElement('div');
    div.classList.add('mensagem');
    
    let checksHtml = '';
    
    // Só mostramos os checks para as mensagens que NÓS enviamos
    if (msg.autor === usuarioLogado) {
        div.classList.add('minha');
        checksHtml = `<span id="status-${msg.id}">${obterIconesCheck(msg.status)}</span>`;
    }
    
    div.innerHTML = `
        <strong>${msg.autor}</strong>
        <div>${msg.texto}</div>
        <div class="info-mensagem">
            ${formatarHora(msg.data_hora)} ${checksHtml}
        </div>
    `;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// Lógica de Enviar (Modificada para usar o Socket.io em vez da API quando online para ficar mais rápido)
async function enviarMensagem() {
    const texto = inputMsg.value.trim();
    if (!texto) return;

    const denuncia = { autor: usuarioLogado, texto: texto };
    inputMsg.value = '';

    if (navigator.onLine) {
        // Envia direto pelo túnel do Socket.io!
        socket.emit('nova_denuncia', denuncia);
    } else {
        salvarOffline(denuncia, () => statusOffline.style.display = 'block');
    }
}

function sair() {
    localStorage.removeItem('usuario_denuncia');
    window.location.href = 'login.html';
}

window.addEventListener('online', () => statusOffline.style.display = 'none');
window.addEventListener('offline', () => statusOffline.style.display = 'block');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => console.log('SW Registrado!'));
}