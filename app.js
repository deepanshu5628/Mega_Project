// requiring express
const express = require("express");
const app = express();
// parsing body data into readable form 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// requring method override pakage
var methodOverride = require('method-override');
app.use(methodOverride("_method"));

// app is listening
app.listen(8080, () => {
    console.log("app is listening on port ", 8080);
});
app.get("/", (req, res) => {
    res.send("root directory");
})

// requiring ejs
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "/views"));
// requring ejs mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
// to use static files
app.use(express.static(path.join(__dirname, "/public")));
// requring database
const mongoose = require("mongoose");
// requiring schema & collectoin
const Listing = require("./models/listing");
const { count } = require("console");
// connecting database 
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

main()
    .then(() => console.log("connected to db "))
    .catch((err) => {
        console.log("db connection err", err);
    });
// 

// error handling 
// requireing custom err class 
const ExpressError = require("./utils/ExpressError");
// requiring wrap async to hadle error's 
const wrapasync = require("./utils/wrapasync");

// app functionality

// testing db 
// app.get("/testlisting", async(req, res) => {
//     let user1 = new Listing({
//         title: "my home ",
//         description: "sweet ohem not ",
//         price: 100,
//         image: "",
//         location: "haryana",
//         country: "india",
//     });
//     await user1.save()
//         .then(() => console.log(" user 1 data is saved to db "))
//         .catch((err) => console.log("data is not saved in db err occured"));
//     res.send("successful testing");
// })


// writing crud api's 

// Index route
app.get("/listings", wrapasync(async(req, res) => {
    let alllistings = await Listing.find({});
    // res.send(alllistings);
    res.render("listings/index.ejs", { alllistings });
}));

// show route
app.get("/listings/show/:id", wrapasync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// new button
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

// create Route
app.post("/listings", wrapasync(async(req, res, next) => {
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

    res.redirect("/listings");
}));


// edit button 
app.get("/listings/:id", wrapasync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// update route
app.patch("/listings/:id", wrapasync(async(req, res) => {
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

    res.redirect("/listings");
}));


// Delete route
app.delete("/listings/:id", wrapasync(async(req, res) => {
    let { id } = req.params;
    let deltedid = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));



// custom err handler
app.use((err, req, res, next) => {
    let { status = 500, message = "unknwn err occured" } = err;
    // console.log(err);
    res.render("listings/err.ejs", { err });
    // res.status(status).send(message);
})

// defining middleware's to handele page is not found
app.use((req, res) => {
    res.send("page not found");
})