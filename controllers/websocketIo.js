import express from "express"

// 为socket.io 准备一个服务
const app = express()
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    io.on('disconnect', function(socket){
        console.log('a user leave');
    });
});


  
http.listen(3000, function(){
    console.log('listening on *:3000');
});

export default io