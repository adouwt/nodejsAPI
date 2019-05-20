import mongoose from "mongoose"
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name fields is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password fields is required'],
    unique: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now()
  },
  regsiterTime: {
    type: String,
    required: true,
    default: (new Date()).toLocaleString()
  },
  avatar_url: String,
  age: String,
  email: String,
  followers: Number,
  following: Number,
  roles: Array,
  gender: String
})

const User = mongoose.model('User', UserSchema)

export default User
