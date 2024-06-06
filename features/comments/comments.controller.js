import { CommentsRepository } from "./comments.repository.js";


export class CommentsController{

    constructor(){
        this.commentsRepository = new CommentsRepository();
    }

    async addComment(req, res, next){
        try{
       const postID = req.params.id;
       const userID = req.userID;

       const {comment} = req.body;

        const data = await this.commentsRepository.addComment(postID, userID, comment);

        res.status(data.status).json(data.message);
        
    }catch(err){
        console.log(err);
        next(err);
    }
    }

    async getComments(req, res, next){
        try{
           const commentID = req.params.id;

           const data = await this.commentsRepository.getComments(commentID);

           data ? res.status(200).json({
                status: 'success',
                data: data
            }) : res.status(404).json({
                status: 'failure',
                message: 'Comment not found'
            })

        }catch(err){
            console.log(err);
            next(err);
        }
    }

    async updateComment(req, res, next){
        try{
        const {comment} = req.body;
        const userID = req.userID;
        const commentID = req.params.id;

        const data = await this.commentsRepository.updateComment(commentID, userID, comment);
        
        res.status(data.status).json(data.message);

       }catch(err){
        console.log(err);
        next(err);
       }
    }

    async deleteComments(req, res, next){
        try{
       const commentID = req.params.id;
       const userID = req.userID;

       const data = await this.commentsRepository.deleteComments(commentID, userID);
      
       res.status(data.status).json(data.message); 
        }catch(err){
            console.log(err);
            next(err);
        }
    }
}