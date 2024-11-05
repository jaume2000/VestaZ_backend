import { Schema, model, Document, Types } from "mongoose";

export interface IReferenceSet extends Document {
    machines: Types.ObjectId[];
    categories: Types.ObjectId[];
    references: string[];
}

const referenceSetSchema = new Schema<IReferenceSet>({
  machines: [{ type: Schema.Types.ObjectId, ref: "Machine", required: true }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  references: [{ type: String, required: true, unique: true }]
}, { timestamps: true });

export const ReferenceSet = model<IReferenceSet>("ReferenceSet", referenceSetSchema);
