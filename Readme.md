KIRANA-STORE

A full-featured e-commerce grocery store built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Kirana store enables users to browse grocery products, manage their carts, and experience a dynamic shopping flow, with features such as authentication, payments, and responsive design.

Table of Contents
Features
Technologies Used
Installation
Usage
API Endpoints
Future Enhancements
License
Features
User Authentication & Authorization
Users can sign up, log in, and manage their accounts using JWT-based authentication.

Product Listing
Dynamic product listing with real-time search and filter options to explore available groceries.

Shopping Cart
Add products to the cart, view total price, and update quantity before placing orders.

Payment Integration
Integrated with the Razorpay demo API to simulate payment transactions.

Responsive Design
Optimized for both desktop and mobile views to ensure a seamless shopping experience on any device.

Technologies Used
Frontend:
React.js
CSS3 (Responsive Layouts)
Bootstrap (For pre-built UI components)
Backend:
Node.js
Express.js (REST API)
Database:
MongoDB (Product storage and user data)
Authentication:
JSON Web Tokens (JWT)
Payment Gateway:
Razorpay (Demo API Integration)
Installation
To set up the project locally, follow these steps:



Usage
Sign up or log in to explore the product listings.
Add items to the cart and view the total price.
Proceed to checkout and make a demo payment using Razorpay.
View order confirmation.
API Endpoints
Authentication
POST /api/users/register - Register a new user
POST /api/users/login - Login with email and password
Products
GET /api/products - Get all products
GET /api/products/:id - Get product by ID
Cart
POST /api/cart/add - Add product to cart
GET /api/cart - View cart items
Orders
POST /api/orders/create - Create a new order
Future Enhancements
Order Management: Add functionality to track and manage orders.
Wishlist: Enable users to save products for later.
Real Payment Integration: Integrate live payment gateways like PayPal or Stripe for real transactions.
Product Reviews: Allow users to leave reviews and ratings for products.

