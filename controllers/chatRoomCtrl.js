// controller 里面导入 model ，调用model 的方法，查询数据库
import ChatRoomSchema from '../models/ChatRoomModelSchema'
import logger from '../core/logger/app-logger'
import io from './websocketIo'
const ChatRoomCtrl = {};
// 进入聊天室
io.on('connection', function(socket){
    socket.on('erlingerFamily', function (msg) {
        //把接受到的信息在返回到页面中去 （广播）
        console.log(msg, '12hang')
        io.emit('erlingerFamily', msg);
    })
})

ChatRoomCtrl.getRoomAllMsg = (req, res, next) => {
    const { roomId } = req.body
    // 初始化数据
    ChatRoomSchema.findOne({ roomId: roomId})
    .then(ChatRoomMsg => {
        if (ChatRoomMsg) {
            // console.log(ChatRoomMsg, '20hang')
            res.send({
                success: true,
                msgData: ChatRoomMsg
            })
        } else {
            // console.log('ChatRoomMsg 26hang')
            ChatRoomSchema.insertMany({
                roomId: roomId,
                friendName: friendName
            })
            .then( res => {
                console.log(res, '32hang')
            })
            .catch(err => {
                console.log(err)
            })
        }
    }).catch(next)
}

ChatRoomCtrl.saveChatRoomMsg = (req, res, next) => {
    const { roomId, currentMsg } = req.body;
    // console.log(roomId, 'roomId');
    // console.log(currentMsg, 'currentMsg');
    if(!roomId) {
        logger.error('没有找到对应的聊天室房间编号');
        return
    }
    // 初始化数据
    ChatRoomSchema.update(
        { roomId: roomId}, 
        {
            $push:{
                allChatContents: currentMsg
            }
        },
        (err) => {
            if(err) {
                logger.error(`ChatRoomCtrl.saveChatRoomMsg-----${next}--60`)
                res.send({
                    success: false,
                    msgData: '信息保存失败'
                })
            }
            res.send({
                success: true,
                msgData: '信息保存成功'
            })
        }
    )
}

export default ChatRoomCtrl;


// io.on('connection', function(socket){
//     console.log(friendName + ' ----connected =====11h 行');
//     // chats 服务端和客户端要一致，作为一个聊天房间，如何一致，前端告知和某个用户连接，然后传递给后端?
//     // 我 和 我的好友只要发起聊天，数据库存在一条聊天室id,之后不管谁先发起聊天，都是这个聊天室，进入聊天室可以获取
//     // 历史信息，信息保存7（）天，删除该聊天室id;聊天室id = 我id + 好友id(或者好友id+我id) ，将聊天内容保存进mongo(后期用redis 缓存信息时间为两分钟)
//     // 区分你 我， 进入聊天室传递ID  聊天室id = 我id + 好友id   根据前面的一个id,设置 isMe 字段为 true
//     socket.on(roomId, function (msg) {
//         //把接受到的信息在返回到页面中去 （广播）
//         console.log(msg)
//         io.emit(roomId, msg);

//         // // 信息入库
//         // ChatRoomSchema.insertOne({ roomId: roomId })
//         // // .update(
//         // //     { roomId: roomId }, 
//         // //     { $push: { msgArr: msg } }
//         // // )
//         // .then(msg => {
//         //     console.log('聊天信息入库成功')
//         //     res.send({
//         //         success: true,
//         //         message: '聊天信息入库成功',
//         //     })
//         // })
//         // .catch(next => {
//         //     console.log('聊天信息入库失败')
//         //     res.send({
//         //         success: false,
//         //         message: `聊天信息入库失败`
//         //     })
//         //     logger.error(`ChatRoomCtrl.getRoomMsg-----${next}--42`)
//         // })
//     });
//     socket.on('disconnect', function(){
//         console.log(`${friendName}离开聊天室了！`);
//     });
// });    