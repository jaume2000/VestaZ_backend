import { NextFunction, Request, Response } from 'express';
import { setAdmin as setAdminService, getAllUsers as getAllUsersServie, setUser as setUserService } from '../services/user.service';
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';

const saltRounds = 10;

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.header('Authorization', `Bearer ${token}`).json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error registering user' });
  }
};


export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Comparar la contraseña ingresada con la contraseña almacenada
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '6h' });
    res.header('Authorization', `Bearer ${token}`).json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in', error: error });
  }
};


export const getUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).send('User not authenticated');
    return;
  }

  try {
    const user = await User.findById(userId)
    .populate({
      path: 'products',
      populate: [
        { path: 'brand' },
        { path: 'machines' },
        { path: 'categories' },
      ],
    })
    .populate({
      path: 'history.searches',
      populate: [
        { path: 'category' },
        { path: 'machine' },
        { path: 'brand' },
        {
          path: 'results',
          populate: [
            { path: 'categories' },
            { path: 'machines' },
            { path: 'references.brand' }, // Accedemos a 'brand' dentro de 'references'
          ],
        },
      ],
    }).populate({
      path: 'machines',
      populate: [
        {path : 'brand'}
      ]
    })
    .exec();  

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }
    
    const serializedUser = user.toJSON();

    const { password, ...userWithoutPassword } = serializedUser;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching user' });
  }
}

export const setAdmin = async (req: Request, res: Response) => {
  const userId = req.body.id;

  if (!userId) {
    res.status(400).send('User ID is required');
    return;
  }

  try {
    const user = await setAdminService(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error setting user as admin' });
  }
}

export const setUser = async (req: Request, res: Response) => {
  const userId = req.body.id;

  if (!userId) {
    res.status(400).send('User ID is required');
    return;
  }

  try {
    const user = await setUserService(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error setting user as admin' });
  }
}


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersServie();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}