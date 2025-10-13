import { model, Schema } from 'mongoose'

export default model('Notification', new Schema({
    text: {
        type: String,
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    is_read: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        default: '/'
    }
},
    {
        timestamps: true
    }))