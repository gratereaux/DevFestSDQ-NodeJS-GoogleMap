var http = require('http');
var url = require('url');
var fs = require('fs');
var server;


server = http.createServer(function(req, res){

    var path = url.parse(req.url).pathname;
    switch (path){
        
        case '/':
            fs.readFile(__dirname + '/index.html', function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
            break;


            case '/direccion':
            fs.readFile(__dirname + '/direccion.html', function (err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
            break;

        default: send404(res);
    }
}),

send404 = function(res){
    res.writeHead(404);
    res.write('ERROR 404');
    res.end();
};

server.listen(8001);

// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

// coneccion del socket entre cliente / servidor
io.sockets.on('connection', function(socket){


    //recieve client data
    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
    });

   
    socket.on('coords:me', function (data) {
        // broadcast your coordinates to everyone except you
        socket.broadcast.emit('coords:user', data);
    });



    //prueba de envio de data via socket.
    var mensaje = "Ola ke hace!";
    socket.emit('enviaalgo',{'enviaalgo' : mensaje});



});