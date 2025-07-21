import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import express from 'express'; //
import cors from 'cors'; // Importing necessary modules so that frontend can communicate with backend without any issues
import mongoose from 'mongoose'; // Importing mongoose to connect to MongoDB
import UserRoute from './routes/UserAuthRoute'; // Importing user routes for authentication
import productRoutes from './routes/productRoutes'; // Importing product routes for product management
import orderRoutes from './routes/orderRoutes'
import path from 'path'

const app = express()
const PORT = process.env.PORT_NUMBER


mongoose.connect(process.env.MONGO_URI as string,) //connecting to MongoDB using the URI from the .env file
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});


app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies for incoming requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies for incoming requests i.e form submissions
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))) //serves static files


//importing routes
app.get("/", (_, res) => {
  res.send("API is running");
});
app.use('/api/user', UserRoute); // Using user routes for authentication
app.use('/api/products', productRoutes); // Using product routes for product management
app.use('/api/orders', orderRoutes)


