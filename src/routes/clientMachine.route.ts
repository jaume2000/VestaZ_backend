import { Router } from "express";
import { getAllClientMachines, createClientMachine, deleteClientMachine, updateClientMachine } from "../controllers/clientMachine.controller";
import { auth } from "../middleware/auth";
import multer from "multer";
import { schemaValidation } from "../middleware/schemaValidation.middleware";
import { clientMachineSchema } from "../schemas/clientMachine.schema";

const router = Router();

router.get("/", auth, getAllClientMachines);


const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true); // Aceptar solo imágenes
        } else {
            cb(null, false);
        }
    },
});

router.post(
    "/",
    auth,
    upload.single('imageFile'), // Procesar el archivo primero
    (req, res, next) => {
        try {
            // Parsear y validar req.body con Zod
            req.body = clientMachineSchema.parse({
                ...req.body,
                imageFile: req.file ? req.file.buffer : undefined, // Incluir el buffer del archivo si existe
            });
            next(); // Continuar si la validación es exitosa
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    },
    createClientMachine
);


router.put("/:id", auth, upload.single('imageFile'), updateClientMachine);
router.delete("/:id", auth, deleteClientMachine);

export default router;