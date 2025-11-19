const express = require("express");
const { registerUser, loginUser, logoutUser, aboutMe } = require("../controller/authController.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", aboutMe)

module.exports = router;
