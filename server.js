var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var ping = require('ping');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.redirect('html/index.htm');
});

var hostNames = ['MSODT2', 'MSODT3', 'MSOHSM', 'MSOHSA', 'MSOCC1', 'MSOAOD', 'MSOEAF'];
var frequencyPing = 30000; //30 seconds
var frequencyUsers = 10000; //10 seconds
var nspIndex = io.of('/index');
var nspChat = io.of('/chat');

users = [];
ids = [];

hostNames.forEach(function(host){
    setInterval(function() {
        // Update index.htm with status of servers
        ping.sys.probe(host, function(active){
            var info = active ? 'Online' : 'Offline';
            nspIndex.emit('update-msg', info);
        });
    }, frequencyPing);
});

nspChat.on('connection', function(socket)  {
    var date = new Date();
    var ip = socket.request.connection.remoteAddress;

    setInterval(function() {
        //  Update chat.htm with users currently connected
        nspChat.emit('usersActive', users);
    }, frequencyUsers);

    // Get client IP Address
    if (ip.substr(0,7) == "::ffff:"){
        ip = ip.replace("::ffff:", "");
    }

    if (ip == "172.17.230.133"){
        var name = 'Nick Moyer';
        users.push(name);
        ids.push(socket.id);
        socket.emit('setUsernamePreset', 'Nick Moyer');
    }

    // For todays date;
    Date.prototype.today = function () { 
        return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+ this.getFullYear();
    };

    // For the time now
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    };

    console.log(date.today() + " " + date.timeNow() + " " + 'New connection from ' + ip);

    socket.on('setUsername', function(data) {    
        if(users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
            users.push(data);
            ids.push(socket.id);
            socket.emit('userSet', {username: data});
            console.log(ip + " set as " + data);
            nspChat.emit('connected', data);
        }
    });
    
    socket.on('msg', function(data) {
        //Send message to everyone
        nspChat.emit('newmsg', data);
        console.log(data.user + ": " + data.message);
    });

    socket.on('disconnect', function() {
        // Remove the user from the array
        var index = ids.indexOf(socket.id);
        var user = users[index];
        nspChat.emit('disconnected', user);
        console.log(user + ' disconnected');
        ids.splice(index, 1);
        users.splice(index, 1);
    });
});

server.listen(80, "172.17.230.18", function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Express app listening at http://%s:%s', host, port);
});