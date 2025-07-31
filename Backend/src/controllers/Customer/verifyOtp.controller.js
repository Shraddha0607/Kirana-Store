import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import OTP from "../../models/otp.model.js"


const verifyOTP = asyncHandler(async (req, res) => {
      const { otp, customerId } = req.body
      try {
            const customer = await OTP.findOne({ customerId: customerId })
            if (customer) {
                  if (customer.otp === otp) {
                        const customerDetail = await Customer.findOne({ _id: customerId },{password:0,refreshToken:0,address:0})
                        if (customerDetail) {
                              await OTP.deleteOne({customerId: customerId})
                              res.status(200).json(
                                    new ApiResponse(200, customerDetail, "Otp verified Successfully")
                              )
                              return
                        }
                        else {
                              res.status(400).json(
                                    new ApiError(400, 'Customer Not Found')
                              )
                              return
                        }
                  }
                  else {
                        res.status(400).json(
                              new ApiError(400, 'Incoorect OTP')
                        )
                  }
            }
            else {
                  res.status(400).json(
                        new ApiError(400, 'OTP Got expired')
                  )
            }
      } catch (error) {
            res.status(500).json(
                  new ApiError(500, `Some Error Occured : ${error.message}`)
            )
      }
})

export default verifyOTP