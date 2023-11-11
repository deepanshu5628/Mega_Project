const user = require("../models/user");


// signup
module.exports.sigupbtn = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signuppost = async(req, res, next) => {
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
}

// login

module.exports.loginbtn = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.loginroute = async(req, res) => {
    req.flash("success", "you are login in");
    let redirecturl = res.locals.originalUrl || "/listings"
    res.redirect(redirecturl);

}

// logout
module.exports.logoutbtn = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "successfully loged out ");
        res.redirect("/listings");
    })
}