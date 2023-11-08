const Listing = require("./models/listing");
const review = require("./models/review");
module.exports.islogedin = (req, res, next) => {
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "you must be loggedin")
        return res.redirect("/login");
    }
    next();
}



module.exports.savedurl = (req, res, next) => {
    if (req.session.redirecturl) {
        res.locals.originalUrl = req.session.redirecturl;
    }
    next();
}

module.exports.isowner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!req.user._id.equals(listing.owner)) {
        req.flash("error", "you are not the owner");
        return res.redirect(`/listings/show/${id}`);
    }
    next();
}

module.exports.isreviewowner = async(req, res, next) => {
    let { id, reviewid } = req.params;
    let rev = await review.findById(reviewid);
    // console.log(res.locals.curruser._id);
    // console.log(rev);
    if (!res.locals.curruser._id.equals(rev.createdBy)) {
        req.flash("error", ("you are not the owner of this review"));
        return res.redirect(`/listings/show/${id}`)
    }
    next();
}