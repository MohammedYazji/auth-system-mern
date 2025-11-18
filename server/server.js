import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.route.js";

// init my app, and read env //
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware //
app.use(cors()); // enable cors [unblock request from client domain]
app.use(express.json()); // enable read json

// Routes //
app.use("/api/auth", authRoutes);

// run my application, and connect to DB //
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
