const Joi = require("joi");
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
  async createError(status, message) {
    let err = new Error(message);
    err.status = status;
    return err;
  },
};
module.exports = ValidationService;
