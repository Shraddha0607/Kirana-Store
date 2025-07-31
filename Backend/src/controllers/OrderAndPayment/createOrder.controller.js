import Razorpay from 'razorpay';
import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import { v4 as uuidv4 } from 'uuid';

const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
            const {cartItems} = req.body
            const totalamount = cartItems.reduce((accumulator,product)=>{
                        return accumulator + product.product.productSellingPrice*product.quantity
            },0)
            const options = {
                        amount: totalamount*100, // amount in paise
                        currency: "INR",
                        receipt: uuidv4(),
            };
            try {
                        const order = await instance.orders.create(options);
                        res.status(200).json(new ApiResponse(202,order,'Order Created Successfully'));
            } catch (error) {
                        console.error(error);
                        res.status(500).send("Error creating order");
            }

})

export default createOrder