// controller 里面导入 model ，调用model 的方法，查询数据库
import ChatRoomSchema from '../models/ChatRoomModelSchema'
import logger from '../core/logger/app-logger'
import jwt from 'jsonwebtoken'
import express from "express"


// 为socket.io 准备一个服务
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    // chats 服务端和客户端要一致，作为一个聊天房间，如何一致，前端告知和某个用户连接，然后传递给后端?
    // 我 和 我的好友只要发起聊天，数据库存在一条聊天室id,之后不管谁先发起聊天，都是这个聊天室，进入聊天室可以获取
    // 历史信息，信息保存7（）天，删除该聊天室id;聊天室id = 我id + 好友id(或者好友id+我id) ，将聊天内容保存进mongo(后期用redis 缓存信息时间为两分钟)
    // 区分你 我， 进入聊天室传递ID  聊天室id = 我id + 好友id   根据前面的一个id,设置 isMe 字段为 true
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
const ChatRoomCtrl = {};

// 进入聊天室
ChatRoomCtrl.getRoomMsg = (req, res, next) => {
    const { roomId, friendName } = req.body
    
    ChatRoomSchema.find({roomId: roomId})
        .then(roomMsg => {
            logger.info(`ChatRoomCtrl.ChatRoomCtrl${roomMsg}`)
            // todo 只筛选部分信息，不包括密码 id 等敏感信息
            res.send({
                success: true,
                message: '获取成功',
                roomMsg: roomMsg
            })
        })
        .catch(next => {
            logger.error(`ChatRoomCtrl.ChatRoomCtrl${next}`)
        })
}


// 离开聊天室
ChatRoomCtrl.leaveRoom = (req, res, next) => {
    
}

export default ChatRoomCtrl;