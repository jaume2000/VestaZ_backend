import { IProduct, Product } from "../models/product.model";
import { IReferenceSet, ReferenceSet } from "../models/referenceSet.model";
import mongoose from "mongoose";


export async function searchService(
    sku: string,
    category?: string,
    brand?: string,
    machine?: string
  ): Promise<IReferenceSet[]> {
    try {
      // Convertir IDs a ObjectID si son proporcionados
      const categoryId = category ? new mongoose.Types.ObjectId(category) : null;
      const machineId = machine ? new mongoose.Types.ObjectId(machine) : null;
      const brandId = brand ? new mongoose.Types.ObjectId(brand) : null;
        
      // Construir la consulta dinámica
      const query: any = {
        ...(sku && { references: { $elemMatch: { reference: sku, ...(brandId && { brand: brandId }) } } }),
        ...(categoryId && { categories: categoryId }),
        ...(machineId && { machines: machineId }),
      };
  
      const referenceSet = await ReferenceSet.find(query).populate("categories").populate("machines").populate("references.brand").exec();
  
      return referenceSet || [];
    } catch (error) {
      console.error("Error in searchService:", error);
      return [];
    }
}

interface IChatbotResponse {
  message: string;
}
