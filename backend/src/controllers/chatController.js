const db = require('../config/db');

module.exports = {
    receberDenuncia: async (req, res) => {
        const { autor, texto } = req.body;
        if (!autor || !texto) return res.status(400).json({ erro: "Dados incompletos" });

        try {
            // Salva no MySQL
            const [resultado] = await db.query('INSERT INTO mensagens (autor, texto) VALUES (?, ?)', [autor, texto]);
            
            // Pega a mensagem recém-criada para mandar pro Socket (com a data certa do banco)
            const [novaMensagem] = await db.query('SELECT * FROM mensagens WHERE id = ?', [resultado.insertId]);

            // Dispara a mensagem para quem estiver online
            req.io.emit('receber_denuncia', novaMensagem[0]);
            
            res.json({ sucesso: true });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao salvar denúncia." });
        }
    },

    listarMensagens: async (req, res) => {
        try {
            const [mensagens] = await db.query('SELECT * FROM mensagens ORDER BY data_hora ASC');
            res.json(mensagens);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar histórico." });
        }
    }
};