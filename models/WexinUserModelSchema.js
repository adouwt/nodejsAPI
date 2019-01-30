import mongoose from "mongoose"
const Schema = mongoose.Schema

const WexinUserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name fields is required'],
    unique: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now()
  },
  avatarUrl: {
    type: String,
    required: [true, 'avatarUrl fields is required'],
    unique: true
  }
})

const WexinUser = mongoose.model('WexinUser', WexinUserSchema)

export default WexinUser
