import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// const secret_key = process.env.ACCESS_TOKEN_SECRET!;
const secret_key = process.env.ACCESS_TOKEN_SECRET!;

export function getToken(payload: any): string 
{
    const token = jsonwebtoken.sign(payload, secret_key);
    return token;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction)
{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  
  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
}