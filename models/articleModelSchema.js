import mongoose from "mongoose"
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title fields is required'],
        unique: true
    },
    body: {
        type: String
    },
    header: {
        type: String
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
    followers: Number,
    following: Number,
    role: String
})

const Article = mongoose.model('Article', ArticleSchema)

export default Article
