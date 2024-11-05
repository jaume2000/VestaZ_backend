import mongoose, { Schema, Document } from 'mongoose';

const productSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sku: { type: String, required: true, unique: false },
  name: { type: String, required: true },
  cross_references: [{type: String, required: true}],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false, default: [] }],
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
  machines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true }],
  processed: { type: Boolean, required: false, default: false },
}, {  
  timestamps: true,
});


export const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;

export interface IProduct extends Document {
  owner: mongoose.Types.ObjectId;
  sku: string;
  name: string;
  cross_references: string[];
  brand: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  price: number;
  stock: number;
  description: string;
  machines:[ mongoose.Types.ObjectId, ref: 'Machine'];
  processed: boolean;
}