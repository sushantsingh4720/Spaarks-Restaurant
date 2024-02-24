import mongoose from "mongoose";
const connectDB = (req, res) => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected to Mongoose server"))
    .catch((error) => {
      console.error(`Error connecting to MongoDB server: ${error.message}`);
    });
};

export default connectDB;
