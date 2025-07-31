import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config({
      path: '.env'
})

const addressSchema = new Schema({
      name: {
            type: String,
            trim: true
      },
      city: {
            type: String,
            trim: true
      },
      state: {
            type: String,
            trim: true
      },
      pincode: {
            type: Number,
      },
      locality: {
            type: String,
            trim: true,
      },
      mobileNumber:{
            type:Number,
      },
      alternateNumber:{
            type:Number,
      },
      fullAddress:{
            type:String
      },
      landmark:{
            type:String
      },
      addressType:{
            type:String
      }
}, {
      timestamps: true // Adds createdAt and updatedAt timestamps
});

const Address = mongoose.model('Address', addressSchema);


const customerSchema = new Schema({
      firstName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
      },
      middleName: {
            type: String,
            lowercase: true,
            trim: true,
            index: true
      },
      lastName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
      },
      userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true, // to enhance the searchability
      },
      email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
      },
      address: [addressSchema],
      password: {
            type: String,
            required: [true, "Password is required"],
      },
      verified: {
            type: Boolean,
            default: false
      },
      role: {
            type: String,
            default: "GENERAL"
      },
      refreshToken: {
            type: String
      }

}, { timestamps: true });

//Hooks
customerSchema.pre("save", async function (next) {

      //paswword only be encrypt if it is modifies or stores first time

      if (!this.isModified("password")) return next();
      this.password = await bcrypt.hash(this.password, 10);
      next()
})

customerSchema.pre("findOneAndUpdate", async function (next) {

      //paswword only be encrypt if it is modifies
      const update = this.getUpdate()
      if (update.password) {
            try {
                  update.password = await bcrypt.hash(update.password, 10);
            } catch (error) {
                  return next(error)
            }
      }
      next()
})

//Custom Methods
customerSchema.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password, this.password);
}

// Access Token generator
customerSchema.methods.generateAccessToken = function () {
      return jwt.sign(
            {
                  _id: this._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
      )
}
customerSchema.methods.generateRefreshToken = function () {
      return jwt.sign(
            {
                  _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                  expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
      )
}

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;