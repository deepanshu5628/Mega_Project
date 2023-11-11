const Listing = require("../models/listing");
const review = require("../models/review");
module.exports.reviewpost = async(req, res) => {
    let { id } = req.params;
    try {
        let list = await Listing.findById(id);
        let { comment, rating } = req.body;
        let newrev = new review({
            rating: rating,
            comment: comment,
        });
        newrev.createdBy = req.user._id
        list.reviews.push(newrev);
        await newrev.save();
        await list.save();
        // console.log("review saved");
        req.flash("success", "Review Posted");
        res.redirect(`/listings/show/${id}`);
    } catch (err) {
        req.flash("error", `${err.message}`);
        res.redirect(`/listings/show/${id}`);
    }
}


module.exports.destroyroute = async(req, res) => {
    let { id, reviewid } = req.params;
    try {

        let list = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
        let delreview = await review.findByIdAndDelete(reviewid);
        req.flash("success", "Review Deleted");
        res.redirect(`/listings/show/${id}`);
    } catch (err) {
        req.flash("error", `${err.message}`);
        res.redirect(`/listings/show/${id}`);
    }
}