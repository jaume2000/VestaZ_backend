import {z} from 'zod';

export const messageShema = z.object({
    message: z.string(),
    sessionID: z.string(),
});
