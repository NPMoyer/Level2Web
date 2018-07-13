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

var hostNames = ['MSODT2', 'MSODT3', 'MSOHSM', 'MSOHSA', 'MSOCC1', 'MSOAOD', 'MSOEAF'];

var frequency = 30000; //30 seconds

hostNames.forEach(function(host){
    setInterval(function() {
        ping.sys.probe(host, function(active){
            var info = active ? 'Online' : 'Offline';
            io.sockets.emit('update-msg', info);
        });
    }, frequency);
});

users = [];
io.on('connection', function(socket) {
    // Get client IP Address
    var ip = socket.request.connection.remoteAddress;
    if (ip.substr(0,7) == "::ffff:"){
        ip = ip.replace("::ffff:", "");
    }
    console.log('New connection from ' + ip);

    socket.on('setUsername', function(data) {
        console.log(ip + ":" + data);
        
        if(users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
            users.push(data);
            socket.emit('userSet', {username: data});
        }
    });
    
    socket.on('msg', function(data) {
        //Send message to everyone
        io.sockets.emit('newmsg', data);
    })
});

server.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Express app listening at http://%s:%s', host, port);
});