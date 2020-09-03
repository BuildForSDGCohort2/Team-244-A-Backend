const AuthService = require("../services/auth.service");
const AuthController = {
  async usersRegister(req, res) {
    try {
      await AuthService.usersRegister(req.body);
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
    const check = await AuthService.confirmUser(req.user);
    if (check) {
      res.status(201).send("account has been confirmed");
    } else {
      res.status(400).send("user couldnt be confirmed");
    }
  },
  async usersLogin(req, res) {
    try {
      const token = await AuthService.usersLogin(req.body);
      res.status(200).send(token);
    } catch (err) {
      if (err.status) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Server Error");
      }
    }
  },
  async orgsRegister(req, res) {
    try {
      await AuthService.orgsRegister(req.body);
      res.status(201).send("your signup request has been sent");
    } catch (err) {
      if (err.status) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Server Error");
      }
    }
  },
  async orgsLogin(req, res) {
    try {
      const token = await AuthService.orgsLogin(req.body);
      res.status(200).send(token);
    } catch (err) {
      if (err.status) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Server Error");
      }
    }
  },
  async forgetPassword(req, res) {
    try {
      await AuthService.forgetPassword(req.body);
      res.status(200).send("email has been sent");
    } catch (err) {
      if (err.status) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Server Error");
      }
    }
  },
  async resetPassword(req, res) {
    try {
      await AuthService.resetPassword(req.body, req.user);
      res.status(200).send("password changed succissfully");
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
