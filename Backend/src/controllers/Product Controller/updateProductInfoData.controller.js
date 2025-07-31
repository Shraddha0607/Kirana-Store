import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";

const updateProductInfoData = asyncHandler(async (req, res) => {
      try {
            const data = req.body
            let count = 1;
            const fieldsToUpdate = Object.keys(data)
            fieldsToUpdate.forEach(async (field) => {
                  if (field !== '_id') {
                        const res = await Product.findByIdAndUpdate(req.body._id, { [field]: req.body[field] })
                        count++
                  }
                  if (count === Object.keys(data).length) {
                        const updatedProduct = await Product.findById(req.body._id)
                        if (updatedProduct) {
                              res.status(200).json(
                                    new ApiResponse(200, {}, `${updatedProduct.productName} gets Updated`)
                              )
                        }
                        else {
                              res.status(500).json(
                                    new ApiError(500, `Error : Something Went Wrong try Again`)
                              )
                        }
                  }
            })

      } catch (error) {
            console.log(error)
            res.status(500).json(
                  new ApiError(500, `Error : ${error}`)
            )
      }
})
export default updateProductInfoData