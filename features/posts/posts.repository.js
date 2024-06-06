import { ObjectId } from "mongodb";
import { postModel } from "./posts.schema.js"
import { userModel } from "../user/user.schema.js";
import { applicationError } from "../../error-handler/applicationError.js";
import path from 'path';
import fs from 'fs';
import { likeModel } from "../likes/likes.schema.js";
import { commentsModel } from "../comments/comments.schema.js";

export class PostRepository{

    async addPost(image, caption, userID){

        try{
       const newPost = new postModel({
         imageUrl: image,
         caption: caption,
         Owner: userID
       });

       await newPost.save();

       const user = await userModel.findById(userID);

       if(!user){
        return {status: 404, message: {status: 'failure', message: 'User not found!'}};
       }

       user.postOwner.push(newPost._id);

       await user.save();

       return {status: 200, message: {status: 'success', message: 'New post has been added!'}};
    }catch(err){
         console.log(err);
       new applicationError('Something went wrong', 500);
    }

    }

    async getPostById(id){
          try{
          return await  postModel.findById(new ObjectId(id)).populate({
           path: 'Owner',
           select: "-password -postOwner"
          });
          }catch(err){
            new applicationError('Something went wrong', 500);
          }
    }

    async getPostByUser(userID){
        try{
           return await userModel.findById(new ObjectId(userID)).select("-password").populate(
            { 
                path: 'postOwner',
            });
        }catch(err){
            new applicationError('Something went wrong', 500);
        }
    }


    async getAllPosts(){
            try{
            return await postModel.find({}).populate({
               path: 'Owner',
               select: "-postOwner -password"
            });
            }catch(err){
                new applicationError('Something went wrong', 500);
            }
    }

    async updatePost(userID, postID, data){
         try{
         const post = await postModel.findById(new ObjectId(postID));
         if(post.Owner != userID){
            return {status: 401, message: {status: 'failure', message: `You can't access this user details`}};
         }

         if(!data.imageUrl){
            data.imageUrl = post.imageUrl;
         }else{
            const filepath = path.join('uploads', post.imageUrl);
             fs.unlink(filepath, (err)=>{
                console.log(err);
             })
         }

         post.imageUrl = data.imageUrl;
         post.caption = data.caption;

         await post.save();
         return {status: 200, message: {status: 'success', message: 'Your post have been updated successfully!'}};
        }catch(err){
            throw new applicationError('Something went wrong', 500);
        }
    }

    async deletePost(postID, userID){

        try{
        const post = await postModel.findById(new ObjectId(postID));

        if(!post){
            return {status: 404, message: {status: 'failure', message: `Post not found!`}};
        }
        if(post.Owner!=userID){
            return {status: 401, message: {status: 'Failure', message: `You can't access this user details!`}};
        }

           //DELETING THE RECORD OF LIKES ASSOCIATED WITH THE PARTICULAR POST
           await likeModel.deleteMany({likeable: postID});

           //DELETING THE RECORD OF COMMENTS ASSOCIATED WITH THAT PARTICULAR POST
           await commentsModel.deleteMany({post: postID});

           //DELETING THE POST
           await postModel.findByIdAndDelete(postID);

          return {status: 200, message: {status: 'success', message: `Your Post has been deleted`}};
        }catch(err){
            throw new applicationError('Something went wrong', 500);
        }
    }
}
