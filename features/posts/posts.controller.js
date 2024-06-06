import { PostRepository } from "./posts.repository.js";

export class PostController {

    constructor(){
        this.postRepository = new PostRepository();
    }


    async addPost(req, res, next){

        try{
        const imageUrl = req.file ? `${req.file.filename}` : null;
        const caption = req.body.caption;
        const userID = req.userID;

        const data = await this.postRepository.addPost(imageUrl, caption, userID);

         res.status(data.status).json(data.message);

        }catch(err){
        console.log(err);
        next(err);
         }
         
    }


    async getPostById(req, res, next){
        try{
        const {id} = req.params;
        const data = await this.postRepository.getPostById(id);
        data ? res.status(200).json({
                status : "success",
                data : data
            }) : res.status(404).json({
                status : "failure",
                message: "ID not found!"
            })
        }catch(err){
            console.log(err);
            next(err);
        }
    }


    async getPostsByUser(req, res, next){
        try{
           const userID = req.userID;
           const data = await this.postRepository.getPostByUser(userID);

           data ? res.status(200).json({
                status: 'success',
                data: data
             }) : res.status(404).json({
                status:'failure',
                message: 'User and posts not found!'
            });

        }catch(err){
            console.log(err);
            next(err);
        }

    }

    async getAllPosts(req, res, next){
          try{
            const data = await this.postRepository.getAllPosts();
            
            data ? res.status(200).json({
                    status: 'success',
                    data: data
                }) : res.status(404).json({
                    status: 'failure',
                    message: 'Posts not found'
                });

          }catch(err){
            console.log(err);
            next(err);
          }
    }

    async updatePost(req, res, next){
        try{
        const {id} = req.params;
        const imageUrl = req.file ? `${req.file.filename}` : null;
        const caption = req.body.caption;

        const post ={imageUrl, caption};

        const userID = req.userID;

        const data = await this.postRepository.updatePost(userID, id, post);

        res.status(data.status).json(data.message);

    }catch(err){
        console.log(err);
        next(err);
    }
    }

    async deletePost(req, res, next){
        try{
        const userID = req.userID;
        const {id} = req.params;

        const data = await this.postRepository.deletePost(id, userID);

        res.status(data.status).json(data.message);

      }catch(err){
        next(err);
      }
    }
}
