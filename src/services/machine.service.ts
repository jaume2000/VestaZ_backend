import mongoose from "mongoose";
import {Machine} from "../models/machine.model";

export async function createMachine(name: string): Promise<void> {

    //Machine exists?
    const machine = await Machine.findOne({
        name
    })
    if (machine) {
        throw new Error('Machine already exists');
    }

    await Machine.create({name});

}

export async function getMachines(): Promise<any> {
    return await Machine.find();
}