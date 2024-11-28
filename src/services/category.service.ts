import mongoose from "mongoose";
import Category, { ICategory } from "../models/category.model";

export async function createCategory(name: string, description: string, parentCategory?: string): Promise<void> {

    //Category exists?
    const category = await Category.findOne({
        name
    });

    if (category) {
        throw new Error('Category already exists');
    }

    if(parentCategory) {
        const parentCategoryObj = await Category.findOne({
            name: parentCategory
        });
        
        if(parentCategoryObj) {
            const newCategory = await Category.create({name, description, subcategories: [], parent: parentCategoryObj?._id});
            parentCategoryObj.subcategories.push(newCategory._id);
            await parentCategoryObj.save();
        }
        else {
            throw new Error('Parent category does not exist');
        }
    }
    else{
        await Category.create({name, description, subcategories: []});
    }
}

export async function getCategories(): Promise<ICategory[]> {
    return await Category.find();
}