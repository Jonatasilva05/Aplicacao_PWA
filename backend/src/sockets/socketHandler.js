// src/sockets/socketHandler.js
const { lerBanco, salvarBanco } = require('../models/bancoModel');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Novo usuário conectado via Socket:', socket.id);

        socket.on('nova_denuncia', (dados) => {
            const banco = lerBanco();
            const novaMensagem = {
                id: Date.now(),
                autor: dados.autor,
                texto: dados.texto,
                data_hora: new Date().toISOString()
            };

            banco.mensagens.push(novaMensagem);
            salvarBanco(banco);

            io.emit('receber_denuncia', novaMensagem);
        });

        socket.on('disconnect', () => {
            console.log('Usuário desconectado:', socket.id);
        });
    });
};