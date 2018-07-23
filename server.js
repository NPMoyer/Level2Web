var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var ping = require('ping');
var MongoClient = require('mongodb').MongoClient;
var winston = require('winston');
require('winston-daily-rotate-file');

var date = new Date();
var url = "mongodb://localhost:27017/";
var logDir = '//mamafil01/automatn_pub/level 2 web/logs';
var hostNames = ['MSODT2', 'MSODT3', 'MSOHSM', 'MSOHSA', 'MSOCC1', 'MSOAOD', 'MSOEAF'];

var frequencyPing = 30000; //30 seconds
var frequencyUsers = 10000; //10 seconds

var nspIndex = io.of('/index');
var nspChat = io.of('/chat');
var nspEmail = io.of('/email');

// For todays date;
Date.prototype.today = function () { 
    return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+ this.getFullYear();
};
// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + 
    this.getSeconds();
};

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Create the logger
var transport = new (winston.transports.DailyRotateFile)({
    filename: logDir + '/%DATE%.log',
    datePattern: 'MM-DD-YYYY',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
var logger = winston.createLogger({
    transports: [
        transport
    ]
});
logger.info(date.today() + " " + date.timeNow() + " " + 'Start of logging');


// Specify the location for source code
app.use(express.static('public'));

// Redirect the client to the index page
app.get('/', function (req, res) {
    res.redirect('html/index.htm');
});

users = [];
ids = [];

// Update index.htm with status of servers
hostNames.forEach(function(host){
    setInterval(function() {
        ping.sys.probe(host, function(active){
            var info = active ? 'Online' : 'Offline';
            if (info == 'Offline')
                logger.warn(date.today() + " " + date.timeNow() + " " + host + ":" + info);
            nspIndex.emit('update-msg', info);
        });
    }, frequencyPing);
});

nspChat.on('connection', function(socket)  {
    var ip = socket.request.connection.remoteAddress;

    //  Update chat.htm with users currently connected
    setInterval(function() {
        nspChat.emit('usersActive', users);
    }, frequencyUsers);

    // Get client IP Address
    if (ip.substr(0,7) == "::ffff:"){
        ip = ip.replace("::ffff:", "");
    }

    // Search the database to find it the IP address is a predefined user
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { address: ip };

        dbo.collection("IPs").find(query).toArray(function(err, result) {
            if (err) throw err;

            if (result.length){
                // IP was found in the DB, get the associated name
                var name = result[0].name;
                socket.emit('setUsernamePreset', name);
            }
            db.close();
        });
    });

    // Log the connection
    logger.info(date.today() + " " + date.timeNow() + " " + 'New connection from ' + ip);

    socket.on('setUsername', function(data) {    
        // User has set their username
        if(users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        } else {
            users.push(data);
            ids.push(socket.id);
            socket.emit('userSet', {username: data});
            loggger.info(ip + " set as " + data);
            nspChat.emit('connected', data);
        }
    });
    
    socket.on('msg', function(data) {
        //Send message to everyone
        nspChat.emit('newmsg', data);
        logger.info(data.user + ": " + data.message);
    });

    socket.on('disconnect', function() {
        // Remove the user from the array
        var index = ids.indexOf(socket.id);
        var user = users[index];
        nspChat.emit('disconnected', user);
        logger.info(date.today() + " " + date.timeNow() + " " + user + ' disconnected');
        ids.splice(index, 1);
        users.splice(index, 1);
    });
});

nspEmail.on('connection', function(socket)  {
    // Connect to the database and search for the email
    socket.on('search', function(data){
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var query = { email: data };

            dbo.collection("users").find(query).toArray(function(err, result) {
                if (err) throw err;

                if (result.length)
                    socket.emit('found', result);
                else
                    socket.emit('notFound', result);
                db.close();
            });
        });
    });
});

server.listen(80, "172.17.230.18", function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Express app listening at http://%s:%s', host, port);
});