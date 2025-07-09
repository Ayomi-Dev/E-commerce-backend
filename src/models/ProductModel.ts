import mongoose, {Schema, model} from 'mongoose';

interface Product {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string; // Optional field for product image URL
    reviews?: string[]; // Optional field for reviews
    stock: number;
}

const ProductSchema = new Schema<Product>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' }, // Optional field for product image URL
    reviews: { type: [String], default: [] }, // Optional field for reviews, default to an empty array
    stock: { type: Number, required: true }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

const ProductModel = model('Product', ProductSchema);

export default ProductModel;