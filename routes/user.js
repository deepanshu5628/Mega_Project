const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { savedurl } = require("../middleware");
const controller = require("../controller/user");


// router.route
router.route("/signup")
    .get(controller.sigupbtn)
    .post(wrapasync(controller.signuppost));

const authentication = passport.authenticate("local", { failureRedirect: "/login", failureFlash: true });
router.route("/login")
    .get(controller.loginbtn)
    .post(savedurl, authentication, controller.loginroute);

// api for signup 
// router.get("/signup", controller.sigupbtn)
// 
// router.post("/signup", wrapasync(controller.signuppost));


// api's for login
// router.get("/login", controller.loginbtn);
// 
// router.post("/login", savedurl, authentication, controller.loginroute)

// api for logout 
router.get("/logout", controller.logoutbtn)
module.exports = router;