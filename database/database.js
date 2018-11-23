const os = require('os');

require('dotenv').config();

var mysql = require('mysql');
var dbc;

// The variables in the following function are in /.env
if(os.userInfo().username === 'foreverj') {
    dbc = mysql.createPool({
        // Production
        host: process.env.DB_HOST_PROD,
        port: process.env.DB_PORT_PROD,
        user: process.env.DB_USER_PROD,
        password: process.env.DB_PWD_PROD,
        database: process.env.DB_NAME_PROD,
        connectionLimit: process.env.DB_CONN_PROD,
        debug: false,
        multipleStatements: true
    });
} else {
    dbc = mysql.createPool({
        // Local development
        host: process.env.DB_HOST_LOC,
        port: process.env.DB_PORT_LOC,
        user: process.env.DB_USER_LOC,
        password: process.env.DB_PWD_LOC,
        database: process.env.DB_NAME_LOC,
        connectionLimit: process.env.DB_CONN_LOC,
        debug: false,
        multipleStatements: true
    });
}

module.exports = dbc;
