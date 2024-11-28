import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { /*addReferenceFromProduct,*/ addReferenceManually, addReferenceListManually, getReferences, addReferenceManuallyFromProduct, simulateAddReferenceManually } from '../controllers/referenceSet.controller';
import { auth, permission } from '../middleware/auth';
import { schemaValidation } from '../middleware/schemaValidation.middleware'
import { /*referenceSchemFromProduct,*/ referenceListSchema, referenceProductSchema, referenceSchema } from '../schemas/reference.schema';

const router = Router();


router.post('/reference_info', auth, permission("admin"), schemaValidation(referenceSchema), addReferenceManually);
router.post('/reference_info/many', auth, permission("admin"), schemaValidation(referenceListSchema), addReferenceListManually);
router.post('/simulate_reference_info', auth, permission("admin"), schemaValidation(referenceSchema), simulateAddReferenceManually);
router.post('/reference_info_from_product', auth, permission("admin"), schemaValidation(referenceProductSchema), addReferenceManuallyFromProduct);
router.get("/", auth, permission("admin"), getReferences)

export default router

/**
 * @swagger
 * components:
 *   schemas:
 *     Reference:
 *       type: object
 *       properties:
 *         reference:
 *           type: string
 *           description: La referencia del producto.
 *         cross_references:
 *           type: array
 *           items:
 *             type: string
 *           description: Referencias cruzadas.
 *         machines:
 *           type: array
 *           items:
 *             type: string
 *           description: Máquinas asociadas.
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: Categorías relacionadas.
 *     ProductReference:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           description: ID del producto para asociar con la referencia.
 *
 * /reference/reference_info:
 *   post:
 *     summary: Agrega una referencia manualmente.
 *     tags: [Referencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reference'
 *     responses:
 *       200:
 *         description: Referencia agregada exitosamente.
 *       500:
 *         description: Error al agregar la referencia.
 *
 * /reference/product_info:
 *   post:
 *     summary: Agrega una referencia desde un producto.
 *     tags: [Referencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReference'
 *     responses:
 *       200:
 *         description: Referencia agregada desde el producto exitosamente.
 *       500:
 *         description: Error al agregar la referencia desde el producto.
 *
 * /reference/:
 *   get:
 *     summary: Obtiene una lista de referencias.
 *     tags: [Referencias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de referencias obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reference'
 *       500:
 *         description: Error al obtener referencias.
 */
