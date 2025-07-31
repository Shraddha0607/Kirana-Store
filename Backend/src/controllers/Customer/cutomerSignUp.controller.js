import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import Token from "../../models/token.model.js"
import crypto from "crypto"
import sendEmail from "../../utils/sendEmails.js"

const signUpCustomer = asyncHandler(async function (req, res, next) {

      const { username, firstname,middlename,lastname, email, password, confirmPassword } = req.body
      const validUsername = /^[0-9A-Za-z]{6,16}$/;
      const isStrongPassword = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/
      //username validation
      if (!firstname) {
            res.status(400).json(
                  new ApiError(400, "First name is required")
            )
            return
      }
      if (!lastname) {
            res.status(400).json(
                  new ApiError(400, "Last name is required")
            )
            return
      }

      if (!email) {
            res.status(400).json(new ApiError(400, "eamil is required"))
            return
      }

      if (!username) {
            res.status(400).json(new ApiError(400, "username is required"))
            return
      }
      else if (!validUsername.test(username)) {
            res.status(400).json(new ApiError(400, "Inavlid Username - username can't have special character and should be alphanumeric "))
            return
      }
      else if (username.length > 16) {
            res.status(400).json(new ApiError(400, "Username can not exceeds 10 character"))
            return
      }
      else if (username.length < 8) {
            res.status(400).json(new ApiError(400, "UserName must have atleast 8 character"))
            return
      }



      if (!password) {
            res.status(400).json(new ApiError(400, "password is required"))
            return
      }
      else if (!isStrongPassword.test(password)) {
            res.status(400).json(
                  new ApiError(400, 'Password must contain at least one each of a number, uppercase letter, lowercase letter, and non-alphanumeric and length of password should be of 8 character'))
            return
      }
      else if (password.length < 4) {
            res.status(400).json(new ApiError(400, "Password should be atleast of 4 character"))
            return
      }
      else if (password.length > 20) {
            res.status(400).json(new ApiError(400, "Password should not exceeds 20 character"))
            return
      }

      if (!confirmPassword) {
            res.status(400).json(new ApiError(400, "Confirm Password is required"))
            return
      }

      if (!(confirmPassword === password)) {
            res.status(400).json(new ApiError(400, "Confirm Password and Password should be same is required"))
            return
      }


      const customerData = await Customer.findOne({ $or: [{ email: email }, { userName: username }] })
      if (customerData) {
            res.status(409).json(
                  new ApiError(409, "Customer is already exist with the same email or username"))
            return
      }

      const newCustomer = await Customer.create({
            userName: username.toLowerCase(),
            email: email.toLowerCase(),
            firstName: firstname.toLowerCase(),
            middleName: middlename.toLowerCase(),
            lastName: lastname.toLowerCase(),
            password: password
      });

      if (!newCustomer) {
            res.status(500).json(new ApiError(500, "Something went wrong while registering the user pleaase refresh the page and try again"))
            return
      }
      const createdCustomer = await Customer.findById(newCustomer._id).select("-password -refreshToken");

      // Sending Mail for Email Verification
      const token = await new Token({
            customerId: createdCustomer._id,
            token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}/customer/${createdCustomer._id}/verify/${token.token}`;
      await sendEmail(createdCustomer.email, "Verify Email", url);

      return res.status(200).json(
            new ApiResponse(200, createdCustomer, "An Email Sent to Your Email Account please verify before login")
      )
})

export default signUpCustomer;
