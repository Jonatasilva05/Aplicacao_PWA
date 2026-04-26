// src/models/bancoModel.js
const fs = require('fs');
const ARQUIVO_DB = './banco.json';

// Garante que o banco existe
if (!fs.existsSync(ARQUIVO_DB)) {
    fs.writeFileSync(ARQUIVO_DB, JSON.stringify({ usuarios: [], mensagens: [] }, null, 2));
}

module.exports = {
    lerBanco: () => {
        const dados = fs.readFileSync(ARQUIVO_DB, 'utf8');
        return JSON.parse(dados);
    },
    salvarBanco: (dados) => {
        fs.writeFileSync(ARQUIVO_DB, JSON.stringify(dados, null, 2));
    }
};