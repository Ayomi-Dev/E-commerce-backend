import { Router } from "express";
import { protect } from "../middleware/userAuthMiddleware";
import { createPaymentIntent, createOrder, fetchUserOrders } from "../controllers/OrderControllers";



const router = Router();

router.post('/create-payment-intent', protect, createPaymentIntent)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, fetchUserOrders);




export default router;