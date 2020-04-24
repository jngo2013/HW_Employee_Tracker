const inquirer = require('inquirer');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'trackerdb'
});
connection.connect(err => {
    if(err) throw err;
    start();
});