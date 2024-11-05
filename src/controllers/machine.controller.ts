import {Request, Response} from 'express';
import { getMachines, createMachine as createMachineService } from '../services/machine.service';

export async function getAllMachines(req: Request, res: Response): Promise<void> {
    try{
        const machines = await getMachines();
        res.json(machines);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}


export async function createMachine(req: Request, res: Response): Promise<void> {
    try{
        const {name} = req.body;
        await createMachineService(name);
        res.status(201).json({message: 'Machine created'});
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