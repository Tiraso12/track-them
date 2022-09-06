const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Slowride@22!',
    database:'employee_tr'
});

module.exports = db;