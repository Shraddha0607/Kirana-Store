import asyncHandler from '../../utils/asyncHandler.js'
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import Cart from '../../models/shoppingCart.model.js'
import Product from '../../models/product.model.js'

const updateProductCount = asyncHandler(async (req, res) => {
      const customerId = req.customer._id
      const getCustomerCart = await Cart.findOne({ customerId: customerId })
      const productId = req.body.productId
      const product = await Product.findById(productId) 
      const action = req.body.action
      try {
            if (getCustomerCart) {
                  if (action === 'inc') {
                        const existingItemIndex = getCustomerCart.items.findIndex(item => item.productId.toString() === productId)
                        if (existingItemIndex >= 0) {
                              getCustomerCart.items[existingItemIndex].quantity = getCustomerCart.items[existingItemIndex].quantity + 1
                        }
                        await getCustomerCart.save()
                        res.status(200).json(
                              new ApiResponse(200,{},`${product.productName} is added`)
                        )
                  }
                  else{
                        const existingItemIndex = getCustomerCart.items.findIndex(item => item.productId.toString() === productId)
                        if (existingItemIndex >= 0) {
                              if(getCustomerCart.items[existingItemIndex].quantity > 1){
                                    getCustomerCart.items[existingItemIndex].quantity = getCustomerCart.items[existingItemIndex].quantity - 1
                              }
                              else{
                                    getCustomerCart.items.splice(existingItemIndex,1)
                              }
                        }
                        await getCustomerCart.save()
                        res.status(200).json(
                              new ApiResponse(200,{},`${product.productName} is removed `)
                        )
                  }
            }
      } catch (error) {
            console.log('Update Cart Product Error', error)
            res.status(500).json(
                  new ApiError(500, `Server Error : ${error}`)
            )
      }
})
export default updateProductCount