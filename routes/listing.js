const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listing");
// const passport = require("passport");
const { islogedin, isowner } = require("../middleware");

const listingcontroller = require("../controller/listing");

// new button
router.get("/new", islogedin, listingcontroller.newbtnroute)

router.route("/")
    .get(wrapasync(listingcontroller.indexroute))
    .post(islogedin, wrapasync(listingcontroller.postroute));

router.route("/:id")
    .get(islogedin, isowner, wrapasync(listingcontroller.editbtnroute))
    .patch(islogedin, isowner, wrapasync(listingcontroller.updateroute))
    .delete(islogedin, isowner, wrapasync(listingcontroller.destroyroute));


// Index route
// router.get("/", wrapasync(listingcontroller.indexroute));

// show route
router.get("/show/:id", wrapasync(listingcontroller.showroute));



// create Route
// router.post("/", islogedin, wrapasync(listingcontroller.postroute));


// edit button 
// router.get("/:id", islogedin, isowner, wrapasync(listingcontroller.editbtnroute));

// update route
// router.patch("/:id", islogedin, isowner, wrapasync(listingcontroller.updateroute));


// Delete route
// router.delete("/:id", islogedin, isowner, wrapasync(listingcontroller.destroyroute));

module.exports = router;