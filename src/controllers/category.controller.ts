import { Request, Response } from "express";
import { getCategories, createCategory as createCategoryService } from "../services/category.service";


export async function getAllCategories(req: Request, res: Response): Promise<void> {
    try{
        const categories = await getCategories();
        res.json(categories);
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
    try{
        const {name, description, parent} = req.body;
        await createCategoryService(name, description, parent);
        res.status(201).json({message: "Category created"});
    }catch(error){
        console.log(error)
        if ((error as any).message === 'Category already exists'){
            res.status(400).json({message: "Category already exists"});
            return;
        }
        else if ((error as any).message === 'Parent category does not exist'){
            res.status(400).json({message: "Parent category does not exist"});
            return;
        }
        else {
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export async function createCategoriesList(req: Request, res: Response): Promise<void> {
    console.log("Create categories list")
    try{
        const categories = req.body;
        await Promise.all(categories.map(async (category: any) => {
            await createCategoryService(category.name, category.description, category.parent);
        }));
        res.status(201).json({message: "Categories created"});
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}