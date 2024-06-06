import { UserRepository } from "./user.repository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController{

    constructor(){
        this.UserRepository = new UserRepository();
     }


     async signUp(req, res, next){

    try{
        const data = req.body;
         data.password = await bcrypt.hash(data.password, 12);
        const registeredUser = await this.UserRepository.signUp(data);

        if(registeredUser){
            res.status(200).json({
                 status: "success",
                 message: "User registered successfully"
            })
        }
     }catch(err){
        next(err);
     }
    }


     async signIn(req, res, next){

        try{
           const data = req.body;
           const user = await this.UserRepository.signIn(data);

           if(user){
              const confirmPassword = await bcrypt.compare(data.password, user.password);
              if(confirmPassword){
                const secretCode = process.env.JWT_SEC;
                const token = jwt.sign({userID: user._id, email: user.email}, secretCode, {
                    expiresIn: '1h'
                });
                res.status(200).json({
                    token : token,
                    message: "User signed in successfully!"
                });
              }else{
                res.status(400).json({
                    status: 'failure',
                    message: 'Bad credentials'
                })
              }
           }else{
            res.status(400).json({
                "status": 'failure',
                "message": "User not signed in because user not found!, Please register"
            });
        }
        }catch(err){
           next(err);
         }
     }

     async getUserDetails(req, res, next){
          try{
            const {id} = req.params;
            const userID = req.userID;

            const userData = await this.UserRepository.detailsByUser(id,userID);

            userData ?  res.status(200).json({
                    status: 'success',
                    userDetails: userData
                }) :
                res.status(404).json({
                    status: 'failure',
                    message: 'User not found'
                });

          }catch(err){
           next(err);
         }
     }

     async getAllUserDetails(req, res, next){
        try{
        //  const userID = req.userID;
          const data = await this.UserRepository.getAllUsers();

          data ? res.status(200).json({
                status: 'success',
                userDetails: data
            }) : res.status(404).json({
                status: 'failure',
                message: 'User not found'
            });

        }catch(err){
           next(err);
         }
     }

     async updateUserDetails(req, res, next){
        try{
        const {id} = req.params;
        const {name, email, gender, password} = req.body;
        const userID = req.userID;

        if(id!= userID){
            return res.status(401).json({
                status: 'failure',
                message: 'You cant access this user details'
            })
        }

        const updateUser ={name, email, gender, password};

        // console.log(req.session?.verified === true);

        if(password && !req.session?.verified){
           return res.status(400).json({
            status: 'failure',
            message: 'You cant change password without email verification via OTP!'
           })
        }

        const data = await this.UserRepository.updateUserDetails(id, updateUser);

         res.status(data.status).json(data.message);

        }catch(err){
           console.log(err);
            next(err);
        }
     }
}