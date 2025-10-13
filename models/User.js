import { Schema, model } from 'mongoose'
import pkg from 'jsonwebtoken'
const { sign } = pkg

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    liked_posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    disliked_posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// remove generateToken method if using auth.js with direct jwt.sign
// OR update it:
userSchema.methods.generateToken = function () {
    return sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export default model('User', userSchema)
