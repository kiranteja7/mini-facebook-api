
import { applicationError } from "../../error-handler/applicationError.js";
import { userModel } from "../user/user.schema.js";
import { friendModel } from "./friendship.schema.js";
import { ObjectId } from "mongodb";

export class FriendShipRepository{

    async getUserFriends(friendID){
        return await friendModel.find({status: 'friend', user: new ObjectId(friendID)}).select('friends');
    }

    async pendingRequests(userID){
         const data= await friendModel.findOne({user: new ObjectId(userID), status: 'pending'});
         if(!data){
            return {status: 200, message: {status: 'success', message: 'Pending request not found!'}};
         }else{
            return {status: 200, message: {status: 'success', message: data}};
         }
    }

    async toggleFriendship(userID, friendID){
        try{
        const friend = await friendModel.findOne({user: new ObjectId(userID), friends: new ObjectId(friendID)});

        if(friend){
           await friendModel.deleteOne({user: new ObjectId(userID), friends: new ObjectId(friendID)});
           await userModel.updateOne({friends: new ObjectId(friendID)}, {$pull: {friends: new ObjectId(friendID)}});
           await userModel.updateOne({friends: new ObjectId(userID)}, {$pull: {friends: new ObjectId(userID)}});
           return {status: 200, message: { status: 'success', message: 'Sad to say that your friend request has been reverted back!'}};
        }

        const push= new friendModel({
            user: userID,
            friends: friendID,
            status: 'pending'
        });

       await push.save();
       return {status: 200, message: {status: 'success', message: 'Hurray! Your friend request has been sent its in pending stage!'}};

       }catch(err){
        console.log(err);
        new applicationError('Something Went Wrong', 500);
       }
  }

    async acceptOrRejectFriendship(userID, friendID, type){

         if(type=='accept'){
         const user = await userModel.findById(new ObjectId(userID));
        const friend = await userModel.findById(new ObjectId(friendID));
        
        if(friend){
        await friendModel.updateOne({friends: new ObjectId(friendID)}, {$set: {'status': 'friend'}});
        friend.friends.push(userID);
        user.friends.push(friendID);
        
        await user.save(); 
        await friend.save();

        return {status: 200, message: { status: 'success', message: 'Magnificent! Your friend has been accepted your friend request!'}};
        }else{
            return {status: 404, message: {status: 'failure', message: 'Friend not found!'}}
        }
         
       }else if(type=='reject'){
        const friend = await friendModel.find({user: new ObjectId(userID), friends: new ObjectId(friendID)});
        if(friend){
            await userModel.updateOne({friends: new ObjectId(friendID)}, {$pull: {friends: new ObjectId(friendID)}});
            await friendModel.deleteOne({user: new ObjectId(userID), friends: new ObjectId(friendID)}); 
         return {status: 200, message: { status: 'success', message: 'Sorry to say this! Your friend has been rejected your friend request!'}};
        }else{
            return {status: 404, message: {status: 'failure', message: 'Friend not found!'}}
        }
         }
    }
}