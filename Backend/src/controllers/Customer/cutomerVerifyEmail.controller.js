import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import Token from "../../models/token.model.js"

const verifyEmail = asyncHandler (async (req,res,next)=>{
      try {
            const customer = await Customer.findById(req.params.id);
            if(!customer){
                  res.status(400).json(
                        new ApiError(
                              400,"Invalid Link"
                        )
                  )
                  return
            }
            const token = await Token.findOne({
                  customerId : customer._id,
                  token : req.params.token
            });
            if(!token){
                  res.status(400).json(
                        new ApiError(
                              400,"Invalid Link"
                        )
                  )
                  return
            }

            await customer.updateOne({_id:customer._id,verified : true})
            await Token.deleteOne({_id : token._id});

            res.status(200).json(
                  new ApiResponse(200,null,"Email Verified Successfully")
            )
      } catch (error) {
            res.status(400).json(
                  new ApiError(
                        400,"Internal Server Error"
                  )
            )
            console.log("mail Sent Server error : ",error)
      }
})

export default verifyEmail;