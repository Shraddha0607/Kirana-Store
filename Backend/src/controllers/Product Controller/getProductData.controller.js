import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";

const getOneProductData = asyncHandler(async(req,res)=>{
      const {_id} = req.body
      try {
            const productDetail = await Product.findOne({_id : _id}).populate({
                  path: 'productReview.customer',
                  select: 'firstName middleName lastName', // Select only the fields you want to include
                })
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

export default getOneProductData