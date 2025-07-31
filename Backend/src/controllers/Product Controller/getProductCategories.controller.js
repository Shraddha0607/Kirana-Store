import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";

const getProductCategory = asyncHandler(async(req, res)=>{
      const productCategory = await Product.distinct("category")
      const categoryList = []
      try {
            for(let category of productCategory){
                  const product = await Product.findOne({category:category})
                  if(product){
                        categoryList.push(product)
                  }
            }
            res.status(200).json(
                  new ApiResponse(200 , categoryList,"ok")
            )
      } catch (error) {
            res.status(500).json(
                  new ApiError(500,`Intrenal Server Error : ${error}`)
            )
      }
})
 export default getProductCategory