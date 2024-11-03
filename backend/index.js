import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //allow us to parse incoming requests: req.body
app.use(cookieParser()); //allow us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is runing on ${PORT}`);
});
