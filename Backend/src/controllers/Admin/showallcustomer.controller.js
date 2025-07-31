import Customer from "../../models/customer.model.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const showAllCustomer = asyncHandler(async (req,res)=>{
      try {
            
            if(req.customer.role.toUpperCase() !== "ADMIN"){
                  res.status(401).json(
                        new ApiError(401,"You are Unauthorised for this Call")
                  )   
            }
            else{
                  const allCustomerData = await Customer.find().select("-password") 
                  res.status(200).json(
                        new ApiResponse(200,allCustomerData,"Got all Customer")
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

export default showAllCustomer;