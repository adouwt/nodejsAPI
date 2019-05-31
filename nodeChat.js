var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    // chats 服务端和客户端要一致，作为一个聊天房间，如何一致，前端告知和某个用户连接，然后传递给后端?
    // 我 和 我的好友只要发起聊天，数据库存在一条聊天室id,之后不管谁先发起聊天，都是这个聊天室，进入聊天室可以获取
    // 历史信息，信息保存7（）天，删除该聊天室id;聊天室id = 我id + 好友id(或者好友id+我id) 
    socket.on("chats",function (msg) {
        //把接受到的信息在返回到页面中去 （广播）
        console.log(msg)
        io.emit("chats",msg);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});

