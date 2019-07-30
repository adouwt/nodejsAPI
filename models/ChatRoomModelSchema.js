import mongoose from "mongoose"
const Schema = mongoose.Schema

const ChatRoomSchema = new Schema({
    roomId: {
        type: String,
        // required: [true, 'roomId fields is required'],
        unique: true
    },
    created_at: {
        type: String,
        required: true,
        default: new Date().toLocaleString()
    },
    allChatContents: Array,
    roomName: String
})

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema)

export default ChatRoom
