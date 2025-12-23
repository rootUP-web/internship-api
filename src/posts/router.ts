import express, { Router, Request, Response } from 'express';
import { createPostController, updatePostController, deletePostController, getPostController } from './controller'; 

const router: Router = express.Router();

router.get("/posts", getPostController);
router.put("/posts", updatePostController);
router.delete("/posts", deletePostController);
router.post("/posts", createPostController);

export default router;