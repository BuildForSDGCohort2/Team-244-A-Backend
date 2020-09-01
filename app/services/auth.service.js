const ValidationService = require("./validation.service");
const JWT = require("jsonwebtoken");
const MailService = require("./mail.service");
const userModel = require("../models/user.model");
const orgModel = require("../models/organization.model");
const bcrypt = require("bcrypt");
AuthService = {
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
  async confirmUser(user) {
    const validUser = await ValidationService.userRegisterValidation(user);
    if (!validUser) {
      let err = await ValidationService.createError(400, "Not Valid Data");
      throw err;
    }
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.password, salt);
    let newUser = new userModel({
      name: user.name,
      email: user.email,
      password: hash,
      phone: user.phone,
      posts: [],
    });
    await newUser.save();
    return true;
  },
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
    return { token: token };
  },
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
    let newOrg = new orgModel({
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
    await newOrg.save();
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
  async orgsLogin(org) {
    let loggedOrg = await ValidationService.loginValidation(org, "orgs");
    if (!loggedOrg) {
      let err = await ValidationService.createError(404, "No such user");
      throw err;
    }
    if (loggedOrg.confirm == false) {
      let err = await ValidationService.createError(
        401,
        "organization account hasn't been confirmed yet"
      );
      throw err;
    }
    let token = await JWT.sign({ _id: loggedOrg._id }, process.env.SECRET_KEY, {
      expiresIn: "67472347632732h",
    });
    return { token: token };
  },
};

module.exports = AuthService;
