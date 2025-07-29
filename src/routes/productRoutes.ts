import { Router } from "express";
import { protect } from "../middleware/userAuthMiddleware";
import { getProducts, getProductById, addNewProduct, deleteProduct, updateReview, updateProductDetails } from "../controllers/ProductController";
import { requireAdmin } from "../middleware/adminAuth";
import { upload } from "../utils/UploadFile";


const router = Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/admin/create", protect, requireAdmin, addNewProduct);

router.put("/:id/review", protect, updateReview);

router.put("/admin/edit/:id", protect, updateProductDetails);

router.delete("/:id", protect, requireAdmin, deleteProduct);

router.post('/upload/images', upload.array('images', 5), (req, res) => { //allows image files be created or saved locally on the backend
    const files = req.files as Express.Multer.File[]
    const baseUrl = 'http://localhost:5000'
    const imagePaths = files.map(file => `${baseUrl}/uploads/${file.filename}`)
    res.json({images: imagePaths })
})


export default router;
// This code defines the routes for product-related operations in an Express application.
// It imports necessary functions from the ProductController and sets up routes for getting all products, getting