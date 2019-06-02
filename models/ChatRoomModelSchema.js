import mongoose from "mongoose"
const Schema = mongoose.Schema

const ChatRoomSchema = new Schema({
    roomId: {
        type: String,
        required: [true, 'roomId fields is required'],
        unique: true
    },
    header: {
        type: String
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now().toLocaleString()
    },
    msgArr: {
        type: Array,
        required: true
    }
})

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema)

export default ChatRoom
