import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from "../../utils/apiError.js"
import ApiResponse from "../../utils/apiResponse.js"
import Customer from "../../models/customer.model.js"
import Token from "../../models/token.model.js"
import crypto from "crypto"
import sendEmail from "../../utils/sendEmails.js"

const generateAccessAndRefreshTokens = async (custId) => {
      try {
            const user = await Customer.findById(custId);
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
      } catch (error) {
            throw new ApiError(500, `Token generation error : ${error}`);
      }
}

const logInCustomer = asyncHandler(async function (req, res, next) {
      const { email, password } = req.body;
      try {
            if (!email) {
                  res.status(400).json(
                        new ApiError(400, "Registered Email is Required??")
                  )
                  return
            }
      
            if (!password) {
                  res.status(400).json(
                        new ApiError(400, "Password is Required??")
                  )
                  return
            }
            const getcustomer = await Customer.findOne({ email: email });
            if (!getcustomer) {
                  res.status(400).json(
                        new ApiError(400, "You are Not Registered")
                  )
                  return
            }
            const getToken = await Token.findOne({ customerId: getcustomer._id });
      
            if (getToken) {
                  //Chcek token expiry
                  const isTokenExpoired = (Date.now() - getToken.createdAt.getTime()) > 30 * 60 * 1000
                  if (isTokenExpoired) {
                        await Token.findByIdAndDelete(getToken._id);
                        const token = await new Token({
                              customerId: getcustomer._id,
                              token: crypto.randomBytes(32).toString("hex"),
                        }).save();
      
                        const url = `${process.env.BASE_URL}/customer/${getcustomer._id}/verify/${token.token}`;
                        await sendEmail(getcustomer.email, "Verify Email", url);
                        res.status(200).json(
                              new ApiError(200, "Email is sent to your Registered Email first Verify")
                        )
                  }
                  else{
                        res.status(400).json(
                              new ApiError(400, "Kindly verify your email")
                        )
                  }
                  return
            }
      
      
            if (!getcustomer.verified) {
      
                  res.status(400).json(
                        new ApiError(400, "Your Email is not verified, Kindly verify your Email")
                  )
                  return
            }
      
            const isPasswordValid = await getcustomer.isPasswordCorrect(password);
      
            if (!isPasswordValid) {
                  res.status(400).json(
                        new ApiError(400, "Inavlid Customer Credential")
                  )
                  return
            }
      
            //generate AccessToken and Refresh Token
      
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(getcustomer._id);
      
            const customerLoggedIn = await Customer.findOne({ email: email },{password:0,refreshToken:0,address:0});
      
            // Setting up the cookie
      
            const options = {
                  httpOnly: true,
                  secure: true,
                  sameSite:'NONE',
            }
      
            return res
                  .status(200)
                  .cookie("accessToken", accessToken, options)
                  .cookie("refreshToken", refreshToken, options)
                  .json(
                        new ApiResponse(
                              200,
                              {
                                    customerData: customerLoggedIn,
                                    accessToken: accessToken,
                                    refreshToken: refreshToken
                              },
                              "You are SuccessFully LoggedIn"
                        )
                  )
      } catch (error) {
            console.log(error)
            res.status(500).json(
                  new ApiError(500,`Server Side Error: ${error.message}`)
            )
      }
})

export default logInCustomer;