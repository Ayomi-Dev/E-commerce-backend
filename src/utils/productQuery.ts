import { FilterQuery, SortOrder } from "mongoose";
import  { IProduct } from "../models/ProductModel";
 
interface FilterResults { //defines the type of results the query function should return
    query: FilterQuery<IProduct>;
    sort: { [key: string]: SortOrder }; //Based on users selection, this specifies the value of what products should be sorted by and the order by which they should be sorted
    page: number;
    limit: number;
    skip: number;
}  

// Function to query products based on various filters
export const productQuery =  (params: any) : FilterResults => {
    const { name, category, min, max, brand, sortBy, rating } = params; // Destructure parameters for filtering and sorting
    const query: FilterQuery<IProduct> = {}; // Initialize an empty query object
    const sort: { [key: string]: SortOrder } = {}; // Initialize an empty sort object. 
    const page = parseInt(params.page) || 1;  //specifies the page number 
    const limit = parseInt(params.limit) || 10; //specifies the number of product to return per page
    const skip = (page - 1) * limit //tells MongoDB the number of items to skip before starting sort
 
    

    if (sortBy) { // Check if sortBy parameter is provided
        const [field, order] = sortBy.split(':'); // Split the sortBy string into field and order
        sort[field] = order === 'asc' ? 1 : -1; // Set the sort order based on the provided value
    } else {
        sort['createdAt'] = -1; // Default sort by createdAt in descending order
    }

    if (name) { // Check if name term is provided
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search of products by name
    }

    if (category) { // Check if category is provided
        query.category = { $regex: category, $options: 'i' }; // Filter by category then returns products that match the specified category
    }

    if (min || max) {
        query.price = {};
        if (min) query.price.$gte = parseFloat(min);
        if (max) query.price.$lte = parseFloat(max);
    }
    if (rating) {
        query.rating = { $gte: parseFloat(params.rating) 
    };
    if(brand){
        query.brand = { $regex: brand, $options: 'i'}; //filters by brand
    }
}

    return {query, sort, page, limit, skip}; // Return the query and sort objects
}