import { z } from 'zod';

export const referenceSchema = z.object({
    references: z.array(
        z.object({
            reference: z.string(),
            brand: z.string().optional(),
        })
    ),
    categories: z.array(z.string()),        // Lista de IDs
    machines: z.array(z.string()),          // Lista de IDs
    description: z.string().optional(),     // String opcional
    weight: z.union([z.number(), z.null(), z.undefined()])  // Permite number, null, o undefined
});

export const referenceListSchema = z.array(referenceSchema);

export const referenceProductSchema = z.object({
    product_id: z.string(),             //String
    references: z.array(z.string()),  //Strings
    categories: z.array(z.string()),        //Lista de IDs
    machines: z.array(z.string())           //Lista de IDs
})
/*
export const referenceSchemFromProduct = z.object({
    product_id: z.string()
})
*/