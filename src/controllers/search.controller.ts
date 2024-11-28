import {Request, Response} from 'express';
import { chatbotService } from '../services/dialogflow.service';
import { searchService } from '../services/search.service';
import { randomInt } from 'crypto';


export async function searchProducts(req: Request, res: Response): Promise<void> {
    try{
        const {sku, category, machine, brand} = req.query;
        console.log(sku);
        const products = await searchService(sku as string, category as string, brand as string, machine as string);
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

export async function chatbotChat(req: Request, res: Response): Promise<void> {
    console.log('chatbotChat');
    try{
        const {message, sessionID} = req.body;
        console.log(message);
        const response = await chatbotService(message as string, sessionID as string);
        console.log(response);
        res.json(response);
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