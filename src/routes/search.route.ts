import { Router } from 'express';
import { createProduct, getAllProducts, deleteProduct, getProductById } from '../controllers/product.controller';
import { schemaValidation } from '../middleware/schemaValidation.middleware';
import { searchProducts } from '../controllers/search.controller';

const router = Router();


router.get('/', searchProducts);

export default router;
