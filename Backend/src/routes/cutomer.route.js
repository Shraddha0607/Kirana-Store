import {Router} from "express"
import signUpCustomer from "../controllers/Customer/cutomerSignUp.controller.js";
import logInCustomer from "../controllers/Customer/customerlogIn.controller.js";
import logOutCustomer from "../controllers/Customer/customerlogout.controller.js"
import verifyEmail from "../controllers/Customer/cutomerVerifyEmail.controller.js";
import verifyCustomer from "../middlewares/cutomerAuth.middleware.js"
import showCustomerDetails from "../controllers/Customer/showCustomerDetails.controller.js";
import forgotPasswordVerification from "../controllers/Customer/ForgetPassword.controller.js";
import verifyOTP from "../controllers/Customer/verifyOtp.controller.js";
import updatePassword from "../controllers/Customer/UpdatePassword.controller.js";
import CustomerCart from "../controllers/Customer/GusetCustomerCartData.controller.js";
import getCustomerCartData from "../controllers/Customer/getCustomerCartData.controller.js";
import addItemsToCartOfLoggedInCustomer from "../controllers/Customer/addItemsToCartofLogincust.controller.js";
import updateProductCount from "../controllers/Customer/UpdateProductQunatity.controller.js";
import removeItemFromCart from "../controllers/Customer/removeCustomerCartItem.controller.js";
import {addNewAddressOfCustomner, beforeUpdatingEmailIdOfCustomerValidating, modifyCustomerAddress, updateCustomerInfo, updatingEmailOfTheCustomer} from "../controllers/Customer/updateCustomerInfo.controller.js";
const customerRouter = Router()

customerRouter.route("/signup").post(signUpCustomer);
customerRouter.route("/login").post(logInCustomer);
customerRouter.route("/logout").post(verifyCustomer,logOutCustomer);
customerRouter.route("/:id/verify/:token").post(verifyEmail);
customerRouter.route("/customer-details").get(verifyCustomer,showCustomerDetails)
customerRouter.route('/forgotPassword').post(forgotPasswordVerification)
customerRouter.route('/verifyOtp').post(verifyOTP)
customerRouter.route('/updatePassword').post(updatePassword)
customerRouter.route('/customerUpdateInfo').post(verifyCustomer,updateCustomerInfo)
customerRouter.route('/customerUpdateEmail/Phase1').post(verifyCustomer,beforeUpdatingEmailIdOfCustomerValidating)
customerRouter.route('/customerUpdateEmail/Phase2').post(verifyCustomer,updatingEmailOfTheCustomer)
customerRouter.route('/Customer/add/newAddress').post(verifyCustomer,addNewAddressOfCustomner)
customerRouter.route('/Customer/modify/Address').post(verifyCustomer,modifyCustomerAddress)
customerRouter.route('/guestCustomerCartDetail').post(CustomerCart)
customerRouter.route('/loggedInCustomerCartDetail').post(verifyCustomer,addItemsToCartOfLoggedInCustomer)
customerRouter.route("/getCustomerCartDetail").get(verifyCustomer,getCustomerCartData);
customerRouter.route("/productCountUpdation").post(verifyCustomer,updateProductCount);
customerRouter.route("/removeItemFromCart").post(verifyCustomer,removeItemFromCart);


export default customerRouter;