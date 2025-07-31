import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
            customer: {
                        type: Schema.Types.ObjectId,  // Reference to the User model
                        ref: 'Customer',
                        required: true
            },
            orderItems: [{
                        productId: {
                                    type: Schema.Types.ObjectId,  // Reference to the Product model
                                    ref: 'Product',
                                    required: true
                        },
                        quantity: {
                                    type: Number,
                                    required: true
                        },
                        price: {
                                    type: Number,
                                    required: true
                        }
            }],
            totalAmount: {
                        type: Number,
                        required: true
            },
            paymentDetails: {
                        razorpayOrderId: {
                                    type: String, // Razorpay generated order ID
                                    required: true
                        },
                        razorpayPaymentId: {
                                    type: String  // Razorpay generated payment ID (after successful payment)
                        },
                        razorpaySignature: {
                                    type: String  // Signature for verifying the payment
                        },
                        paymentStatus: {
                                    type: String,  // 'pending', 'completed', 'failed'
                                    default: 'pending'
                        },
                        paymentMethod: {
                                    type: String,  // e.g., 'razorpay', 'credit_card', 'debit_card'
                                    required: true
                        },
                        paymentTime: {
                                    type: Date,
                                    required: true
                        },
                        paymettransId: {
                                    type: String,
                                    required: true
                        },
                        paymentMethodName: {
                                    type: String,
                                    required: true
                        }
            },
            shippingAddress: {
                        name:{ type: String, required: true },
                        mobileNumber:{ type: String, required: true },
                        alternateNumber:{ type: String },
                        address: { type: String, required: true },
                        city: { type: String, required: true },
                        state:{ type: String, required: true },
                        pincode: { type: String, required: true },
                        country: { type: String, required: true, default: 'INDIA' }
            },
            orderStatus: {
                        type: String, // e.g., 'processing', 'shipped', 'delivered', 'cancelled'
                        default: 'processing'
            },
}, { timestamps: true });


const Order = mongoose.model("Order", orderSchema);
export default Order;