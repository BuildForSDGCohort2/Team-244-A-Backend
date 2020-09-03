const ValidationService = require("./validation.service");
const JWT = require("jsonwebtoken");
const MailService = require("./mail.service");
const userModel = require("../models/user.model");
const orgModel = require("../models/organization.model");
const bcrypt = require("bcrypt");
const AuthService = {
  /**
   * @description register a new user into safehome accounts
   * @param (Object) payload : the request body that contains user data (name-email-password-phone)
   * @returns (Boolean)
   */
  async usersRegister(payload) {
    const isValid = await ValidationService.userRegisterValidation(payload);
    if (!isValid) {
      let err = await ValidationService.createError(400, "Not Valid Data");
      throw err;
    }
    const checkUserMail = await ValidationService.validateMail(
      payload.email,
      "users"
    );
    if (!checkUserMail) {
      let err = await ValidationService.createError(
        400,
        "Email is already exist"
      );
      throw err;
    }
    let token = await JWT.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "67472347632732h",
    });
    let confirm = await MailService.sendEmail(
      payload.email,
      token,
      "confirm",
      payload.name
    );
    if (confirm) {
      return true;
    }
    let err = await ValidationService.createError(500, "Couldn't sign up");
    throw err;
  },
  /**
   * @description confirm a new user account
   * @param (Object) user : the user data (name-email-password-phone)
   * @returns (Boolean)
   */
  async confirmUser(user) {
    const validUser = await ValidationService.userRegisterValidation(user);
    if (!validUser) {
      let err = await ValidationService.createError(400, "Not Valid Data");
      throw err;
    }
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.password, salt);
    let User = new userModel({
      name: user.name,
      email: user.email,
      password: hash,
      phone: user.phone,
      posts: [],
    });
    await User.save();
    return true;
  },
  /**
   * @description login user
   * @param (Object) user : the user account data (email-password)
   * @returns (Object) token : the JWT of the user
   */
  async usersLogin(user) {
    let loggedUser = await ValidationService.loginValidation(user, "users");
    if (!loggedUser) {
      let err = await ValidationService.createError(404, "No such user");
      throw err;
    }
    let token = await JWT.sign(
      { _id: loggedUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "67472347632732h",
      }
    );
    const tokenObject = {
      token,
    };
    return tokenObject;
  },
  /**
   * @description register a new organization into safehome accounts
   * @param (Object) payload : the request body that contains organization data (name-email-password-phone-links-description-preference-address)
   * @returns (Boolean)
   */
  async orgsRegister(payload) {
    const isValid = await ValidationService.orgRegisterValidation(payload);
    if (!isValid) {
      let err = await ValidationService.createError(400, "Not Valid Data");
      throw err;
    }
    const checkOrgMail = await ValidationService.validateMail(
      payload.email,
      "orgs"
    );
    if (!checkOrgMail) {
      let err = await ValidationService.createError(
        400,
        "Email is already exist"
      );
      throw err;
    }
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(payload.password, salt);
    let Org = new orgModel({
      name: payload.name,
      email: payload.email,
      password: hash,
      phone: payload.phone,
      links: payload.links,
      preference: payload.preference,
      address: payload.address,
      description: payload.description,
      posts: [],
      confirm: false,
    });
    await Org.save();
    let mail = await MailService.sendEmail(
      payload.email,
      null,
      "org",
      payload.name
    );
    if (mail) {
      return true;
    }
    let err = await ValidationService.createError(500, "Couldn't sign up");
    throw err;
  },
  /**
   * @description login organization
   * @param (Object) org : the org account data (email-password)
   * @returns (Object) token : the JWT of the organization
   */
  async orgsLogin(org) {
    let loggedOrg = await ValidationService.loginValidation(org, "orgs");
    if (!loggedOrg) {
      let err = await ValidationService.createError(404, "No such user");
      throw err;
    }
    if (loggedOrg.confirm === false) {
      let err = await ValidationService.createError(
        401,
        "organization account hasn't been confirmed yet"
      );
      throw err;
    }
    let token = await JWT.sign({ _id: loggedOrg._id }, process.env.SECRET_KEY, {
      expiresIn: "67472347632732h",
    });
    const tokenObject = {
      token,
    };
    return tokenObject;
  },
  /**
   * @description forget password of a user/organization
   * @param (Object) payload : the request body that contains (type=[organization/user],email)
   * @returns (Boolean)
   */
  async forgetPassword(payload) {
    const isValid = await ValidationService.forgetPasswordValidation(payload);
    if (!isValid) {
      let err = await ValidationService.createError(400, "Not Valid Data");
      throw err;
    }
    let token, user;
    if (payload.type === "user") {
      user = await userModel.findOne({ email: payload.email });
      token = await JWT.sign(
        { _id: user._id, type: payload.type },
        process.env.SECRET_KEY,
        {
          expiresIn: "67472347632732h",
        }
      );
    } else if (payload.type === "organization") {
      user = await orgModel.findOne({ email: payload.email });
      token = await JWT.sign(
        { _id: user._id, type: payload.type },
        process.env.SECRET_KEY,
        {
          expiresIn: "67472347632732h",
        }
      );
    }
    let mail = await MailService.sendEmail(
      user.email,
      token,
      "forget password",
      user.name
    );
    if (mail) {
      return true;
    }
    let err = await ValidationService.createError(500, "server error");
    throw err;
  },
  /**
   * @description reset password of a user/organization
   * @param (Object) payload : the request body that contains the new passowrd (password)
   * @param (Object) user : the user data sent through token (type,id)
   * @returns (Boolean)
   */
  async resetPassword(payload, user) {
    const isValid = await ValidationService.resetPasswordValidation(
      payload,
      user
    );
    if (!isValid) {
      let err = await ValidationService.createError(400, "Not Valid Data");
      throw err;
    }
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(payload.password, salt);
    if (user.type === "user") {
      let newUser = await userModel.findById(user._id);
      if (newUser) {
        newUser.password = hash;
        await newUser.save();
        return true;
      }
    } else if (user.type === "organization") {
      let newOrg = await orgModel.findById(user._id);
      if (newOrg) {
        newOrg.password = hash;
        await newOrg.save();
        return true;
      }
    }
    let err = await ValidationService.createError(500, "server error");
    throw err;
  },
};

module.exports = AuthService;
