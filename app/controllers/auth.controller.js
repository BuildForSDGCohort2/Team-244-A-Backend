const AuthService = require("../services/auth.service");
const { json } = require("body-parser");
AuthController = {
  async register(req, res) {
    try {
      const token = await this.AuthService.register(req.body);
      res.status(200).send("confirmation mail has been sent");
    } catch (err) {
      res.status(err.status).send(err.message);
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
};
module.exports = AuthController;
