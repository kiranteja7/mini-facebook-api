

import express from 'express';
import { FriendshipController } from './friendship.controller.js';

const friendRouter = express.Router();

const friendship = new FriendshipController();

friendRouter.get('/get-pending-requests', (req, res, next)=> friendship.pendingRequests(req, res, next));

friendRouter.get('/get-friends/:id', (req, res, next)=> friendship.getUserFriends(req, res, next));

friendRouter.get('/toggle-friendship/:id', (req, res, next)=> friendship.toggleFriendship(req, res, next));

friendRouter.get('/response-to-request/:id', (req, res, next)=> friendship.acceptOrRejectFriendship(req, res, next));


export default friendRouter;