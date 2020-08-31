const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { auth: checkAuth } = require("../middlewares/auth.middleware");

router.post("/register", AuthController.register);
router.post("/users/confirm", checkAuth, AuthController.confirmUser);

module.exports = router;
