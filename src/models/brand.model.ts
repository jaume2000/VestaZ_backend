import mongoose, {Schema, Document} from "mongoose";

const brandSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false, default: ''}
}, {
    timestamps: true
})

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);

export interface IBrand extends Document<mongoose.Types.ObjectId> {
    name: string;
    description: string;
}