
import { applicationError } from "../../error-handler/applicationError.js";
import { userModel } from "./user.schema.js";
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';

export class UserRepository{



    async signUp(data){
        
        try{
        
        const alreadyExistingUser = await userModel.findOne({email: data.email});
        if(!alreadyExistingUser){
            const newUser = new userModel({...data, postOwner: []});
            await newUser.save();
            return newUser;
        }else{
            throw new applicationError('User Already exists, Please sign in!', 400);
        }
        }catch(err){
            // console.log(err);
           throw err;
        }
    }


    async signIn(data){
        try{
            const findUser = await userModel.findOne({email: data.email});
            return findUser;
            }catch(err){
                console.log(err);
                throw err;
            }
    }

    async detailsByUser(id, userID){
        try{
            if(id === userID){
                return await userModel.findById(new ObjectId(userID)).populate('postOwner');
            }else{
                return await userModel.findById(new ObjectId(id)).select('-postOwner -password');
            }

        }catch(err){
            console.log(err);
            new applicationError('Something went wrong :)', 500);
        }
    }

    async getAllUsers(){
        try{
            return await userModel.find({}).populate('postOwner').select('-password -Owner');
        }catch(err){
            console.log(err);
            new applicationError('Something went wrong :)', 500);
        }
    }

    async updateUserDetails(id, data){

        try{   
            const user = await userModel.findById(new ObjectId(id));
            if(!user){
                return {status: 404, message: {status: 'failure', message: 'User not found!'}};
            }
            data.password = await bcrypt.hash(data.password, 12);
            user.gender = data.gender;
            user.name = data.name;
            user.password = data.password

            await user.save();
            return {status: 200, message: {status: 'success', message: 'User details updated successfully'}};
            
        }catch(err){
            console.log(err);
            new applicationError('Something went wrong :)', 500);
        }
    }
}