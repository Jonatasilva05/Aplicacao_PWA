// src/routes/rotas.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

// Rotas de Autenticação
router.post('/cadastro', authController.cadastrar);
router.post('/login', authController.logar);

// Rotas do Chat
router.post('/denuncia', chatController.receberDenuncia);
router.get('/mensagens', chatController.listarMensagens);

module.exports = router;