var socket = io('/chat');
var user;

// Sends the username to the server
function setUsername() {
    socket.emit('setUsername', document.getElementById('name').value);
}

// Sends the mssage to the server
function sendMessage() {
    var msg = document.getElementById('message').value;
    document.getElementById('message').value = " ";
    if(msg) {
        socket.emit('msg', {message: msg, user: user});
    }
}

// If the username is taken, display an error
socket.on('userExists', function(data) {
    document.getElementById('error-container').innerHTML = data;
});

// If the username is not taken, set up the input for messages
socket.on('userSet', function(data) {
    user = data.username;
    document.getElementById('input-container').innerHTML = '<input type = "text" id = "message">' +
        '<button type = "button" name = "button" onclick = "sendMessage()">Send</button>';
});

// If the IP address is predefined, set the username
socket.on('setUsernamePreset', function(data){
    document.getElementById('name').value = data;
    setUsername();
});

// New message from a user
socket.on('newmsg', function(data) {
    if(user) {
    document.getElementById('message-container').innerHTML += '<div><b>' + 
        data.user + '</b>: ' + data.message + '</div>';
        var sound = document.getElementById("audio");
        sound.volume = 0.5;
        sound.play();
    }
});

// Update the list of users online
socket.on('usersActive', function(data) {
    document.getElementById("users-container").innerHTML = "<b>Users Online</b><br>";

    for (var i = 0; i < data.length; i++){
        document.getElementById("users-container").innerHTML += data[i];
        document.getElementById("users-container").innerHTML += "</br>";
    }
});

// A user connected 
socket.on('connected', function(data) {
    document.getElementById('message-container').innerHTML += '<i>' + data + ' has joined the chat<i></br>';
});

// A user disconnected
socket.on('disconnected', function(data) {
    document.getElementById('message-container').innerHTML += '<i>' + data + ' has left the chat<i></br>';
});