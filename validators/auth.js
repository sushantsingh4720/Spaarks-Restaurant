import Joi from "joi";

const registerBodyValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required().label("name"),
    email: Joi.string().email().required().label("email"),
    phone: Joi.string().min(10).max(10),
    password: Joi.string().min(6).required().label("password"),
  });
  return schema.validate(body);
};

const loginBodyValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(body);
};

export { registerBodyValidation, loginBodyValidation };
