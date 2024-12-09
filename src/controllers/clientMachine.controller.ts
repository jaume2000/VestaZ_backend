import {Request, Response} from 'express';
import { ClientMachine } from '../models/clientMachine.model';
import { createClientMachineService, deleteClientMachineService, getAllClientMachinesService, updateClientMachineService } from '../services/clientMachine.service';
import User from '../models/user.model';

export async function getAllClientMachines(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const clientMachines = await getAllClientMachinesService(user_id);
        res.status(200).json(clientMachines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
}

export async function createClientMachine(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const newClientMachine = await createClientMachineService(req.body, user_id, req.file);
        res.status(201).json(newClientMachine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateClientMachine(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const updatedClientMachine = await updateClientMachineService(req.body, req.params.id, user_id);
        res.status(200).json(updatedClientMachine);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteClientMachine(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        await deleteClientMachineService(req.params.id, user_id);
        res.status(204).json();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
}