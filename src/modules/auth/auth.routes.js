const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

router.post("/sign-up", authController.signUp);

router.post("/sign-in", authController.signIn);

router.post("/sign-out", authController.signOut);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
