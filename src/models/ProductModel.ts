import mongoose, {Schema, model, Document} from 'mongoose';

export interface Review{
    review: string;
    date: string
}

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    images?: string[]; // field for product image urls path
    reviews?: Review[]; // Optional field for reviews
    stock: number;
    brand?: string;
    rating?: number;
    numReviews?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const categories = [
  "Electronics",
  "Fashion",
  "Health & Beauty",
  "Home & Kitchen",
  "Groceries & Everyday Essentials",
  "Computers & Office",
  "Sports & Outdoors",
  "Toys, Kids & Babies",
  "Automotive",
  "Books, Media & Stationery",
  "Mobile Accessories",
  "Watches & Jewelry",
  "Gaming"
];

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: categories, required: true },
    images: { type: [String], required: true }, // Optional field for product image URL
    reviews: {
        type: [
            {
              userName: {type: String, required: true},
              review: { type: String, required: true },
              date: { type: String }
            }
        ],
        default: []
    }, // Optional field for reviews, default to an empty array
    stock: { type: Number, required: true },
    brand: {type: String },
    rating: {type: Number, default: 0},
    numReviews: {type: Number, default: 0}
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

const ProductModel = model('Product', ProductSchema);

export default ProductModel;