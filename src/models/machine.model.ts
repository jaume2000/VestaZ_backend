import mongoose, { Schema, model, Document } from "mongoose";

export interface IMachine extends Document<mongoose.Types.ObjectId> {
  name: string;
  brand: Schema.Types.ObjectId;
}

const machineSchema = new Schema<IMachine>({
  name: { type: String, required: true, unique: true },
  //Brand reference
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
}, { timestamps: true });

export const Machine = model<IMachine>("Machine", machineSchema);
