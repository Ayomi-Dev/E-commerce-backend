import { Router } from "express";
import { protect } from "../middleware/userAuthMiddleware";
import { getProducts, getProductById, addNewProduct, updateProduct, deleteProduct } from "../controllers/ProductController";
import { requireAdmin } from "../middleware/adminAuth";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/admin/create", protect, requireAdmin, addNewProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
// This code defines the routes for product-related operations in an Express application.
// It imports necessary functions from the ProductController and sets up routes for getting all products, getting