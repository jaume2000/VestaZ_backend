import mongoose from "mongoose";
import {Brand} from "../models/brand.model";

export async function createBrand(name: string, description: string): Promise<void> {

    //Machine exists?
    const brand = await Brand.findOne({
        name
    })
    if (brand) {
        throw new Error('Brand already exists');
    }

    const createdBrand = await Brand.create({name, description});
    console.log(`Brand ${createdBrand.name} created`);

}

export async function getBrands(): Promise<any> {
    return await Brand.find();
}