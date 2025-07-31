import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
      origin:process.env.CORS_ORIGIN,
      credentials:true
}));

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

// Customer Routes Import
import customerRouter from "./routes/cutomer.route.js";
app.use("/api/v1/customer",customerRouter);

//Admin Routes Import
import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin",adminRouter);

//Product Routes Import
import productRouter from "./routes/product.route.js";
app.use("/api/v1/product",productRouter)

//Payment and Order Routes
import paymentOrderRouter from "./routes/payment.routes.js";
app.use('/api/v1/paymentandorder',paymentOrderRouter)

export default app;