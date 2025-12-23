import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import { authenticateToken } from './utils/tokenManager';

import comment_router from './comments/router';
import posts_router from './posts/router';
import users_router from './users/router';

dotenv.config();

const app: Express = express();
const PORT: string = process.env.PORT || "3000";

app.use(express.json());

app.use('/comments', authenticateToken, comment_router);
app.use('/posts', authenticateToken, posts_router);
app.use('/users', users_router);

app.post('/login', (req: Request, res: Response) => {
  const username = req.body.username;
  const user = { name: username }
  const accessToken = jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET!);
  res.json({ accessToken: accessToken });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
