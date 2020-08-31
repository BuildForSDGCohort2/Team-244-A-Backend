const Joi = require("joi");
const userModel = require("../models/user.model");
ValidationService = {
  async registerValidation(payload) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
      phone: Joi.string()
        .trim()
        .regex(/^[0-9]{11}$/),
    });
    const validate = schema.validate({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
    });
    if (validate.error) return false;
    return true;
  },
  async loginValidation(user) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
      password: Joi.string().required(),
    });
    const validate = schema.validate({
      email: user.email,
      password: user.password,
    });
    if (validate.error) return false;
    let loggedUser = await userModel.findOne({ email: user.email });
    if (!loggedUser) return false;
    let validPassword = await loggedUser.comparePassword(user.password);
    if (!validPassword) return false;
    return loggedUser;
  },
  async createError(status, message) {
    let err = new Error(message);
    err.status = status;
    return err;
  },
};
module.exports = ValidationService;
