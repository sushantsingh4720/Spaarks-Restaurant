import {
  addRestaurantBodyValidation,
  nearestToFarthestBodyValidation,
  specifiedRadiusRangeBodyValidataion,
} from "../validators/restaurant.js";
import Restaurant from "./../models/restaurant.model.js";

export const test = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "restaurant route has been successfully established.",
  });
};

export const addRestaurant = async (req, res) => {
  try {
    const { name, description, cordinates, ratings } = req.body;
    const { error } = addRestaurantBodyValidation({
      name,
      description,
      cordinates,
    });
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    let existingRestaurant = await Restaurant.findOne({ name });

    if (existingRestaurant)
      return res.status(409).json({
        success: false,
        message: `Restaurant  ${name} already exists.`,
      });

    const NumberOfRating = ratings.length;
    let sumOfRatings = ratings.reduce((acc, val) => {
      return acc + val;
    }, 0);
    const AvgRating = Math.ceil(sumOfRatings / NumberOfRating);

    await new Restaurant({
      name,
      description,
      cordinates,
      ratings,
      NumberOfRating,
      AvgRating,
    }).save();
    res.status(201).json({
      success: true,
      message: `Restaurant ${name} created successfully.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const nearestToFarthest = async (req, res) => {
  try {
    const { Latitude, Longitude, Radius } = req.body;
    const { error } = nearestToFarthestBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    let allRestaurants = await Restaurant.find();
    if (allRestaurants.length === 0)
      return res.status(200).json({ success: true, data: allRestaurants });

    allRestaurants = allRestaurants
      .map((restaurant) => {
        const distance = calculateDistance(
          Latitude,
          Longitude,
          restaurant.cordinates.latitude,
          restaurant.cordinates.longitude
        );

        if (distance <= Radius)
          return {
            "Name of restaurant": restaurant.name,
            "Description of restaurant": restaurant.description,
            "Location of restaurant": {
              latitude: restaurant.cordinates.latitude,
              longitude: restaurant.cordinates.longitude,
            },
            "Average Rating of the restaurant": restaurant.AvgRating,
            "No. of Ratings": restaurant.NumberOfRating,
            distance: distance,
          };
        else return null; // Exclude restaurants outside the radius
      })
      .filter((restaurant) => restaurant !== null); // Remove null entries

    allRestaurants.sort((a, b) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    res.status(200).json({ success: true, data: allRestaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const specifiedRadiusRange = async (req, res) => {
  try {
    const { Latitude, Longitude, minimumDistance, maximumDistance } = req.body;
    const { error } = specifiedRadiusRangeBodyValidataion(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    let allRestaurants = await Restaurant.find();
    if (allRestaurants.length === 0)
      return res.status(200).json({ success: true, data: allRestaurants });

    allRestaurants = allRestaurants
      .map((restaurant) => {
        const distance = calculateDistance(
          Latitude,
          Longitude,
          restaurant.cordinates.latitude,
          restaurant.cordinates.longitude
        );

        if (distance >= minimumDistance && distance <= maximumDistance)
          return {
            "Name of restaurant": restaurant.name,
            "Description of restaurant": restaurant.description,
            "Location of restaurant": {
              latitude: restaurant.cordinates.latitude,
              longitude: restaurant.cordinates.longitude,
            },
            "Average Rating of the restaurant": restaurant.AvgRating,
            "No. of Ratings": restaurant.NumberOfRating,
            distance: distance,
          };
        else return null;
      })
      .filter((restaurant) => restaurant !== null);

    allRestaurants.sort((a, b) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;

      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    res.status(200).json({ success: true, data: allRestaurants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  var p = 0.017453292519943295;
  var c = Math.cos;
  var a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};
