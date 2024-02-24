import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    name: {
      type: "String",
      required: true,
    },
    phone: {
      type: "String",
    },
    password: {
      type: "String",
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
