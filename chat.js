var uncomment = function(obj){return obj.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];}
var html = uncomment(function(){/*
<!DOCTYPE html>
<html>
        <head>
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="socket.io/socket.io.js"></script>
        
        <script>
        var socket = io.connect("https://demo-project-c9-jmshaa.c9.io");
        
        socket.on("names", function(data) {
            var names = data.message.split('|').sort(); 
            //alert(data.message);
            var users = $('#users');
            users.empty();
            for(var i in names){
                users.append("<div id='user-"+names[i]+"'>"+names[i]+"</div>").scrollTop(users.prop("scrollHeight"));
            }
        });
        
        socket.on("remove-name", function(data) {
            //alert(data.message)
            var users = $('#users');
            users.find('#user-'+data.message).remove();
        });
        
        socket.on("disconnect", function(data) {
            //var users = $('#users');
            //users.append('<div>'+data.message+' DISCONNECTED</div>').scrollTop(users.prop("scrollHeight"));
        });
        
        socket.on("bmsg", function(data) {
            var chat = $('#chat');
            chat.append('<div>'+data.message+'</div>').scrollTop(chat.prop("scrollHeight"));
        });
        
        $(function(){
            var tbx = $('#tbx');
            var chat = $('#chat');
            var users = $('#users');
            chat.css({height:$(window).height()-100});
            users.css({height:$(window).height()-100});
            
            tbx.keyup(function(event){
                if(event.keyCode == 13){
                    var val = tbx.val();
                    tbx.val('');
                    socket.emit("msg", { message : val } );
                }
            });
            
            $('#submit-name').click(function(){
                socket.emit("set-name", { message : $('#name').val() } );
                $('#chat-area').show();
                $('#connect-area').hide();
            });
            
        });
        </script>
        </head>
        <body>
        <div id='connect-area'>
        Enter name <input type='text' id='name' /><button id='submit-name'>Connect</button>
        </div>
        <table id='chat-area' style='width:100%;display:none'>
        <tr>
            <td style='width:25%'><div style='border:1px solid black;overflow:auto' id='users'></div></td>
            <td style='width:75%'><div style='border:1px solid black;overflow:auto' id='chat'></div></td>
        </tr>
        <tr><td></td><td>
        <input type='text' id='tbx' style='width:100%'/>
        </td></tr>
        </table>
        </div>
        </body>
</html>
*/})

var http = require("http");


// create http server
var server = http.createServer(function(req, res) {
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.end(html)
}).listen(process.env.PORT, process.env.IP);

var io = require("socket.io").listen(server);

var clients = {}
io.sockets.on('connection', function (socket) {
    clients[socket.id] = socket;
    
    socket.on('set-name', function (data) {
        clients[socket.id].name = data.message;
        var names = []
        for(var sid in clients)names.push(clients[sid].name);
        io.sockets.emit('names', { message: names.join('|') });
    });
    
    
    socket.on('disconnect', function () {
        io.sockets.emit('remove-name', { message: clients[socket.id].name });
        delete clients[socket.id];
        //io.sockets.emit('disconnect', { message: ip.split(',')[0] });
    });
    
    socket.on('msg', function (data) {
        io.sockets.emit('bmsg', { message: clients[socket.id].name + ': ' + data.message });
    });
});
