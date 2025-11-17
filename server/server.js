import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// init my app, and read env //
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware //
app.use(cors()); // enable cors [unblock request from client domain]
app.use(express.json()); // enable read json

// run my application //
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
