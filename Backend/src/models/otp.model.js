import mongoose ,{Schema} from 'mongoose'

const otpSchema = new Schema({
      customerId :{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"Customer",
            unique:true
      },
      otp:{
            type:String,
            required:true
      },
      createdAt:{
            type:Date,
            default:Date.now(),
            expires : 600
      },
      isUsed:{
            type:Boolean,
            default:false
      }
})

const OTP = mongoose.model('OTP',otpSchema)
export default OTP