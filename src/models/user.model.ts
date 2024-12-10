import mongoose, { Document, Schema } from 'mongoose';
import { IReferenceSet } from './referenceSet.model';

// Define la interfaz del historial
export interface IChat {
  message: string;
  bot: boolean;
  timestamp: number;
}

export interface ISearch {
  sku?: string;
  category?: string;
  machine?: string;
  brand?: string;
  results: IReferenceSet[];
  timestamp: number;
}

interface IHistory {
  // Diccionario sessionID: chats
  chats: Map<string, IChat[]>;
  searches: ISearch[];
}

// Define la interfaz del usuario
export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
  products: mongoose.Types.ObjectId[];
  history: IHistory;
  machines: mongoose.Types.ObjectId[];
}

// Define el esquema para chats
const chatSchema = new Schema({
  message: { type: String, required: true },
  bot: { type: Boolean, required: true },
  timestamp: { type: Number, required: true },
});

const resultSchema = new Schema({
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Array de referencias
  machines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Machine' }], // Array de referencias
  references: [
    {
      reference: String,
      brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    },
  ],
});


// Define el esquema para búsquedas
const searchSchema = new Schema({
  sku: { type: String, required: false },
  category: { type: mongoose.Types.ObjectId, required: false, ref: 'Category' },
  machine: { type: mongoose.Types.ObjectId, required: false, ref: 'Machine' },
  brand: { type: mongoose.Types.ObjectId, required: false, ref: 'Brand' },
  results: { type: [resultSchema], required: true },
  timestamp: { type: Number, required: true },
}, {
  _id: false,
});

// Define el esquema para historial
const historySchema = new Schema({
  chats: {
    type: Map,
    of: [chatSchema],
    required: false,
    default: () => ({}), // Necesitas una función para inicializar Maps
  },
  searches: {
    type: [searchSchema],
    required: false,
    default: [],
  },
});

// Define el esquema del usuario
const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: false, default: "user" },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false, default: [] },
    ],
    machines: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ClientMachine", required: false, default: [] },
    ],
    history: { type: historySchema, required: false, default:
      {
        chats: {},
        searches: [],
      },
    }, // Conecta el subdocumento de historial
  },
  { timestamps: true }
);

// Crea el modelo
const User = mongoose.model<IUser>("User", userSchema);
export default User;
