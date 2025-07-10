import { FilterQuery, SortOrder } from "mongoose";
import  { IProduct } from "../models/ProductModel";
 
interface FilterResults { //defines the type of results the query function should return
    query: FilterQuery<IProduct>;
    sort: { [key: string]: SortOrder }; //Based on users selection, this specifies the value of what to sort products by and the order by which they should be sorted
 
}  

// Function to query products based on various filters
export const productQuery =  (params: any) : FilterResults => {
    const { name, category, min, max, sortBy } = params; // Destructure parameters for filtering and sorting
    const query: FilterQuery<IProduct> = {}; // Initialize an empty query object
    const sort: { [key: string]: SortOrder } = {}; // Initialize an empty sort object. 
    

    if (sortBy) { // Check if sortBy parameter is provided
        const [field, order] = sortBy.split(':'); // Split the sortBy string into field and order
        sort[field] = order === 'asc' ? 1 : -1; // Set the sort order based on the provided value
    } else {
        sort['createdAt'] = -1; // Default sort by createdAt in descending order
    }

    if (name) { // Check if name term is provided
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (category) { // Check if category is provided
        query.category = { $regex: category, $options: 'i' }; // Filter by category then returns products that match the specified category
    }

    if (min || max) {
        query.price = {};
        if (min) query.price.$gte = parseFloat(min);
        if (max) query.price.$lte = parseFloat(max);
    }

    return {query, sort}; // Return the query and sort objects
}