import {Request, Response} from 'express';
import { searchService } from '../services/search.service';
import { addHistoryService } from '../services/history.service';


export async function searchReferences(req: Request, res: Response): Promise<void> {

    const user_id = req.user?.id;
    if (!user_id) {
        res.status(401).send('Unauthorized');
        return;
    }

    try{
        const {sku, category, machine, brand} = req.query;
        const references = await searchService(sku as string, category as string, brand as string, machine as string);
        await addHistoryService({type: 'search', data: {
            sku: sku as string,
            category: category as string,
            machine: machine as string,
            brand: brand as string,
            timestamp: Date.now()
        }}, references, user_id);
        res.json(references);
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