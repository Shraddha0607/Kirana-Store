import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js"
import ApiError from "../../utils/apiError.js"
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
      cloud_name: `${process.env.CLOUDINARY_CLOUDNAME}`,
      api_key: `${process.env.CLOUDINARY_API_KEY}`,
      api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const deleteImageFromCloudinary = asyncHandler((req,res) => {
      const {imagename} = req.body
      cloudinary.uploader.destroy(imagename,(error,result)=>{
            if(result.result === 'ok'){
                  res.status(200).json(
                        new ApiResponse(200,{},"Image Deleted Successfully")
                  )
            }
            if(error){
                  res.status(500).json(
                        new ApiError(500,"Internal Server Error")
                  )
            }
      })
}
)
export default deleteImageFromCloudinary