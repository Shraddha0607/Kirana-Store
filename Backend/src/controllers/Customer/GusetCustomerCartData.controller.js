import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Cart from "../../models/shoppingCart.model.js"

const CustomerCart = asyncHandler(async(req,res)=>{
      const body =JSON.parse(req.body.cartData) 
      const custId = req.body._id
      const totalNumberOfProduct = body.totalNumberOfProduct
      const productId = body.productId
      const itemsData = body.itemsData
      const isCurrentCustCartExist = await Cart.findOne({customerId : custId})
      try {
            if(isCurrentCustCartExist){
                  for(let i = 0;i<totalNumberOfProduct;i++){
                        const existingItemIndex = isCurrentCustCartExist.items.findIndex(item => item.productId.toString() === productId[i])
                        if(existingItemIndex >=0){
                              isCurrentCustCartExist.items[existingItemIndex].quantity = isCurrentCustCartExist.items[existingItemIndex].quantity +  itemsData[productId[i]].quantity
                        }
                        else{
                              isCurrentCustCartExist.items.push({
                                    productId : productId[i],
                                    quantity:itemsData[productId[i]].quantity,
                                    price:itemsData[productId[i]].price
                              })
                              isCurrentCustCartExist.totalNumberOfProduct += 1
                        }
                  }
                  await isCurrentCustCartExist.save()
            }
            else{
                  const newCustCart = new Cart({
                        customerId: custId,
                        items:[],
                        totalNumberOfProduct : totalNumberOfProduct
                  })
                  for(let i = 0;i<totalNumberOfProduct;i++){
                        newCustCart.items.push({
                              productId : productId[i],
                              quantity:itemsData[productId[i]].quantity,
                              price:itemsData[productId[i]].price
                        })
                  }
                  await newCustCart.save()
            }
            res.status(200).json(
                  new ApiResponse(200,{},'Cart Updated')
            )
      } catch (error) {
            console.log(error)
            res.status(500).json(
                  new ApiError(500,`Some Error occured: ${error?.message}`)
            )
      }
})
export default CustomerCart