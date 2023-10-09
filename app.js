// requiring express
const express = require("express");
const app = express();
// parsing body data into readable form 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app is listening
app.listen(8080, () => {
    console.log("app is listening on port ", 8080);
});

// requiring ejs
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "/views"));

// requring database
const mongoose = require("mongoose");
// requiring schema & collectoin
const Listing = require("./models/listing");
// connecting database 
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

main()
    .then(() => console.log("connected to db "))
    .catch((err) => {
        console.log("db connection err", err);
    });


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

app.get("/", (req, res) => {
    res.send("root directory");
})

app.get("/ejs", (req, res) => {
    res.render("listings/home");
})