const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

main().then(() => console.log("connected to init db "))
    .catch((err) => console.log("err occured while connecting to init db"));


const initdb = async() => {
    await Listing.deleteMany();
    Listing.insertMany(initdata.data);
    console.log("sample data is sabed");
};

// initdb();

// completed

// const dellis = async(req, res, next) => {
//     // let listing = await Listing.findByIdAndDelete("654b45cc4bbf2b25938a1602");
//     let listing = await Listing.findOneAndDelete({ price: 234 });

//     console.log(listing);
//     console.log("deleted successfylly");

// };

// dellis();