import Product, { IProduct } from '../models/product.model';

export async function getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).populate('brand').populate('categories').populate('machines').populate('owner').exec();
}

export async function getAllProducts(): Promise<IProduct[]> {
    return await Product.find().populate('brand').populate('categories').populate('machines').populate('owner').exec();
}

export async function setProcessedProduct(id: string): Promise<void> {
    const product = await Product.findById(id);
    if (!product){
        throw new Error('Product not found')
    }
    await Product.findByIdAndUpdate(id, { processed: true }, { new: true })
}