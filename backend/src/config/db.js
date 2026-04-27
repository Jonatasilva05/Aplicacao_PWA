const mysql = require('mysql2/promise');

// Altere o usuário e senha caso o seu MySQL não seja o padrão do XAMPP
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'app_denuncias',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;