import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import sendEmail from "../../utils/sendEmails.js"
import OTP from "../../models/otp.model.js"

const updateCustomerInfo = asyncHandler(async (req, res) => {
      const customerId = req.customer._id
      const data = req.body
      const customerToUpdate = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
      try {
            if (customerToUpdate) {
                  const firstName = req.body.firstName !== '' ? req.body.firstName : customerToUpdate.firstName
                  const middleName = req.body.middleName !== '' ? req.body.middleName : customerToUpdate.middleName
                  const lastName = req.body.lastName !== '' ? req.body.lastName : customerToUpdate.lastName
                  const updatedCustomer = await Customer.findOneAndUpdate(
                        { _id: customerId },
                        {
                              firstName: firstName,
                              middleName: middleName,
                              lastName: lastName
                        },
                        { new: true }, { password: 0, refreshToken: 0 }
                  )
                  res.status(200).json(
                        new ApiResponse(200, updatedCustomer, 'Details Updated Successfully')
                  )
            }
      } catch (error) {
            console.log(error.message)
            res.status(500).json(
                  new ApiError(500, `Server Error : ${error.message}`)
            )
      }
})
const beforeUpdatingEmailIdOfCustomerValidating = asyncHandler(async (req, res) => {
      const customerId = req.customer._id
      const data = req.body
      const customerToUpdate = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
      const otpExist = await OTP.findOne({ customerId: customerToUpdate._id })
      try {
            if (!otpExist) {
                  if (customerToUpdate) {
                        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
                        sendEmail(
                              data?.email,
                              `Kirana Store - Email Updation Process- Your One Time Password`,
                              `Hello, ${customerToUpdate?.firstName.toUpperCase()}, Welcome to Kirana Store. Your One Time Password is : ${generatedOTP}. OTP is valid till 10 minutes`
                        )
                        const newOtpData = new OTP({
                              customerId: customerId,
                              otp: generatedOTP
                        })
                        await newOtpData.save()

                        if (newOtpData) {
                              res.status(200).json(
                                    new ApiResponse(200, { newEmail: data?.email }, `An Otp is Sent to${data?.email}`)
                              )
                        }
                  }
            }
            else {
                  res.status(200).json(
                        new ApiResponse(200, { newEmail: data?.email }, "Otp Already sent to your email")
                  )
            }
      } catch (error) {
            console.log(error.message)
            res.status(500).json(
                  new ApiError(500, `Server Error : ${error.message}`)
            )
      }
})
const updatingEmailOfTheCustomer = asyncHandler(async (req, res) => {
      const customerId = req.customer._id
      const data = req.body
      const customerToUpdate = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
      try {
            if (customerToUpdate) {
                  if (customerToUpdate.email === data.newEmail) {
                        new ApiResponse(200, customerToUpdate, "Email is Already Registered to Your Account")
                        return
                  }
                  else {
                        // Checking Email is already used or not
                        const dupliocateCust = await Customer.findOne({ email: data.newEmail }, { password: 0, refreshToken: 0 })
                        if (dupliocateCust) {
                              res.status(200).json(
                                    new ApiResponse(200, customerToUpdate, "This Email is Already In Used")
                              )

                              return
                        }
                        else {
                              const updatedCustomer = await Customer.findOneAndUpdate(
                                    { _id: customerId },
                                    {
                                          email: data?.newEmail
                                    },
                                    { new: true }, { password: 0, refreshToken: 0 }
                              )
                              res.status(200).json(
                                    new ApiResponse(200, updatedCustomer, 'Details Updated Successfully')
                              )
                        }
                  }
            }

      } catch (error) {
            console.log(error.message)
            res.status(500).json(
                  new ApiError(500, `Server Error : ${error.message}`)
            )
      }
})
const addNewAddressOfCustomner = asyncHandler(async (req, res) => {
      const customerId = req.customer._id
      const data = req.body
      const customerToUpdate = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
      try {
            if (customerToUpdate) {
                  customerToUpdate.address.push({
                        name: data.name,
                        mobileNumber: data.mobileNumber,
                        pincode: data.pincode,
                        locality: data.locality,
                        fullAddress: data.address,
                        city: data.city,
                        state: data.state,
                        landmark: data.landmark,
                        addressType: data.addressType,
                        alternateNumber: data.alternateNumber
                  })
                  await customerToUpdate.save()
                  const updatedCustomer = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
                  res.status(200).json(
                        new ApiResponse(200, updatedCustomer, 'Addrsss Added Successfully')
                  )
            }
      } catch (error) {
            console.log(error.message)
            res.status(500).json(
                  new ApiError(500, `Server Error : ${error.message}`)
            )
      }
})

const modifyCustomerAddress = asyncHandler(async (req, res) => {
      const customerId = req.customer._id
      const data = req.body
      const customerToUpdate = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
      const addresses = customerToUpdate.address
      const index = addresses.findIndex((address) => address._id.toString() === data._id.toString())
      try {
            if (customerToUpdate) {
                  if (data.action === 'del') {
                        addresses.splice(index,1)
                        await customerToUpdate.save()
                        const updatedCustomer = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
                        res.status(200).json(
                              new ApiResponse(200, updatedCustomer, 'Addrsss Deleted Successfully')
                        )
                  }
                  else {
                        addresses[index] = data
                        await customerToUpdate.save()
                        const updatedCustomer = await Customer.findById({ _id: customerId }, { password: 0, refreshToken: 0 })
                        res.status(200).json(
                              new ApiResponse(200, updatedCustomer, 'Addrsss Updated Successfully')
                        )
                  }
            }
      } catch (error) {
            console.log(error.message)
            res.status(500).json(
                  new ApiError(500, `Server Error : ${error.message}`)
            )
      }
})
export { updateCustomerInfo, beforeUpdatingEmailIdOfCustomerValidating, updatingEmailOfTheCustomer, addNewAddressOfCustomner, modifyCustomerAddress }