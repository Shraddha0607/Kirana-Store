import Product from "../../models/product.model.js"
import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"

const addProduct = asyncHandler(async(req,res)=>{
      const {
            productName,productBrand,productDescription,
            productListingPrice,productSellingPrice,category,subcategory,
            productImage
      } = req.body
      const productData= {
            productName :productName,
            productBrand:productBrand,
            productDescription:productDescription,
            productListingPrice:productListingPrice,
            productSellingPrice:productSellingPrice,
            category:category,
            subcategory:subcategory,
            productImage:productImage
      }

      const newProduct = await Product.create(productData)
            
      if(!newProduct){
            res.status(500).json(
                  new ApiError(500,"Data not saved in the Database!! Internal Server Error")
            )
      }
      else{
            res.status(200).json(
                  new ApiResponse(200,newProduct._id,"Product Added Successfully")
            )
      }
})

export default addProduct