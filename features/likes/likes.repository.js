
import { applicationError } from "../../error-handler/applicationError.js";
import { commentsModel } from "../comments/comments.schema.js";
import { postModel } from "../posts/posts.schema.js";
import { likeModel } from "./likes.schema.js";
import { ObjectId } from "mongodb";
export class LikesRepository{

    async getAllLikes(){
       return await likeModel.find({})
    }

    async getLikes(type, id){
        try{

        const likes = await likeModel.find({
            likeable: new ObjectId(id),
            paths: type
        }).populate({
           path: 'user',
           select: '-password -postOwner'
         }).populate({
            path: 'likeable',
            model: type
         });

        return likes
        }catch(err){
            console.log(err);
            new applicationError('Something Went Wrong', 500);
        }
    }

    async likePost(userID, postID){
        try{
        //CHECK IF ALREADY USER EXIST IN LIKE MODEL
        const user = await likeModel.findOne({user: new ObjectId(userID), paths: 'Post'});

        if(user){
            if(user.user == userID){
                //IF ALREADY LIKE EXIST TOGGLE THE LIKE
                // UPDATE THE POST DATA BY REMOVE THE LIKE FROM LIKES ARRAY
            await postModel.updateOne({likes: new ObjectId(user._id)},{$pull: {likes: new ObjectId(user._id)}});

                //DELETE THE RECORD FROM LIKE DOCUMENT!
            await likeModel.deleteOne({user: new ObjectId(userID), paths: 'Post'});

            return {status: 200, message: { status: 'success', message: 'Your like has been removed from the post'}};
            }else{
             return {status: 401, message: {status: 'failure' , message: 'You dont have access to remove this like!'}};
            }
        }
        const post = await postModel.findById(new ObjectId(postID));
        if(!post){
            return{status: 404, message: {status: 'failure', message: 'Post not found!'}};
        }

        const newLike = new likeModel({
            user: userID,
            likeable: postID,
            paths: 'Post'
        });

        post.likes.push(newLike._id);

        await newLike.save();
        await post.save();

        return {status: 200, message: {status: 'success', message: 'Your like has been succesfully added!'}};
       }catch(err){
        console.log(err);
        new applicationError('Something Went Wrong', 500);
       }
    }

    async likeComment(userID, commentID){
        try{     
                
       //CHECK IF ALREADY USER EXIST IN LIKE MODEL
       const user = await likeModel.findOne({user: new ObjectId(userID), paths: 'Comments'});

       if(user){
        if(user.user == userID){
         await postModel.updateOne({likes: new ObjectId(userID)},{$pull: {likes: new ObjectId(user._id)}});
        await likeModel.deleteOne({user: new ObjectId(userID), paths: 'Comments'});
        return {status: 200, message: { status: 'success', message: 'Your comment has been removed from the post'}};
        }else{
            return {status: 401, message: {status: 'failure' , message: 'You dont have access to remove this like!'}}; 
        }
       }

        const post = await postModel.findOne({comments: commentID});
        const comment = await commentsModel.findById(new ObjectId(commentID));
          if(!comment){
            return{status: 404, message: {status: 'failure', message: 'Post not found!'}};
          }
            const newLike = new likeModel({
                user: userID,
                likeable: commentID,
                paths: 'Comments'
            });
                      
            await newLike.save();

            post.likes.push(newLike._id);
            await post.save();
            return {status: 200, message: {status: 'success', message: 'Your comment has been succesfully added!'}};
           }catch(err){
            console.log(err);
            new applicationError('Something Went Wrong', 500);
           }
    }
}