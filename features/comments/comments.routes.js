

import express from 'express';
import { CommentsController } from './comments.controller.js';


const commentsRoute = express.Router();

const commentsController = new CommentsController();


commentsRoute.post('/:id', (req, res, next) =>  commentsController.addComment(req, res, next));

commentsRoute.get('/:id', (req,  res, next)=> commentsController.getComments(req, res, next));

commentsRoute.put('/:id', (req, res, next)=> commentsController.updateComment(req, res, next));

commentsRoute.delete('/:id', (req, res, next)=> commentsController.deleteComments(req, res, next));

export default commentsRoute;