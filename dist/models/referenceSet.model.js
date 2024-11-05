"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceSet = void 0;
const mongoose_1 = require("mongoose");
const referenceSetSchema = new mongoose_1.Schema({
    machines: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Machine", required: true }],
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true }],
    references: [{ type: String, required: true, unique: true }]
});
exports.ReferenceSet = (0, mongoose_1.model)("ReferenceSet", referenceSetSchema);
