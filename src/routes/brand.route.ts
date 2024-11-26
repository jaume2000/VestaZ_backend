import { Router } from "express";
import { getAllBrands, createBrand, createBrandList } from "../controllers/brand.controller";
import { auth, permission } from "../middleware/auth";
import { schemaValidation } from "../middleware/schemaValidation.middleware";
import { brandListSchema, brandSchema } from "../schemas/brand.schema";

const router = Router();

router.get("/", getAllBrands);
router.post("/", auth, permission("admin"), schemaValidation(brandSchema), createBrand);
router.post("/many", auth, permission("admin"), schemaValidation(brandListSchema), createBrandList);

export default router;