import { z } from 'zod';

export const referenceSchema = z.object({
    references: z.array(z.string()),        //Lista de strings
    categories: z.array(z.string()),        //Lista de IDs
    machines: z.array(z.string())           //Lista de IDs
})
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