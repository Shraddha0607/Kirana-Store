import React from 'react';
import { createBrowserRouter, Route } from "react-router-dom";
import App from "../App.jsx";
import Home from '../Pages/Home.jsx';
import Login from '../Pages/Login.jsx';
import SignUp from '../Pages/SignUp.jsx';
import ForgotPassword from '../Pages/ForgotPassword';
import SetNewPassword from '../Pages/SetNewPAssword';
import ErrorPage from '../Pages/ErrorPage.jsx';
import EmailVerify from '../Pages/EmailVerify.jsx';
import CustomerProfile from '../Pages/CustomerProfile.jsx';
import AdminPanel from '../Pages/Admin/AdminPanel.jsx';
import ViewAllCustomer from "../Pages/AdminOptionPages/ViewAllCustomer.jsx";
import AddProducts from "../Pages/AdminOptionPages/AddProducts.jsx";
import ViewAllListedProducts from "../Pages/AdminOptionPages/ViewAllListedProducts.jsx";
import UpdateProductMenu from '../Components/UpdateProductForm/UpdateProductMenu.jsx';
import SpecificCategoryPage from '../Components/HomePageComponents/SpecificCategoryPage.jsx';
import CartLandingPage from '../Pages/Cart/CartLandingPage.jsx';
import AddToCartPage from '../Pages/Cart/AddToCartPage.jsx';
import CheckoutPage from '../Pages/Cart/ChecckOutpage';
import PaymentGateway from '../Pages/Cart/Paymentgateway';
import OrderStatus from '../Pages/Cart/OrderStatus';
import ProductDetailPage from '../Pages/ProductDetailPage.jsx';
import PrivateRoute from '../Components/PrivateRoute/PrivateRoute.jsx';
import CustomerOrderPage from '../Pages/CustomerOrderPage.jsx';
import SubCatehoryLandingPage from '../Pages/SubCatehoryLandingPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'productDetail/:id/view',
        element: <ProductDetailPage />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'forgotPassword',
        element: <ForgotPassword />,
      },
      {
        path: 'resetpassword/:id',
        element: <SetNewPassword />,
      },
      {
        path: 'customer/:id/verify/:token',
        element: <EmailVerify />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
      {
        path: 'products/:productcategory',
        element: <SpecificCategoryPage />,
      },
      {
        path: 'products/deals/:subcategory',
        element: <SubCatehoryLandingPage/>,
      },
      {
        element: <PrivateRoute />, // This applies to all routes nested inside
        children: [
          {
            path: 'customer-profile',
            element: <CustomerProfile />,
          },
          {
            path: 'customer-order-detail',
            element: <CustomerOrderPage />,
          },
          {
            path: 'yourcart',
            element: <CartLandingPage />,
            children: [
              {
                index: true,
                element: <AddToCartPage />,
              },
              {
                path: 'checkout',
                element: <CheckoutPage />,
              },
              {
                path: 'payment/:id/success/:orderId',
                element: <PaymentGateway />,
              },
              {
                path: 'orderStatus/:id',
                element: <OrderStatus />,
              },
            ],
          },
          {
            path: 'admin-pannel',
            element: <AdminPanel />,
            children: [
              {
                path: 'view-all-customer',
                element: <ViewAllCustomer />,
              },
              {
                path: 'add-products',
                element: <AddProducts />,
              },
              {
                path: 'view-all-listed-products',
                element: <ViewAllListedProducts />,
              },
            ],
          },
          {
            path: ':id/update-product',
            element: <UpdateProductMenu />,
          },
        ],
      },
    ],
  },
]);

export default router;
