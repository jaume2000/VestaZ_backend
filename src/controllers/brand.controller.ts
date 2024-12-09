import { Request, Response } from "express";
import { getBrands, createBrand as createBrandService } from "../services/brand.service";


export async function getAllBrands(req: Request, res: Response): Promise<void> {
    try{
        const brand = await getBrands();
        res.json(brand);
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function createBrand(req: Request, res: Response): Promise<void> {
    try{
        const {name, description} = req.body;
        await createBrandService(name, description);
        res.status(201).json({message: "Brand created"});
    }catch(error){
        console.log(error)
        if ((error as any).message === 'Brand already exists'){
            res.status(400).json({message: "Brand already exists"});
            return;
        }
        else {
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export async function createBrandList(req: Request, res: Response): Promise<void> {
    try{
        const brands = req.body;
        await Promise.all(brands.map(async (brand: any) => {
            await createBrandService(brand.name, brand.description);
        }));
        res.status(201).json({message: "Brands created"});
    }catch(error){
        console.log(error)
        if ((error as any).message === 'Brand already exists'){
            res.status(400).json({message: "Brand already exists"});
            return;
        }
        else {
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}