import { Router } from 'express';
import { createProduct, getAllProducts, deleteProduct, getProductById } from '../controllers/product.controller';
import { auth } from '../middleware/auth';
import { schemaValidation } from '../middleware/schemaValidation.middleware';
import { productSchema } from '../schemas/product.schema';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - brand
 *         - sku
 *         - price
 *         - stock
 *         - categories
 *       properties:
 *         brand:
 *           type: string
 *           description: ID de la marca
 *         sku:
 *           type: string
 *           description: SKU único del producto
 *         price:
 *           type: number
 *           description: Precio del producto
 *         stock:
 *           type: number
 *           description: Cantidad disponible en inventario
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs de las categorías a las que pertenece el producto
 *       example:
 *         brand: "62f25c6f6e7f1b1234567890"
 *         sku: "ABC123"
 *         price: 49.99
 *         stock: 100
 *         categories: ["62f25c6f6e7f1b1234567891", "62f25c6f6e7f1b1234567892"]
 */

/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Publicar un nuevo producto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []   # Protegemos este endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *       500:
 *         description: Error al crear el producto
 */
router.post('/', auth, schemaValidation(productSchema), createProduct);
router.delete('/', auth, deleteProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;
