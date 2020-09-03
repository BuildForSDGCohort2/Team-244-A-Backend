const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { auth: checkAuth } = require("../middlewares/auth.middleware");

router.post("/users/register", AuthController.usersRegister);
router.post("/users/confirm", checkAuth, AuthController.confirmUser);
router.post("/users/login", AuthController.usersLogin);
router.post("/orgs/register", AuthController.orgsRegister);
router.post("/orgs/login", AuthController.orgsLogin);
router.post("/forget-password", AuthController.forgetPassword);
router.put("/reset-password", checkAuth, AuthController.resetPassword);

module.exports = router;
