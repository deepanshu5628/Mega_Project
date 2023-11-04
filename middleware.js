const islogedin = (req, res, next) => {
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "you must be logged in to create a list ")
        return res.redirect("/login");
    }
    next();
}
module.exports = islogedin;


module.exports.savedurl = (req, res, next) => {
    if (req.session.redirecturl) {
        res.locals.originalUrl = req.session.redirecturl;
    }
    next();
}