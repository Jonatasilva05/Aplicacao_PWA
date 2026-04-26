// src/controllers/chatController.js
const { lerBanco, salvarBanco } = require('../models/bancoModel');

module.exports = {
    receberDenuncia: (req, res) => {
        const { autor, texto } = req.body;
        if (!autor || !texto) return res.status(400).json({ erro: "Dados incompletos" });

        const banco = lerBanco();
        const novaMensagem = {
            id: Date.now(),
            autor,
            texto,
            data_hora: new Date().toISOString()
        };

        banco.mensagens.push(novaMensagem);
        salvarBanco(banco);

        // Dispara a mensagem para quem estiver online (req.io é injetado nas rotas)
        req.io.emit('receber_denuncia', novaMensagem);
        
        res.json({ sucesso: true });
    },

    listarMensagens: (req, res) => {
        const banco = lerBanco();
        res.json(banco.mensagens);
    }
};