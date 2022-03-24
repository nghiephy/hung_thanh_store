var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '150101',
    database: 'hung_thanh_bookstore',
    port: '3306'
});

connection.connect(function(err) {
    if(err) {
        console.log("Connect to database failed!!!" + err);
    }else {
        console.log("Connect to database successful!!!");
    }
});

module.exports = connection;
