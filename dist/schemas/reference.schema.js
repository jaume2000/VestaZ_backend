"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceSchemFromProduct = exports.referenceSchema = void 0;
const zod_1 = require("zod");
exports.referenceSchema = zod_1.z.object({
    reference: zod_1.z.string(),
    cross_references: zod_1.z.array(zod_1.z.string()),
    categories: zod_1.z.array(zod_1.z.string()),
    machines: zod_1.z.array(zod_1.z.string())
});
exports.referenceSchemFromProduct = zod_1.z.object({
    product_id: zod_1.z.string()
});
