import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import Product from "../../models/product.model.js";
import Customer from "../../models/customer.model.js";

const addProductReview = asyncHandler(async (req, res) => {
	const { productId } = req.params;
	const { rating, review } = req.body;
	const customerId = req.customer._id;
	const CurrentCustomer = await Customer.findById(customerId);
	try {
		if (CurrentCustomer) {
			const product = await Product.findById(productId)
			if (!product) {
				return res.status(404).json(
					new ApiError(404, 'Product Not Found')
				);
			}
			// Check if the customer already reviewed the product
			const alreadyReviewed = product.productReview.find(
				(r) => r.customer.toString() === customerId.toString()
			);
			if (alreadyReviewed) {
				return res.status(400).json(
					new ApiError(400, 'You have already reviewed this product'))
			}
			// Create a new review object
			const newReview = {
				customer: req.customer.id, // The verified customer from the token
				rating: Number(rating),
				comment: review,
			};

			// Push the review into the product's reviews array
			product.productReview.push(newReview);

			// Update the product's average rating (optional but common practice)
			product.numReviews = product.productReview.length;
			product.rating = product.productReview.reduce((acc, item) => item.rating + acc, 0) / product.productReview.length;
			await product.save();

			return res.status(200).json(
				new ApiResponse(200,product,"Review Added Successfully")
			)
		}
	} catch (error) {
		console.log(error)
		return res.status(500).json(
			new ApiError(500, `Server Error : ${error.message}`))
	}
})

export { addProductReview }