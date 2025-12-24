import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { authenticateToken } from './utils/tokenManager';

import comment_router from './comments/router';
import posts_router from './posts/router';
import users_router from './users/router';

dotenv.config();

const app: Express = express();


app.use(express.json());

app.use('/comments', authenticateToken, comment_router);
app.use('/posts', authenticateToken, posts_router);
app.use('/users', users_router);

export default app;
