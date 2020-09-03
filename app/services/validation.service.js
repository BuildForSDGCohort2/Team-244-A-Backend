const Joi = require("joi");
const userModel = require("../models/user.model");
const orgModel = require("../models/organization.model");
const ObjectId = require("mongoose").Types.ObjectId;

const ValidationService = {
  /**
   * @description validate registeration data of a new user
   * @param (Object) payload : the request body that contains user data (name-email-password-phone)
   * @returns (Boolean)
   */
  async userRegisterValidation(payload) {
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
  /**
   * @description validate login data of a user/ an organization
   * @param (Object) data : the user account data (email-password)
   * @param (string) type : the user type [users,orgs]
   * @returns (Object|Boolean) user : the user or org object
   */
  async loginValidation(data, type) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
      password: Joi.string().required(),
    });
    const validate = schema.validate({
      email: data.email,
      password: data.password,
    });
    if (validate.error) return false;
    if (type == "users") {
      let loggedUser = await userModel.findOne({ email: data.email });
      if (!loggedUser) return false;
      let validPassword = await loggedUser.comparePassword(data.password);
      if (!validPassword) return false;
      return loggedUser;
    } else if (type == "orgs") {
      let loggedOrg = await orgModel.findOne({ email: data.email });
      if (!loggedOrg) return false;
      let validPassword = await loggedOrg.comparePassword(data.password);
      if (!validPassword) return false;
      return loggedOrg;
    }
  },
  /**
   * @description validate registeration data of a new organization
   * @param (Object) payload : the request body that contains organization data (name-email-password-phone-links-description-preference-address)
   * @returns (Boolean)
   */
  async orgRegisterValidation(payload) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
      phone: Joi.string()
        .trim()
        .regex(/^[0-9]{11}$/),
      links: Joi.array().items(Joi.string().trim()),
      preference: Joi.string().valid("people", "animal").required(),
      address: Joi.string().required(),
      description: Joi.string().required(),
    });
    const validate = schema.validate({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      links: payload.links,
      preference: payload.preference,
      address: payload.address,
      description: payload.description,
    });
    if (validate.error) return false;
    return true;
  },
  /**
   * @description validate if an email exists or not into safehome accounts
   * @param (string) email : email needs to be validated
   * @param (string) type : type of emails (orgs/users)
   * @returns (Boolean)
   */
  async validateMail(email, type) {
    if (type == "users") {
      let checkUser = await userModel.findOne({ email: email });
      if (checkUser) return false;
    } else if (type == "orgs") {
      let checkOrg = await orgModel.findOne({ email: email });
      if (checkOrg) return false;
    }
    return true;
  },
  /**
   * @description validate forget password of a user/organization data
   * @param (Object) payload : the request body that contains (type=[organization/user],email)
   * @returns (Boolean)
   */
  async forgetPasswordValidation(payload) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
      type: Joi.string().valid("user", "organization").required(),
    });
    const validate = schema.validate({
      email: payload.email,
      type: payload.type,
    });
    if (validate.error) return false;
    if (payload.type == "user") {
      let checkUser = await this.validateMail(payload.email, "users");
      if (checkUser) return false;
    } else {
      let checkOrg = await this.validateMail(payload.email, "orgs");
      if (checkOrg) return false;
    }
    return true;
  },
  /**
   * @description validate reset password of a user/organization data
   * @param (Object) payload : the request body that contains the new passowrd (password)
   * @param (Object) user : the user data sent through token (type,id)
   * @returns (Boolean)
   */
  async resetPasswordValidation(payload, user) {
    const schema = Joi.object({
      password: Joi.string().required(),
      type: Joi.string().valid("user", "organization").required(),
    });
    const validate = schema.validate({
      password: payload.password,
      type: user.type,
    });
    if (validate.error) return false;

    return await this.checkMongooseID([user._id]);
  },
  async createError(status, message) {
    let err = new Error(message);
    err.status = status;
    return err;
  },
  async checkMongooseID(ids) {
    for (let id of ids) {
      if (id == undefined) continue;
      if (!ObjectId.isValid(id)) return 0;
    }
    return 1;
  },
};
module.exports = ValidationService;
