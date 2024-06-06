

import express from 'express';
import { UserController } from './user.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';
import { invalidateToken } from '../../middleware/invalidateToken.middleware.js';

const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/signup', (req, res, next)=> userController.signUp(req, res, next));

userRouter.post('/signin', (req, res, next)=> userController.signIn(req, res, next));

userRouter.get('/logout', jwtAuth, invalidateToken);

userRouter.get('/logout-all-devices', jwtAuth, invalidateToken); //NEEDS TO BE TESTED

userRouter.get('/get-all-details', jwtAuth, invalidateToken,(req, res, next)=> userController.getAllUserDetails(req, res, next));

userRouter.get('/get-details/:id', jwtAuth, invalidateToken, (req, res, next) => userController.getUserDetails(req, res, next));

userRouter.put('/update-details/:id', jwtAuth, invalidateToken,(req, res, next)=> userController.updateUserDetails(req, res, next));


export default userRouter;