const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listing");
// const passport = require("passport");
const { islogedin, isowner } = require("../middleware");

const listingcontroller = require("../controller/listing");


// Index route
router.get("/", wrapasync(listingcontroller.indexroute));

// show route
router.get("/show/:id", wrapasync(listingcontroller.showroute));

// new button
router.get("/new", islogedin, listingcontroller.newbtnroute)

// create Route
router.post("/", islogedin, wrapasync(listingcontroller.postroute));


// edit button 
router.get("/:id", islogedin, isowner, wrapasync(listingcontroller.editbtnroute));

// update route
router.patch("/:id", islogedin, isowner, wrapasync(listingcontroller.updateroute));


// Delete route
router.delete("/:id", islogedin, isowner, wrapasync(listingcontroller.destroyroute));

module.exports = router;