// controller 里面导入 model ，调用model 的方法，查询数据库
import ChatRoomSchema from '../models/ChatRoomModelSchema'
import logger from '../core/logger/app-logger'
import io from './websocketIo'

const chatRoomSingleCtrl = {};
var usocket = {},user = [];

io.on('connection', function(socket){
    console.log('new roomId');
    socket.on('new roomId', (roomId) => {
        console.log(roomId, 'roomId');
		if(!(roomId in usocket)) {
			socket.roomId = roomId;
			usocket[roomId] = socket;
			user.push(roomId);
			socket.emit('login',user);
			socket.emit('user joined',roomId,(user.length-1));
			console.log(user, 'wefwefewfewfewfw00000');
		}
    })
    socket.on('send private message', function(res){
        console.log(res, 'dddddddd');
        usocket[res.roomId].emit('receive private message', res);
		// if(res.roomId in usocket) {
		// 	// usocket[res.roomId].emit('receive private message', res);
		// }
	});
})

io.on('disconnect', function(){
    console.log(`人 离开聊天室了！`);
});

// 获取建立连接的 roomId
chatRoomSingleCtrl.getRoomId = (req, res, next) => {
    const { roomId, friendName } = req.body   
    return roomId
}

// 进入聊天室
chatRoomSingleCtrl.getSingleRoomMsg = (req, res, next) => {
    const { roomId } = req.body
    // 初始化数据
    console.log(roomId, 'getSingleRoomMsg')
    ChatRoomSchema.findOne({ roomId: roomId})
    .then(ChatRoomMsg => {
        if (ChatRoomMsg) {
            res.send({
                success: true,
                msgData: ChatRoomMsg
            })
        } else {
            res.send({
                success: true,
                data: {
                    'msg': '暂时没有查到内容'
                }
            })
        }
    }).catch(next)
}

chatRoomSingleCtrl.saveChatRoomSingleMsg = (req, res, next) => {
    const { roomId, currentMsg } = req.body;
    if(!roomId) {
        logger.error('roomId 不允许为空');
        res.send({
            success: false,
            msg: 'roomId 不能为空'
        })
    }

    ChatRoomSchema.findOne({ roomId: roomId})
    .then( response => {
        if(!response) {
            ChatRoomSchema.create({roomId: roomId})
            .then( Response => {
                if(Response){
                    console.log('创建成功')
                    ChatRoomSchema.update(
                        { roomId: roomId}, 
                        {
                            $push:{
                                allChatContents: currentMsg
                            }
                        },
                        (err) => {
                            if(err) {
                                logger.error(`ChatRoomCtrl.saveChatRoomSingleMsg-----${next}--60`)
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
            })
        } else {
            // 保存数据 入库
            ChatRoomSchema.update(
                { roomId: roomId}, 
                {
                    $push:{
                        allChatContents: currentMsg
                    }
                },
                (err) => {
                    if(err) {
                        logger.error(`ChatRoomCtrl.saveChatRoomSingleMsg-----${next}--60`)
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
    })

    
}



export default chatRoomSingleCtrl;