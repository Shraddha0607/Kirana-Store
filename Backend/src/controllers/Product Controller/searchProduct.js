import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";

const searchProductFromDB = asyncHandler(async (req, res) => {
    const query = req.query.q.toLowerCase()
    const regex = new RegExp(query, 'i', 'g');
    try {
        const products = await Product.find({
            $or: [
                {
                    productName:regex
                },
                {
                    productBrand:regex
                },
                {
                    category:regex
                },
                {
                    subcategory:regex
                },
                // {
                //     productDescription :regex
                // }
            ]
        })
        if(products.length>0){
            res.status(200).json(
                new ApiResponse(200,products,'Here the Result')
          )
        }
        else{
            res.status(200).json(
                new ApiResponse(404,{},'Product Not Found!!!')
          )
        }

    } catch (error) {
        res.status(500).json(
            new ApiError(500, `Internal Server Error : ${error.message}`)
        )
    }
})

export default searchProductFromDB