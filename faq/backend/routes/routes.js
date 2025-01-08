const express = require("express");
const { login, logout, signup, verifySignup } = require("../controller/controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/verifySignup", verifySignup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
