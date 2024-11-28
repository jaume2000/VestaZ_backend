import { Request, Response, NextFunction } from 'express';

//schema is zod object type
import { ZodError, ZodSchema } from 'zod';

export const schemaValidation = (schema: ZodSchema)=>(req: Request, res: Response, next: NextFunction) => {

    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).send(error.errors);
        } else {
            res.status(400).send('Invalid request');
        }
    }
}