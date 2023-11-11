const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { savedurl } = require("../middleware");
const controller = require("../controller/user");

// api for signup 
router.get("/signup", controller.sigupbtn)

router.post("/signup", wrapasync(controller.signuppost));


// api's for login
router.get("/login", controller.loginbtn);

const authentication = passport.authenticate("local", { failureRedirect: "/login", failureFlash: true })
router.post("/login", savedurl, authentication, controller.loginroute)

// api for logout 
router.get("/logout", controller.logoutbtn)
module.exports = router;