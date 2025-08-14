import { Router } from "express";
import { protect } from "../middleware/userAuthMiddleware";
import { createPaymentIntent, createOrder, fetchUserOrders, deleteOrder, fetchOrderById, getAllOrders } from "../controllers/OrderControllers";
import { requireAdmin } from "../middleware/adminAuth";



const router = Router();

router.post('/create-payment-intent', protect, createPaymentIntent)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, fetchUserOrders);
router.delete('/:id', protect, deleteOrder)
router.get(`/:id`, protect, fetchOrderById)
router.get('/admin/orders', getAllOrders)



export default router;