var socket = io('/chat');

function setUsername() {
    socket.emit('setUsername', document.getElementById('name').value);
}

var user;
socket.on('userExists', function(data) {
    document.getElementById('error-container').innerHTML = data;
});

socket.on('userSet', function(data) {
    user = data.username;
    document.getElementById('input-container').innerHTML = '<input type = "text" id = "message">' +
        '<button type = "button" name = "button" onclick = "sendMessage()">Send</button>';
});

function sendMessage() {
    var msg = document.getElementById('message').value;
    document.getElementById('message').value = " ";
    if(msg) {
        socket.emit('msg', {message: msg, user: user});
    }
}

socket.on('newmsg', function(data) {
    if(user) {
    document.getElementById('message-container').innerHTML += '<div><b>' + 
        data.user + '</b>: ' + data.message + '</div>';
    }
});

socket.on('usersActive', function(data) {
    document.getElementById("users-container").innerHTML = "<b>Users Online</b><br>";

    for (var i = 0; i < data.length; i++){
        document.getElementById("users-container").innerHTML += data[i];
        document.getElementById("users-container").innerHTML += "</br>";
    }
});

socket.on('disconnected', function(data) {
    document.getElementById('message-container').innerHTML += '<i>' + data + ' has left the chat<i></br>';
});

socket.on('connected', function(data) {
    document.getElementById('message-container').innerHTML += '<i>' + data + ' has joined the chat<i></br>';
});

socket.on('setUsernamePreset', function(data){
    document.getElementById('name').value = data;
    setUsername();
});