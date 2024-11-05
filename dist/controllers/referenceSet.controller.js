"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferences = exports.addReferenceManually = exports.addReferenceFromProduct = void 0;
const referenceSet_service_1 = require("../services/referenceSet.service");
const mongoose_1 = require("mongoose");
const referenceSet_model_1 = require("../models/referenceSet.model");
const addReferenceFromProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id } = req.body;
    const user = req.user;
    if (!user) {
        return;
    }
    try {
        yield (0, referenceSet_service_1.addReferenceFromProduct)({
            product: product_id,
            userId: new mongoose_1.Types.ObjectId(user.id)
        });
        res.status(200).end();
    }
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
});
exports.addReferenceFromProduct = addReferenceFromProduct;
const addReferenceManually = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference, cross_references, machines, categories } = req.body;
    const user = req.user;
    if (!user) {
        return;
    }
    try {
        yield (0, referenceSet_service_1.addReferenceManually)({
            reference,
            categories,
            cross_references,
            machines,
            userId: new mongoose_1.Types.ObjectId(user.id)
        });
        res.status(200).end();
    }
    catch (error) {
        console.log(error);
        res.status(500).end();
    }
});
exports.addReferenceManually = addReferenceManually;
const getReferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const references = yield referenceSet_model_1.ReferenceSet.find().limit(20);
        res.status(200).json(references);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching references', error });
    }
});
exports.getReferences = getReferences;
