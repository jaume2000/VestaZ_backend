import { Router } from 'express';
import { createProduct, getAllProducts, deleteProduct, getProductById } from '../controllers/product.controller';
import { schemaValidation } from '../middleware/schemaValidation.middleware';
import { chatbotChat, searchProducts } from '../controllers/search.controller';
import { messageShema } from '../schemas/dialogflow.schema';

const router = Router();


router.get('/', searchProducts);
router.post('/chatbot', schemaValidation(messageShema), chatbotChat);

export default router;
