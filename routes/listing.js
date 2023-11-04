const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync");
const Listing = require("../models/listing");
// const passport = require("passport");
const islogedin = require("../middleware");




// Index route
router.get("/", wrapasync(async(req, res) => {
    let alllistings = await Listing.find({});
    // res.send(alllistings);
    res.render("listings/index.ejs", { alllistings });
}));

// show route
router.get("/show/:id", wrapasync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing is not availle");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// new button
router.get("/new", islogedin, (req, res) => {
    res.render("listings/new.ejs");
})

// create Route
router.post("/", islogedin, wrapasync(async(req, res, next) => {
    let { title, description, image, price, location, country } = req.body;
    let newlisting = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    });
    await newlisting.save()
        .then(() => {
            console.log("data is sabed");
        });
    req.flash("success", "Created Successfully");
    res.redirect("/listings");
}));


// edit button 
router.get("/:id", islogedin, wrapasync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// update route
router.patch("/:id", islogedin, wrapasync(async(req, res) => {
    // console.log("patch req is working");
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    let updatedlist = await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    }, { runValidators: true }).then(() => console.log("data is updated"));
    req.flash("success", "Updated Successfully");
    res.redirect("/listings");
}));


// Delete route
router.delete("/:id", islogedin, wrapasync(async(req, res) => {
    let { id } = req.params;
    let deltedid = await Listing.findByIdAndDelete(id);
    req.flash("success", "deleted Successfully")
    res.redirect("/listings");
}));

module.exports = router;