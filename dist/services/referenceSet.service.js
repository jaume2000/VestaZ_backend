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
exports.addReferenceManually = addReferenceManually;
exports.addReferenceFromProduct = addReferenceFromProduct;
const referenceSet_model_1 = require("../models/referenceSet.model");
// FALTA AÑADIR AL HISTORIAL
function addReferenceManually(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { reference, cross_references, categories, machines, userId } = data;
        //Search Sets with a reference or one or more crossReferences
        const referenceSets = yield referenceSet_model_1.ReferenceSet.find({
            $or: [
                { references: reference },
                { references: { $in: cross_references } }
            ]
        });
        let referenceSet = null;
        //There is no set, create it
        if (referenceSets.length === 0) {
            referenceSet = yield referenceSet_model_1.ReferenceSet.create({
                references: [],
                categories: [],
                machines: [],
            });
        }
        //Only one Set, use it
        else if (referenceSets.length === 1) {
            referenceSet = referenceSets[0];
        }
        //Many Sets, merge them
        else {
            referenceSet = referenceSets[0];
            const promises = [];
            for (let i = 1; i < referenceSets.length; i++) {
                const otherSet = referenceSets[i];
                //Move info from other sets to the 1st.
                referenceSet.references = [...new Set([...referenceSet.references, ...otherSet.references])];
                referenceSet.categories = [...new Set([...referenceSet.categories, ...otherSet.categories])];
                referenceSet.machines = [...new Set([...referenceSet.machines, ...otherSet.machines])];
                otherSet.references = [];
                otherSet.categories = [];
                otherSet.machines = [];
                promises.push(otherSet.save());
            }
            yield Promise.all([...promises]);
        }
        //Add the reference to the set and the cross_references
        referenceSet.references = [...new Set([...referenceSet.references, ...cross_references, reference])];
        referenceSet.categories = [...new Set([...referenceSet.categories, ...categories])];
        referenceSet.machines = [...new Set([...referenceSet.machines, ...machines])];
    });
}
function addReferenceFromProduct(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { product, userId } = data;
    });
}
