const Joi = require("joi");

const signUpBodyValidation = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().max(30).required().label("First Name"),
    lastName: Joi.string().max(30).required().label("First Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(8).max(20).required().label("Password"),
    isAdmin: Joi.boolean().default(false),
  });
  return schema.validate(body);
};

const signIn = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(8).max(20).required().label("Password"),
  });
  return schema.validate(body);
};

const signOut = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body);
};

module.exports = {
  signUpBodyValidation,
  signIn,
  signOut,
  refreshTokenBodyValidation,
};
