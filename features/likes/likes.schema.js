
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paths'
    },
    paths:{
        type: String,
        enum: ['Post', 'Comments']
    }
})

export const likeModel = mongoose.model('Likes', likeSchema);