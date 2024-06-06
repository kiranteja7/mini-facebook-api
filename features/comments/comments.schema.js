
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    comment: {
        type: String,
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export const commentsModel = mongoose.model('Comments', commentSchema);