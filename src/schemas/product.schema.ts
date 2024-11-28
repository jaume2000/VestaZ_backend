import { z } from 'zod';

export const productSchema = z.object({
    name: z.string(),
    price: z.number().min(0),
    stock: z.number().min(0),
    categories: z.array(z.string()),
    brand: z.string(),
    sku: z.string(),
    description: z.string(),
    cross_references: z.array(z.string()),
    machines: z.array(z.string())
});