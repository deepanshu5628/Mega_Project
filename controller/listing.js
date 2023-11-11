const Listing = require("../models/listing");


module.exports.indexroute = async(req, res) => {
    let alllistings = await Listing.find({});
    // res.send(alllistings);
    res.render("listings/index.ejs", { alllistings });
}

module.exports.showroute = async(req, res) => {
    let { id } = req.params;
    try {

        let listing = await Listing.findById(id).populate({
            path: "reviews",
            populate: {
                path: "createdBy",
            },
        }).populate("owner");
        if (!listing) {
            req.flash("error", "Listing is not available");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        req.flash("error", "error in loading the listings");
        res.redirect("/listings");
    }
}

module.exports.newbtnroute = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.postroute = async(req, res, next) => {
    try {

        let { title, description, image, price, location, country } = req.body;
        let newlisting = new Listing({
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
        });
        newlisting.owner = req.user._id
        await newlisting.save()
            .then(() => {
                console.log("data is sabed");
            });
        req.flash("success", "Created Successfully");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", `${err.message}`);
        res.redirect("/listings/new");
    }
}

module.exports.editbtnroute = async(req, res) => {
    let { id } = req.params;
    try {

        let listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        req.flash("error", "error is loading edit page");
        res.redirect(`/listings/show/${id}`);
    }
}


module.exports.updateroute = async(req, res) => {
    // console.log("patch req is working");
    let { id } = req.params;
    try {
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
    } catch (Err) {
        req.flash("error", `${Err.message}`);
        res.redirect(`/listings/${id}`)
    }
}


module.exports.destroyroute = async(req, res) => {
    let { id } = req.params;
    try {

        let deltedid = await Listing.findByIdAndDelete(id);
        req.flash("success", "deleted Successfully")
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", "err is deletign listing");
        res.redirect(`listings/show/${id}`)
    }
}