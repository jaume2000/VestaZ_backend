import { z } from 'zod';

export const searchSchema = z.object({
    query: z.object({
        sku: z.string().min(1, "SKU is required")
    })
});

export type SearchSchema = z.infer<typeof searchSchema>;