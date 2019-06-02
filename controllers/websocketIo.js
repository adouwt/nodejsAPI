import express from "express"

// 为socket.io 准备一个服务
const app = express()
let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(3000, function(){
    console.log('listening on *:3000');
});

export default io