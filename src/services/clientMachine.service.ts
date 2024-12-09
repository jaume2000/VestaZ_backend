import { ClientMachine } from "../models/clientMachine.model";
import User from "../models/user.model";
import { ClientMachineParamType } from "../schemas/clientMachine.schema";
import path from "path";
import fs from "fs";
import { Storage } from "@google-cloud/storage";

export async function getAllClientMachinesService(user_id:string) {
        const clientMachines = await ClientMachine.find({owner: user_id}).populate("brand");
        return clientMachines;
}

const storage = new Storage();
const bucket = storage.bucket('don_piston_data'); // Nombre del bucket en Google Cloud

export async function createClientMachineService(clientMachine: Partial<ClientMachineParamType>, user_id: string, file?: Express.Multer.File) {
    const ownerUser = await User.findById(user_id);
    if (!ownerUser) {
        throw new Error("User not found");
    }

    // Crear el nuevo documento en MongoDB sin la imagen aún
    const newClientMachine = new ClientMachine({ ...clientMachine, owner: user_id });
    const createdClientMachine = await newClientMachine.save();

    // Verificar si existe una imagen en el formulario
    if (file) {
        const fileExtension = path.extname(file.originalname); // Obtener la extensión del archivo
        const fileName = `${createdClientMachine._id}${fileExtension}`; // Usar el ID del documento como nombre del archivo

        // Guardar la imagen en el bucket de Google Cloud Storage
        const bucketFile = bucket.file(`client/machines/images/${fileName}`);
        await bucketFile.save(file.buffer, {
            contentType: file.mimetype, // Usar el tipo de contenido de la imagen
        });

        // Generar la URL pública
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/client/machines/images/${fileName}`;
        createdClientMachine.image_url = imageUrl; // Actualizar el documento
        await createdClientMachine.save();
    }

    // Agregar la máquina al usuario
    ownerUser.machines.push(createdClientMachine._id);
    await ownerUser.save();

    return createdClientMachine;
}

export async function updateClientMachineService(clientMachine:ClientMachineParamType, id:string, user_id:string) {
    //Check if the product exists and if it belongs to the user
    const clientMachineExists = await ClientMachine.findById(id);
    if (!clientMachineExists) {
        throw new Error("Machine not found");
    }
    if (clientMachineExists.owner.toString() !== user_id) {
        throw new Error("Unauthorized");
    }    
    
    const updatedClientMachine = await ClientMachine.findByIdAndUpdate(id, clientMachine, {new: true});
        return updatedClientMachine;
}   


export async function deleteClientMachineService(id:string, owner:string) {
    //Check if the product exists and if it belongs to the user
    const clientMachineExists = await ClientMachine.findById(id);
    if (!clientMachineExists) {
        throw new Error("Machine not found");
    }
    if (clientMachineExists.owner.toString() !== owner) {
        throw new Error("Unauthorized");
    }
        await ClientMachine.findByIdAndDelete(id);
}