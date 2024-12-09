import mongoose, { Schema, model, Document } from "mongoose";

export interface IClientMachine extends Document<mongoose.Types.ObjectId> {
    owner: Schema.Types.ObjectId;
    name: string;
    brand: Schema.Types.ObjectId;
    serial_number: string;
    machine_model: string;
    plate: string;
    description?: string;
    engine?: string;
    gearbox?:string;
    front_axle?: string;
    rear_axle?: string;
    hydraulic_system?: string;
    image_url?: string;
}

const clientMachineSchema = new Schema<IClientMachine>({
    name: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    serial_number: { type: String, required: true },
    machine_model: { type: String, required: true },
    plate: { type: String, required: true },
    description: { type: String },
    engine: { type: String },
    gearbox: { type: String },
    front_axle: { type: String },
    rear_axle: { type: String },
    hydraulic_system: { type: String },
    image_url: { type: String },
}, { timestamps: true });

export const ClientMachine = model<IClientMachine>("ClientMachine", clientMachineSchema);
