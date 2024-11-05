import { Request, Response } from 'express';
import Product from '../models/product.model';
import User, { IUser } from '../models/user.model';
import mongoose from 'mongoose';
import { getProductById as getProductByIdService, getAllProducts as getAllProductsService } from '../services/product.service';

// Controlador para publicar un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
  const { sku, name, cross_references, brand, category, price, stock, description, machines } = req.body;

  const owner = req.user

  if (!owner) {
    res.status(401).send('User not authenticated');
    return;
  }

  const owenr_id = owner.id

  try {
    const newProduct = new Product({
      owner: owenr_id,
      sku,
      name,
      cross_references: cross_references,
      brand,
      category,
      price,
      stock,
      description,
      machines
    });


    //Todo esto se debería poner en servicios
    const savedProduct = await newProduct.save();

    const populatedProduct = await Product.findById(savedProduct._id)
    .populate('brand')
    .populate('categories')
    .populate('machines')
    .exec();
  
    //Add the product to the user's products array
    const user = await User.findById(owner.id) as IUser;
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    user.products.push(savedProduct._id as mongoose.Types.ObjectId);
    await user.save();

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: populatedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.body; // ID del producto a eliminar
  const owner = req.user;
  
  if (!owner) {
    res.status(401).send('User not authenticated');
    return;
  }

  const owner_id = owner.id
  
  try {
    // Busca el producto en la base de datos
    const product = await Product.findById(id);

    // Verifica si el producto existe y si el owner coincide con el usuario autenticado
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    
    if (product.owner.toString() !== owner_id) {
      res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
      return;
    }

    // Elimina el producto
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProductsService();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await getProductByIdService(id);
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
}