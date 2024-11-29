import { Router } from 'express';
import { createProduct, getAllProducts, deleteProduct, getProductById } from '../controllers/product.controller';
import { schemaValidation } from '../middleware/schemaValidation.middleware';
import { chatbotChat } from '../controllers/dialogflow.controller';
import { searchReferences } from '../controllers/search.controller';
import { messageShema } from '../schemas/dialogflow.schema';
import { auth } from '../middleware/auth';

const router = Router();


router.get('/', auth, searchReferences);
router.post('/chatbot', auth, schemaValidation(messageShema), chatbotChat);

export default router;
