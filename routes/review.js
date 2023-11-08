const express = require("express");
const router = express.Router({ mergeParams: true });


const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listing");
const review = require("../models/review");
const { islogedin, isreviewowner } = require("../middleware");


router.post("/", islogedin, wrapasync(async(req, res) => {
    let { id } = req.params;
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
    console.log("review saved");
    req.flash("success", "Review Posted");
    res.redirect(`/listings/show/${id}`);
}));

// to delete a review 
router.delete("/:reviewid", islogedin, isreviewowner, wrapasync(async(req, res) => {
    let { id, reviewid } = req.params;
    let list = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    let delreview = await review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/show/${id}`);
}));

module.exports = router;