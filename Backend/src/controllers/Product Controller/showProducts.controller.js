import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";

const showProduct = asyncHandler(async(req,res)=>{
      try {
            const productDetail = await Product.find().sort({"createdAt":-1})
            if(productDetail){
                  res.status(200).json(
                        new ApiResponse(200,productDetail)
                  )
            }
            else{
                  res.status(400).json(
                        new ApiError(400,`No product Found`)
                  )
            }
      } catch (error) {
            res.status(500).json(
                  new ApiError(500,`Internal Server Error : ${error.message}`)
            )
      }
})

export default showProduct