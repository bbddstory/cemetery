var mysql = require('mysql');

var dbc = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    port: '3307',
    user: 'root',
    password: 'root',
    database: 'phantom_zone',
    debug: false,
    multipleStatements: true
});

module.exports = dbc;