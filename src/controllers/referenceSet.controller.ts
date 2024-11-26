import { Request, Response } from 'express';
import {addReferenceManually as addReferenceManuallyService, getReferences as getReferencesService, simulateAddReferenceManuallyService} from '../services/referenceSet.service'
import mongoose, { Types } from 'mongoose';
import { IReferenceSet, ReferenceSet } from '../models/referenceSet.model';
import {Category} from '../models/category.model';
import Product from '../models/product.model';
import { setProcessedProduct } from '../services/product.service';

export const addReferenceManually = async (req: Request, res: Response) => {
    const { references, machines, categories, weight, description } = req.body;
    const user = req.user;
    if (!user){
        return;
    }
    try {
        
    await addReferenceManuallyService({
        data:{
            references,
            categories,
            machines,
            weight,
            description
        },
        userId: new Types.ObjectId(user.id)
    });
    res.status(200).end()
    }
    catch(error){
        console.log(error)
        res.status(500).end()
    }
};

export const addReferenceListManually = async (req: Request, res: Response) => {
    const referenceList = req.body;
    const user = req.user;
    if (!user){
        return;
    }
    try {
        await Promise.all(referenceList.map(async (reference: IReferenceSet) => {
            await addReferenceManuallyService({
                data: reference,
                userId: new Types.ObjectId(user.id)
            });
        }
        ));
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
};

export const simulateAddReferenceManually = async (req: Request, res: Response) => {
    const { references, machines, categories, weight, description } = req.body;
    const user = req.user;
    if (!user){
        return;
    }
    try {
        
    const result = await simulateAddReferenceManuallyService({
        data:{
            references,
            categories,
            machines,
            weight,
            description
        },
        userId: new Types.ObjectId(user.id)
    });
    res.status(200).json(result)
    }
    catch(error){
        console.log(error)
        res.status(500).end()
    }
}

export const addReferenceManuallyFromProduct = async (req: Request, res: Response) => {
    const { product_id, references, machines, categories} = req.body;
    const user = req.user;
    if (!user){
        return;
    }
    try {

        await Promise.all([
            setProcessedProduct(product_id),
            addReferenceManuallyService({
                data:{
                    references,
                    categories,
                    machines
                },
                userId: new Types.ObjectId(user.id)
            })
        ])

    res.status(200).end()
    }
    catch(error){
        console.log(error)
        res.status(500).end()
    }
}



export const getReferences = async (req: Request, res: Response) => {
    try {
        const references = await getReferencesService()
        res.status(200).json(references);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching references', error });
    }
};