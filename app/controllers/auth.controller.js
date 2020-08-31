const AuthService = require("../services/auth.service");
const { json } = require("body-parser");
AuthController = {
  async usersRegister(req, res) {
    try {
      const token = await this.AuthService.usersRegister(req.body);
      res.status(200).send("confirmation mail has been sent");
    } catch (err) {
      if (err.status) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Server Error");
      }
    }
  },
  async confirmUser(req, res) {
    try {
      await this.AuthService.confirmUser(req.user);
      res.status(201).send("account has been confirmed");
    } catch (err) {
      if (err.status) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Server Error");
      }
    }
  },
  async usersLogin(req, res) {
    try {
      const token = await this.AuthService.usersLogin(req.body);
      res.status(200).send(token);
    } catch (err) {
      if (err.status) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Server Error");
      }
    }
  },
};
module.exports = AuthController;
