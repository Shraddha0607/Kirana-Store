import asyncHandler from "../../utils/asyncHandler.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js";

const logOutCustomer = asyncHandler(async function (req, res, next) {
      const cust = await Customer.findOneAndUpdate(req.customer._id,

            {
                  $set: {
                        refreshToken: ""
                  }
            },
            {
                  new: true
            }
      );

      const options = {
            httpOnly: true,
            secure: true
      }

      return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(
                  200,
                  cust,
                  "User Logged Out SuccessFully")
            )

})

export default logOutCustomer