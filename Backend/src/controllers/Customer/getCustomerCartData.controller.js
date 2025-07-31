import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Cart from "../../models/shoppingCart.model.js"

const getCustomerCartData = asyncHandler(async(req,res)=>{
      const currentCustId = req.customer
      try {
            const currentCustomerCartData = await Cart.findOne({customerId : currentCustId._id},{customerId:0}).populate('items.productId')
            if(currentCustomerCartData){
                  res.status(200).json(
                        new ApiResponse(200,currentCustomerCartData,"Your cart")
                  )
            }
      } catch (error) {
            console.log(error)
            res.status(500).json(
                  new ApiError(500,`Some Error occured: ${error?.message}`)
            )
      }
})
export default getCustomerCartData