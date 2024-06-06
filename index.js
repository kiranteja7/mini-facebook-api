
import "./env.js"

import express from 'express';
import cors from 'cors';
import { connectToMongoose } from './config/mongooseConfig.js';
import { applicationError } from "./error-handler/applicationError.js";
import mongoose from "mongoose";
import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' assert{type: 'json'};
import jwtAuth from "./middleware/jwt.middleware.js";
import userRouter from "./features/user/user.routes.js";
import bodyParser from "body-parser";
import postRouter from "./features/posts/posts.routes.js";
import commentsRoute from "./features/comments/comments.routes.js";
import likeRouter from "./features/likes/likes.router.js";
import friendRouter from "./features/friendship/friendship.routes.js";
import { invalidateToken } from "./middleware/invalidateToken.middleware.js";
import session from "express-session";
import otpRouter from "./features/otp/otp.routes.js";
import multer from "multer";

const app = express();

app.use(bodyParser.json());

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.use(cors());

app.use('/api-docs', swagger.serve, swagger.setup(apiDocs));

app.use('/api/users', userRouter);

app.use('/api/posts', jwtAuth, invalidateToken, postRouter);

app.use('/api/comments', jwtAuth, invalidateToken, commentsRoute);

app.use('/api/likes', jwtAuth, invalidateToken, likeRouter);

app.use('/api/friends', jwtAuth, invalidateToken, friendRouter);

app.use('/api/otp', jwtAuth, invalidateToken, otpRouter);

app.get('/', (req, res)=>{
    res.status(200).send('WELCOME TO SOCIAL MEDIA API');
})

//HANDLING 404 ERRORS
app.use((req,res)=>{
    res.status(400).send('Resource not found!');
})

app.use((err, req, res, next)=>{

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send('File size exceeds 30KB');
        }
      }

    if(err instanceof mongoose.Error.ValidationError){
       return  res.status(400).json({
        statusCode: 400,
        message: err.message
       })
    }

    if(err instanceof applicationError){
        return res.status(err.code).json({
            statusCode: err.code,
            message: err.message
           });
    }
   console.log(err);
    res.status(500).send('SOMETHING WENT WRONG :) PLEASE TRY AFTER SOME TIME!');
})

app.listen('8000', ()=>{
    console.log("LISTENING TO SERVER ON 8000");
    connectToMongoose();
})