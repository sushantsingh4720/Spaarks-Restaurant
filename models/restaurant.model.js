import mongoose from "mongoose";
const restaurantschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    ratings: [{ type: Number }],
    AvgRating: { type: Number, default: 0 },
    NumberOfRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantschema);
