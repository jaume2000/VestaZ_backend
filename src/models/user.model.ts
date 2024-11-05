import mongoose, { Document, Schema } from 'mongoose';

// Define la interfaz del documento
export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
  products: mongoose.Types.ObjectId[];
}

// Define el esquema del usuario
const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: false, default: 'user' },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false, default: [] }]
}, { timestamps: true });

// Crea el modelo
const User = mongoose.model<IUser>('User', userSchema);
export default User;
