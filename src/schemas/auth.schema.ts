import {z} from 'zod';

export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const registerSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const setAdminSchema = z.object({
    id: z.string(),
});