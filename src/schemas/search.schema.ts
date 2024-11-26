import { z } from 'zod';

export const searchSchema = z.object({
    query: z.object({
        sku: z.string().min(1, "SKU is required"),
        category: z.string().optional(),
        brand: z.string().optional(),
        model: z.string().optional(),
    })
});

export type SearchSchema = z.infer<typeof searchSchema>;