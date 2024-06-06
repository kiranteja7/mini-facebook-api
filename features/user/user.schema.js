

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name: {
        type: String,
        required: [true, 'Name is required']
     },

     email : {
        type: String,
        unique: true,
        required: true,
        match: [/.+\@.+\../, "Please enter a valid email"]
     },

     password: {
        type: String,
        required: true,
        validate: {
            validator : function(value){ 
                return /^(?=.*[!@#$%^&*()-_=+{};:,.<>?]).*[A-Z].*\d.*.{10,}$/.test(value)
            },
        message: "User should have first letter as capital, Should contain atleast 9 characters, should have numbers in them"
       }
     },

     gender: {
        type: String,
        required: true
     },

     postOwner: [{
       type : mongoose.Schema.Types.ObjectId,
       ref : 'Post'
     }],

     friends: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Friendship'
        }
     ]

});

export const userModel = mongoose.model('User', userSchema);