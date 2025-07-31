import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { uplaodOnCloudinary } from "../../utils/cloudinary.js";

const uploadImageToCloudinary =asyncHandler(async(req,res)=>{
      const imageLocalPath = req.file.path
      const imageURL=  await uplaodOnCloudinary(imageLocalPath)
      if(imageURL){
            res.status(200).json(
                  new ApiResponse(200,imageURL.url,"image uploaded successfully")
            )
            
      }
      else{
            res.status(500).json(
                  new ApiError(500,"Image was Not Uploaded, due to Server Error")
            )
            
      }
})
 export default uploadImageToCloudinary