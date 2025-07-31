import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import sendEmail from "../../utils/sendEmails.js"

const formatDate = (timestamp) => {
      const date = new Date(timestamp).toISOString();
      const readableDate = date?.toLocaleString('en-US', {
            weekday: 'long',   // Full weekday (e.g., Friday)
            year: 'numeric',   // Full year (e.g., 2024)
            month: 'long',     // Full month (e.g., September)
            day: 'numeric',    // Day of the month (e.g., 13)
            hour: 'numeric',   // Hours (e.g., 5 PM)
            minute: 'numeric', // Minutes (e.g., 20)
            second: 'numeric', // Seconds (e.g., 58)
            hour12: true       // 12-hour format (AM/PM)
      })

      return readableDate
}

const updatePassword = asyncHandler(async (req, res) => {
      const { password, customerId } = req.body
      try {
            const getUpdatedCustomer = await Customer.findByIdAndUpdate({ _id: customerId }, { password: password }, { new: true })
            if (getUpdatedCustomer) {
                  sendEmail(
                        getUpdatedCustomer.email,
                        `Your Password Has Been Successfully Updated`,
                        `Hi ${getUpdatedCustomer.fullname},
                          We wanted to let you know that the password for your account associated with this email ([user's email]) was successfully updated.
                          
                          If you made this change, you can ignore this message. If you did not request a password change, please contact our support team immediately to secure your account.
                          
                          For your reference:
                          
                          Date of change: ${formatDate(Date.now())}
                          For your security, we recommend:
                          Using strong, unique passwords for each of your online accounts.
                          Enabling two-factor authentication (2FA) if available.
                          Thank you for being with us!
                          
                          Best regards,
                          KIRANA_STORE
                        `
                  )
                  res.status(200).json(
                        new ApiResponse(200, {}, 'Password Got Updated Successfully')
                  )
            }
      } catch (error) {
            console.log(error.message)
            res.status(500).json(
                  new ApiError(500,`Internal Server Error : ${error.message}`)
            )
      }
})
export default updatePassword