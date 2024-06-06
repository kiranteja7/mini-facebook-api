import { commentsModel } from "./comments.schema.js";
import { postModel } from "../posts/posts.schema.js";
import { ObjectId } from "mongodb";
import { applicationError } from "../../error-handler/applicationError.js";
import { likeModel } from "../likes/likes.schema.js";

export class CommentsRepository{

    async addComment(postID, userID, comment){

        try{
        //CHECK THE POST IS EXIST OR NOT 
        const post = await postModel.findById(new ObjectId(postID));
        if(!post){
            return {status: 404, message: {status: 'failure', message: 'Post not found!'}};
        }
        //ADD COMMENT TO THE POST
        const newComment = new commentsModel({
            comment: comment,
            post: postID,
            commentedBy: userID
        });

        await newComment.save();

        //PUSH THE COMMENT ID TO THE POST 
        post.comments.push(newComment._id);

        await post.save();

        return {status: 200, message: {status: 'success', message: 'A new comment has been added to your post!'}};
    }catch(err){
        console.log(err);
         new applicationError('Something went wrong', 500);
    }
        
    }

    async getComments(commentID){
      try{
         return await commentsModel.findById(commentID).populate({
            path: 'post',
            select: 'imageUrl caption Owner'
         }).populate({
            path: 'commentedBy',
            select: 'name email'
         });
      }catch(err){
        new applicationError('Something went Wrong :)', 500);
      }
    }

    async updateComment(commentID, userID, comment){
         try{
           const getComment = await commentsModel.findById(new ObjectId(commentID));
           if(getComment.commentedBy.equals(new ObjectId(userID))){
             getComment.comment= comment;
             getComment.save();
             return {status: 200, message: {status: 'success', message: 'Your comment has been updated to the post!'}};
           }else{
             return {status: 401, message: {status: 'failure', message: `You can't update this comment because the current comment is added by different user!`}};
           }
         }catch(err){
        new applicationError('Something went Wrong :)', 500);
      }
    }

    async deleteComments(commentID, userID){
         try{
            const getComment = await commentsModel.findById(new ObjectId(commentID));
            if(!getComment){
              return {status: 404, message: {status: 'failure', message: 'Comment ID not found!'}};
            }

            //PULLING THE COMMENT FROM THE COMMENTS ARRAY
            await postModel.updateOne({comments: new ObjectId(commentID)}, {$pull: {comments: new ObjectId(commentID)}});

            const like= await likeModel.findOne({likeable: new ObjectId(commentID)});
           
            if(like){
            //PULLING THE LIKE ID FROM LIKES ARRAY IN POST MODEL
            await postModel.updateOne({likes: like._id}, {$pull: {likes: like._id}});
             
            //DELETING THE LIKE RECORD OF THAT PARTICULAR COMMENT
            await likeModel.deleteOne({likeable: new ObjectId(commentID)});
            }

            if(getComment.commentedBy.equals(new ObjectId(userID))){
              await commentsModel.findByIdAndDelete(commentID);
              return {status: 200, message: {status: 'success', message: 'Your comment has been deleted to the post!'}};
            }else{
              return {status: 401, message: {status: 'failure', message: `You can't delete this comment because the current comment is added by different user!`}};
            }
            
         }catch(err){
            new applicationError('Something went Wrong :)', 500);
         }
    }
}