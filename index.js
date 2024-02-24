import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import { authMiddleware } from "./middlewares/auth.js";
import authRoute from "./routes/auth.route.js";
import restaurantRoute from "./routes/restaurant.route.js";

const app = express();

config();
connectDB();

app.use(cookieParser());
app.use(express.json());

app.use(cors({ credentials: true }));

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoute);
app.use(authMiddleware);
app.use("/api/restaurant", restaurantRoute);
const port = process.env.PORT;

app.listen(port, (err) => {
  if (err) {
    process.exit(1);
  }
  console.log(`
      ################################################
     Server listening on port: ${port}
      ################################################
    `);
});
