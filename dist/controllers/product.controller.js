"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = exports.deleteProduct = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
// Controlador para publicar un nuevo producto
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { sku, name, cross_references, brand, category, price, stock, description, machines } = req.body;
    const owner = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!owner) {
        res.status(401).send('User not authenticated');
        return;
    }
    const processed_cross_references = cross_references.map((reference) => {
        return {
            reference_str: reference,
            reference_id: null,
            is_id: false
        };
    });
    try {
        const newProduct = new product_model_1.default({
            owner,
            sku,
            name,
            cross_references: processed_cross_references,
            brand,
            category,
            price,
            stock,
            description,
            machines
        });
        yield newProduct.save();
        res.status(201).json({
            message: 'Producto creado exitosamente',
            product: newProduct
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.body; // ID del producto a eliminar
    const owner = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ID del usuario autenticado
    if (!owner) {
        res.status(401).send('User not authenticated');
        return;
    }
    try {
        // Busca el producto en la base de datos
        const product = yield product_model_1.default.findById(id);
        // Verifica si el producto existe y si el owner coincide con el usuario autenticado
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }
        if (product.owner.toString() !== owner) {
            res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
            return;
        }
        // Elimina el producto
        yield product_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});
exports.deleteProduct = deleteProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});
exports.getProduct = getProduct;
