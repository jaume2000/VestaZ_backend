import {z} from 'zod';

export const machineSchema = z.object({
    name: z.string()
});