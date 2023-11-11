const express = require("express");
const router = express.Router({ mergeParams: true });


const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listing");
const review = require("../models/review");
const { islogedin, isreviewowner } = require("../middleware");

const reviewcontroller = require("../controller/review");

router.post("/", islogedin, wrapasync(reviewcontroller.reviewpost));

// to delete a review 
router.delete("/:reviewid", islogedin, isreviewowner, wrapasync(reviewcontroller.destroyroute));

module.exports = router;