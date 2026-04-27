// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');
const qrcode = require('qrcode-terminal');

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

// function pegarIP() {
//     const interfaces = os.networkInterfaces();
//     for (const nome in interfaces) {
//         for (const iface of interfaces[nome]) {
//             if (iface.family === 'IPv4' && !iface.internal) {
//                 return iface.address;
//             }
//         }
//     }
//     return '127.0.0.1';
// }

const meuIP = '192.168.1.6';

// Iniciando o gerenciador de Sockets
socketHandler(io);

// LIGANDO O MOTOR (DEIXE APENAS ESTE BLOCO AQUI NO FINAL)
server.listen(3000, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 API rodando no seu PC em: http://localhost:3000`);
    console.log(`🌐 API na sua Rede Wi-Fi:    http://${meuIP}:3000`);
    console.log('--------------------------------------------------\n');
    
    console.log('📱 Escaneie o QR Code abaixo para abrir o app no celular:');
    
    qrcode.generate(`http://${meuIP}:5500`, { small: true });
});