import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IMachine } from "./machine.model";
import { ICategory } from "./category.model";
import { IBrand } from "./brand.model";

export interface IReferenceSet extends Document<mongoose.Types.ObjectId> {
    machines: Types.ObjectId[];
    categories: Types.ObjectId[];
    references: {
        reference: string;
        brand: Types.ObjectId;
    }[];
    weight?: number;
    description?: string;
    vector?: number[];
    createdBy: Types.ObjectId;

}


export interface IReferenceSetPopulated extends Omit<IReferenceSet, 'machines' | 'categories' | 'references'> {
  machines: IMachine[];
  categories: ICategory[];
  references: {
      reference: string;
      brand: IBrand;
  }[];
}

const referenceSetSchema = new Schema<IReferenceSet>({
  machines: [{ type: Schema.Types.ObjectId, ref: "Machine", required: true }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  references: [{
    reference: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: false, default: null },
    _id: false
  }],
  weight: { type: Number, required: false, default: null },
  description: { type: String, required: false, default: null },
  vector: { type: [Number], required: false, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Validación de unicidad para la combinación `reference` y `brand` dentro de cada documento
referenceSetSchema.pre("save", function (next) {
  const refSet = this as IReferenceSet;
  const referenceBrandPairs = refSet.references.map(ref => `${ref.reference}-${ref.brand}`);
  
  const uniquePairs = new Set(referenceBrandPairs);
  if (uniquePairs.size !== referenceBrandPairs.length) {
    return next(new Error("Cada combinación de 'reference' y 'brand' debe ser única."));
  }
  
  next();
});

export const ReferenceSet = model<IReferenceSet>("ReferenceSet", referenceSetSchema);
