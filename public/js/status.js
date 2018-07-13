$(document).ready(connection());

function connection(){
    var socket = io('/index');

    var i = 0;

    socket.on('update-msg', function (msg) {	
        if (i == 0){
            $('#results').html('<tr><th>MSODT2</th><th>MSODT3</th><th>MSOHSM</th>' + 
                '<th>MSOHSA</th><th>MSOCC1</th><th>MSOAOD</th><th>MSOEAF</th></tr><tr>');
        }

        $('#results').append('<td>' + msg);
        i++;

        if (i != 7){
            $('#results').append('</td>');			
        } else {
            i = 0;
            $('#results').append('</td></tr>');
        }
    });
}