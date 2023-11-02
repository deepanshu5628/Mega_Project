const express = require("express");
const router = express.Router({ mergeParams: true });


const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listing");
const review = require("../models/review");


router.post("/", wrapasync(async(req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    let { comment, rating } = req.body;
    let newrev = new review({
        rating: rating,
        comment: comment,
    });
    list.reviews.push(newrev);
    await newrev.save();
    await list.save();
    console.log("review saved");
    res.redirect(`/listings/show/${id}`);
}));

// to delete a review 
router.delete("/:id2", wrapasync(async(req, res) => {
    let { id, id2 } = req.params;
    let list = await Listing.findByIdAndUpdate(id, { $pull: { reviews: id2 } });
    let delreview = await review.findByIdAndDelete(id2);
    res.redirect(`/listings/show/${id}`);
}));

module.exports = router;