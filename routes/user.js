const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { savedurl } = require("../middleware");

// api for signup 
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})

router.post("/signup", wrapasync(async(req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let newuser = new user({
            email: email,
            username: username
        })
        let reguser = await user.register(newuser, password);
        req.login(reguser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", ("user is registered Successfully"));
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));


// api's for login
router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

router.post("/login", savedurl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async(req, res) => {
    req.flash("success", "you are login in");
    let redirecturl = res.locals.originalUrl || "/listings"
    res.redirect(redirecturl);

})

// api for logout 
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "successfully loged out ");
        res.redirect("/listings");
    })
})
module.exports = router;