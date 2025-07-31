import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";

const getSubCategoryWiseProduct = asyncHandler(async(req,res)=>{
      try {
            const {subcategory} = req.body
            const products = await Product.find({subcategory:subcategory})
            if(products.length === 0){
                  res.status(500).json(
                        new ApiError(500,`the product with this category not found'`)
                  )
            }
            else{
                  res.status(200).json(
                        new ApiResponse(200,products,`All Products`)
                  )
            }
            
      } catch (error) {
            res.status(500).json(
                  new ApiError(500,`Internal Server Error : ${error.message}`)
            )
      }
})
export default getSubCategoryWiseProduct