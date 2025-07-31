import Customer from "../../models/customer.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
const updateCustomerRole = asyncHandler(async (req, res) => {
      try {

            if(req.customer.role.toUpperCase() !== "ADMIN"){
                  res.status(401).json(
                        new ApiError(401,"You are Unauthorised for this Call")
                  )   
            }
            else{
                  const { id ,role} = req.body
                  if(role.toLowerCase() === "admin" || role.toLowerCase() ==="general" ){
                        await Customer.findByIdAndUpdate(id,
                              {$set:{
                                          role : role 
                              },
                              $currentDate: { lastUpdated: true }
                        });
      
                        const updatedUser =await Customer.find({_id : id},{password:0,refreshToken:0})
      
      
                        res.status(200).json(
                              new ApiResponse(200,updatedUser[0],"role Updated")
                        )
                  }
                  else{
                        res.status(400).json(
                              new ApiError(400,"Please Send the valid Role")
                        ) 
                        return
                  }
            }
      } catch (error) {
            res.status(500).json(
                  new ApiError(500,"Internal Server Error")
            )
            console.log(error)
      }


})

export default updateCustomerRole;