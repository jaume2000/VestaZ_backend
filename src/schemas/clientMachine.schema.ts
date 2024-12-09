import mongoose from 'mongoose';
import { z } from 'zod';

export const clientMachineSchema = z.object({
    name: z.string(),
    brand: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
    }),
    serial_number: z.string(),
    machine_model: z.string(),
    plate: z.string(),
    description: z.string().optional(),
    engine: z.string().optional(),
    gearbox: z.string().optional(),
    front_axle: z.string().optional(),
    rear_axle: z.string().optional(),
    hydraulic_system: z.string().optional(),
    imageUrl: z.string().url().optional() // Guardar solo la URL de la imagen
});

// Inferir el tipo del esquema
export type ClientMachineParamType = z.infer<typeof clientMachineSchema>;
