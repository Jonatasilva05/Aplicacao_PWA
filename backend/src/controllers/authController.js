// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const { lerBanco, salvarBanco } = require('../models/bancoModel');

module.exports = {
    cadastrar: (req, res) => {
        const { nome_falso, senha } = req.body;
        const banco = lerBanco();

        if (banco.usuarios.find(u => u.nome_falso === nome_falso)) {
            return res.status(400).json({ erro: "Este nome já está em uso." });
        }

        const novoUsuario = { 
            id: Date.now(), 
            nome_falso, 
            senha: bcrypt.hashSync(senha, 8) 
        };

        banco.usuarios.push(novoUsuario);
        salvarBanco(banco);

        res.json({ mensagem: "Usuário cadastrado com sucesso!", id: novoUsuario.id });
    },

    logar: (req, res) => {
        const { nome_falso, senha } = req.body;
        const banco = lerBanco();
        const usuario = banco.usuarios.find(u => u.nome_falso === nome_falso);

        if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
            return res.status(401).json({ erro: "Usuário ou senha incorretos." });
        }

        res.json({ mensagem: "Login efetuado com sucesso!", nome_falso: usuario.nome_falso });
    }
};