const Router = new require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { auth: checkAuth } = require("../middlewares/auth.middleware");

Router.post("/users/register", AuthController.usersRegister);
Router.post("/users/confirm", checkAuth, AuthController.confirmUser);
Router.post("/users/login", AuthController.usersLogin);
Router.post("/orgs/register", AuthController.orgsRegister);
Router.post("/orgs/login", AuthController.orgsLogin);
Router.post("/forget-password", AuthController.forgetPassword);
Router.put("/reset-password", checkAuth, AuthController.resetPassword);

module.exports = Router;
