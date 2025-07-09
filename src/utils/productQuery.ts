import { FilterQuery } from "mongoose";
import  { Product } from "../models/ProductModel";
 
// Function to query products based on various filters
export const productQuery =  (params: any) : FilterQuery<Product> => {
    const { search, category, priceRange, sortBy } = params; // Destructure parameters for filtering and sorting

    const query: FilterQuery<Product> = {}; // Initialize an empty query object

    if (search) { // Check if search term is provided
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    if (category) { // Check if category is provided
        query.category = { $regex: category, $options: 'i' }; // Filter by category then returns products that match the specified category
    }

    if (priceRange) { //
        query.price = { $gte: priceRange.min, $lte: priceRange.max }; // Filter by price range then returns products within the specified range
    }

    return query;
}