const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { auth: checkAuth } = require("../middlewares/auth.middleware");

router.post("/users/register", AuthController.usersRegister);
router.post("/users/confirm", checkAuth, AuthController.confirmUser);
router.post("/users/login", AuthController.usersLogin);

module.exports = router;
