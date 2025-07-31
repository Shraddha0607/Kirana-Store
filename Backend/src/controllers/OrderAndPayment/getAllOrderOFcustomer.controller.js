import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Order from "../../models/order.model.js";

const getCurrentUserOrderDetail = asyncHandler(async(req,res)=>{
            const customerId = req.customer._id;
            try {
                   const getCustomerOrderDetail = await Order.find({customer:customerId}).populate('orderItems.productId').sort({createdAt:-1})
                   if(getCustomerOrderDetail){
                        res.status(200).json(
                                    new ApiResponse(200,getCustomerOrderDetail,'ok')
                        )
                   }
                   else{
                        res.status(200).json(
                                    new ApiResponse(200,{},`You have No order Detail`))  
                   }     
            } catch (error) {
                        res.status(500).json(
                                    new ApiError(500, `Server side error${error}`))
            }
})

export default getCurrentUserOrderDetail