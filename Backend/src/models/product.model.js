import mongoose, { Schema } from "mongoose";

// Define schema for reviews
const ReviewSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', 
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5, // Rating out of 5
  },
  comment: {
    type: String,
    trim: true,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true,
    },
    productBrand: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productListingPrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    productSellingPrice: {
      type: Number,
      required: true,
      min: 0,
      index: true, // enhance search functionality
    },
    category: {
      type: String,
      index: true,
      required: true,
    },
    subcategory: {
      type: String,
      index: true,
      required: true,
    },
    productImage: [],
    
    // Add productReview attribute as an array of reviews
    productReview: [ReviewSchema],
    numReviews:{
      type:Number
    },
    rating:{
      type:Number
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
