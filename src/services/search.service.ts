import { IProduct, Product } from "../models/product.model";
import { ReferenceSet } from "../models/referenceSet.model";
import mongoose from "mongoose";


export async function searchService(sku:string): Promise<IProduct[]> {
    try{
        const referenceSet = await ReferenceSet.findOne({ references: { $in: [sku] } });
        if (!referenceSet) {
            return [];
        }

        const products = await Product.find({
            $or: [
                { cross_references: { $in: referenceSet.references } },
                { sku: { $in: referenceSet.references } }
            ]
        }).populate('brand').populate('categories').populate('machines').populate('owner').exec();
        return products;
        }
        catch(error){
        console.log(error);
        return [];
    }
}