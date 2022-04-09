var dotenv = require('dotenv');
var mysql = require('mysql');

dotenv.config();

var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});

connection.connect(function(err) {
    if(err) {
        console.log("Connect to database failed!!!" + err);
    }else {
        console.log("Connect to database successful!!!");
    }
});

module.exports = connection;
