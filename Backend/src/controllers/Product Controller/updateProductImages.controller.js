import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";

const updateProductImages = asyncHandler(async(req,res)=>{
      try {
            const {productImage,productId} = req.body
            const updatedProduct = await Product.findByIdAndUpdate(productId,{productImage:productImage},{returnDocument:"after"})
            if(updatedProduct){
                  res.status(200).json(
                        new ApiResponse(200,updatedProduct,"Image Updated Successfully")
                  )
            }
            else{
                  res.status(500).json(
                        new ApiError(500,"Some Error Occured")
                  )
            }
      } catch (error) {
            res.status(500).json(
                  new ApiError(500,`Error : ${error}`)
            )
      }
})

export default updateProductImages