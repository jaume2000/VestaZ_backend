import {Request, Response} from 'express';
import { searchService } from '../services/search.service';


export async function searchProducts(req: Request, res: Response): Promise<void> {
    try{
        const {sku} = req.query;
        console.log(sku);
        const products = await searchService(sku as string);
        res.json(products);
    }
    catch(error){
        console.log(error);
        if ((error as any).message === 'Machine already exists'){
            res.status(400).json({message: 'Machine already exists'});
            return;
        }
        else {
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}