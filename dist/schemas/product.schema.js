"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string(),
    price: zod_1.z.number().min(0),
    stock: zod_1.z.number().min(0),
    categories: zod_1.z.array(zod_1.z.string()),
    brand: zod_1.z.string(),
    sku: zod_1.z.string(),
    description: zod_1.z.string(),
    cross_references: zod_1.z.array(zod_1.z.string()),
    machines: zod_1.z.array(zod_1.z.string())
});
