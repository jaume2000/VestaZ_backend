import { Router } from "express";
import { getAllCategories, createCategory } from "../controllers/category.controller";
import { auth, permission } from "../middleware/auth";
import { schemaValidation } from "../middleware/schemaValidation.middleware";
import { categorySchema } from "../schemas/category.schema";

const router = Router();

router.get("/", getAllCategories);
router.post("/", auth, permission("admin"), schemaValidation(categorySchema), createCategory);

export default router;