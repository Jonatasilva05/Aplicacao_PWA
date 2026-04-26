// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Importando nossos módulos MVC
const rotas = require('./src/routes/rotas');
const socketHandler = require('./src/sockets/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(cors());
app.use(express.json());

// Injeta o 'io' em todas as requisições (para o chatController conseguir emitir mensagens)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Usando as rotas separadas
app.use('/', rotas);

// Iniciando o gerenciador de Sockets
socketHandler(io);

// Ligando o motor
server.listen(3000, () => {
    console.log('Servidor MVC rodando em http://localhost:3000');
});