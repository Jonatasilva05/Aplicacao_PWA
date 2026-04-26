// assets/js/auth.js
async function cadastrarUsuario() {
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    if (!nome || !senha) return alert("Preencha tudo!");

    try {
        const res = await apiCadastrar(nome, senha);
        if (res.erro) return alert(res.erro);
        alert('Cadastrado com sucesso! Faça login.');
        window.location.href = 'login.html';
    } catch (e) { alert("Erro de conexão com o servidor."); }
}

async function logarUsuario() {
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    if (!nome || !senha) return alert("Preencha tudo!");

    try {
        const res = await apiLogar(nome, senha);
        if (res.erro) return alert(res.erro);
        
        localStorage.setItem('usuario_denuncia', res.nome_falso);
        window.location.href = 'index.html';
    } catch (e) { alert("Erro de conexão com o servidor."); }
}