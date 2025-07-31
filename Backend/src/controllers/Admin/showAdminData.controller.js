import Customer from "../../models/customer.model.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";


const showAdminData = asyncHandler(async(req,res)=>{
      try {
            if(req.customer.role.toUpperCase() !== "ADMIN"){
                  res.status(401).json(
                        new ApiError(401,"You are no longer Admin")
                  )   
            }
            else{
                  const adminData = await Customer.find({_id:req.customer._id},{password:0,refreshToken:0}) 
                  res.status(200).json(
                        new ApiResponse(200,adminData,`Welcome Admin !!`)
                  )
            }
            return
      } catch (error) {
            res.status(500).json(
                  new ApiError(500,"Internal Server Error")
            )
            console.log(error)
      }
})

export default showAdminData