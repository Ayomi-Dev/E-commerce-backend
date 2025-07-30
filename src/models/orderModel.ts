import { Schema, model, Document } from "mongoose";

interface OrderItem {
    product: Schema.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
}


export interface IOrder extends Document {
    user: Schema.Types.ObjectId;
    orderItems: OrderItem[];
    totalAmount: number;
    totalQuantity: number;
    isPaid: boolean;
    paidAt?: Date;
    paymentIntentId: string
}

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            product: { type: Schema.Types.ObjectId, ref:"Product", required: true},
            name: {type: String, required: true},
            quantity: { type: Number, required: true},
            price: { type: Number, required: true}
        }
    ],
    totalAmount: {type: Number, required: true},
    totalQuantity: {type: Number, required: true},
    isPaid: {type: Boolean, default: false},
    paidAt: Date,
    paymentIntentId: String,
},
    { timestamps: true}
)


export const Order = model<IOrder>("Order", orderSchema)