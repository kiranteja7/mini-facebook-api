

import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    imageUrl : {
        type: String,
        required: [true, "Please provide a image for your post!"]
    },

    caption:{
        type: String,
        required: [true, "Please provide caption for your post!"]
    },

    Owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments'
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Likes'
        }
    ]
})


export const postModel = mongoose.model('Post', postSchema);