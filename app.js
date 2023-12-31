// requiring express
const express = require("express");
const app = express();
// parsing body data into readable form 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// requring method override pakage
var methodOverride = require('method-override');
app.use(methodOverride("_method"));

// requiring .envfile
require('dotenv').config()

// app is listening
app.listen(8080, () => {
    console.log("app is listening on port ", 8080);
});
app.get("/", (req, res) => {
    // res.send("root directory")
    res.redirect("/listings");
})
const url = "mongodb://127.0.0.1:27017/wanderlust"
const dburl = process.env.atlasurl;

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
// // requiring schema & collectoin
// const Listing = require("./models/listing");
// const review = require("./models/review");

// requreiing mongo strore
const MongoStore = require('connect-mongo');


// requiring session 
const session = require("express-session");
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dburl,
        crypto: {
            secret: process.env.secret,
        },
        touchAfter: 24 * 3600,
    })
}));


// requireing flash 
const flash = require("connect-flash");
app.use(flash());

// authincation part 
const user = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req, res, next) => {
    res.locals.succ = req.flash("success");
    res.locals.err = req.flash("error")
    res.locals.curruser = req.user;
    next();
})

// connecting database 
async function main() {
    await mongoose.connect(dburl);
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

// writing crud api's  routes 
const listingroute = require("./routes/listing");
app.use("/listings", listingroute);
// api for review's 
const reviewrouter = require("./routes/review");
app.use("/listings/:id/review", reviewrouter);
// api for users.js router
const userroute = require("./routes/user");
app.use("/", userroute);


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