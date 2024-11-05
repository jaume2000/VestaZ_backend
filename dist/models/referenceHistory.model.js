"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReferenceHistorySchema = new mongoose_1.Schema({
    action: { type: String, required: true },
    category: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
    machine: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Machine' }],
    reference: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Reference' }],
    referenceSet: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ReferenceSet' }],
    timestamp: { type: Date, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
});
const ReferenceHistory = (0, mongoose_1.model)('ReferenceHistory', ReferenceHistorySchema);
exports.default = ReferenceHistory;
