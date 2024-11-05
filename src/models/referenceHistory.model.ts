import mongoose, { Schema, model, Document } from 'mongoose';

interface IReferenceHistory extends Document {
    action: "add"| "remove" | "add_merge" | "remove_merge";
    category?: mongoose.Types.ObjectId[];
    machine?: mongoose.Types.ObjectId[];
    reference?: mongoose.Types.ObjectId[];
    referenceSet?: mongoose.Types.ObjectId[];
    product: mongoose.Types.ObjectId;
    timestamp: Date;
    user: mongoose.Types.ObjectId;
}

const ReferenceHistorySchema = new Schema<IReferenceHistory>({
    action: { type: String, required: true },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    machine: [{ type: Schema.Types.ObjectId, ref: 'Machine' }],
    reference: [{ type: Schema.Types.ObjectId, ref: 'Reference' }],
    referenceSet: [{ type: Schema.Types.ObjectId, ref: 'ReferenceSet' }],
    timestamp: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const ReferenceHistory = model<IReferenceHistory>('ReferenceHistory', ReferenceHistorySchema);

export default ReferenceHistory;