const AuthService = require("../services/auth.service");
const AuthController = {
  async usersRegister(req, res) {
    await AuthService.usersRegister(req.body)
      .then(() => {
        res.status(200).send("confirmation mail has been sent");
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send("Server Error");
        }
      });
  },
  async confirmUser(req, res) {
    await AuthService.confirmUser(req.user)
      .then(() => {
        res.status(201).send("account has been confirmed");
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send("Server Error");
        }
      });
  },
  async usersLogin(req, res) {
    await AuthService.usersLogin(req.body)
      .then((token) => {
        res.status(200).send(token);
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send("Server Error");
        }
      });
  },
  async orgsRegister(req, res) {
    await AuthService.orgsRegister(req.body)
      .then(() => {
        res.status(201).send("your signup request has been sent");
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send("Server Error");
        }
      });
  },
  async orgsLogin(req, res) {
    await AuthService.orgsLogin(req.body)
      .then((token) => {
        res.status(200).send(token);
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send("Server Error");
        }
      });
  },
  async forgetPassword(req, res) {
    await AuthService.forgetPassword(req.body)
      .then(() => {
        res.status(200).send("email has been sent");
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send("Server Error");
        }
      });
  },
  async resetPassword(req, res) {
    await AuthService.resetPassword(req.body, req.user)
      .then(() => {
        res.status(200).send("password changed succissfully");
      })
      .catch((err) => {
        if (err.status) {
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send("Server Error");
        }
      });
  },
};
module.exports = AuthController;
