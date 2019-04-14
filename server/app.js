const express = require("express");

const app = express();
let isConnectable = false;

const server = app.listen(3001, function() {
  console.log("server running on port 3001");
  console.log(isConnectable);
});

const io = require("socket.io")(server);

io.on("connection", function(socket) {
  // console.log(socket.id)
  socket.on("broadcastStatus", function(data) {
    isConnectable = data;
  });

  socket.on("fontsize", function(data) {
    console.log(data);
    socket.broadcast.emit("fontsize", data);
  });

  socket.on("SEND_MESSAGE", function(data) {
    console.log(data);
    io.emit("MESSAGE", data);
  });

  socket.on("all", function(data) {
    console.log(isConnectable);
    if (isConnectable === false) return;
    socket.broadcast.emit("code", data);
    console.log(data);
  });

  // socket.on('html', function(data) {
  //     io.emit('html_code', data)
  //     console.log(`data:${data}`)
  // })

  // socket.on('js', function(data) {
  //     io.emit('js_code', data)
  //     console.log(`data:${data}`)
  // })

  // socket.on('css', function(data) {
  //     io.emit('css_code', data)
  //     console.log(`data:${data}`)
  // })
});
