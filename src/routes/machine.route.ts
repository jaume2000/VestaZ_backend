import { Router } from "express";
import { getAllMachines, createMachine } from "../controllers/machine.controller";
import { auth, permission } from "../middleware/auth";
import { schemaValidation } from "../middleware/schemaValidation.middleware";
import { machineSchema } from "../schemas/machine.schema";

const router = Router();

router.get("/", getAllMachines);
router.post("/", auth, permission("admin"), schemaValidation(machineSchema), createMachine);

export default router;