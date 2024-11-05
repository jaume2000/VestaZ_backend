import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { roleType } from '../types/role';
import { getUser } from '../services/user.service';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token){
    res.status(401).send('Access denied. Auth required.');
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};


export const permission =  (role:roleType) => async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).send('Access denied. No user.');
    return;
  }

  const user = await getUser(req.user.id);
  if (!user) {
    res.status(401).send('Access denied. No user.');
    return;
  }
  
  if (user.role !== role) {
    console.log(user.role, role);
    res.status(403).send('Access denied. Insufficient permissions.');
    return;
  }

  next();

}