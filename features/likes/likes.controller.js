import { applicationError } from "../../error-handler/applicationError.js";
import { LikesRepository } from "./likes.repository.js";


export class LikesController{

    constructor(){
        this.likeRepository = new LikesRepository();
    }


    async likeItem(req, res, next){
        try{
       const {id, type} = req.query;
       const userID = req.userID;
       
       if(type!= "Post" && type!= "Comments"){
        return res.status(400).json({
            status: 'failure',
            message: 'Invalid Type'
        })
       }

       if(type == 'Post'){
           const data = await this.likeRepository.likePost(userID, id);
           res.status(data.status).json(data.message);
       }

       if(type=='Comments'){
           const data= await this.likeRepository.likeComment(userID, id);

           data ? res.status(200).json({
            status:'success',
            message: 'Your comment has been liked!'
           }) : res.status(404).json({
            status: 'failure',
            message: 'Post not found' 
           });
       }
         }catch(err){
           new applicationError(err, 400)
           next(err);
         }
       }

    async retreiveLikes(req, res, next){
        try{
        const {id, type} = req.query;
         const result = await this.likeRepository.getLikes(type, id);
         if(result === "liked"){
            res.status(400).json({
                status: 'failure',
                message: 'You have already liked the post/comment'
               });
         }
         result ? res.status(200).json({
            status:'success',
            data : result
           }) : res.status(404).json({
            status: 'failure',
            message: 'ID not found'
           });
        }catch(err){
            console.log(err);
            next(err);
        }
    }


    async retreiveAllLikes(req, res, next){

        const data = await this.likeRepository.getAllLikes();

        data ? res.status(200).json({
            status: 'success',
            data : data
        }) : res.status(404).json({
            status : 'failure',
            message : 'ID not found'
        })
    }
}