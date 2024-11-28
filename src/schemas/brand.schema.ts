import {z} from 'zod';

export const brandSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});

export const brandListSchema = z.array(brandSchema);