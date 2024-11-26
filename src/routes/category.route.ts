import { Router } from "express";
import { getAllCategories, createCategory, createCategoriesList } from "../controllers/category.controller";
import { auth, permission } from "../middleware/auth";
import { schemaValidation } from "../middleware/schemaValidation.middleware";
import { categorySchema, categoryListSchema } from "../schemas/category.schema";

const router = Router();

router.get("/", getAllCategories);
router.post("/", auth, permission("admin"), schemaValidation(categorySchema), createCategory);
router.post("/many", auth, permission("admin"), schemaValidation(categoryListSchema), createCategoriesList);

export default router;