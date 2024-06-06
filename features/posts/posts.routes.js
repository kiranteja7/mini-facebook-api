

import express from 'express';
import { PostController } from './posts.controller.js';
import { upload } from '../../middleware/fileupload.middleware.js';

const postRouter = express.Router();

const postController = new PostController();

postRouter.post('/', upload.single('imageUrl'), (req, res, next)=> postController.addPost(req, res,next));

postRouter.get('/all', (req, res, next)=> postController.getAllPosts(req, res, next));

postRouter.get("/", (req, res, next)=> postController.getPostsByUser(req, res, next));

postRouter.put('/:id', upload.single('imageUrl'), (req, res, next)=> postController.updatePost(req, res, next));

postRouter.delete('/:id', (req, res, next)=> postController.deletePost(req, res, next));

postRouter.get('/:id', (req, res, next)=> postController.getPostById(req, res, next))


export default postRouter;