
import express from 'express';
import { LikesController } from './likes.controller.js';

const likeRouter = express.Router();

const likeController = new LikesController();

// likeRouter.post('/', (req, res, next)=> likeController.likeItem(req, res, next));

likeRouter.get('/toggle', (req, res, next)=> likeController.likeItem(req, res, next));

likeRouter.get('/', (req, res, next)=> likeController.retreiveAllLikes(req, res, next));

export default likeRouter;