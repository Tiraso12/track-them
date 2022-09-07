const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Majorablack1995!?',
    database:'employee_tr'
});

module.exports = db;