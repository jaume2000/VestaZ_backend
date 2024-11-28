import { Request, Router } from 'express';
import { register, login, getUser, getAllUsers } from '../controllers/auth.controller';
import { auth, permission } from '../middleware/auth';
import User from '../models/user.model';
import { schemaValidation } from '../middleware/schemaValidation.middleware';
import { loginSchema, registerSchema, setAdminSchema } from '../schemas/auth.schema';
import { setAdmin, setUser } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "testuser"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', schemaValidation(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "testuser"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post('/login', schemaValidation(loginSchema), login);

router.get('/me', auth, getUser);

router.put('/admin', auth, permission('admin'), schemaValidation(setAdminSchema), setAdmin);
router.put('/user', auth, permission('admin'), schemaValidation(setAdminSchema), setUser);

router.get('/', auth, permission('admin'), getAllUsers)

export default router;
