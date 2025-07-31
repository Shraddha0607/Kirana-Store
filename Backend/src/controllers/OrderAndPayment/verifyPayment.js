import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import crypto, { randomUUID } from 'crypto';
import Cart from "../../models/shoppingCart.model.js";
import Razorpay from 'razorpay';
import Order from "../../models/order.model.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//Fetch payment details using payment_id
const fetchPaymentDetails = async (paymentId) => {
            try {
                        const paymentDetails = await razorpay.payments.fetch(paymentId);
                        if (paymentDetails) {
                                    const detailsOfPayment = {
                                                amount: paymentDetails.amount / 100,
                                                status: paymentDetails.status,
                                                orderId: paymentDetails.order_id,
                                                paymentMethod: paymentDetails.method,
                                                paymentDate: paymentDetails.created_at,
                                                paymentDescription: paymentDetails.description,
                                                deliveryName: paymentDetails.notes.name,
                                                deliveryMobileNumber: paymentDetails.notes.mobileNumber,
                                                deliveryAlternateMobileNumber: paymentDetails.notes?.alternateNumber,
                                                deliveryAddress: paymentDetails.notes.fullAddress,
                                                deliveryCity: paymentDetails.notes.city,
                                                deliveryPincode: paymentDetails.notes.pincode,
                                                deliveryState: paymentDetails.notes.state
                                    }
                                    if (paymentDetails.method === 'card') {
                                                detailsOfPayment.methodName = paymentDetails.card
                                    }
                                    if (paymentDetails.method === 'netbanking') {
                                                detailsOfPayment.methodName = paymentDetails?.bank
                                                detailsOfPayment.paymentTransactionID = paymentDetails.acquirer_data.bank_transaction_id
                                    }
                                    if (paymentDetails.method === 'wallet') {
                                                detailsOfPayment.methodName = paymentDetails?.wallet
                                                detailsOfPayment.paymentTransactionID = randomUUID()
                                    }
                                    return detailsOfPayment
                        }
            } catch (error) {
                        console.error('Error fetching payment details:', error);
                        return
            }
};

const verifyPayment = asyncHandler(async (req, res) => {
            const custId = req.customer._id;
            const razorpay_order_id = req.body.razorpay_order_id;
            const razorpay_payment_id = req.body.razorpay_payment_id;
            const razorpay_signature = req.body.razorpay_signature;
            const secret = 'your_razorpay_key_secret';  // This is your Razorpay secret key

            // Create a signature using the razorpay_order_id and razorpay_payment_id
            const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                        .update(razorpay_order_id + "|" + razorpay_payment_id)
                        .digest('hex');

            // Compare the generated signature with the received one
            if (generated_signature === razorpay_signature) {
                        // Signature is valid, payment is verified
                        const getCartDetail = await Cart.findOne({ customerId: custId })
                        const paymentDetail = await fetchPaymentDetails(razorpay_payment_id);
                        if (paymentDetail && getCartDetail) {
                                    const orderDetail = new Order({
                                                customer: custId,
                                                totalAmount: paymentDetail.amount,
                                                paymentDetails: {
                                                            razorpayOrderId: razorpay_order_id,
                                                            razorpayPaymentId: razorpay_payment_id,
                                                            razorpaySignature: razorpay_signature,
                                                            paymentStatus: paymentDetail.status,
                                                            paymentMethod: paymentDetail.paymentMethod,
                                                            paymentMethodName:paymentDetail.methodName,
                                                            paymentTime: Date.now(),
                                                            paymettransId: paymentDetail.paymentTransactionID
                                                },
                                                shippingAddress: {
                                                            name: paymentDetail.deliveryName,
                                                            mobileNumber: paymentDetail.deliveryMobileNumber,
                                                            alternateNumber: paymentDetail.alternateNumber!== undefined?paymentDetail.alternateNumber : 'Not Given',
                                                            address: paymentDetail.deliveryAddress,
                                                            city: paymentDetail.deliveryCity,
                                                            state: paymentDetail.deliveryState,
                                                            pincode: paymentDetail.deliveryPincode,
                                                }
                                    })
                                    getCartDetail.items.map((item)=>{
                                                orderDetail.orderItems.push({
                                                            productId:item.productId,
                                                            quantity:item.quantity,
                                                            price:item.price,
                                                })
                                    })
                                    await orderDetail.save()

                                    const getOrderCreated = await Order.find({customer:custId}).sort({ createdAt: 1 })
                                    if(getOrderCreated){
                                                await Cart.deleteOne({customerId: custId})
                                                res.redirect(`${process.env.CORS_ORIGIN}/yourcart/payment/${razorpay_payment_id}/success/${getOrderCreated[getOrderCreated.length - 1]._id}`)
                                    }
                        }
            } else {
                        // Invalid signature, verification failed
                        console.log("Payment verification failed");
                        // Handle failed verification scenario
            }
})

export default verifyPayment