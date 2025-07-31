import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Cart from "../../models/shoppingCart.model.js"
import Product from "../../models/product.model.js";

const removeItemFromCart = asyncHandler(async(req,res)=>{
      const custId = req.customer._id
      const productId = req.body._id
      const ProductDetail = await Product.findById({_id:productId})
      const custCart = await Cart.findOne({ customerId: custId })
      try {
            if(custCart){
                  const existingItemIndex = custCart.items.findIndex(item => item.productId.toString() === productId)
                  if (existingItemIndex >= 0) {
                        const itemdeleted = custCart.items.splice(existingItemIndex,1)
                        custCart.totalNumberOfProduct -= 1
                  }
                  await custCart.save()
                  const updatedCart = await Cart.findOne({customerId : custId},{customerId:0}).populate('items.productId')
                  res.status(200).json(
                        new ApiResponse(200, updatedCart, `${ProductDetail.productName} removed from the Cart`)
                  )
            }
      } catch (error) {
            console.log(error)
            res.status(500).json(
                  new ApiError(500, `Some Error occured: ${error?.message}`)
            )
      }
})
export default removeItemFromCart

