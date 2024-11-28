import { IProduct, Product } from "../models/product.model";
import { IReferenceSet, ReferenceSet } from "../models/referenceSet.model";
import mongoose from "mongoose";


export async function searchService(
    sku: string,
    category?: string,
    brand?: string,
    machine?: string
  ): Promise<IReferenceSet[]> {
    console.log("searchService", sku, category, brand, machine);
    try {
      // Convertir IDs a ObjectID si son proporcionados
      const categoryId = category ? new mongoose.Types.ObjectId(category) : null;
      const machineId = machine ? new mongoose.Types.ObjectId(machine) : null;
      const brandId = brand ? new mongoose.Types.ObjectId(brand) : null;
        
      console.log("IDs:", categoryId, machineId, brandId); // Log para debugging
      // Construir la consulta dinámica
      const query: any = {
        ...(sku && { references: { $elemMatch: { reference: sku, ...(brandId && { brand: brandId }) } } }),
        ...(categoryId && { categories: categoryId }),
        ...(machineId && { machines: machineId }),
      };
  
      console.log("Query:", JSON.stringify(query, null, 2)); // Log para debugging
  
      const referenceSet = await ReferenceSet.find(query);
  
      return referenceSet || [];
    } catch (error) {
      console.error("Error in searchService:", error);
      return [];
    }
}

interface IChatbotResponse {
  message: string;
}
