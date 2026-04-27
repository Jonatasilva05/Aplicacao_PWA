const bcrypt = require('bcryptjs');
const db = require('../config/db');

module.exports = {
    cadastrar: async (req, res) => {
        const { nome_falso, senha } = req.body;

        try {
            // Verifica se o usuário já existe
            const [usuariosExistentes] = await db.query('SELECT * FROM usuarios WHERE nome_falso = ?', [nome_falso]);
            if (usuariosExistentes.length > 0) {
                return res.status(400).json({ erro: "Este nome já está em uso." });
            }

            // Salva no banco
            const hash = bcrypt.hashSync(senha, 8);
            const [resultado] = await db.query('INSERT INTO usuarios (nome_falso, senha) VALUES (?, ?)', [nome_falso, hash]);

            res.json({ mensagem: "Usuário cadastrado com sucesso!", id: resultado.insertId });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({ erro: "Erro interno no servidor." });
        }
    },

    logar: async (req, res) => {
        const { nome_falso, senha } = req.body;

        try {
            const [usuarios] = await db.query('SELECT * FROM usuarios WHERE nome_falso = ?', [nome_falso]);
            
            if (usuarios.length === 0) {
                return res.status(400).json({ erro: "Usuário não encontrado." });
            }

            const usuario = usuarios[0];
            const senhaValida = bcrypt.compareSync(senha, usuario.senha);
            
            if (!senhaValida) {
                return res.status(401).json({ erro: "Senha incorreta." });
            }

            res.json({ mensagem: "Login efetuado com sucesso!", nome_falso: usuario.nome_falso });
        } catch (erro) {
            res.status(500).json({ erro: "Erro interno no servidor." });
        }
    }
};