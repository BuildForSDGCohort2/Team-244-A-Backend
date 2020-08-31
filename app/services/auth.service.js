const ValidationService = require("./validation.service");
const JWT = require("jsonwebtoken");
const MailService = require("./mail.service");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
AuthService = {
  async usersRegister(payload) {
    const isValid = await ValidationService.registerValidation(payload);
    if (!isValid) {
      let err = await ValidationService.createError(400, "Not Valid Data");
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
    const validUser = await ValidationService.registerValidation(user);
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
    let loggedUser = await ValidationService.loginValidation(user);
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
};

module.exports = AuthService;
