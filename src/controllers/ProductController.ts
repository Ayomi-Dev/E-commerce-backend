import {Request, Response} from 'express';
import Product from '../models/ProductModel';

// Controller for handling product-related operations
export const getProducts = async(req: Request, res: Response) => {  // Retrieves all products
    try {
        const products = await Product.find();  // Fetch all products from the database
        if (!products || products.length === 0) {
            return (res as any).status(404).json({ message: 'No products found' });
        }
        res.status(200).json(products);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
}

// Retrieve a single product by its ID
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;  // Extract product ID from request parameters
    try{
        const product = await Product.findById(id);  // Finds the selected product by ID
        if (!product) {
            return (res as any).status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching product', error });
    }
}



// Create/add a new product 
export const addNewProduct = async (req: Request, res: Response) => {

    try {
        const {name, description, price, imageUrl, category, reviews, stock} = req.body;  // Extract product details from request body
        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
            reviews,
            stock
        });
        
        const saveNewProduct = await newProduct.save();  // Save the new product to the database
        res.status(201).json({ product: saveNewProduct, message: 'Product added successfully' });  // Respond with the created product and a success message

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding product', error });
    }
}


// Update an existing product by its ID
export const updateProduct = async (req: Request, res: Response) => {
    try{
        // Update the product details
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Update the product in the database and return the updated product
        if(!updatedProduct){
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json(updatedProduct);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating product', error });
    }
}


// Deleting a product by its ID
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;  // Extract product ID from request parameters
    try{
        const productToDelete = await Product.findByIdAndDelete(id);  // Find and delete the product by ID 
        if(!productToDelete){
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting product', error });
    }
}