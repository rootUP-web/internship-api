import express, { Router, Request, Response } from 'express';
import { getCommentController, updateCommentController, deleteCommentController, createCommentController } from "./controller";

const router: Router = express.Router();

router.get("/comments", getCommentController);
router.put("/comments", updateCommentController);
router.delete("/comments", deleteCommentController);
router.post("/comments", createCommentController);

export default router;

