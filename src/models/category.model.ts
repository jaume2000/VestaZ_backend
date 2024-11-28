import mongoose, {Schema, Document} from "mongoose";

const categorySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false, default: ''},
    subcategories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false, default: []}],
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false, default: null}
    }, {
    timestamps: true
})

export const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;

export interface ICategory extends Document<mongoose.Types.ObjectId> {
    name: string;
    description: string;
    subcategories: mongoose.Types.ObjectId[];
    parent: mongoose.Types.ObjectId|null;
}