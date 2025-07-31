import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Order from "../../models/order.model.js";

const getSpecificOrderDetail = asyncHandler(async (req, res) => {
            try {
                        const {orderId} = req.body;
                        const orderDetail = await Order.findById(orderId).populate('orderItems.productId')
                        if(orderDetail){
                                    res.status(200).json(
                                                new ApiResponse(200,orderDetail,'ok')
                                    )
                        }
                        else{
                                    res.status(400).json(
                                                new ApiError(400, `Invaid OrderId:${orderId}`))  
                        }

            } catch (error) {
                        res.status(500).json(
                                    new ApiError(500, `Server side error${error}`))
            }
})

export default getSpecificOrderDetail