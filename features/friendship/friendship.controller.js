import { FriendShipRepository } from "./friendship.repository.js";


export class FriendshipController{

    constructor(){
        this.friendshipRepository = new FriendShipRepository();
    }

    async getUserFriends(req, res, next){
        try{
        const friendID = req.params.id;
        const data = await this.friendshipRepository.getUserFriends(friendID);
        data ? res.status(200).json({
            status: 'success',
            data : data
        }) : res.status(404).json({
            status: 'failure',
            message: 'friend ID not found!'
        })
    }catch(err){
        console.log(err);
        next(err);
    }
    }

    async pendingRequests(req, res, next){
        try{
           const userID = req.userID;
           const data = await this.friendshipRepository.pendingRequests(userID);
           res.status(data.status).json(data.message);
        }catch(err){
            console.log(err);
            next(err);
        }
    }

    async toggleFriendship(req, res, next){
        try{
          const userID= req.userID;
          const friendID = req.params.id;

          if(userID == friendID){
            return res.status(400).json({
                status: 'failure',
                message: 'Cannot add yourself as a friend!'
            })
          }

          const data = await this.friendshipRepository.toggleFriendship(userID, friendID);
          res.status(data.status).json(data.message);

        }catch(err){
            console.log(err);
            next(err);
        }
    }

    async acceptOrRejectFriendship(req, res, next){
         try{
            const userID= req.userID;
            const friendID = req.params.id;
            const type = req.query.type;

            if(type!= 'accept' && type!= 'reject'){
              return res.status(400).json({
                status: 'failure',
                message: 'Type should be of accept/reject!'
              });
            }

            const data = await this.friendshipRepository.acceptOrRejectFriendship(userID, friendID, type);

            res.status(data.status).json(data.message);
         }catch(err){
            console.log(err);
            next(err);
         }
    }
}