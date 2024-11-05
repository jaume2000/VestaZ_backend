"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaValidation = void 0;
//schema is zod object type
const zod_1 = require("zod");
const schemaValidation = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).send(error.errors);
        }
        else {
            res.status(400).send('Invalid request');
        }
    }
};
exports.schemaValidation = schemaValidation;
