"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machine = void 0;
const mongoose_1 = require("mongoose");
const machineSchema = new mongoose_1.Schema({
    name: { type: String, required: true }
});
exports.Machine = (0, mongoose_1.model)("Machine", machineSchema);
