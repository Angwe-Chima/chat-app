import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const port = process.env.PORT || 3000;  

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Chat app listening on port ${port}!`);
});