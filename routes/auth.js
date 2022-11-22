const express = require("express");

const authController = require("../controllers/auth-controller");

const router = express.Router();

router.get("/signup", authController.getSignup);

router.get("/login", authController.getLogin);

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/401", authController.get401);
// Now we can redirect to this route if a unauthenticated user tries to enter a protected page.

module.exports = router;
