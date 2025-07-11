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
    const { amount } = req.body

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
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
    const {orderItems, totalAmount, paymentIntentId} = req.body;

    if(!orderItems || orderItems.length === 0){
        return (res as any).status(400).json({message: "No order items found"})
    }

    const newOrder = new Order({
        user: (req as any).user._id,
        orderItems,
        totalAmount,
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
