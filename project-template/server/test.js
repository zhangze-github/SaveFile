var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '47.106.113.142',
    user     : 'root',
    password : '123456',
    database : 'test_db'
});
connection.connect();

var express = require('express');
var path = require('path');

var app = express();

// 利用express.static中间件来托管静态资源。
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/test', function (req, res) {
    connection.query(' insert into test_table (age, name) value(30, "zhang")', function (error, results, fields) {
        if (error) throw error;
        console.log('插入成功');
    });
    res.send('GET request to homepage');
});


app.listen(80)
