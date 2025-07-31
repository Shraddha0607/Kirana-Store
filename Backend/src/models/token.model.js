import mongoose, {Schema}from "mongoose";

const tokenSchema = new Schema({
      customerId :{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"Customer",
            unique:true
      },
      token:{
            type:String,
            required:true
      },
      createdAt:{
            type:Date,
            default:Date.now
      }
})

const Token = mongoose.model("Token",tokenSchema)

export default Token