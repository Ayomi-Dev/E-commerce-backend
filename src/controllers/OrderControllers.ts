import { Request, Response } from "express";
import Stripe from "stripe";
import { Order } from "../models/orderModel";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not defined.");
}
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-06-30.basil"
})
export const createPaymentIntent = async (req:Request, res:Response) => {
    const { totalAmount } = req.body

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            
            amount: totalAmount,
            currency: "usd",
            payment_method_types: ['card']
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } 
    catch (error) {
       console.log(error);
       res.status(500).json({message: "Stripe error"}) 
    }
}


export const createOrder = async (req:Request, res:Response) => {
    const {orderItems, totalAmount, totalQuantity, paymentIntentId} = req.body;
    
    if(!orderItems || orderItems.length === 0){
        return (res as any).status(400).json({message: "No order items found"})
    }

    const newOrder = new Order({
        user: (req as any).user._id,
        orderItems,
        totalAmount,
        totalQuantity,
        isPaid: true,
        paidAt: new Date(),
        paymentIntentId
    });
    
    const createdOrder = await newOrder.save();

    res.status(200).json(createdOrder)
}


export const fetchUserOrders = async (req: Request, res: Response) => {
    const order = await Order.find({user: (req as any).user.id});
    res.status(200).json(order)
};

export const deleteOrder = async(req: Request, res: Response) => {
    const {id } = req.params
    const order = await Order.findByIdAndDelete(id);
    if(!order){
        return (res as any).status(404).json({message: "Order not found"})
    }
    res.status(200).json({message: "Order successfully deleted"})
}


export const fetchOrderById = async (req:Request, res: Response) => {
    const { id } = req.params
    try {
        const order = await Order.findById(id).populate('user', 'name email');
        if (!order) {
            return (res as any).status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        
    }
}