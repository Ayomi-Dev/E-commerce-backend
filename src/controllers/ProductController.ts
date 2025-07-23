import {Request, Response} from 'express';
import Product from '../models/ProductModel';
import { productQuery } from '../utils/productQuery';  // Importing utility function for querying products

// Controller for handling product-related operations
export const getProducts = async(req: Request, res: Response) => {  // Retrieves all products
    try {
        const {query, sort, page, limit, skip} = productQuery(req.query);  // Get the query object from the utility function

        const products = await Product.find(query)
        .sort(sort);  // Fetch products from the database using the sort
        

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
        const {name, description, price, category, stock, images} = req.body;  // Extract product details from request body
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            images
        });
         
        const saveNewProduct = await newProduct.save();  // Save the new product to the database
        console.log(saveNewProduct)
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
        const { review } = req.body
  
        const id = req.params.id

        const updatedProduct = await Product.findById(id);  // find the product in the database by its id and return the updated product
        if(!updatedProduct){
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        updatedProduct.reviews?.push(review) //pushes the incoming review into the product's review array
        updatedProduct.numReviews = updatedProduct.reviews?.length; //sets the number of reviews to the legth of the reviews array
    
        await updatedProduct.save() //saves the updated version into the database
        res.status(200).json({updatedProduct});  //returns the updated version of the product to frontend
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