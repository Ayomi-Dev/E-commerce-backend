import { Router } from "express";
import multer from 'multer'
import { protect } from "../middleware/userAuthMiddleware";
import { getProducts, getProductById, addNewProduct, updateProduct, deleteProduct } from "../controllers/ProductController";
import { requireAdmin } from "../middleware/adminAuth";
import path from 'path'
import { upload } from "../utils/UploadFile";
import { hostname } from "os";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/admin/create", protect, requireAdmin, addNewProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.post('/upload/images', upload.array('images', 5), (req, res) => { //allows image files be created or saved locally on the backend
    const files = req.files as Express.Multer.File[]
    const baseUrl = 'http://localhost:5000'
    console.log(baseUrl)
    const imagePaths = files.map(file => `${baseUrl}/uploads/${file.filename}`)
    res.json({images: imagePaths })
})


export default router;
// This code defines the routes for product-related operations in an Express application.
// It imports necessary functions from the ProductController and sets up routes for getting all products, getting