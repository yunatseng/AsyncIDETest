
const express = require('express');


const app = express();



const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});


const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
        console.log(data)
        io.emit('MESSAGE', data)
    });

    // socket.on('html', function(data) {
    //     // io.emit('html_code', data);
    //     socket.broadcast.emit('html_code', data);

    //     console.log(data)
    // })

    // socket.on('js', function(data) {
    //     // io.emit('js_code', data)
    //     socket.broadcast.emit('js_code', data);

    //     console.log(data)
    // })

    // socket.on('css', function(data) {
    //     // io.emit('css_code', data);
    //     // io.emit('css_code', data);
    //     socket.broadcast.emit('js_code', data);

    //     console.log(data)
    // });

    socket.on('all', function(data) {
        socket.broadcast.emit('code', data);
        console.log(data);
    });
});
