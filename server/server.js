import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.route.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import AppError from "./utils/appError.js";

// init my app, and read env //
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware //
app.use(cors()); // enable cors [unblock request from client domain]
app.use(express.json()); // enable read json

// Routes //
app.use("/api/auth", authRoutes);

// handle unhandled routes for all methods //
// this will run if not catch in any route before
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// make a global error handling middleware //
app.use(globalErrorHandler);

// run my application, and connect to DB //
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
