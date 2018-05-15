require('dotenv').config();

var mysql = require('mysql');

var dbc = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONN,
    debug: false,
    multipleStatements: true
});
// var dbc = mysql.createPool({
//     host: process.env.DB_HOST_PROD,
//     port: process.env.DB_PORT_PROD,
//     user: process.env.DB_USER_PROD,
//     password: process.env.DB_PWD_PROD,
//     database: process.env.DB_NAME_PROD,
//     connectionLimit: process.env.DB_CONN_PROD,
//     debug: false,
//     multipleStatements: true
// });

module.exports = dbc;
