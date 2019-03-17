
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
    
    socket.on('html', function(data) {
        io.emit('html_code', data)
        console.log(`data:${data}`)
    })
    
    socket.on('js', function(data) {
        io.emit('js_code', data)
        console.log(`data:${data}`)
    })
    
    socket.on('css', function(data) {
        io.emit('css_code', data)
        console.log(`data:${data}`)
    })
});
