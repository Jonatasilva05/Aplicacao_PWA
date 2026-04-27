const db = require('../config/db');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Novo usuário conectado via Socket:', socket.id);

        // 1. Escuta o envio de uma nova mensagem
        socket.on('nova_denuncia', async (dados) => {
            try {
                // Insere no banco (o status 'enviado' já vai por padrão)
                const [resultado] = await db.query('INSERT INTO mensagens (autor, texto) VALUES (?, ?)', [dados.autor, dados.texto]);
                
                const [novaMensagem] = await db.query('SELECT * FROM mensagens WHERE id = ?', [resultado.insertId]);

                // Emite para todo mundo
                io.emit('receber_denuncia', novaMensagem[0]);
            } catch (erro) {
                console.error("Erro ao salvar mensagem do Socket:", erro);
            }
        });

        // 2. Escuta a atualização de status (Entregue ou Lido)
        socket.on('atualizar_status', async (dados) => {
            try {
                // Atualiza no banco apenas se não estiver voltando para trás (ex: de 'lido' para 'entregue')
                await db.query('UPDATE mensagens SET status = ? WHERE id = ? AND status != "lido"', [dados.status, dados.id_mensagem]);
                
                // Avisa os celulares para mudarem a cor do checkmark
                io.emit('status_atualizado', { id_mensagem: dados.id_mensagem, status: dados.status });
            } catch (erro) {
                console.error("Erro ao atualizar status:", erro);
            }
        });

        socket.on('disconnect', () => {
            console.log('Usuário desconectado:', socket.id);
        });
    });
};