// assets/js/api.js
const API_URL = 'http://localhost:3000';

async function apiCadastrar(nome_falso, senha) {
    const req = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_falso, senha })
    });
    return await req.json();
}

async function apiLogar(nome_falso, senha) {
    const req = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_falso, senha })
    });
    return await req.json();
}

async function apiEnviarDenuncia(denuncia) {
    const req = await fetch(`${API_URL}/denuncia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(denuncia)
    });
    if (!req.ok) throw new Error("Falha no servidor");
    return await req.json();
}

async function apiBuscarHistorico() {
    const req = await fetch(`${API_URL}/mensagens`);
    return await req.json();
}