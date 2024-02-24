import Joi from "joi";

export const addRestaurantBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().label("name"),
    description: Joi.string().required().label("description"),
    cordinates: Joi.object({
      latitude: Joi.number().required().label("latitude"),
      longitude: Joi.number().required().label("longitude"),
    })
      .required()
      .label("cordinates"),
  });

  return schema.validate(body);
};

export const nearestToFarthestBodyValidation = (body) => {
  const schema = Joi.object({
    Latitude: Joi.number().required().label("Latitude"),
    Longitude: Joi.number().required().label("Longitude:"),
    Radius: Joi.number().required().label("Radius"),
  });
  return schema.validate(body);
};

export const specifiedRadiusRangeBodyValidataion = (body) => {
  const schema = Joi.object({
    Latitude: Joi.number().required().label("Latitude"),
    Longitude: Joi.number().required().label("Longitude:"),
    minimumDistance: Joi.number().required().label("minimumDistance"),
    maximumDistance: Joi.number().required().label("maximumDistance:"),
  });
  return schema.validate(body);
};
