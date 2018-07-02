var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var ping = require('ping');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.redirect('html/Index.htm');
});

var host2 = ['MSODT2', 'MSODT3', 'MSOHSM', 'MSOAOD', 'MSOEAF'];

var frequency = 15000; //15 seconds

host2.forEach(function(host){
    setInterval(function() {
        ping.sys.probe(host, function(active){
            var info = active ? host + ' = Online' : host + ' = Offline';
            io.sockets.emit('update-msg', info);
            console.log(info);
        });
    }, frequency);
});

server.listen(8000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Express app listening at http://%s:%s', host, port);
});