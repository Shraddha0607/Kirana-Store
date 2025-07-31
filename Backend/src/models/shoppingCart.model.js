import mongoose ,{Schema} from "mongoose";

const CartItemsSchema = new Schema({
      productId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"Product",
      },
      quantity:{
            type:Number,
            default:1,
            required:true,
            min:1,
      },
      price:{
            type:Number,
            required:true
      }
})

const CartItem = mongoose.model('CartItem',CartItemsSchema)

const CartSchema = new Schema({
      customerId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"Customer",
            unique:true
      },
      items :[
            CartItemsSchema
      ],
      totalNumberOfProduct:{
            type:Number,
            default:0
      },
      totalCartPrice:{
            type: Number,
            required:true,
            default:0
      }
},{timestamps:true})

CartSchema.pre("save",function(next){
      this.totalCartPrice = this.items.reduce((acc,item)=>acc + item.quantity*item.price,0)
      next()
})

const Cart = mongoose.model('Cart',CartSchema)
export default Cart