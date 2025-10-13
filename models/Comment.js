import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
    text: String,
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // fixed
    is_reply: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const populateReplies = function (next) {
    this
        .populate('replies', '-createdAt -updatedAt -__v -is_reply')
        .populate('author', 'username')
        .select('-createdAt -updatedAt -__v -is_reply')
        
    next()
}

commentSchema.pre('find', populateReplies)

export default model('Comment', commentSchema)

