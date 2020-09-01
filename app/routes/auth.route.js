const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { auth: checkAuth } = require("../middlewares/auth.middleware");

router.post("/users/register", AuthController.usersRegister);
router.post("/users/confirm", checkAuth, AuthController.confirmUser);
router.post("/users/login", AuthController.usersLogin);
router.post("/orgs/register", AuthController.orgsRegister);
router.post("/orgs/login", AuthController.orgsLogin);
module.exports = router;
