import { Router } from "express";
import { getAllBrands, createBrand } from "../controllers/brand.controller";
import { auth, permission } from "../middleware/auth";
import { schemaValidation } from "../middleware/schemaValidation.middleware";
import { brandSchema } from "../schemas/brand.schema";

const router = Router();

router.get("/", getAllBrands);
router.post("/", auth, permission("admin"), schemaValidation(brandSchema), createBrand);

export default router;